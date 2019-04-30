import React from 'react';
import { Switch } from 'react-router-dom';
import SemaVolume from "./SemaVolume";
import SemaCustomer from "./SemaCustomer";
import SemaSales from "./SemaSales";
import SemaWaterOperations from "./SemaWaterOperations";
import DataExport from "./routes/DataExport";

import {
	PrivateRoute,
	SemaNotFound
} from './';

const Main = (props) => (
    <main>
        <Switch>
			<PrivateRoute exact path='/' component={SemaWaterOperations}/>
			<PrivateRoute path='/Sales' component={SemaSales}/>
            <PrivateRoute path='/Volumes' component={SemaVolume}/>
            <PrivateRoute path='/Demographics' component={SemaCustomer}/>
            <PrivateRoute path='/DataExport' component={DataExport}/>
            {/*<PrivateRoute path='/DistributionMap' component={SeamaDistributionMap}/>*/}
            {/*<PrivateRoute path='/DeliverySchedule' component={SeamaDeliverySchedule}/>*/}
            {/*<PrivateRoute path='/InventoryManagement' component={SeamaInventoryManagement}/>*/}
            {/*<PrivateRoute path='/Financials' component={SeamaFinancials}/>*/}
            <PrivateRoute component={SemaNotFound}/>
        </Switch>
    </main>
);

export default Main
