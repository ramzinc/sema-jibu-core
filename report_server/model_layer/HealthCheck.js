/// HealthCheck class - Validates that web service is functional
class HealthCheck {
	constructor(request, schema) {
		this.server = "Ok";
		this.database = "Ok";
		this.version = request.app.get('sema_version');
		this.schema = schema;
	}
	set server( status){
		this._server = status;
	}
	set database( status){
		this._database = status;
	}
	classToPlain(){
		return {server:this._server,
			database:this._database,
			version:this.version,
			schema:this.schema};
	}
}

module.exports = HealthCheck;
