import React from 'react';
import { Alert } from 'react-bootstrap';

// TODO: Make this error page prettier
const SeamaDatabaseError = props => {
	return (
		<Alert bsStyle="danger" className="SeamaServiceError">
			<h4>Database Error</h4>
			<p>
				The SEAMA database is currently unavailable.
			</p>
		</Alert>
	);
}

export default SeamaDatabaseError;
