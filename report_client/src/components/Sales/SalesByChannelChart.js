import React, { Component } from 'react';
import {Doughnut} from 'react-chartjs-2';
import { utilService } from 'services';
import 'css/SemaChart.css';

class SalesByChannelChart extends Component {
    render() {
		if( this.props.chartData.loaded ) {
			return (
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
    		if( this.props.chartData.salesInfo.hasOwnProperty('salesByChannel')){

				data.datasets.push( {label: "Revenue Channel", backgroundColor:[], data:[]});

				this.props.chartData.salesInfo.salesByChannel.total.data.forEach((salesChannel, index) => {
					data.labels.push(salesChannel.salesChannel);
					data.datasets[0].backgroundColor.push( utilService.getBackgroundColorByIndex( index ) );
					data.datasets[0].data.push(salesChannel.total );
				});

				console.log("SalesByChannelChart - Revenue data loaded");
			}
		}
		return data;
	}
	getChartText( ) {
		let title =  "Revenue By Sales Channel";
		let total = 0;
		if (this.props.chartData.loaded) {
			if (this.props.chartData.salesInfo.hasOwnProperty('salesByChannel')) {
				this.props.chartData.salesInfo.salesByChannel.total.data.forEach( (channel) =>{
					total += channel.total;
				} );
			}
			if( total === 0 ){
				title = title + " (No data available)";
			}else {
				title = title + " (" + utilService.formatDollar(this.props.chartData.salesInfo.currencyUnits, total) + " for this period)";
			}
		}
		return title;
	}
}
export default SalesByChannelChart;
