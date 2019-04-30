import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';
import { utilService } from 'services';

class CustomersByIncomeLevelChart extends Component {
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
			return  (
				<div style={{textAlign:"center"}}>
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
    		if( this.props.chartData.customerInfo.hasOwnProperty('customersByIncome')){

				data.datasets.push( {label: "Customers By Income Levelx", backgroundColor:[], data:[]});
				let index = 0;
				let label = "";
				let totalCustomers = this.props.chartData.customerInfo.customersByIncome.reduce( (total, customer) => { return(total + customer.customerCount)}, 0);

				this.props.chartData.customerInfo.customersByIncome.forEach(income => {
					if (income.hasOwnProperty("incomeLessThan") && income.hasOwnProperty("incomeGreaterThan")) {
						label = "$" + income.incomeGreaterThan + "<$" + income.incomeLessThan + " per day";
					} else if (income.hasOwnProperty("incomeLessThan")) {
						label = "$" + income.incomeLessThan + "< per day";
					} else if (income.hasOwnProperty("incomeGreaterThan")) {
						label = "$" + income.incomeGreaterThan + "> per day";
					}
					let percentage = ((income.customerCount * 100)/totalCustomers).toFixed(0);
					data.labels.push(label + ' (' + percentage + '%)');

					data.datasets[0].backgroundColor.push( utilService.getBackgroundColorByIndex( index ) );
					data.datasets[0].data.push(income.customerCount );
					index++;
				});
			}
		}
		return data;
	}

	getChartText( ) {
		let title = "Customers By Income Level";
		if( this.props.chartData.loaded && this.props.chartData.customerInfo.hasOwnProperty('customersByIncome')) {
			let total = this.props.chartData.customerInfo.customersByIncome.reduce( (total, customer) => { return(total + customer.customerCount)}, 0);
			if( total === 0 ) {
				title = title + ". (No data available)";
			}
		}
		return title;
	}

}
export default CustomersByIncomeLevelChart;
