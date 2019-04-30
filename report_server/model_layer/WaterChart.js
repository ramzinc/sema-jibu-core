class WaterChart {

	constructor(type, beginDate, endDate){
		this.beginDate = beginDate;
		this.endDate = endDate;
		this.type = type;
		this.units = "";
		this.data = {}
	}

	setData( data ){
		this.data = data;
	}
	setUnit( unit ){
		this.units = unit;
	}
	classToPlain() {
		return this;
	}

}

module.exports = WaterChart;
