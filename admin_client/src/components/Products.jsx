import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from './common/Button';
import ProductList from './common/ProductList';

class Products extends Component {
  render() {
    return (
      <div className="">
        <div className="">
          <Button
            buttonStyle="primary"
            className="pull-right"
            icon="plus"
            buttonText="Create Product"
            onClick={() => this.props.history.push('/products/new')}
          />
          <h2>Products</h2>
        </div>
        <hr />
        <ProductList
          loading={this.props.loading}
          products={this.props.products}
          {...this.props}
        />
      </div>
    );
  }
}

export default withRouter(Products);
