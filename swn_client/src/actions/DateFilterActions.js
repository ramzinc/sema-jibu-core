import * as allActions from './ActionTypes';

function setDateRange(startDate, endDate) {
	console.log("setStartEndDate - ", startDate.toString(), endDate.toString());
	return {type: allActions.SET_DATE_RANGE, dateRange: {startDate:startDate, endDate:endDate}};
}

export const dateFilterActions = {
	setDateRange
};
