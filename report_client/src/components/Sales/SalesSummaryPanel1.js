
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'css/SemaSales.css';
import PropTypes from 'prop-types';
// let dateFormat = require('dateformat');

class SalesSummaryPanel1 extends Component {
    render() {
        return (<div style={{width:"60%"}}>
                <Panel className="SalesSummaryPanel1">
                    <Panel.Body  style={{padding:"7px"}}>
                        <Panel.Title componentClass="h3" style={{margin:"0"}}>{this.props.title}</Panel.Title>
                        <p style={{fontSize:"x-large",margin:"0" }}>{SalesSummaryPanel1.format(this.props.value)}</p>
                        <p style={SalesSummaryPanel1.calcDeltaStyle(this.props.valueColor)}>{this.props.delta} {this.calcDeltaDate(this.props.delta, this.props.date)}</p>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
    static format( value ){
        if( typeof value === "string") return value;
        return Math.round(value);
    }
    static calcDeltaStyle( color ){
		return {margin: "0", color:color}
	}

	calcDeltaDate( ){
    	if( this.props.delta === "N/A" || this.props.date === "N/A" ){
    		return "";
		}else{
			return this.props.date;
		}
	}
}
SalesSummaryPanel1.propTypes ={
	date:PropTypes.string,
	title:PropTypes.string,
	delta:PropTypes.string,
}
export default SalesSummaryPanel1;


