import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Products from '../components/Products';
import { getProducts } from '../actions/ProductActions';
import {
  createLoadingSelector,
  createAlertMessageSelector
} from '../reducers/selectors';

class ProductList extends Component {
  componentDidMount() {
    this.props.getProducts();
  }

  render() {
    return (
      <Products products={this.props.products} loading={this.props.loading} />
    );
  }
}
const loadingSelector = createLoadingSelector(['GET_PRODUCTS']);
const alertSelector = createAlertMessageSelector(['GET_PRODUCTS']);

const mapStateToProps = state => ({
  products: state.products,
  loading: loadingSelector(state),
  alert: alertSelector(state)
});

const mapDispatchToProps = dispatch => ({
  getProducts: bindActionCreators(getProducts, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);
