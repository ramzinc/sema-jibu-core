
import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import 'App.css';
import 'css/SemaCustomer.css';

class CustomerSummaryPanel extends Component {
    render() {
        return (<div style={{width:"90%"}}>
                <Panel className="CustomerSummaryPanel">
                    <Panel.Body  style={{padding:"7px"}}>
                        <Panel.Title componentClass="h3" style={{margin:"5px"}}>{this.props.title}</Panel.Title>
						<p style={{fontSize:"x-large",margin:"0", color:this.props.valueColor, padding:"12px" }}>{this.format()} <span style={{fontSize:"medium",margin:"0", color:"black" }}>{this.props.units}</span></p>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
    format(){
		if( typeof this.props.value === "string") return this.props.value;
    	if( typeof this.props.value === 'number' ){
			return Math.round(this.props.value);
		}else{
    		return "N/A"
		}

    }

}
export default CustomerSummaryPanel;

