import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
import moment from "moment/moment";
import { utilService } from 'services';
import 'css/SemaChart.css';


class SemaTDSChart extends Component {

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
											beginAtZero:true,
											max:210,
											stepSize: 30,
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
					Total Dissolved Solid
					<br/>
					No Data available
				</div>
			);

		}
    }
    getChartTitle(tds){
    	return "Total Dissolved Solids (mg/L (ppm)";

	}
    getChartData( tdsData ){
    	if( utilService.isEmptyObject(tdsData) || utilService.isEmptyObject(tdsData.data )){
			return { labels: [], datasets: []}
		}else{
			let tds = {
				labels:tdsData.data.time,
				datasets: [{label: 'Total Disolved Solids', data: tdsData.data.values}]
			};
			tds.datasets[0].backgroundColor='rgb(53, 91, 183)';
			tds.datasets[0].fill=false;
			tds.datasets[0].pointRadius=0;
			tds.datasets[0].borderWidth = 4;
			tds.datasets[0].borderColor='rgb(53, 91, 183)';
			tds.labels = tds.labels.map(function(time)
				{return moment(time ).format("MMM Do YY")});
			createGuide(tds.datasets, 150, 'rgba(255,0,0,1.0)', "Shutdown");
			createGuide(tds.datasets, 70, 'rgba(255,255,0,1.0)', "Risk");
			createGuide(tds.datasets, 110, "rgba(198,209,232,1.0", "Fair");
			createGuide(tds.datasets, 30, 'rgba(0,255,0,1.0)', "Good");
			return tds;
		}
	}
}

export default SemaTDSChart;

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


