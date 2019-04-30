import React, { Component } from 'react';
import 'App.css';
import WaterVolumeChannelAndIncomeChart from "./WaterVolume/WaterVolumeChannelAndIncomeChart";
import WaterVolumeChannelChart from "./WaterVolume/WaterVolumeChannelChart"
import WaterVolumeChannelAndPaymentTypeChart from "./WaterVolume/WaterVolumeChannelAndPaymentTypeChart"
import CustomerSummaryPanel from "./Demographics/CustomerSummaryPanel";
import 'css/SemaVolume.css';
import SemaServiceError from "./SemaServiceError";
import SemaDatabaseError from "./SemaDatabaseError";
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
			return SemaServiceError(props);
		}else  if( this.props.healthCheck.database !== "Ok" ){
			return SemaDatabaseError(props)
		}
        return this.showWaterOperations();

    }

    showWaterOperations( ){
        return (
            <div className="WaterVolumeContainer" style = {this.getHeight()}>
				<div className = "WaterVolumeProgress" style={{width:"100%", height:'100%'}}>
					<LoadProgress/>
				</div>
				<div className = "WaterVolumeChannelAndLabels">
					<div className = "WaterVolumeLabels">
						<div className = "WaterVolumeLabel1">"
							<CustomerSummaryPanel title = {this.getTitleVolumePeriod(this.props.volume)} valueColor = "rgb(35,75,125)"
												  value = {this.calcTotalVolume()}
												  units = ""/>
						</div>
						<div className = "WaterVolumeLabel2">"
							<CustomerSummaryPanel title = {this.getTitleLitersPerPerson(this.props.volume)} valueColor = "rgb(35,75,125)"
												  value = {this.calcTotalLitersPerPerson()}
												  units = ""/>
						</div>
						<div className = "WaterVolumeLabel3">"
							<CustomerSummaryPanel title = {this.getTitlePurchaseFrequency(this.props.volume)} valueColor = "rgb(35,75,125)"
												  value = {this.calcPurchaseFrequency()}
												  units = ""/>
						</div>
						<div className = "WaterVolumeLabel4">"
							<CustomerSummaryPanel title = {this.getTitleVolumePerPurchase(this.props.volume)} valueColor = "rgb(35,75,125)"
												  value = {this.calcVolumePerPurchase()}
												  units = ""/>
						</div>
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
	getTitleVolumePeriod( volume ){
    	if( volume.loaded ){
			return "Total Volume (" + volume.volumeInfo.volumeWaterMeasureUnits + ")";
		}else{
			return "Total Volume";
		}
	}
	getTitleLitersPerPerson( volume ){
		if( volume.loaded ){
			return "Volume/Consumer (" + volume.volumeInfo.volumeWaterMeasureUnits + ")";
		}else{
			return "Volume/Consumer";
		}
	}
	getTitlePurchaseFrequency( volume ){
		return "Avg. Purchase Frequency";
	}


	getTitleVolumePerPurchase( volume ){
		if( volume.loaded ){
			return "Volume/Purchase (" + volume.volumeInfo.volumeWaterMeasureUnits + ")";
		}else{
			return "Volume/Purchase";
		}
	}


	getHeight(){
    	let windowHeight = window.innerHeight;
        // TODO 52px is the height of the toolbar. (Empirical)
		windowHeight -= 52;
		let height = windowHeight.toString()+'px';
    	return {height:height}
	}
	calcTotalVolume(){
    	if( this.props.volume.volumeInfo.volumeByChannel.hasOwnProperty("volume")){
			if( this.props.volume.volumeInfo.volumeByChannel.volume.hasOwnProperty("data")){
				let totalVolume = this.props.volume.volumeInfo.volumeByChannel.volume.data.reduce( (total, salesChannel) => { return(total + salesChannel.volume)}, 0);
				return totalVolume.toFixed(1);
			}
		}
		return "N/A";
	}
	calcTotalLitersPerPerson(){
    	const totalVolume = this.calcTotalVolume();
    	if( totalVolume !== "N/A") {
			// Find the kiosk.
			const kiosk = this.getKiosk();
			if (kiosk && kiosk.consumerBase && kiosk.consumerBase > 0) {
				const value = totalVolume / kiosk.consumerBase;
				return value.toFixed(1);
			}
		}
		return "N/A";

	}
	calcVolumePerPurchase(){
		const totalVolume = this.calcTotalVolume();		// Total volume for the period
		if( totalVolume !== "N/A"){
			const totalReceipts = this.calcTotalReceipts();
			if( totalReceipts !== "N/A" ){
				return (totalVolume/totalReceipts).toFixed(1);
			}
		}
		return "N/A";
	}
	calcPurchaseFrequency(){
		const distinctCustomers = this.calcDistinctCustomers();		// Total distinct customers for the period
		if( distinctCustomers !== "N/A"){
			const totalReceipts = this.calcTotalReceipts();
			if( totalReceipts !== "N/A" ){
				return (totalReceipts/distinctCustomers).toFixed(1);
			}
		}
		return "N/A";
	}

	calcTotalReceipts(){
		if( this.props.volume.volumeInfo.volumeByChannel.hasOwnProperty("total")){
			if( this.props.volume.volumeInfo.volumeByChannel.total.hasOwnProperty("data")){
				let totalReceipts = this.props.volume.volumeInfo.volumeByChannel.total.data.reduce( (totalReceipts, dataItem) => { return(totalReceipts + dataItem.receipts)}, 0);
				return totalReceipts;
			}
		}
		return "N/A";
	}

	calcDistinctCustomers(){
		if( this.props.volume.volumeInfo.volumeByChannel.hasOwnProperty("total")){
			if( this.props.volume.volumeInfo.volumeByChannel.total.hasOwnProperty("data")){
				let distinctCustomers = this.props.volume.volumeInfo.volumeByChannel.total.data.reduce( (distinctCustomers, dataItem) => { return(distinctCustomers + dataItem.numberCustomers)}, 0);
				return distinctCustomers;
			}
		}
		return "N/A";
	}

	getKiosk() {
		if (this.props.kiosk.selectedKiosk) {
			for (let index = 0; index < this.props.kiosk.kiosks.length; index++) {
				if (this.props.kiosk.kiosks[index].id === this.props.kiosk.selectedKiosk.kioskID) {
					return this.props.kiosk.kiosks[index];
				}
			}
		}
		return null;
	}
}

function mapStateToProps(state) {
	return {
		volume:state.volume,
		kiosk:state.kiosk,
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

