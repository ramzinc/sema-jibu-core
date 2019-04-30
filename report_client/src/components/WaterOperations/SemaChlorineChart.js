import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import moment from "moment/moment";
import { utilService } from 'services';
import 'css/SemaChart.css';

// To accsess Chart globals, change "import {Line} from 'react-chartjs-2';" to "import {Line, Chart} from 'react-chartjs-2';"
// Chart.defaults.global.defaultFontColor = '#666';

class SemaChlorineChart extends Component {

    render() {
		if( ! utilService.isEmptyObject(this.props.chartData) ) {

			return (
				<div className="ChartContainer">
					<div className="chart" style={{backgroundColor: 'white', margin: "2px"}}>
						<Line
							data={this.getChartData(this.props.chartData)}
							height={300}
							width={500}
							options={{
								maintainAspectRatio: false,
								scales: {
									yAxes: [{
										ticks: {
											beginAtZero: true,
											max: 1.1,
											stepSize: 0.1,
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
									position: "top"
								}

							}}
						/>
					</div>
				</div>
			);
		}else{
			return  (<div style={{textAlign:"center"}}>
					Chlorine
					<br/>
					No Data available
				</div>
			);

		}
    }
    getChartTitle(chlorine){
    	switch( chlorine.type){
			case "totalchlorine":
				return "Total Chlorine (PPM)";
			case "freechlorine":
				return "Free Chlorine (PPM)";
			default:
				return "Chlorine";
		}

	}
    getChartData( chlorineData ){
    	if( utilService.isEmptyObject(chlorineData) || utilService.isEmptyObject(chlorineData.data )){
			return { labels: [], datasets: []}
		}else{
			let chlorine = {
				labels:chlorineData.data.time,
				datasets: [{label: 'Total Chlorine', data: chlorineData.data.values}]
			};
			chlorine.datasets[0].backgroundColor='rgb(53, 91, 183)';
			chlorine.datasets[0].fill=false;
			chlorine.datasets[0].pointRadius=0;
			chlorine.datasets[0].borderWidth = 4;
			chlorine.datasets[0].borderColor='rgb(53, 91, 183)';
			chlorine.labels = chlorine.labels.map(function(time)
				{return moment(time ).format("MMM Do YY")});
			createGuide(chlorine.datasets, 0.9, 'rgba(255,0,0,1.0)', "High");
			createGuide(chlorine.datasets, 0.4, 'rgba(0,255,0,1.0)', "Low");
			createGuide(chlorine.datasets, 0.6, 'rgba(255,255,0,1.0)', "ideal");
			return chlorine;
		}
	}
}

export default SemaChlorineChart;

const createGuide = ( datasets, yValue, color, label) => {
	let guideData = new Array(datasets[0].data.length);
	guideData.fill(yValue);
	let guide = {
		label: label,
		data: guideData,
		type: "line",
		borderColor: color,
		backgroundColor: color,
		fill: false,
		pointRadius: 0,
		borderWidth: 2
	};
	datasets.push(guide)
};


// const timeTicks = result.map(item =>{return item.created_date});
// const values = result.map(item =>{return parseFloat(item.value)});
// results.chlorine = {
// 	x_axis: timeTicks,
// 	datasets: [{label: 'Total Chlorine', data: values}]
//
//
// if( waterQuality.chlorine.datasets.length === 0){
// 	newWaterQuality.chlorine = createBlankChart();
// }else{
// 	newWaterQuality.chlorine = {
// 		labels:waterQuality.chlorine.x_axis,
// 		datasets: waterQuality.chlorine.datasets
// 	};
// 	newWaterQuality.chlorine.datasets[0].backgroundColor='rgb(53, 91, 183)';
// 	newWaterQuality.chlorine.datasets[0].fill=false;
// 	newWaterQuality.chlorine.datasets[0].pointRadius=0;
// 	newWaterQuality.chlorine.datasets[0].borderColor='rgb(53, 91, 183)';
// 	newWaterQuality.chlorine.labels = newWaterQuality.chlorine.labels.map(function(time)
// 	{return moment(time ).format("MMM Do YY")});
// 	createGuide(newWaterQuality.chlorine.datasets, 0.9, "red", "High");
// 	createGuide(newWaterQuality.chlorine.datasets, 0.4, "yellow", "Low");
// 	createGuide(newWaterQuality.chlorine.datasets, 0.6, "green", "ideal");
// }
