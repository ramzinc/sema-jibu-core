
const colors = [
	"rgb(253,179,8)",
	"rgb(138,54,14)",
	"rgb(228,103,32)",
	"rgb(95,159,55)",
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

export const utilService = {
	getBackgroundColorForChannel,
	getBackgroundColorByIndex,
	getBackgroundColorByIndex2
};
