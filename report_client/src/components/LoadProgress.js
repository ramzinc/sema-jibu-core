import React, { Component } from 'react';
import  { Line } from 'rc-progress';

class LoadProgress extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			percent:0
		}
		this.progressEventfn = this.handleProgressEvent.bind(this);
		this.mounted = false;
	}
	componentDidMount() {
		window.addEventListener('progressEvent', this.progressEventfn );
		this.mounted = true;

	}
	handleProgressEvent( event ){
		console.log("progressEvent" + JSON.stringify(event.detail));
		var that = this;
		setTimeout( function() {
			if( that.mounted ){
				that.setState({percent: event.detail.progressPct})
			}
		},  50);

	}
	componentWillUnmount(){
		this.mounted = false;
		window.removeEventListener('progressEvent', this.progressEventfn );
	}

	render() {
        return (
			<Line percent={this.state.percent} strokeWidth="2" strokeColor="#18376A" strokeLinecap="square" style = {{width:'100%'}} />
        );
    }
}
export default LoadProgress;
