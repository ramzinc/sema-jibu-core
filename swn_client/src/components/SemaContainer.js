import React from 'react';
import SeamaToolbar from "./SeamaToolbar";
import SeamaMain from "./SeamaMain";
import SeamaSidebar from "./SeamaSidebar";
import { version } from '../../package.json';

export const SemaContainer = ({ component: Component, ...rest }) => (
	<div className="SeamaNav">
		<SeamaToolbar Version={version}/>
		<SeamaSidebar/>
		<SeamaMain/>
	</div>
);
