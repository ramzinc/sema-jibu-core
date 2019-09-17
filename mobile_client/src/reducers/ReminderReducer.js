import {ADD_REMINDER}  from "../actions/ReminderActions.js";


let initialState = {
    localReminders : []

};

const reminderReducer = (state = initialState, action) => {
    console.log("reminderReducer:" + action.type);
    let newState;
    switch(action.type){
    case ADD_REMINDER:
	newState = {...state};
	newState.localReminders.push(action.data);
	return newState;

   default:
	return state;
    
    }
    
    



};
export default reminderReducer;
