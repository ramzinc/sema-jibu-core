import { LOAD_PRODUCT_CATEGORIES } from '../actions/ProductActions';

const productCategoryReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_PRODUCT_CATEGORIES:
      return action.payload.productCategories;
    default:
      return state;
  }
};

export default productCategoryReducer;
