export const SET_SETTINGS = 'SET_SETTINGS';
export const SET_CONFIGURATION = 'SET_CONFIGURATION';

export function setSettings(settings){
	console.log("setSettings - action");
	return (dispatch) => { dispatch({type: SET_SETTINGS, data:settings});};
}

// export function setConfiguration( configuration){
// 	console.log("setConfiguration - action");
// 	return (dispatch) => { dispatch({type: SET_CONFIGURATION, data:configuration});};
// }
