const axios = require('axios');
const iotileConfig = require('./iotile.conf.json');
const mysql	= require('mysql2');
const pe	= require('parse-error');
const path = require('path');
const dotenvPath = path.resolve('..', '.env');
const dotenv = require('dotenv').config({ path: dotenvPath});
const moment = require('moment');

if (dotenv.error) {
	return console.log(`.env file not found at '${dotenvPath}')}`);
}

const env	= process.env.NODE_ENV || 'development';
const dbConfig	= require(`./config/database`)[env];

// Clone the DB config and add additional options
const configs = {...dbConfig, connectionLimit: 50, supportBigNumbers: true, decimalNumbers: true};

// Get rid of those unnecessary properties
delete configs.username;
delete configs.dialect;

// hp stands for Handle Promise
hp = promise =>
		promise
		.then(data => [null, data])
		.catch(err => [pe(err)]);

// TODO: Make sure the config file exists and contains the necesary info

// Get the token using the credentials from the config file
const getIotileToken = () => {
    return new Promise((resolve, reject) => {
        axios.post(`${iotileConfig.baseUrl}/auth/api-jwt-auth/`, {
                username: iotileConfig.username,
                password: iotileConfig.password
            })
            .then(result => {
                resolve(result.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const selectLatestEntryQuery = `SELECT 
    *
FROM
    reading
WHERE
    kiosk_id = ? AND parameter_id = ?
        AND sampling_site_id = ?
ORDER BY id DESC
LIMIT 1;
`;

// We need the latest entry so we know where to continue gathering
// data from. If there is none, it returns null
const getLatestEntry = (mapping, pool) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query(selectLatestEntryQuery, [
                mapping.kiosk_id,
                mapping.parameter_id,
                mapping.sampling_site_id
            ], (err, result) => {
                connection.release();
                if (err) return reject(err);
                if (Array.isArray(result) && result.length > 0) {
                    return resolve(result);
                } else {
                    return resolve(null);
                }
            });
        });
    });
};

// Pull stream data from the IoTile API server using the token received during login
// And the latest product flow meter entry date
const getStreamData = (token, lastSyncDate, mapping) => {
    const axiosOptions = {
        headers: {
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json'
        }
    };

    // Make sure to only get data after the last sync, if any
    if (lastSyncDate) {
        axiosOptions['params'] = {
            start: lastSyncDate
        };
    }

    return new Promise((resolve, reject) => {
        axios.get(`${iotileConfig.baseUrl}/stream/${mapping.device_stream_id}/data/`, axiosOptions)
            .then(result => {
                resolve(result.data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

// Calculate the total from the IoTile stream data and add it to the previous reading value
const doAccumulation = (dbValue, iotileData) => {
    let syncDate = null;

    const total = iotileData.reduce((total, input, index) => {
        if (iotileData.length === index + 1) syncDate = input.timestamp;
        return input.value;
    }, 0);

    return {
        syncDate,
        value: total + dbValue
    }; 
};

const insertNewReadingQuery = `INSERT INTO
reading (created_at, kiosk_id, parameter_id, sampling_site_id, value, user_id)
VALUES (?, ?, ?, ?, ?, ?);
`;

const getIoTileUserQuery = `SELECT id FROM user WHERE username = 'iotile'`;

// Enter the data received from IoTile API server into the SEMA schema
const syncReading = (readingData, mapping, pool) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(async (err, connection) => {
            connection.query(getIoTileUserQuery, (err, user) => {
                if (err) return reject(err);

                connection.query(insertNewReadingQuery, [
                    moment(readingData.syncDate).format('YYYY-MM-DD HH:mm:ss'),
                    mapping.kiosk_id,
                    mapping.parameter_id,
                    mapping.sampling_site_id,
                    readingData.value,
                    user[0].id
                ], err => {
                    connection.release();
                    resolve();
                    if (err) return reject(err);
                });
            });
        });
    });
};

// TODO: Handle errors
iotileConfig.mappings.forEach(async mapping => {

    // Skip inactive devices
    if (!mapping.active) return console.log(`${mapping.slug}: Device inactive or not setup yet`);

    console.log(`${mapping.slug}: Begin data synchronization`)

    // The connection pool to use for database calls
    let pool = mysql.createPool(configs);

    // Get the latest entry and ultimately the latest sync date
    const [err, latestEntry] = await hp(getLatestEntry(mapping, pool));
    const lastSyncDate = latestEntry && latestEntry[0] && latestEntry[0].created_at;

    // TODO: save the received token to local storage and check its validity before calling for
    // a new one. For now, it's getting a new token every 10 minutes
    const [err2, {token}] = await hp(getIotileToken());

    // Pull the data from IoTile using the token and the latest sync date
    const [err3, streamData] = await hp(getStreamData(token, lastSyncDate, mapping));

    // Get rid of the first value of the stream data if it's of the exact same
    // date as the last sync date because currently, IoTile includes
    // streams with the same date as the one specified in the "start" parameter
    // Make sure to only remove it if it's not the first sync ever.
    if (streamData.count && moment(streamData.results[0].timestamp).isSame(lastSyncDate)) {
        streamData.results.splice(0, 1);
    }

    // No need to do anything when there's no new readings from IoTile
    if (streamData.results && !streamData.results.length) {
        pool.end();
        return console.log(`${mapping.slug}: No new data`);
    }

    // If stream data is an accumulation, we use the total of the last values entered for it
    // to create the next reading. If not, we upload each as a reading value.
    if (mapping.is_accumulation) {
        const accumulationData = doAccumulation(latestEntry && latestEntry[0] && latestEntry[0].value, streamData.results);
        await syncReading(accumulationData, mapping, pool);
        pool.end();
        console.log(`${mapping.slug}: Accumulation synced successfully`)
    } else {
        streamData.results.forEach(async (stream, index) => {
            const readingData = {
                value: stream.value,
                syncDate: stream.timestamp
            };

            await syncReading(readingData, mapping, pool);
            pool.end();
            if (streamData.results.length === index + 1) {
                console.log(`${mapping.slug}: Synced ${index + 1} new readings`);
            }
        });
    }

    console.log(`${mapping.slug}: DONE`)
});