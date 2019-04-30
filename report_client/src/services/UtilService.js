
const colors = [

	"rgb(228,150,32)",
	"rgb(95,159,55)",
	"rgb(128,0,128)",
	"rgb(253,0,6)",
	"rgb(51, 110, 182)",
	"rgb(106,42,10)",
	"rgb(183,218,234)",
	"rgb(254,225,4)",
	"rgb(104,97,94)",
	"rgb(32,56,100)",
	"rgb(160,203,160)",

	// "rgb(253,179,8)",
	// "rgb(138,54,14)",
	// "rgb(228,103,32)",
	// "rgb(95,159,55)",
	// "rgb(75,135,203)",
	// "rgb(160,160,160)",
	// "rgb(160,203,160)",
];

const colors2 = [
	"rgb(95,161,55)",
	"rgb(75,135,203)",
	"rgb(160,160,160)",
];

const getBackgroundColorForChannel = channelName => {
	switch( channelName.toLowerCase() ){
		case "household":
			return "rgba(95,161,55,1.0)";
		case "main station":
			return "rgba(75,135,201,1.0)";
		case "access points":
			return "rgba(253,181,10,1.0)";

		default:
			return "rgba(255,0,0,1)";



	}
};

// Simple color picker to pick a color by index
const getBackgroundColorByIndex = index =>{
	const pickIndex =  index % colors.length;
	return colors[pickIndex];
};

// Simple color picker to pick a color by index
const getBackgroundColorByIndex2 = index =>{
	const pickIndex =  index % colors2.length;
	return colors2[pickIndex];
};

const formatDollar = (currencyUnits, amount ) =>{
	let suffix = "";
	if(! currencyUnits ){
		currencyUnits = 'USD';
	}
	if( amount ) {
		if (amount > 1000) {
			amount = amount / 1000;
			suffix = "k";
		}
		let formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currencyUnits,
			minimumFractionDigits: 2,
			// the default value for minimumFractionDigits depends on the currency
			// and is usually already 2
		});
		return formatter.format(amount) + suffix;
	}else{
		return "N/A"
	}
};

const formatDateForUrl = dateTime =>{
	return ( "" + dateTime.getFullYear() + '-'  +
		('0'+ (dateTime.getMonth() +1)).slice(-2) + '-' +
		('0'+ dateTime.getDate()).slice(-2) + 'T' +
		('0'+ dateTime.getHours()).slice(-2) + ':' +
		('0'+ dateTime.getMinutes()).slice(-2) + ':' +
		('0'+ dateTime.getSeconds()).slice(-2) );
};


const isEmptyObject = ( obj ) =>{
	return (Object.keys(obj).length === 0 && obj.constructor === Object) ? true: false;
}

export const utilService = {
	getBackgroundColorForChannel,
	getBackgroundColorByIndex,
	getBackgroundColorByIndex2,
	isEmptyObject,
	formatDollar,
	formatDateForUrl
};
