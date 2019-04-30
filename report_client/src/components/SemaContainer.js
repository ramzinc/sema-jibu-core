import React from 'react';
import SemaToolbar from "./SemaToolbar";
import SemaMain from "./SemaMain";
import SemaSidebar from "./SemaSidebar";
import { version } from '../../package.json';

export const SemaContainer = ({ component: Component, ...rest }) => (
	<div className="SeamaNav">
		<SemaToolbar Version={version}/>
		<SemaSidebar/>
		<SemaMain/>
	</div>
);
