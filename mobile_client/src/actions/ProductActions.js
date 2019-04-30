export const PRODUCTS_LOADED = 'PRODUCTS_LOADED';
export const PRODUCTS_SET = 'PRODUCTS_SET';



export function setProducts( products ) {
	console.log("setProducts - action. No of products " + products.length);

	return (dispatch) => {dispatch({type: PRODUCTS_SET, data:products})};

}
