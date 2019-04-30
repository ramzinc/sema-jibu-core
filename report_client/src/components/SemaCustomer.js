import React, { Component } from 'react';
import 'App.css';
import 'css/SemaCustomer.css';
import LoadProgress from "./LoadProgress";
import SemaServiceError from "./SemaServiceError";
import SemaDatabaseError from "./SemaDatabaseError";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as customerActions from 'actions/CustomerActions';
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router'
import CustomerSummaryPanel from "./Demographics/CustomerSummaryPanel";
import CustomersByIncomeLevelChart from "./Demographics/CustomersByIncomeLevelChart";
import CustomersByGenderChart from "./Demographics/CustomersByGenderChart";
import CustomersByDistanceChart from "./Demographics/CustomersByDistanceChart";

class SemaCustomer extends Component {

    render() {
        return this.showContent();
    }
    showContent(props){
		if( this.props.healthCheck.server !== "Ok" ){
			return SemaServiceError(props);
		}else  if( this.props.healthCheck.database !== "Ok" ){
			return SemaDatabaseError(props)
		}
        return this.showCustomers();

    }

    showCustomers( ){
        return (
            <div className="CustomerContainer"  style = {this.getHeight()}>
				<div className = "CustomerProgress" style={{width:"100%", height:'100%'}}>
					<LoadProgress/>
				</div>
                <div className = "CustomerSummaryRow2">
					<div className = "CustomerSummaryRow2Col1">
						<div className= "CustomerSummaryRow2Col1Top">
							<CustomerSummaryPanel title = "Number of Active Customers" valueColor = "rgb(40,88,197)"
												  value = {this.props.customer.customerInfo.allCustomers.customerCount}
												  units = ""/>
						</div>
						<div className= "CustomerSummaryRow2Col1Bottom">
							<CustomerSummaryPanel title = "Consumer Penetration" valueColor = "rgb(40,88,197)"
												  value = {this.calcHouseHoldPenetration()}
												  units = "(%)"/>
						</div>
					</div>
					<div className = "CustomerSummaryRow2Col2">
						<CustomersByDistanceChart  chartData={this.props.customer}/>
					</div>
                </div>
                <div className = "CustomerSummaryRow3" style={{marginTop:'10px'}}>
					<div className = "CustomerSummaryRow3Col1">
						<CustomersByIncomeLevelChart  chartData={this.props.customer}/>
					</div>
					<div className = "CustomerSummaryRow3Col2">
						<div className = "CustomerSummaryRow3Col1">
							<CustomersByGenderChart  chartData={this.props.customer}/>
						</div>
					</div>
				</div>
            </div>
        );
    }
	calcHouseHoldPenetration(){
    	if( this.props.customer.customerInfo.allCustomers.customerConsumerBase && this.props.customer.customerInfo.allCustomers.siteConsumerBase ){
    		if( this.props.customer.customerInfo.allCustomers.siteConsumerBase > 0 ){
    			let penetration =  Math.round(this.props.customer.customerInfo.allCustomers.customerConsumerBase/this.props.customer.customerInfo.allCustomers.siteConsumerBase * 100);
    			if( penetration === 0 && this.props.customer.customerInfo.allCustomers.customerConsumerBase > 0){
    				return "< 1"
				}
    			return penetration;
			}else{
				return "N/A";
			}
		}else{
    		return "N/A";
		}
	}
	getHeight(){
		let windowHeight = window.innerHeight;
		// TODO 52px is the height of the toolbar. (Empirical)
		windowHeight -= 52;
		let height = windowHeight.toString()+'px';
		return {height:height}
	}

}


function mapStateToProps(state) {
	return {
		customer:state.customer,
		healthCheck: state.healthCheck
	};
}

function mapDispatchToProps(dispatch) {
	return {
		customerActions: bindActionCreators(customerActions, dispatch),
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SemaCustomer));

