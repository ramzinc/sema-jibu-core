import React, { Component } from 'react';
import 'App.css';
import SemaServiceError from "../SemaServiceError";
import SemaDatabaseError from "../SemaDatabaseError";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router';
import '../../css/DataExport.css';
import '../../css/glyphicon-spinner.css';
import { axiosService } from 'services';
import { CSVLink } from 'react-csv';
import { ToastContainer, ToastStore } from 'react-toasts';

import $ from 'jquery';
import 'selectize';
import '../../../node_modules/selectize/dist/css/selectize.css';

class DataExport extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dataset: 'sales',
			data: ''
		}

		this.onBeginDownload = this.onBeginDownload.bind(this);
		this.onDatasetChange = this.onDatasetChange.bind(this);

		this.csvLink = React.createRef();
	}
	render() {
		return this.showContent();
	}

	showContent(props) {
		if (this.props.healthCheck.server !== "Ok") {
			return SemaServiceError(props);
		} else if (this.props.healthCheck.database !== "Ok") {
			return SemaDatabaseError(props)
		}
		return this.showDataExport();

	}

	componentDidMount() {
		$('select').selectize({
			onChange: value => {
				this.onDatasetChange(value);
			}
		});
	}

	onDatasetChange(value) {
		this.setState({
			dataset: value
		});
	}

	onBeginDownload() {
		this.setState({
			loading: true
		});

		axiosService
			.get('/sema/data-export/', {
				params: {
					dataset: this.state.dataset
				}
			})
			.then(response => {
				this.setState({
					loading: false
				});
				if (response.status === 200) {
					if (!response.data || !response.data.length) {
						if (this.state.dataset === 'sales') {
							return ToastStore.info("No sales data for this year");
						} else {
							return ToastStore.info("No water quality data for this year");
						}
					}
					this.setState({
						data: response.data
					}, () => {
						this.csvLink.current.link.click();
					});
				} else {
					return [];
				}
			})
			.catch(function (error) {
				console.log(error);
				return error;
			});
	}

	showDataExport() {
		return (
			<div className="DataExportContainer" style={this.getHeight()}>
				<div className="DataExportContent">
					<div className="well well-lg DataExportWell">
						<select
							id="select-dataset"
							className="selectized"
							placeholder="Select a dataset">
							<option value="sales">Year to Date Sales Data for All Sites</option>
							<option value="water-quality">Year to Date Water Quality Data for All Sites</option>
						</select>
						<button className="btn btn-lg btn-block DataExportButton" onClick={this.onBeginDownload}>
							<div className='ButtonIcon'>
								<i className={`glyphicon ${this.state.loading ? 'glyphicon-refresh fast-right-spinner' : 'glyphicon-download'}`}></i>
							</div>
							Download Now
						</button>
						<CSVLink
							data={this.state.data}
							filename={`YTD-${this.state.dataset}-data.csv`}
							className="hidden"
							ref={this.csvLink}
							target="_blank"
						/>
					</div>
				</div>
				<ToastContainer position={ToastContainer.POSITION.BOTTOM_CENTER} store={ToastStore} />
			</div>
		);
	}

	getHeight() {
		let windowHeight = window.innerHeight;
		// TODO 52px is the height of the toolbar. (Empirical)
		windowHeight -= 52;
		let height = windowHeight.toString() + 'px';
		return { height: height }
	}

}

function mapStateToProps(state) {
	return {
		water: state.waterOperations,
		healthCheck: state.healthCheck
	};
}

function mapDispatchToProps(dispatch) {
	return {
		healthCheckActions: bindActionCreators(healthCheckActions, dispatch)
	};
}

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(DataExport));

