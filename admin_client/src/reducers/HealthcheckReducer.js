import {FETCH_HEALTHCHECK, RECEIVE_HEALTHCHECK} from 'actions/ActionTypes';

export default function healthCheck(state = {server: "Ok", database: "Ok"}, action) {
    let newState;
    switch (action.type) {
        case FETCH_HEALTHCHECK:
            console.log('FETCH_HEALTHCHECK Action');
            return action;
        case RECEIVE_HEALTHCHECK:
            newState = action.healthCheck;
            console.log('RECEIVE_HEALTHCHECK Action');
            return newState;
        default:
            return state;
    }
}
