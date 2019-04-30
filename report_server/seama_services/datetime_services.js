require('datejs');

class PeriodData {
	constructor() {
		this.beginDate = null;
		this.endDate = null;
		this.value = null;
	}
	setValue(value){
		this.value = value;
	}

	setDates( beginDate, endDate ){
		this.endDate = endDate;
		this.beginDate = beginDate;

	}
	static init3Periods(){
		return [ new PeriodData(), new PeriodData(), new PeriodData() ];
	}
	static CalcBeginDate( endDate, period, periodCount ){
		let beginDate = endDate;

		switch( period ) {
			case 'month':
			default:
				let beginDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
				beginDate.addMonths(periodCount);
				return beginDate;
		}
		return beginDate;
	}
	static UpdatePeriodDates( periods, endDateIn, period ){
		let endDate = new Date(endDateIn);
		let beginDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
		switch( period ) {
			case 'year':
				beginDate = new Date(endDate.getFullYear(), 0, 1);
				for( let i = 0; i < periods.length; i++ ){
					periods[i].setDates(beginDate, endDate);
					if( i == 0 ){
						endDate =  new Date( endDate.getFullYear(), 11, endDate.getDaysInMonth( endDate.getFullYear(), 11) );
					}
					beginDate = new Date(beginDate);
					endDate = new Date(endDate);
					beginDate.addYears(-1);
					endDate.addYears(-1);
				}
				break;

			case 'month':
				for( let i = 0; i < periods.length; i++ ){
					periods[i].setDates(beginDate, endDate);
					if( i == 0 ){
						endDate =  new Date( endDate.getFullYear(), endDate.getMonth(), endDate.getDaysInMonth( endDate.getFullYear(), endDate.getMonth()) );
					}
					beginDate = new Date(beginDate);
					endDate = new Date(endDate);
					beginDate.addMonths(-1);
					endDate.addMonths(-1);
				}
				break;
			default:
				break;
		}
	}

	static IsExpectedYearMonth( periodData, checkDate){
		if( periodData.beginDate.getFullYear() === checkDate.getFullYear() &&
			periodData.beginDate.getMonth() === checkDate.getMonth()){
			return true;
		}
		return false;
	}
	static IsExpectedYear( periodData, checkDate){
		if( periodData.beginDate.getFullYear() === checkDate.getFullYear()) {
			return true;
		}
		return false;
	}

}


module.exports = { PeriodData };
