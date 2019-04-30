import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';
import { utilService } from 'services';

class CustomersByGenderChart extends Component {
    render() {
		if( this.props.chartData.loaded ) {
			return (
				<div className = "ChartContainer" >
					<div className = "chart" style={{backgroundColor:'white', margin:"2px"}}>
						<Pie
							data = {this.getCustomerData()}
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
	getCustomerData(){
		let data = {labels:[], datasets:[]}
		if( this.props.chartData.loaded ) {
    		if( this.props.chartData.customerInfo.hasOwnProperty('customersByGender')){

				data.datasets.push( {label: "", backgroundColor:[], data:[]});
				let [ maleCount, femaleCount, naCount] = this.calcGenderValues( this.props.chartData.customerInfo );
				let total = maleCount + femaleCount + naCount;

				data.labels.push("Male (" + ((maleCount *100)/total).toFixed(0) + "%)");
				data.datasets[0].backgroundColor.push( utilService.getBackgroundColorByIndex2( 0 ) );
				data.datasets[0].data.push(maleCount );

				data.labels.push("Female (" + ((femaleCount *100)/total).toFixed(0) + "%)");
				data.datasets[0].backgroundColor.push( utilService.getBackgroundColorByIndex2( 1 ) );
				data.datasets[0].data.push(femaleCount );

				data.labels.push("Not Available (" + ((naCount *100)/total).toFixed(0) + "%)");
				data.datasets[0].backgroundColor.push( utilService.getBackgroundColorByIndex2( 2 ) );
				data.datasets[0].data.push(naCount );

			}
		}
		return data;
	}
	getChartText( ) {
		let title = "Customers By Gender";
		if( this.props.chartData.loaded && this.props.chartData.customerInfo.hasOwnProperty('customersByGender')) {
		let total = this.props.chartData.customerInfo.customersByGender.reduce( (total, customer) => { return(total + customer.customerCount)}, 0);
			if( total === 0 ) {
				title = title + ". (No data available)";
			}
		}
		return title;
	}

	calcGenderValues( customerInfo ){
    	let naCount = customerInfo.allCustomers.customerCount;
		let maleCount = customerInfo.customersByGender[0].customerCount;
		let femaleCount = customerInfo.customersByGender[1].customerCount;
		naCount = naCount - ( maleCount + femaleCount);
		return [maleCount,femaleCount,naCount  ];
	}
}
export default CustomersByGenderChart;
