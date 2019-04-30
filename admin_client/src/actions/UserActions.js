import { axiosService } from 'services';
import get from 'lodash/get';
import * as a from './ActionTypes';

const extractError = err => ({
  type: 'error',
  message: get(err, 'response.data.err', '')
});

export const fetchUsersRequest = () => ({ type: a.FETCH_USERS_REQUEST });

export const fetchSuccess = data => ({
  type: a.FETCH_USERS_SUCCESS,
  payload: data
});

export const fetchFailure = data => ({
  type: a.FETCH_USERS_FAILURE,
  payload: data
});

export const updateUserRequest = () => ({ type: a.UPDATE_USER_REQUEST });
export const updateUserSuccess = data => ({
  type: a.UPDATE_USER_SUCCESS,
  payload: data
});
export const updateUserFailure = data => ({
  type: a.UPDATE_USER_FAILURE,
  payload: data
});

export const createUserRequest = () => ({ type: a.CREATE_USER_REQUEST });
export const createUserSuccess = payload => ({
  type: a.CREATE_USER_SUCCESS,
  payload
});
export const createUserFailure = payload => ({
  type: a.CREATE_USER_FAILURE,
  payload
});

export const deleteUserRequest = () => ({ type: a.DELETE_USER_REQUEST });
export const deleteUserSuccess = payload => ({
  type: a.DELETE_USER_SUCCESS,
  payload
});
export const deleteUserFailure = payload => ({
  type: a.DELETE_USER_FAILURE,
  payload
});

export const toggleUserRequest = () => ({ type: a.TOGGLE_USER_REQUEST });
export const toggleUserSuccess = payload => ({
  type: a.TOGGLE_USER_SUCCESS,
  payload
});
export const toggleUserFailure = payload => ({
  type: a.TOGGLE_USER_FAILURE,
  payload
});

export const clearErrors = () => ({ type: 'CLEAR_ERRORS' });

export const fetchUsers = () => dispatch => {
  dispatch(fetchUsersRequest());
  return axiosService
    .get('/sema/users')
    .then(response => dispatch(fetchSuccess(response.data)))
    .catch(err => dispatch(fetchFailure(extractError(err))));
};

export const createUser = data => dispatch => {
  dispatch(createUserRequest());
  return axiosService
    .post('/sema/users', { data })
    .then(response => dispatch(createUserSuccess(response.data)))
    .catch(err => dispatch(createUserFailure(extractError(err))));
};

export const updateUser = data => dispatch => {
  dispatch(updateUserRequest());
  return axiosService
    .put(`/sema/users/${data.id}`, { data })
    .then(response => dispatch(updateUserSuccess(response.data)))
    .catch(err => dispatch(updateUserFailure(extractError(err))));
};

export const toggleUser = id => dispatch => {
  dispatch(toggleUserRequest());
  return axiosService
    .put(`/sema/users/toggle/${id}`)
    .then(response => dispatch(toggleUserSuccess(response.data)))
    .catch(err => dispatch(toggleUserFailure(extractError(err))));
};

export const deleteUser = id => dispatch => {
  dispatch(deleteUserRequest());
  return axiosService
    .delete(`/sema/users/${id}`)
    .then(response => dispatch(deleteUserSuccess(response.data)))
    .catch(err => dispatch(deleteUserFailure(extractError(err))));
};
