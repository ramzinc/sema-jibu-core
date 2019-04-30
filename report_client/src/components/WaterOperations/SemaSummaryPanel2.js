
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';
import 'css/SemaWaterOperations.css';
import {Table } from 'react-bootstrap';

let dateFormat = require('dateformat');

class SemaSummaryPanel2 extends Component {
    render() {
        return (
        	<div style={{width:"90%"}}>
					<Panel className="WaterSummaryPanel">
						<Table >
							<tbody>
								<tr>
									<td className="WaterOpTableRow1Col1">{this.populateRow1Col1()}</td>
									<td className="WaterOpTableRow1Col2to4">{this.populateRow1Col2()}</td>
									<td className="WaterOpTableRow1Col2to4">{this.populateRow1Col3()}</td>
									<td className="WaterOpTableRow1Col2to4">{this.populateRow1Col4()}</td>
								</tr>
								<tr>
									<td style={{border:"none", paddingBottom:0, paddingTop:"3px", fontSize:"16px"}}>{this.populateRow2Col1()}</td>
									<td className="WaterOpTableRow2Col2to4" style={this.getStyle()}>{this.populateRow2Col2()}</td>
									<td className="WaterOpTableRow2Col2to4" style={this.getStyle()}>{this.populateRow2Col3()}</td>
									<td className="WaterOpTableRow2Col2to4" style={this.getStyle()}>{this.populateRow2Col4()}</td>
								</tr>
							</tbody>
						</Table>
						<p style={{textAlign:"center"}}>{this.populateDate()}</p>
					</Panel>
			</div>
        );
    }
	populateRow1Col1(){
        return ( this.props.type === "pressure") ? "Pressure" : "Flowrate";
    }

	populateRow1Col2(){
		return ( this.props.type === "pressure") ? "Pre-Membrane" : "Product";
	}

	populateRow1Col3(){
		return ( this.props.type === "pressure") ? "Post-Membrane" : "Source";
	}

	populateRow1Col4(){
		return ( this.props.type === "pressure") ? "" : "Distribution";
	}

	populateRow2Col1(){
    	return "Units: " + this.props.units.toUpperCase();
		// return ( this.props.type === "pressure") ? "Units: PSI" : "Units: GPM";
	}

	populateRow2Col2(){
    	let value = ( this.props.type === "pressure") ? this.props.data.pressurePreMembrane : this.props.data.flowRateProduct;
		if( ! value ){
			return "N/A";
		}
		return Math.round(value);
	}

	populateRow2Col3(){
		let value = ( this.props.type === "pressure") ? this.props.data.pressurePostMembrane : this.props.data.flowRateSource;
		if( ! value ){
			return "N/A";
		}
		return Math.round(value);
	}

	populateRow2Col4(){
		if( this.props.type === "pressure"){
			return " ";
		}else{
			let value = this.props.data.flowRateDistribution;
			if( ! value ){
				return "N/A";
			}else {
				return Math.round(value);
			}
		}
	}

	populateDate(){
    	let dateVal = this.props.data.endDate;
		if( !dateVal){
			return "";
		}
		return this.formatDate(dateVal);
	}

	formatDate(dateVal){
		return  dateFormat((Date.parse(dateVal)), "dddd. mmm, d, yyyy");
	}
	getStyle(){
		if( this.props.type === "pressure") {
			return {paddingTop: "3px", color: "rgb(219,86,13)", fontSize:"large"};
		}else{
			return {paddingTop: "3px", color: "rgb(91,26,143)", fontSize:"large"};
		}
	}
}
export default SemaSummaryPanel2;


// {/*<Panel className="WaterQualitySummaryPanel">*/}
// 	{/*<Panel.Body  style={{padding:"7px"}}>*/}
// 		{/*<Panel.Title componentClass="h3" style={{margin:"0"}}>{this.props.title}</Panel.Title>*/}
// 		{/*<p style={{fontSize:"large",margin:"0", color:this.props.valueColor }}>{this.format()}   <span style={{fontSize:"medium",margin:"0", color:"black" }}>{this.props.units}</span></p>*/}
// 		{/*<p style={{margin:"0"}}>{this.formatDate()}</p>*/}
// 	{/*</Panel.Body>*/}
// {/*</Panel>*/}
// {/*</div>*/}
