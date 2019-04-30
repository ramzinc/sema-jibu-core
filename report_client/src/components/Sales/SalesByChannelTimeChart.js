import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';
// import moment from "moment/moment";
import { utilService } from 'services';


class SalesByChannelTimeChart extends Component {
	render() {
		if( this.props.chartData.loaded ) {
			return (
				<div className="chart" style={{backgroundColor: 'white', margin: "2px"}}>
					<Line
						data={this.getChartDataSets()}
						height={300}
						width={500}
						options={{
							maintainAspectRatio: false,
							scales: {
								yAxes: [{
									ticks: {
										beginAtZero:true,
									}
								}],
								xAxes: [{
									type: 'time',
									time: {
										unit: this.getTimeUnit(),
										displayFormats: {
											day: 'MMM D'
										},
										min:this.getMin(),
										max:this.getMax(),
									},

									// max: this.calcDate(this.props.chartData.salesInfo.salesByChannelHistory.salesByChannel.endDate)
								}]

								// xAxes: [{
								// 	type: 'time',
								// 	time: {
								// 		unit: 'month',
								// 		displayFormats: {
								// 			day: 'MMM D'
								// 		},
								// 		min: this.calcDate(this.props.chartData.salesInfo.salesByChannelHistory.salesByChannel.beginDate),
								// 		max: this.calcDate(this.props.chartData.salesInfo.salesByChannelHistory.salesByChannel.endDate)
								// 	}
								// }]
							},
							title: {
								display: true,
								text: this.getChartText(),
								position: "top"
							}
						}}
					/>
				</div>
			);
		}else{
			return  (<div style={{textAlign:"center"}}>
					{this.getChartText()}
					<br/>
					No Data available
				</div>
			);

		}
	}
	getTimeUnit(){
		if(this.props.chartData.salesInfo.salesByChannelHistory.salesByChannel.groupBy === "day"){
			return "week";
		}else{
			return "month";
		}
	}
	getMin(){
		// For monthly data, (groupBy => "day) return the first day of month
		if(this.props.chartData.salesInfo.salesByChannelHistory.salesByChannel.groupBy === "day"){
			return this.calcDate(this.props.chartData.salesInfo.salesByChannelHistory.salesByChannel.beginDate);
		}else{
			return null;
		}
	}
	getMax(){
		// For monthly data, (groupBy => "day) return the end day of month
		if(this.props.chartData.salesInfo.salesByChannelHistory.salesByChannel.groupBy === "day"){
			return this.calcDate(this.props.chartData.salesInfo.salesByChannelHistory.salesByChannel.endDate);
		}else{
			return null;
		}
	}

	getChartDataSets(){
		let datasets = this.props.chartData.salesInfo.salesByChannelHistory.salesByChannel.datasets;
		let returnSets = [];
		datasets.forEach( (dataset,index) =>{
			if( dataset.type === 'total'){
				let color = utilService.getBackgroundColorByIndex( index/2 );

				returnSets.push({label:dataset.salesChannel, data:dataset.data, borderColor:color, pointRadius:0,borderWidth:2,type:"line",lineTension:0 });
			}
		});
		// results.salesByChannel.datasets.push({label:salesChannelArray[index].name, data:salesData});

		return {datasets:returnSets};
	}

 	getChartText( ) {
		return 'Revenue Timeline';
	}
	calcDate= (val)=>{
        // if( val !== "N/A"){
		// 	val = moment(val).format('YYYY-MM-D');
		// }
    	return val;
	}
 }
export default SalesByChannelTimeChart;
