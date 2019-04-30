import { axiosService } from 'services';
import { createActions } from 'redux-actions';

export const LOAD_PRODUCT_CATEGORIES = 'LOAD_PRODUCT_CATEGORIES';

// Actions
export const {
  getProductsRequest,
  getProductsSuccess,
  getProductsFailure
} = createActions(
  {
    GET_PRODUCTS_SUCCESS: payload => payload
  },
  'GET_PRODUCTS_REQUEST',
  'GET_PRODUCTS_FAILURE'
);

export const {
  getProductRequest,
  getProductSuccess,
  getProductFailure,
  resetProduct,
  createProductRequest,
  createProductSuccess,
  createProductFailure,
  updateProductRequest,
  updateProductSuccess,
  updateProductFailure
} = createActions(
  {
    GET_PRODUCT_SUCCESS: payload => payload
  },
  'GET_PRODUCT_REQUEST',
  'GET_PRODUCT_FAILURE',
  'RESET_PRODUCT',
  'CREATE_PRODUCT_REQUEST',
  'CREATE_PRODUCT_SUCCESS',
  'CREATE_PRODUCT_FAILURE',
  'UPDATE_PRODUCT_REQUEST',
  'UPDATE_PRODUCT_SUCCESS',
  'UPDATE_PRODUCT_ERROR'
);

export const { loadProductCategories } = createActions({
  LOAD_PRODUCT_CATEGORIES: payload => payload
});

// Action creators
export const getProducts = () => dispatch => {
  dispatch(getProductsRequest());
  return axiosService
    .get('/sema/admin/products')
    .then(response => dispatch(getProductsSuccess(response.data)))
    .catch(err => dispatch(getProductsFailure(err)));
};

export const getProduct = id => dispatch => {
  dispatch(getProductRequest());
  return axiosService
    .get(`/sema/admin/products/${id}`)
    .then(response => dispatch(getProductSuccess(response.data)))
    .catch(err => {
      dispatch(getProductFailure(err));
    });
};

export const getProductCategories = () => dispatch =>
  axiosService
    .get('/sema/api/product-categories')
    .then(response => dispatch(loadProductCategories(response.data)))
    .catch(err => {
      throw err;
    });

export const createProduct = data => dispatch => {
  dispatch(createProductRequest());
  axiosService
    .post('/sema/admin/products', { data })
    .then(response => dispatch(createProductSuccess(response.data)))
    .catch(err => {
      throw err;
    });
};

export const updateProduct = data => dispatch => {
  dispatch(updateProductRequest());
  axiosService
    .put(`/sema/admin/products/${data.id}`, { data })
    .then(response => dispatch(updateProductSuccess(response.data)))
    .catch(err => {
      throw err;
    });
};
