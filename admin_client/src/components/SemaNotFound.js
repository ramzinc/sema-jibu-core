import React, { Component } from 'react';

// TODO: Make this 404 page prettier
export class SemaNotFound extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("SemaNotFound - Constructor");
    }

	render() {
		return (
			<div>
				<h4>404 - Not Found</h4>
				<p>
					The page you're looking for does not exist or is not
					implemented yet.
				</p>
			</div>
		);
	}
}
