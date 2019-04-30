class WaterSummary {

	constructor(beginDate, endDate){
		this.beginDate = beginDate;
		this.endDate = endDate;
		this.totalProduction = null;
		this.fillStation = null;
		this.productionUnit = "gallons";
		this.pressurePreMembrane = null;
		this.pressurePostMembrane = null;
		this.pressureUnit = "PSI";
		this.distributionFlowRate = null;
		this.productFlowRate = null;
		this.sourceFlowRate = null;
		this.flowrateUnit = "gpm";
	}

	setTotalProduction( value ){
		this.totalProduction = value;
	}
	setFillStation( value ){
		this.fillStation = value;
	}

	setPressurePreMembrane( value ){
		this.pressurePreMembrane = value;
	}
	setPressurePostMembrane( value ){
		this.pressurePostMembrane = value;
	}
	setDistributionFlowRate( value ){
		this.distributionFlowRate = value;
	}
	setProductFlowRate( value ){
		this.productFlowRate = value;
	}
	setSourceFlowRate( value ){
		this.sourceFlowRate = value;
	}
	setProductionUnit( unit ){
		this.productionUnit = unit;
	}
	setPressureUnit( unit ){
		this.pressureUnit = unit;
	}
	setFlowrateUnit( unit ){
		this.flowrateUnit = unit;
	}

	classToPlain() {
		return this;
	}

}

module.exports = WaterSummary;
