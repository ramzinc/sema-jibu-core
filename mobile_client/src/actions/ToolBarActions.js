
export const SHOW_SCREEN = 'SHOW_SCREEN';
export const SET_LOGGED_IN = 'SET_LOGGED_IN';

export function ShowScreen( screen ){
	console.log("SHOW_MAIN - action");
	return (dispatch) => { dispatch({type: SHOW_SCREEN, data:{screen:screen}});};
}


export function SetLoggedIn( loggedIn){
	console.log("SET_LOGGED_IN - action");
	return (dispatch) => { dispatch({type: SET_LOGGED_IN, data:{loggedIn:loggedIn}});};
}
