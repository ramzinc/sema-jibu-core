// Returns information on a kiosk.
// NOTE: Currently the members of this mimic the database names.
// This is for compatibility with the existing dashboard client. Additionally
// This Class also returns unneeded database columns such as version and api_key
// In future version both 'api_key' and 'version' could be ignored and region_id
// returned as regionId
class Kiosk {
	constructor(kiosk) {
		this.id = kiosk.id;
		this.active = true;
		this.gpsCoordinates = null;
		if(kiosk.hasOwnProperty("active") ) {
			this.active = kiosk["active"][0] === 1 ? true : false;
		}
		this.api_key = kiosk.api_key;
		this.name = kiosk.name;
		this.region_id = kiosk.region_id;
		this.version = kiosk.version;
		if(kiosk.hasOwnProperty("consumer_base") ) {
			this.consumerBase = kiosk.consumer_base;
		}
		if(kiosk.hasOwnProperty("gps_coordinates") ) {
			this.gpsCoordinates = kiosk.gps_coordinates;
		}
	}
	classToPlain(){
		return {
			id:this.id,
			active:this.active,
			api_key:this.api_key,
			name:this.name,
			region_id:this.region_id,
			version:this.version,
			consumerBase: this.consumerBase,
			gpsCoordinates:this.gpsCoordinates};
	}
}

module.exports = Kiosk;
