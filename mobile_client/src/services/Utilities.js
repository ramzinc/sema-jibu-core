import { NativeModules } from 'react-native'

import PosStorage from "../database/PosStorage";

const IntlPolyFill = require('intl');
// Add additional locales here
require( 'intl/locale-data/jsonp/en-US');	// U.S.
require( 'intl/locale-data/jsonp/ee-GH');	// Ghana
require( 'intl/locale-data/jsonp/rw-RW');	// Rawanda
require( 'intl/locale-data/jsonp/lg-UG');	// Uganda
require( 'intl/locale-data/jsonp/sw-KE');	// Kenya
require( 'intl/locale-data/jsonp/sw-TZ');	// Tanzania
require( 'intl/locale-data/jsonp/en-ZW');	// Zimbabwe

export const capitalizeWord = word => {
	return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
};

export const isEmptyObj = (obj) => {
	for(var key in obj) {
		if(obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

export function formatCurrency( value ){
	let locale = 'en-US';
	let currency = "USD";
	try{
		locale = NativeModules.I18nManager.localeIdentifier;
		locale = locale.replace('_', '-');
	}catch( error ){
		console.log( "formatCurrency - NativeModules.I18nManager - error " + error.message);
	}
	if( PosStorage.getProducts().length > 0 ){
		if( PosStorage.getProducts()[0].priceCurrency.length === 3 ){
			currency = PosStorage.getProducts()[0].priceCurrency;
		}
	}
	value =  parseFloat(value.toFixed(2));

	// Note: Because of the very large number of locales that exist in order to support all locales AND
	// Adding currency info adds addtional text, it has been decided to format curency as a,ddd.00 format
	// and not include a currency symbol such as "$" or 'U sh'
	currency = "USD";
	locale = "en-US";
	try {
		var formatter = new IntlPolyFill.NumberFormat(locale, {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: 2,
		});
		return formatter.format(value).replace('$', '');
	}catch( error ){
		console.log( "formatCurrency - IntlPolyFill - error " + error.message);
		return value;
	}
}
