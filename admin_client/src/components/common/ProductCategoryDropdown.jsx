import React from 'react';
import { connect } from 'react-redux';
import { getProductCategories } from '../../actions/ProductActions';
import SelectField from './SelectField';

class ProductCategoryDropdown extends React.Component {
  componentDidMount() {
    this.props.getProductCategories();
  }

  render() {
    const { categories, getProductCategories, ...rest } = this.props;

    const categoryOptions = categories.map(category => ({
      value: category.id,
      label: category.name
    }));

    return <SelectField {...rest} options={categoryOptions} />;
  }
}

export default connect(
  state => ({
    categories: state.productCategories
  }),
  { getProductCategories }
)(ProductCategoryDropdown);
