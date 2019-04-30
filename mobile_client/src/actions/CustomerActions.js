export const CUSTOMER_SELECTED = 'CUSTOMER_SELECTED';
export const CUSTOMERS_LOADED = 'CUSTOMERS_LOADED';
export const CUSTOMERS_SET = 'CUSTOMERS_SET';
export const CUSTOMERS_SEARCH = 'CUSTOMERS_SEARCH';


export function CustomerSelected( customer){
	console.log("CustomerSelected - action");
	const data = customer;
	return (dispatch) => {
		dispatch({type: CUSTOMER_SELECTED, data:data});
	};
}

export function setCustomers( customers ) {
	console.log("setCustomers - action. No of customers " + customers.length);

	return (dispatch) => {dispatch({type: CUSTOMERS_SET, data:customers})};

}

export function SearchCustomers( searchString ) {
	console.log("SearchCustomers - action. Search is " + searchString);

	return (dispatch) => {dispatch({type: CUSTOMERS_SEARCH, data: searchString})};
}
