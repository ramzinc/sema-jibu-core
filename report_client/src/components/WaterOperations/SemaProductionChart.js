import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2';
import moment from "moment/moment";
import { utilService } from 'services';
import 'css/SemaChart.css';


class SemaProductionChart extends Component {

    render() {
		if( ! utilService.isEmptyObject(this.props.chartData) ) {
			return (
				<div className="ChartContainer">
					<div className="chart" style={{backgroundColor: 'white', margin: "2px"}}>
						<Bar
							data={this.getChartData(this.props.chartData, this.props.fillData)}
							height={410}
							width={800}
							options={{
								maintainAspectRatio: false,
								scales: {
									yAxes: [{
										ticks: {
											beginAtZero:true
										}
									}],
									xAxes: [{
										displayFormats: {
											day: 'MMM D'
										}
									}]

								},
								title: {
									display: true,
									text: this.getChartTitle(this.props.chartData),
									position:"top"
								}

							}}
						/>

					</div>
				</div>
			);
		}else{
			return  (<div style={{textAlign:"center"}}>
					Water Production
					<br/>
					No Data available
				</div>
			);

		}
    }
    getChartTitle(productionData){
    	return "Production (" + productionData.units +")";

	}
    getChartData( productionData, fillData ){
    	if( utilService.isEmptyObject(productionData) || utilService.isEmptyObject(productionData.data )){
			return { labels: [], datasets: []}
		}else{
			let production = {
				labels:productionData.data.time,
				datasets: [{label: 'Water Production', data: productionData.data.values.map( value =>Math.round(value))}]
			};
			production.datasets[0].backgroundColor='rgb(53, 91, 183)';
			production.datasets[0].borderColor='rgb(53, 91, 183)';
			production.labels = production.labels.map(function(time)
				{return moment(time ).format("MMM Do YY")});
			// Add the moving average
			let movingAvg = this.movingAverage(productionData);
			if(movingAvg ) {
				let lineSet = {
					label: "Forecast",
					data: movingAvg,
					type: "line",
					borderColor: 'rgb(231, 113, 50)',
					backgroundColor: 'rgb(231, 113, 50)',
					fill: false,
					pointRadius: 0,
					borderWidth: 5
				};
				production.datasets.unshift(lineSet);
			}
			if( !utilService.isEmptyObject(fillData) && ! utilService.isEmptyObject(fillData.data )){
				if( this.getWastage( productionData, fillData) ){
					console.log("foo");
					let wastage = {
						label: "Wastage",
						data: fillData.data.values,
						type: "line",
						borderColor: 'rgb(231, 10, 10)',
						backgroundColor: 'rgb(231, 10, 10)',
						fill: false,
						pointRadius: 0,
						borderWidth: 3
					};
					production.datasets.unshift(wastage);

				}
			}
			return production;
		}
	}
	movingAverage( productionData) {
		// Calculate number of days in range...
		let movingAvg = null;
		const count = productionData.data.time.length;
		if (count > 5) {
			// Use a 3 sample moving average for trending
			movingAvg = calcMovingAvg(productionData.data.values, 3, null);
			// const daysInRange = Math.round((Date.parse(productionData.data.time[count-1]) - Date.parse(productionData.data.time[0])) / (1000 * 60 * 60 * 24));
			// if (daysInRange > 10) {
			// 	// Use a 10% moving average, about 3 days for a monthly range, 36 days for a year
			// 	const window = 3;
			// 	if (window > 1) {
			// 		movingAvg = calcMovingAvg(productionData.data.values, window, null);
			// 	}
			// }
		}
		return movingAvg;
	}
	getWastage( productionData, fillData){
    	let hasWastage = false;
    	for( let i = 0; i < fillData.data.time.length && i < productionData.data.time.length; i++){
    		if( fillData.data.time[i] == productionData.data.time[i]){
				fillData.data.values[i] = productionData.data.values[i] - fillData.data.values[i];
				hasWastage = true;
			}else{
				fillData.data.values[i] = null;
			}
		}
		return hasWastage;
	}
}
/**
 * returns an array with moving average of the input array
 * @param array - the input array
 * @param count - the number of elements to include in the moving average calculation
 * @param qualifier - an optional function that will be called on each
 *  value to determine whether it should be used
 */
function calcMovingAvg(array, count, qualifier){

	// calculate average for subarray
	var avg = function(array, qualifier){

		var sum = 0, count = 0, val;
		for (var i in array){
			val = array[i];
			if (!qualifier || qualifier(val)){
				sum += val;
				count++;
			}
		}

		return sum / count;
	};

	var result = [], val;

	// pad beginning of result with null values
	for (let i=0; i < count-1; i++)
		result.push(null);

	// calculate average for each subarray and add to result
	for (let i=0, len=array.length - count; i <= len; i++){

		val = avg(array.slice(i, i + count), qualifier);
		if (isNaN(val))
			result.push(null);
		else
			result.push(val);
	}

	return result;
}

export default SemaProductionChart;


