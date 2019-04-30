import React from 'react';
import { Alert } from 'react-bootstrap';

// TODO: Make this error page prettier
function SemaServiceError(props){
	return(
		<Alert bsStyle="danger" className="SemaServiceError">
			<h4>Service Error</h4>
			<p>
				The SEAMA service is currently unavailable.
			</p>
		</Alert>
	);
}

export default SemaServiceError;
