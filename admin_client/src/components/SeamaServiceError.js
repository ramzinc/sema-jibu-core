import React from 'react';
import { Alert } from 'react-bootstrap';

// TODO: Make this error page prettier
function SeamaServiceError(props){
	return(
		<Alert bsStyle="danger" className="SeamaServiceError">
			<h4>Service Error</h4>
			<p>
				The SEAMA service is currently unavailable.
			</p>
		</Alert>
	);
}

export default SeamaServiceError;
