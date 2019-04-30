import React, { Component } from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import { utilService } from 'services';

class WaterVolumeChannelAndIncomeChart extends Component {
    render() {
    	return this.renderContent();
    }

    renderContent(){
		if( this.props.chartData.loaded ) {
			return (<div className = "ChartContainer" >
					<div className="chart" style={{backgroundColor:'white', margin:"2px"}}>
						<HorizontalBar
							data={this.getVolumeData()}
							// 	data = {{
							// 	labels: ["$8< per day", "$8<$5 per day", "$5<$2 per day", "<$2 per day"],
							// 	datasets: [
							// {
							// 	label: "Walkup",
							// 	backgroundColor: "rgba(99,255,132,0.2)",
							// 	data: [29, 39, 49, 59],
							// 	stack: 1
							// },
							// {
							// 	label: "Reseller",
							// 	backgroundColor: "rgba(99,132,255,0.2)",
							// 	data: [80, 60, 40, 20],
							// 	stack: 1
							// },
							// 	]
							// }}
							height={300}
							width={500}
							options={{
								maintainAspectRatio: false,
								scales: {
									xAxes: [{stacked: true}],
								},
								title: {
									display: true,
									text: this.getChartText(),
									position: "top"
								}

							}}

						/>
					</div>
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

	getChartText( ) {
		let title = "Volume by Channel and Income";
		let total = 0;
		if( this.props.chartData.loaded && this.props.chartData.volumeInfo.hasOwnProperty('volumeByChannelAndIncome')) {
			total = this.props.chartData.volumeInfo.volumeByChannelAndIncome.reduce( (total, channelAndIncome) => {
				return(total + channelAndIncome.volume.data.reduce( (total, data) =>{ return (total + data.volume)}, 0)) }, 0 );
			if( total === 0 ){
				title = title + ". (No data available)";
			}
		}
		return title;
	}

	getVolumeData(){
		let data = {labels:[], datasets:[]}
		if( this.props.chartData.loaded ) {
    		if( this.props.chartData.volumeInfo.hasOwnProperty('volumeByChannelAndIncome')){
				if( this.props.chartData.volumeInfo.volumeByChannelAndIncome.length > 0 ) {
					// Create the bars
					this.props.chartData.volumeInfo.volumeByChannelAndIncome.forEach(channelAndIncome => {
						if (channelAndIncome.hasOwnProperty("incomeLessThan") && channelAndIncome.hasOwnProperty("incomeGreaterThan")) {
							let label = "$" + channelAndIncome.incomeGreaterThan + "<$" + channelAndIncome.incomeLessThan + " per day";
							data.labels.push(label);
						} else if (channelAndIncome.hasOwnProperty("incomeLessThan")) {
							data.labels.push("$" + channelAndIncome.incomeLessThan + "< per day");
						} else if (channelAndIncome.hasOwnProperty("incomeGreaterThan")) {
							data.labels.push("$" + channelAndIncome.incomeGreaterThan + "> per day");
						}
					});

					// Create the labels

					this.props.chartData.volumeInfo.volumeByChannelAndIncome[0].volume.data.forEach((salesChannel,index) => {
						data.datasets.push( {label: salesChannel.salesChannel, data:[], stack: 1, backgroundColor:utilService.getBackgroundColorByIndex( index ), id: salesChannel.salesChannel});
					});
					// add the data
					this.props.chartData.volumeInfo.volumeByChannelAndIncome.forEach(channelAndIncome => {
						channelAndIncome.volume.data.forEach( dataPt =>{
							this.addData( data.datasets, dataPt );
						});

					});

					console.log("WaterVolumeChannelAndIncomeChart - Volume data loaded");

				}
			}
		}
		return data;
	}
	addData( dataSets, dataPt ){
    	for( let index = 0; index < dataSets.length; index++){
    		if(dataSets[index].id === dataPt.salesChannel ){
				dataSets[index].data.push( dataPt.volume );
				return
			}
		}
	}
}
export default WaterVolumeChannelAndIncomeChart;
