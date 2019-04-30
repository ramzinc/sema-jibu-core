import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';
import { utilService } from 'services';

class WaterVolumeChannelChart extends Component {
    render() {
        return (
			<div style={{backgroundColor:'rgb(40,89,167'}}>
        		<div className = "chart" style={{backgroundColor:'white', margin:"2px"}}>
					<Doughnut
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
    }
	getVolumeData(){
		let data = {labels:[], datasets:[]}
		if( this.props.chartData.loaded ) {
    		if( this.props.chartData.volume.volumeInfo.hasOwnProperty('volumeByChannel')){

				data.datasets.push( {label: "Volume by Sales Channel", backgroundColor:[], data:[]});

				let index = 0;
				this.props.chartData.volume.volumeInfo.volumeByChannel.volume.data.forEach(salesChannel => {
					data.labels.push(salesChannel.salesChannel);
					data.datasets[0].backgroundColor.push( utilService.getBackgroundColorForChannel( salesChannel.salesChannel ) );
					data.datasets[0].data.push(salesChannel.volume );
					index++;
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
			if (this.props.chartData.volume.volumeInfo.hasOwnProperty('volumeByChannel')) {
				this.props.chartData.volume.volumeInfo.volumeByChannel.volume.data.forEach( (channel) =>{
					total += channel.volume;
				} );
			}
			title = title + " (" + total.toFixed(1) + " for this period)";
		}
		return title;
	}
}
export default WaterVolumeChannelChart;
