import React, { Component } from 'react';
import { Nav,NavDropdown,MenuItem } from 'react-bootstrap';
import 'App.css';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import { dateFilterActions} from 'actions';
import { withRouter } from 'react-router'

const menuStyle = {};


const ImageStyleEnabled = {
	width:"30px",
	height:"30px",
	verticalAlign: "middle",
	marginTop:"10px",
	opacity:'1.0'
};
const ImageStyleDisabled = {
	width:"30px",
	height:"30px",
	verticalAlign: "middle",
	marginTop:"10px",
	opacity:'.3'
};

class PrevDate extends Component {
	render() {
		return (<div><img src={require('images/left-arrow.png')} alt={""} style={this.props.getStyle(true)} onClick={()=> this.props.clickFn()} /></div>);
	}
}

class NextDate extends Component {
	render() {
		return (<div><img src={require('images/right-arrow.png')} alt={""} style={this.props.getStyle(false)} onClick={()=> this.props.clickFn()} /></div>);
	}
}

class SemaDateFilter extends Component {

	dateMenu = {
		1: {key:1,
			title:"Yearly",
			setStartEndDate:this.setYTD.bind(this),
			setDisplayDate:this.setYTDDisplay.bind(this),
			incrementStartEndDate:this.yearIncrement.bind(this),
			decrementStartEndDate:this.yearDecrement.bind(this)
			},

		2: {key:2,
			title:"Monthly",
			setStartEndDate:this.setThisMonth.bind(this),
			setDisplayDate:this.setThisMonthDisplay.bind(this),
			incrementStartEndDate:this.monthIncrement.bind(this),
			decrementStartEndDate:this.monthDecrement.bind(this)
			},
		3: {key:3,
			title:"Total",
			setStartEndDate:this.setAll.bind(this),
			setDisplayDate:this.setAllDisplay.bind(this),
			incrementStartEndDate:()=>{},
			decrementStartEndDate:()=>{}
		}
	};

	setYTD() {
		this.groupType = "year";
		this.endDate = new Date(Date.now());
		this.startDate = new Date( this.endDate.getFullYear(), 0, 1 );

	};
	setYTDDisplay(){
		this.setState( {displayDate: this.formatYTDDisplay( this.startDate, this.endDate)});
		// Update enables
		let nextDate = new Date( this.startDate);
		nextDate.setFullYear(nextDate.getFullYear() + 1);
		this.setState({nextEnable:(nextDate < this.maxDate) ? true :false})
		let prevDate = new Date( this.startDate);
		prevDate.setFullYear(prevDate.getFullYear() - 1);
		this.setState({prevEnable:(prevDate >= this.minDate) ? true :false})

	};
	yearIncrement(){
		this.startDate = new Date( this.startDate.getFullYear()+1, 0, 1 );
		this.endDate = new Date( this.startDate.getFullYear(), 12, 0, 23, 59, 59 );
		this.setYTDDisplay();
		this.props.dateFilterActions.setDateRange( this.startDate, this.endDate, this.groupType );

	}
	yearDecrement(){
		this.startDate = new Date( this.startDate.getFullYear()-1, 0, 1 );
		this.endDate = new Date( this.startDate.getFullYear(), 12, 0, 23, 59, 59 );
		this.setYTDDisplay();
		this.props.dateFilterActions.setDateRange( this.startDate, this.endDate, this.groupType );

	}
	setThisMonth(){
		this.groupType = "month";
		this.endDate = new Date(Date.now());
		this.startDate = new Date( this.endDate.getFullYear(), this.endDate.getMonth(), 1 );
		this.endDate  = new Date(this.startDate.getFullYear(), this.startDate.getMonth()+1, 0, 23, 59, 59);

	};
	setThisMonthDisplay (){
		let locale = "en-us";
		const month = this.startDate.toLocaleString(locale, {month: "short"});
		this.setState( {displayDate: month + ", " + this.startDate.getFullYear().toString()});
		// Update enables
		let nextDate = new Date( this.startDate);
		nextDate.setMonth(nextDate.getMonth() + 1);
		this.setState({nextEnable:(nextDate < this.maxDate) ? true :false})
		let prevDate = new Date( this.startDate);
		prevDate.setMonth(prevDate.getMonth() - 1);
		this.setState({prevEnable:(prevDate >= this.minDate) ? true :false})

	};
	monthIncrement() {
		this.startDate = new Date( this.startDate.setMonth(this.startDate.getMonth() + 1));
		this.endDate  = new Date(this.startDate.getFullYear(), this.startDate.getMonth()+1, 0, 23, 59, 59);
		this.setThisMonthDisplay();
		this.props.dateFilterActions.setDateRange( this.startDate, this.endDate, this.groupType );
	}
	monthDecrement(){
		this.startDate = new Date( this.startDate.setMonth(this.startDate.getMonth()-1));
		this.endDate  = new Date(this.startDate.getFullYear(), this.startDate.getMonth()+1, 0, 23, 59, 59);
		this.setThisMonthDisplay();
		this.props.dateFilterActions.setDateRange( this.startDate, this.endDate, this.groupType );
	}

	setAll(){
		this.groupType = "none";
		this.startDate = new Date(1973, 0, 1);
		this.endDate =new Date(Date.now());
	};

	setAllDisplay(){
		this.setState( {displayDate: "All Dates"});
		this.setState({nextEnable:false})
		this.setState({prevEnable:false})

	};


	formatYTDDisplay(){
		const locale = "en-us";
		return this.startDate.toLocaleString(locale, {month: "short"}) + " - " +
			this.endDate.toLocaleString(locale, {month: "short"}) + " " +
			this.startDate.getFullYear().toString();
	}

	constructor(props, context) {
		super(props, context);
		console.log("SemaDateFilter-constructor");
		this.handleSelectDate = this.handleSelectDate.bind(this);

		this.endDate = new Date(Date.now());
		this.startDate = new Date( this.endDate.getFullYear(), 0, 1 );
		this.groupType = "year";
		this.minDate = new Date( 2016, 0, 1 );		// Min date allowed
		this.maxDate = this.endDate;

		this.dateSelector = this.dateMenu[1];
		this.dateKey = 1;
		this.dateSelector.setStartEndDate( this );
		this.state = {
			displayDate: this.formatYTDDisplay( this.startDate, this.endDate ),
			nextEnable:false,
			prevEnable:true
		};

	}

	componentDidMount() {
		this.props.dateFilterActions.setDateRange( this.startDate, this.endDate, this.groupType );
	}

	render() {
		return (
			<div>
				<Nav>
					<PrevDate getStyle = {this.getImageStyle.bind(this)} clickFn = {this.leftArrowClick.bind(this)} />
				</Nav>
				<Nav>
					<NavDropdown title={this.state.displayDate} onSelect={this.handleSelectDate}
								 id="basic-nav-dropdown2">
						{this.buildDateMenuItems()}
					</NavDropdown>
				</Nav>
				<Nav>
					<NextDate getStyle = {this.getImageStyle.bind(this)} clickFn = {this.rightArrowClick.bind(this)} />
				</Nav>
			</div>
		);
	}
	handleSelectDate(eventKey){
		console.log(JSON.stringify(eventKey));
		if( this.dateKey !== eventKey){
			this.dateKey = eventKey
			this.dateSelector = this.dateMenu[eventKey];
			this.dateSelector.setStartEndDate( this );
			this.dateSelector.setDisplayDate(this);
			this.props.dateFilterActions.setDateRange( this.startDate, this.endDate, this.groupType );
		}
	}
	buildDateMenuItems(){
		let menuItems = [];
		menuItems.push(<MenuItem eventKey={this.dateMenu[1].key} key={this.dateMenu[1].key} style={menuStyle}>{this.dateMenu[1].title}</MenuItem>);
		menuItems.push(<MenuItem eventKey={this.dateMenu[2].key} key={this.dateMenu[2].key} style={menuStyle}>{this.dateMenu[2].title}</MenuItem>);
		menuItems.push(<MenuItem eventKey={this.dateMenu[3].key} key={this.dateMenu[3].key} style={menuStyle}>{this.dateMenu[3].title}</MenuItem>);
		return menuItems;
	}


	leftArrowClick(){
		if( this.state.prevEnable) {
			this.dateSelector.decrementStartEndDate();
		}
	}
	rightArrowClick(){
		if( this.state.nextEnable) {
			this.dateSelector.incrementStartEndDate();
		}
	}
	getImageStyle( prev){
		if( prev ) {
			return (this.state.prevEnable) ? ImageStyleEnabled : ImageStyleDisabled
		}else{
			return (this.state.nextEnable) ? ImageStyleEnabled : ImageStyleDisabled

		}
	}



}

function mapStateToProps(state) {
	return {
	};
}

function mapDispatchToProps(dispatch) {
	return {
		dateFilterActions: bindActionCreators(dateFilterActions, dispatch),
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(SemaDateFilter));
