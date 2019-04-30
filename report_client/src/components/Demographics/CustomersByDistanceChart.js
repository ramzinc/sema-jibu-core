import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';
import { utilService } from 'services';

class CustomersByDistanceChart extends Component {
    render() {
		if( this.props.chartData.loaded ) {
			return (
				<div className="ChartContainer">
					<div className="chart" style={{backgroundColor: 'white', margin: "2px"}}>
						<Pie
							data={this.getCustomerData()}
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
	getCustomerData(){
		let data = {labels:[], datasets:[]}
		if( this.props.chartData.loaded ) {
    		if( this.props.chartData.customerInfo.hasOwnProperty('customersByDistance')){

				data.datasets.push( {label: "", backgroundColor:[], data:[]});
				let index = 0;
				let label = "";
				let totalCustomers = this.props.chartData.customerInfo.customersByDistance.reduce( (total, customer) => { return(total + customer.customerCount)}, 0);

				this.props.chartData.customerInfo.customersByDistance.forEach(distance => {
					if (distance.hasOwnProperty("distanceLessThan") && distance.hasOwnProperty("distanceGreaterThan")) {
						label = "" + distance.distanceGreaterThan + " - " + distance.distanceLessThan + " M" ;
					} else if (distance.hasOwnProperty("distanceLessThan")) {
						label = "<" + distance.distanceLessThan + " M";
					} else if (distance.hasOwnProperty("distanceGreaterThan")) {
						label = ">" + distance.distanceGreaterThan + " M";
					}
					let percentage = ((distance.customerCount * 100)/totalCustomers).toFixed(0);
					data.labels.push(label + ' (' + percentage + '%)');

					data.datasets[0].backgroundColor.push( utilService.getBackgroundColorByIndex( index ) );
					data.datasets[0].data.push(distance.customerCount );
					index++;
				});
			}
		}
		return data;
	}
	getChartText( ) {
    	let title = "Customers By Distance";
		if( this.props.chartData.loaded && this.props.chartData.customerInfo.hasOwnProperty('customersByDistance')) {
			let total = this.props.chartData.customerInfo.customersByDistance.reduce( (total, customer) => { return(total + customer.customerCount)}, 0);
			if( total === 0 ){
				title = title + ". (No data available)";
			}
		}
		return title;
	}
}
export default CustomersByDistanceChart;

