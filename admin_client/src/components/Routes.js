import React from 'react';
import { Switch } from 'react-router-dom';
import SemaUsers from './SemaUsers';
import ProductList from '../containers/ProductList';
import ProductDetails from '../containers/ProductDetails';
import DailyProduction from '../containers/DailyProduction';
import { PrivateRoute, SemaNotFound } from '.';

const Routes = props => (
  <Switch>
    <PrivateRoute exact path="/" component={SemaUsers} />

    <PrivateRoute exact path="/products" component={ProductList} />
    <PrivateRoute exact path="/products/create" component={ProductDetails} />
    <PrivateRoute path="/products/:id" component={ProductDetails} />
    <PrivateRoute path="/daily_production" component={DailyProduction} />

    <PrivateRoute component={SemaNotFound} />
  </Switch>
);

export default Routes;
