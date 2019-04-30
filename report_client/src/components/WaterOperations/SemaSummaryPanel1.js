
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';
import 'css/SemaWaterOperations.css';
let dateFormat = require('dateformat');

class SemaSummaryPanel1 extends Component {
    render() {
        return (<div style={{width:"90%"}}>
                <Panel className="WaterSummaryPanel">
                    <Panel.Body  style={{padding:"7px"}}>
                        <Panel.Title componentClass="h3" style={{margin:"0"}}>{this.props.title}</Panel.Title>
						<p style={{fontSize:"large",margin:"0", color:this.props.valueColor }}>{this.formatValue()}   <span style={{fontSize:"medium",margin:"0", color:"black" }}>{this.formatUnits()}</span></p>
						<p style={{margin:"0"}}>{this.formatDate()}</p>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
	formatValue() {
		if (this.props.value != null) {
			return Math.round(this.props.value);
		}else{
			return "N/A";
		}
    }
	formatDate(){
 		if( this.props.date ) {
			return dateFormat((Date.parse(this.props.date)), "ddd. mmm, d, yyyy");
		}else{
 			return "";
		}
	}
	formatUnits() {
		if (this.props.value != null) {
			return this.props.units;
		}else{
			return "";
		}
	}

}
export default SemaSummaryPanel1;


