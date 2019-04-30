This file contains instructions on installing, building and deploying the DloHaiti dashboard application. The directions are for Mac OSX and GNU/Linux.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Server build](#server-build)
- [Client build](#client-build)
- [Android POS tablet](#android-build)
- [Production Deployment](#production-deployment)


## Prerequisites
### Mac OSX
* Install nvm: https://github.com/creationix/nvm#installation
* Install latest LTS version of Node and npm: `nvm install --lts`
* Install Yarn: `npm i -g yarn`
* Install react-scripts (To be able to run the client): `yarn global add react-scripts`
* Clone the Git repository to a local folder: `git clone https://github.com/untapped-inc/sema-core.git`

### GNU/Linux
* Install nvm: https://github.com/creationix/nvm#installation
* Install latest LTS version of Node and npm: `nvm install --lts`
* Install Yarn: `npm i -g yarn`
* Install react-scripts (To be able to run the client): `yarn global add react-scripts`
* Clone the Git repository to a local folder: `git clone https://github.com/untapped-inc/sema-core.git`

## Server build
The server uses Expressjs
* Change to report_server folder: `cd report_server`
* Follow [the instructions below](#env-files) to create the environment variables file needed by the project
* Install components: `yarn`
* Start the server on port 3001: `yarn start`. Note that client is configured to access the server on port 3001
* Test the server access via curl: `curl http://localhost:3001/untapped/health-check` this should return {"server":"Ok","database":"Ok"}

[![Build Status](https://travis-ci.org/untapped-inc/sema-core.svg?branch=master)](https://travis-ci.org/untapped-inc/sema-core)

## Client build
The client is a React application
* Change to report_client folder: `cd report_client`
* Install components: `yarn`
* Start the client on the default port, 3000: `yarn start`
* You should now see the login page
* Note: The client uses a custom Bootstrap theme located at ./report_client/src/css/bootstrap_cerulean.min.css. There is a postInstall script, update_theme.sh, that should copy this theme to the folder ./report_client/node_modules/bootstrap/dist/css/bootstrap_cerulean.min.css. Run it with `sh update_theme.sh`.

In development mode, the dashboard server runs on locathost:3001 and the React App on port 3000. REST calls from the app to the server are proxied through port 3001.

## Android build
The Android POS application is a React-Native application used by the SWE to record sales of water products
To build the POS application:
* Follow the Android setup steps at: https://facebook.github.io/react-native/docs/getting-started.html#content. Make sure you select the appropriate tabs in the instructions. 
"Building Projects with **Native Code**"
"Development OS: **macOS** or **Windows** or **Linux** Target OS:  **Android**"
* Change to folder mobile_client `cd mobile_client`
* Install dependencies `yarn install`
* Open the Android project in the folder mobile_client with Android Studio. Note. Do not open the folder mobile_client, open **mobile_client/android**
Build the project from Build menu
* Additional instructions for debugging can be found at with JetBrains WebStorm and Visual Studio Code can be found at https://dlohaiti.atlassian.net/wiki/spaces/DLODOC/pages/34078783/React+Native+on+Android?atlOrigin=eyJpIjoiNGFmMDEwNGVjMTYwNDNhMWJkODZmODgzODQ5NzJiNjIiLCJwIjoiYyJ9



## Production Deployment
In production mode, the dashboard server runs on sema.untapped-inc.com and the React app is built then rendered by the server. REST calls from the app to the server are reverse proxied by Ngninx from port 80 to port 3001. We use pm2 to run the server.

### Prerequisites

Our servers are in Linux so installation methods will be for GNU/Linux:

* Install nvm: https://github.com/creationix/nvm#installation
* Install latest LTS version of Node and npm: `nvm install --lts`
* Install Yarn: `npm i -g yarn`
* Install react-scripts (To be able to build the client): `yarn global add react-scripts`
* Clone the Git repository to the server: `git clone https://github.com/untapped-inc/sema-core.git`
* Nginx (Reverse Proxy): `sudo apt install nginx`
* Pm2 (Robust Process Manager): `yarn global add pm2`

### Deploying to Production

Follow those steps to deploy this app in production mode:
 
1. Assuming you are in the root directory of this project
2. Install client dependencies: `cd report_client && yarn`
3. Build the client: `yarn build`
4. If you get a fatal error about not having enough memory, just add this - `GENERATE_SOURCEMAP=false` - to the .env file of the `report_client` directory and then run `yarn build` again: `echo 'GENERATE_SOURCEMAP=false' >> .env && yarn build`
5. Create a new `public_react` folder into the server directory: `mkdir ../report_server/public_react`
6. Copy the entire build folder from react_client/build to the report_server/public_react folder:
     `cp -rf ./build ../report_server/public_react`
7. Switch to server directory: `cd ../report_server`
8. Follow [the instructions below](#env-files) to create the environment variables file needed by the project
9. Install server dependencies: `yarn`
10. Start the server with Pm2: `pm2 start bin/www --name sema-server`. Name it however you want so you can easily refer to it later
11. Get your server IP address: `curl icanhazip.com`
12. Test the server access via curl - Since we haven't configured Nginx yet, we'll test it from port 3001: `curl http://YOUR-SERVER-IP-ADDRESS:3001/untapped/health-check`. This should return {"server":"Ok","database":"Ok"}
13. Setup Ngninx using [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04)
14. Configure Nginx by editing - *WITH SUPER USER*: `/etc/nginx/sites-available/default`:
    `sudo vim /etc/nginx/sites-available/default`
15. Within the server block, there is an existing `location /` block. Replace the contents of that block with the following configuration:


```
location / {
	proxy_pass http://localhost:3001;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection 'upgrade';
	proxy_set_header Host $host;
	proxy_cache_bypass $http_upgrade;
}
```
16. Make sure you didn't introduce any syntax errors: `sudo nginx -t`
17. Restart Nginx: `sudo systemctl restart nginx`
18. Test the server access without using the port: `curl http://YOUR-SERVER-IP-ADDRESS/untapped/health-check`. This should return {"server":"Ok","database":"Ok"}. You can now setup DNS zone records for your server.

## .env files
To accommodate development/test/production environments, a '.env' configuration file is used to specify database connection information and other configuration parameters.

It's a shared .env file used accross the whole project - by the web client, the mobile client, the server and database scripts.

It's located at the root directory under the name `.example-env`, simply rename it to `.env` and fill up the missing information.

You will need to contact your IT admin for url, database and other credentials required to configure the environment. These parameters are:

* DB_HOST=                  (Url/IP of the database)
* DB_USER=                  (User name)
* DB_PASSWORD=              (User password)
* DB_SCHEMA=                (Database Schema)
* DB_DIALECT=mysql          (The SQL dialect we're using, mysql in this case)
* DEFAULT_TABLES=user,role,user_role  (The tables that must be populated - postinstall - by sequelize-auto by default)
* JWT_SECRET=xxxxx          (Json Web Token secret used to encrypt the token)
* JWT_EXPIRATION_LENGTH='xxxxx'   (length of time the token is valid for. E.g.1 day)
* BCRYPT_SALT_ROUNDS=10     (How much time is needed to calculate a single BCrypt hash - Between 8 and 12 is recommended)

## TODO
- [ ] Production: Add instructions on how to add SSL certification support with Let's Encrypt
- [ ] Production: Make sure we use logs and error printing only in development mode
