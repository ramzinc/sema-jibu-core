import * as allActions from './ActionTypes';

function setDateRange(startDate, endDate, groupType) {
	console.log("setStartEndDate - ", startDate.toString(), endDate.toString(), ". groupType-",groupType);
	return {type: allActions.SET_DATE_RANGE, dateRange: {startDate:startDate, endDate:endDate, groupType:groupType}};
}

export const dateFilterActions = {
	setDateRange
};
