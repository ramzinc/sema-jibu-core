import { handleActions, combineActions } from 'redux-actions';
import { updateObjectInArray } from './helpers';
import {
  getProductsRequest,
  getProductsSuccess,
  getProductsFailure,
  createProductRequest,
  createProductSuccess,
  createProductFailure,
  updateProductRequest,
  updateProductSuccess,
  updateProductFailure
} from '../actions/ProductActions';

// State
const initialState = [];
const productReducer = handleActions(
  {
    [combineActions(
      getProductsRequest,
      getProductsFailure,
      createProductRequest,
      updateProductRequest
    )]: state => state,
    [getProductsSuccess]: (state, { payload: { products } }) => products,
    [createProductSuccess]: (state, { payload: { data: product } }) =>
      updateObjectInArray(state.products, product),
    [createProductFailure]: (state, { payload: error }) => error,
    [updateProductSuccess]: (state, { payload: { data: product } }) =>
      updateObjectInArray(state.products, product),
    [updateProductFailure]: (state, { payload: error }) => error
  },
  initialState
);

export default productReducer;
