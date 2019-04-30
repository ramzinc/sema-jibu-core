import React, { Component } from 'react';
import 'App.css';
import WaterVolumeChannelAndIncomeChart from "./WaterVolume/WaterVolumeChannelAndIncomeChart";
import WaterVolumeChannelChart from "./WaterVolume/WaterVolumeChannelChart"
import WaterVolumeChannelAndPaymentTypeChart from "./WaterVolume/WaterVolumeChannelAndPaymentTypeChart"
import CustomerSummaryPanel from "./Demographics/CustomerSummaryPanel";
import 'css/SemaVolume.css';
import SeamaServiceError from "./SeamaServiceError";
import SeamaDatabaseError from "./SeamaDatabaseError";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as volumeActions from 'actions/VolumeActions';
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router'
import LoadProgress from "./LoadProgress";

class SemaVolume extends Component {

    render() {
        return this.showContent();
    }
    showContent(props){
		if( this.props.healthCheck.server !== "Ok" ){
			return SeamaServiceError(props);
		}else  if( this.props.healthCheck.database !== "Ok" ){
			return SeamaDatabaseError(props)
		}
        return this.showWaterOperations();

    }

    showWaterOperations( ){
        return (
            <div className="WaterVolumeContainer" style = {this.getHeight()}>
				<div className = "WaterVolumeProgress" style={{width:"100%", height:'100%'}}>
					<LoadProgress/>
				</div>
				<div className = "WaterVolumeChannelAndLabel">
					<div className = "WaterVolumeChannelLabel">"
						<CustomerSummaryPanel title = "Total Volume for the Period (Liters)" valueColor = "rgb(40,88,197)"
											  value = {this.calcTotalIncome()}
											  units = ""/>
					</div>
					<div className = "WaterVolumeChannel">
						<WaterVolumeChannelChart  chartData={this.props.volume}/>
					</div>
				</div>
                <div className = "WaterVolumeChannelAndCustomerType" style={{marginTop:'10px'}}>
					<div className = "WaterVolumeChannelAndIncome">
						<WaterVolumeChannelAndIncomeChart chartData={this.props.volume}/>
					</div>
					<div className="WaterVolumeCustomerType">
						<WaterVolumeChannelAndPaymentTypeChart chartData={this.props.volume}/>
					</div>
				</div>
            </div>
        );
    }
    getHeight(){
    	let windowHeight = window.innerHeight;
        // TODO 52px is the height of the toolbar. (Empirical)
		windowHeight -= 52;
		let height = windowHeight.toString()+'px';
    	return {height:height}
	}
	calcTotalIncome(){
    	if( this.props.volume.volumeInfo.volumeByChannel.hasOwnProperty("volume")){
			if( this.props.volume.volumeInfo.volumeByChannel.volume.hasOwnProperty("data")){
				let totalVolume = this.props.volume.volumeInfo.volumeByChannel.volume.data.reduce( (total, salesChannel) => { return(total + salesChannel.volume)}, 0);
				return totalVolume.toFixed(1);
			}
		}
		return "N/A";
	}
}

function mapStateToProps(state) {
	return {
		volume:state.volume,
		healthCheck: state.healthCheck
	};
}

function mapDispatchToProps(dispatch) {
	return {
		volumeActions: bindActionCreators(volumeActions, dispatch),
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SemaVolume));

