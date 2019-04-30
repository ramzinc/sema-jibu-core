import React, { Component } from 'react';
import  { Line } from 'rc-progress';

class LoadProgress extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			percent:0
		}
	}
	componentDidMount() {
		window.addEventListener('progressEvent', this.handleProgressEvent.bind(this));

	}
	handleProgressEvent( event ){
		console.log("progressEvent" + JSON.stringify(event.detail));
		this.setState({percent: event.detail.progressPct});

	}
	componentWillUnmount(){
		window.removeEventListener('progressEvent', this.handleProgressEvent );
	}

	render() {
        return (
			<Line percent={this.state.percent} strokeWidth="2" strokeColor="#18376A" strokeLinecap="square" style = {{width:'100%'}} />
        );
    }
}
export default LoadProgress;
