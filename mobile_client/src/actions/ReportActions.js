import PosStorage from "../database/PosStorage";
import { REMOVE_PRODUCT } from "./OrderActions";
import moment from 'moment-timezone';

export const SALES_REPORT_FROM_ORDERS = 'SALES_REPORT_FROM_ORDERS';
export const INVENTORY_REPORT = 'INVENTORY_REPORT';
export const REPORT_TYPE = 'REPORT_TYPE';
export const REPORT_FILTER = 'REPORT_FILTER';


export function GetSalesReportData( beginDate, endDate ) {
	console.log("GetSalesReportData - action");

	return (dispatch) => {
		getSalesData(beginDate, endDate)
			.then( salesData =>{
				dispatch({type: SALES_REPORT_FROM_ORDERS, data:{salesData:salesData}})
			})
			.catch((error) => {
				console.log( "GetSalesReportData - Error " + error.message);
				dispatch({type: SALES_REPORT_FROM_ORDERS, data:{salesData:[]}})
			});
		}

}

export function setReportType( reportType ) {
	console.log("setReportType - action");
	return (dispatch) => { dispatch({type: REPORT_TYPE, data:reportType}); }
}

export function setReportFilter( startDate, endDate ){
	console.log("setReportFilter - action");
	return (dispatch) => { dispatch({type: REPORT_FILTER, data:{startDate:startDate, endDate:endDate}}); }
}

const getSalesData = (beginDate, endDate) =>{
	return new Promise(async (resolve, reject) => {
		const loggedReceipts = await PosStorage.loadRemoteReceipts();

		const filteredReceipts = loggedReceipts.filter(receipt =>
			moment.tz(
				new Date(receipt.id),
				moment.tz.guess()
			)
			.isBetween(beginDate, endDate)
		);

		const allReceiptLineItems = filteredReceipts.reduce((lineItems, receipt) => {
			// We only show data for active receipts
			if (!receipt.active) return lineItems;

			if (!receipt.isLocal) {
				receipt.receipt_line_items = receipt.receipt_line_items.map(item => {
					item.product = {
						active: item.product.active,
						categoryId: item.product.category_id,
						cogsAmount: item.product.cogsAmount,
						description: item.product.description,
						maximumQuantity: item.product.maximum_quantity,
						minimumQuantity: item.product.minimum_quantity,
						name: item.product.name,
						priceAmount: item.product.price_amount,
						priceCurrency: item.product.price_currency,
						sku: item.product.sku,
						unitMeasure: item.product.unit_measure,
						unitPerProduct: item.product.unit_per_product
					};

					return item;
				});
			} else {
				// Get rid of the image property from the product of pending receipt line items
				// too heavy to carry around. We're not using it here anyway
				receipt.receipt_line_items.forEach(item => {
					delete item.product.base64encodedImage;
				});
			}

			lineItems.push(...receipt.receipt_line_items);

			return lineItems;
		}, []);

		if (!allReceiptLineItems.length) {
			return resolve({totalLiters: 0, totalSales: 0, salesItems:[]})
		}

		const finalData = allReceiptLineItems.reduce((final, lineItem) => {
			const productIndex = final.mapping.get(lineItem.product.sku);

			// Note how we explicitly check it's undefined. The index could be 0
			const product = typeof productIndex !== 'undefined' ?
				final.salesItems[productIndex] :
				{
					sku: lineItem.product.sku,
					description: lineItem.product.description,
					quantity: Number(lineItem.quantity),
					pricePerSku: parseFloat(lineItem.price_total) / Number(lineItem.quantity),
					totalSales: parseFloat(lineItem.price_total),
					litersPerSku: Number(lineItem.product.unitPerProduct),
					totalLiters: Number(lineItem.product.unitPerProduct) * Number(lineItem.quantity),
					isNew: true
				};

			if (product.isNew) {
				delete product.isNew;

				final.salesItems.push(product);
				final.mapping.set(lineItem.product.sku, final.salesItems.length - 1);
			} else {
				product.quantity += Number(lineItem.quantity);
				product.totalSales += parseFloat(lineItem.price_total);
				product.totalLiters += Number(lineItem.product.unitPerProduct) * Number(lineItem.quantity);

				final.salesItems[productIndex] = product;
			}

			final.totalLiters += Number(lineItem.product.unitPerProduct) * Number(lineItem.quantity);
			final.totalSales += parseFloat(lineItem.price_total);

			return final;
		}, {totalLiters: 0, totalSales: 0, salesItems: [], mapping: new Map()});

		finalData.mapping.clear();
		delete finalData.mapping;

		resolve(finalData);
	});
};

export function GetInventoryReportData( beginDate, endDate, products ) {
	console.log("GetInventoryReportData - action");

	return (dispatch) => {
		getInventoryData(beginDate, endDate, products)
			.then( inventoryData =>{
				dispatch({type: INVENTORY_REPORT, data:{inventoryData:inventoryData}})
			})
			.catch((error) => {
				console.log( "GetInventoryReportData - Error " + error.message);
				dispatch({type: INVENTORY_REPORT, data:{inventoryData:[]}})
			});
	}

}

const getInventoryData = (beginDate, endDate, products) =>{
	return new Promise((resolve, reject) => {
		getSalesData(beginDate, endDate)
			.then( salesData =>{
				getInventoryItem(beginDate, products)
					.then(inventorySettings => {
						let inventoryData = createInventory( salesData, inventorySettings, products);
						resolve( inventoryData)
					})
					.catch((error) => {
						reject( error);
					});
			})
			.catch((error) => {
				reject( error);
			});
	});
};
const createInventory = (salesData, inventorySettings, products ) =>{
	let salesAndProducts = {...salesData};
	salesAndProducts.salesItems = salesData.salesItems.slice();
	let emptyProducts = [];
	for( let index = 0; index < products.length; index++ ){
		if( isNotIncluded( products[index], salesAndProducts.salesItems)){
			emptyProducts.push(
				{
					sku: products[index].sku,
					description:products[index].description,
					quantity: 0,
					totalSales: 0,
					totalLiters:0,
					litersPerSku:products[index].unitPerProduct
				});
		}
	}
	salesAndProducts.salesItems = salesAndProducts.salesItems.concat( emptyProducts );
	let inventoryData = {salesAndProducts:salesAndProducts, inventory:inventorySettings};

	return inventoryData;
};

const isNotIncluded = ( product, salesAndProducts) =>{
	for( let index =0; index < salesAndProducts.length; index++){
		if( salesAndProducts[index].sku == product.sku){
			return false;
		}
	}
	return true;
};

const getInventoryItem = (beginDate, products) => {
	return new Promise((resolve ) => {
		const promiseToday = PosStorage.getInventoryItem(beginDate);
		const yesterday = new Date( beginDate.getTime() - 24 * 60 *60 *1000);
		const promiseYesterday = PosStorage.getInventoryItem( yesterday);
		Promise.all([promiseToday, promiseYesterday])
			.then(inventoryResults => {
				if( inventoryResults[0] != null ){
					if( inventoryResults[1]){
						inventoryResults[0].previousProductSkus = inventoryResults[1].currentProductSkus;
						inventoryResults[0].previousMeter = inventoryResults[1].currentMeter;
					}
					resolve(inventoryResults[0])
				}else{
					let newInventory = initializeInventory();
					newInventory.date = beginDate;
					newInventory.currentProductSkus = products.map( product => {return {sku:product.sku, quantity:null }});
					newInventory.previousProductSkus = products.map( product => {return {sku:product.sku, quantity:null }});
					if( inventoryResults[1] ){
						newInventory.previousProductSkus = inventoryResults[1].currentProductSkus;
						newInventory.previousMeter = inventoryResults[1].currentMeter;
					}
					resolve(newInventory);
				}
		});
	});
};
const initializeInventory = () =>{
	return {date:null, currentMeter:null, currentProductSkus:[], previousMeter:null, previousProductSkus:[]}
}
export const initializeSalesData = () => {
	return {totalLiters: null, totalSales: null, salesItems:[]};
};
export const initializeInventoryData = () =>{
	return {salesAndProducts:initializeSalesData(), inventory:initializeInventory()}
};
