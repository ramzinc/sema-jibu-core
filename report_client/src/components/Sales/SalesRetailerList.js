import React, { Component } from 'react';
import {Table } from 'react-bootstrap';
export default class SalesRetailerList extends Component {

	render() {

		return ( // in our return function you must return a div with ref='map' and style.
			<Table striped bordered condensed hover>
				<thead>
				<tr>
					<th style={{width: "10%"}}></th>
					<th>Name</th>
					<th style={{width: "20%"}}>Sales</th>
					<th style={{width: "10%"}}>Trend</th>
				</tr>
				</thead>
				<tbody>
					{this.buildTableRows()}
				</tbody>
			</Table>
		)
	}
	buildTableRows(){
		let rows = [];
		this.props.retailers.forEach( (retailer, index) => {
			// rows.push(<tr {this.calcColor(retailer.thisPeriod, retailer.lastPeriod)}>
			// rows.push(<tr style={{color:"red"}}>
			rows.push(<tr key={index} style={this.calcColor(retailer.periods[0].value, retailer.periods[1].value)}>
						<td>{index+1}.</td>
						<td>{retailer.name}</td>
						<td>{this.getValue( retailer )}</td>
						{this.calcTrend(retailer.periods[0].value, retailer.periods[1].value)}
					</tr>
			)
		});
		return rows;
	}
	getValue( retailer){
		if( retailer.period === "none"){
			return retailer.total;
		}else{
			return retailer.periods[0].value;
		}
	}
	calcTrend( now, last ){
		if( now !== null && last !== null ){
			if( now > last ){
				return (<td style={{textAlign:"center"}}><i className="glyphicon glyphicon-arrow-up"/></td>);
			}else if( now < last ) {
				return (<td style={{textAlign: "center"}}><i className="glyphicon glyphicon-arrow-down"/></td>);
			}
		}
		return (<td style={{textAlign: "center"}}><i className="glyphicon glyphicon-minus"/></td>);
	}
	calcColor( now, last ){
		if( now !== null && last !== null){
			if( now > last ){
				return ( {color:"green"});
			}else if( now < last ) {
				return ( {color:"red"});
			}
		}
		return ( {color:"gray"});
	}

}
