import React, { Component } from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import { utilService } from 'services';
import 'css/SemaChart.css';

class WaterVolumeChannelAndPaymentTypeChart extends Component {
    render() {
		if( this.props.chartData.loaded ) {
			return (
				<div className = "ChartContainer" >
					<div className = "chart" style={{backgroundColor:'white', margin:"2px"}}>
						<HorizontalBar
							data = {this.getVolumeData()}
							// data = {{
							// labels: ["Walkup", "Reseller"],
							// datasets: [
							// 	{
							// 		label: "Walkup",
							// 		backgroundColor: ["rgba(99,255,132,0.2)", "rgba(99,132,255,0.2)" ],
							// 		data: [55, 90 ],
							// 	}
							// ]
							// }}
							height={300}
							width={500}
							options={{
								title: {
									display: true,
									text: this.getChartText(),
									position:"top"
								},
								legend:{
									position:"right"
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
	getVolumeData(){
		let data = {labels:[], datasets:[]}
		if( this.props.chartData.loaded ) {
			if( this.props.chartData.volumeInfo.hasOwnProperty('volumeByChannel')){
				if( this.props.chartData.volumeInfo.volumeByChannelAndPaymentType.length > 0 ) {
					// Create the bars
					this.props.chartData.volumeInfo.volumeByChannelAndPaymentType.forEach(channelAndType => {
						data.labels.push(channelAndType.paymentType);
					});

					// Create the labels
					this.props.chartData.volumeInfo.volumeByChannelAndPaymentType[0].volume.data.forEach((salesChannel, index) => {
						data.datasets.push( {label: salesChannel.salesChannel, data:[], stack: 1, backgroundColor:utilService.getBackgroundColorByIndex( index ), id: salesChannel.salesChannel});
					});
					// add the data
					this.props.chartData.volumeInfo.volumeByChannelAndPaymentType.forEach(channelAndType => {
						channelAndType.volume.data.forEach( dataPt =>{
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
				return;
			}
		}
	}

	getChartText( ) {
		let title = "Volume By Sales Channel and Payment Type";
		let total = 0;
		if( this.props.chartData.loaded && this.props.chartData.volumeInfo.hasOwnProperty('volumeByChannelAndPaymentType')) {
			total = this.props.chartData.volumeInfo.volumeByChannelAndPaymentType.reduce( (total, channelAndType) => {
				return(total + channelAndType.volume.data.reduce( (total, data) =>{ return (total + data.volume)}, 0)) }, 0 );
			if( total === 0 ){
				title = title + ". (No data available)";
			}
		}
		return title;
	}

}
export default WaterVolumeChannelAndPaymentTypeChart;
