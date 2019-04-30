
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';
import 'css/SemaSales.css';
import PropTypes from 'prop-types';


class SalesSummaryPanel2 extends Component {
    render() {
        return (<div style={{width:"100%"}}>
                <Panel className="SalesSummaryPanel2">
                    <Panel.Body  style={{padding:"7px"}}>
                        <Panel.Title componentClass="h3" style={{margin:"0"}}>{this.props.title}</Panel.Title>
                        <p style={SalesSummaryPanel2.formatStyle(this.props.valueColor)}>{this.props.value}</p>
						<Panel.Title componentClass="h3" style={{margin: "0"}}>{this.props.title2}</Panel.Title>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
	static formatStyle(color){
    	return {fontSize:"x-large",margin:"0", color:color}
	}
}

SalesSummaryPanel2.propTypes ={
	title:PropTypes.string,
	value:PropTypes.string,
	valueColor:PropTypes.string,
	title2:PropTypes.string

}
export default SalesSummaryPanel2;


