import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';
import { utilService } from 'services';
import 'css/SemaChart.css';

class WaterVolumeChannelChart extends Component {
    render() {
		if( this.props.chartData.loaded ) {
			return (
				<div className="ChartContainer">
					<div className="chart" style={{backgroundColor: 'white', margin: "2px"}}>
						<Doughnut
							data={this.getVolumeData()}
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
									position: "top"
								},
								legend: {
									position: "right"
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
    		if( this.props.chartData.volumeInfo.hasOwnProperty('volumeByChannel') &&
				this.props.chartData.volumeInfo.volumeByChannel.hasOwnProperty('volume') ){
				data.datasets.push( {label: "Volume by Sales Channel", backgroundColor:[], data:[]});

				this.props.chartData.volumeInfo.volumeByChannel.volume.data.forEach((salesChannel, index) => {
					data.labels.push(salesChannel.salesChannel + ", (" + salesChannel.volume + ")");
					data.datasets[0].backgroundColor.push( utilService.getBackgroundColorByIndex( index ) );
					data.datasets[0].data.push(salesChannel.volume );
				});

				console.log("WaterVolumeChannelChart - Volume data loaded");
			}
		}
		return data;
	}
	getChartText( ) {
		let title =  "Volume By Sales Channel";
		let total = 0;
		if (this.props.chartData.loaded) {
			if (this.props.chartData.volumeInfo.hasOwnProperty('volumeByChannel')) {
				this.props.chartData.volumeInfo.volumeByChannel.volume.data.forEach( (channel) =>{
					total += channel.volume;
				} );
			}
			if( total === 0 ){
				title = title + " (No data available)";
			}else {
				title = title + " (" + total.toFixed(1) + " for this period)";
			}
		}
		return title;
	}
}
export default WaterVolumeChannelChart;
