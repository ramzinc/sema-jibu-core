const { PeriodData } = require(`${__basedir}/seama_services/datetime_services`);

class SalesSummary {

	constructor(beginDate, endDate){
		this.beginDate = beginDate;
		this.endDate = endDate;
		this.totalRevenue =   {total: null, period: null, periods: PeriodData.init3Periods()},
		this.totalCogs =   {total: null, period: null, periods: PeriodData.init3Periods()},
		this.totalCustomers = {total: null, period: null, periods: PeriodData.init3Periods()},
		this.customerCount = null;
		this.customerSales = []
	}

	setTotalRevenue( value ){
		this.totalRevenue.total = value;
	}
	setTotalRevenuePeriod( value ){
		this.totalRevenue.period = value;
	}
	getTotalRevenuePeriods(){
		return this.totalRevenue.periods;
	}

	setTotalCustomers( value ){
		this.totalCustomers.total = value;
	}
	setCustomerCount( value ){
		this.customerCount =value;
	}
	setTotalCustomersPeriod( value ){
		this.totalCustomers.period = value;
	}
	getTotalCustomersPeriods(){
		return this.totalCustomers.periods;
	}

	setTotalCogs( value ){
		this.totalCogs.total = value;
	}
	setTotalCogsPeriod( value ){
		this.totalCogs.period = value;
	}
	getTotalCogsPeriods(){
		return this.totalCogs.periods;
	}

	addCustomerSales( customerSales){
		this.customerSales.push(customerSales)
	}

	classToPlain() {
		return this;
	}

}
class CustomerSale{
	constructor(name, id, groupBy, gpsCoordinates){
		this.name = name;
		this.id = id;
		this.period = groupBy;
		this.gps = gpsCoordinates;
		this.total = null;
		this.periods = PeriodData.init3Periods();
	}
	setTotal( value ){
		this.total = value;
	}
}

module.exports = {SalesSummary,CustomerSale};
