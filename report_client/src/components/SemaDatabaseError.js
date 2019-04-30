import React from 'react';
import { Alert } from 'react-bootstrap';

// TODO: Make this error page prettier
const SemaDatabaseError = props => {
	return (
		<Alert bsStyle="danger" className="SemaServiceError">
			<h4>Database Error</h4>
			<p>
				The SEAMA database is currently unavailable.
			</p>
		</Alert>
	);
}

export default SemaDatabaseError;
