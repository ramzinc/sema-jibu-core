import {
  FETCH_USERS_SUCCESS,
  CREATE_USER_SUCCESS,
  UPDATE_USER_SUCCESS,
  DELETE_USER_SUCCESS,
  TOGGLE_USER_SUCCESS
} from 'actions';

const userReducer = (state = [], action) => {
  let user;
  switch (action.type) {
    case FETCH_USERS_SUCCESS:
      return action.payload.users;
    case CREATE_USER_SUCCESS:
      user = action.payload.user;
      return [...state, { ...user }];
    case UPDATE_USER_SUCCESS:
    case TOGGLE_USER_SUCCESS:
      user = action.payload.user;
      return state.map(item => {
        if (item.id !== user.id) {
          return item;
        }
        return {
          ...item,
          ...user
        };
      });
    case DELETE_USER_SUCCESS:
      const userId = parseInt(action.payload.id, 10);
      return state.filter(user => user.id !== userId);

    default:
      return state;
  }
};

export default userReducer;
