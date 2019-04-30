
import { PRODUCTS_SET } from "../actions/ProductActions"

let initialState = {products:[]};

const productReducer = (state = initialState, action) => {
	console.log("productReducer: " +action.type);
	let newState;
	switch (action.type) {
		case PRODUCTS_SET:
			newState = {...state};
			newState.products = action.data.slice() ;
			return newState;
		default:
			return state;
	}
};

export default productReducer;

