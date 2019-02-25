
import { SHOW_SCREEN, SET_LOGGED_IN} from "../actions/ToolBarActions"

let initialState = { showScreen :{screenToShow:"main", isLoggedIn:false}};

const toolBarReducer = (state = initialState, action) => {
	let newState;
	console.log("toolBarReducer: " +action.type);
	switch (action.type) {
		case SHOW_SCREEN:
			newState = { showScreen :{screenToShow:action.data.screen, isLoggedIn:true}};
			return newState;

		case SET_LOGGED_IN:
			console.log( "toolBarReducer - SET_LOGGED_IN " + action.data.loggedIn);
			newState = { showScreen :{screenToShow:state.showScreen.screenToShow, isLoggedIn:action.data.loggedIn}};
			//newState = { showScreen :{screenToShow:"main", isLoggedIn:true}};
			return newState;

		default:
			return state;
	}
};

export default toolBarReducer;

