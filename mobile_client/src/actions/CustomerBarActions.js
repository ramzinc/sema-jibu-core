export const SHOW_HIDE_CUSTOMERS = 'SHOW_HIDE_CUSTOMERS';


export function ShowHideCustomers( show){
	console.log("SHOW_HIDE_CUSTOMERS - action");
	return (dispatch) => { dispatch({type: SHOW_HIDE_CUSTOMERS, data:show});};
}
