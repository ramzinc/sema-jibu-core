import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Form, Grid, Row, Col, Table, ButtonToolbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Field, FieldArray, arrayPush, reduxForm } from 'redux-form';
import get from 'lodash/get';
import { history } from '../../utils/history';
import TextField from './TextField';
import SelectField from './SelectField';
import KioskDropdown from './KioskDropdown';
import SalesChannelDropdown from './SalesChannelDropdown';
import ImageUpload from './ImageUpload';
import Button from './Button';
import ProductCategoryDropdown from './ProductCategoryDropdown';
import units from '../constants/units';
import CheckboxField from './CheckboxField';
import { required, exactLength3 } from './validate';

const propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

const defaultProps = {
  handleSubmit: () => {}
};

const buttonToolbar = {
  display: 'flex',
  justifyContent: 'center'
};

const renderPricing = ({ fields, meta: { error, submitFailed } }) => {
  const renderRow = fields.map((mrp, index) => (
    <tr key={index}>
      <td>
        <Field name={`${mrp}.kioskId`} component={KioskDropdown} size="small" />
      </td>
      <td>
        <Field
          name={`${mrp}.salesChannelId`}
          component={SalesChannelDropdown}
          size="small"
        />
      </td>
      <td>
        <Field name={`${mrp}.priceAmount`} component={TextField} size="small" />
      </td>
      <td>
        <Field name={`${mrp}.active`} component="input" type="checkbox" />
      </td>
    </tr>
  ));
  return renderRow;
};

const ProductForm = ({ handleSubmit, ...props }) => (
  <Form horizontal onSubmit={handleSubmit}>
    <Grid>
      <Row>
        <Col md={8}>
          <Field
            name="id"
            label="Product ID"
            component={TextField}
            horizontal
            disabled
          />
          <Field
            required
            name="active"
            label="Active"
            component={CheckboxField}
          />
          <Field
            name="name"
            label="Product Name"
            component={TextField}
            horizontal
            required
            validate={[required]}
          />
          <Field
            name="sku"
            label="SKU"
            component={TextField}
            horizontal
            required
            validate={[required]}
          />
          <Field
            name="description"
            label="Product Description"
            component={TextField}
            horizontal
            required
            validate={[required]}
          />
          <Field
            name="category"
            label="Product Category"
            component={ProductCategoryDropdown}
            horizontal
            required
            validate={[required]}
          />
          <Field
            name="priceAmount"
            label="Default Price"
            component={TextField}
            horizontal
            required
            validate={[required]}
            type="number"
          />
          <Field
            name="priceCurrency"
            label="Default Currency"
            component={TextField}
            horizontal
            required
            validate={[required, exactLength3]}
          />
          <Field
            name="costOfGoods"
            label="Cost of Goods"
            component={TextField}
            horizontal
            required
            validate={[required]}
            type="number"
          />
          <Field
            name="minQuantity"
            label="Minimum Quantity"
            component={TextField}
            horizontal
            type="number"
          />
          <Field
            name="maxQuantity"
            label="Maximum Quantity"
            component={TextField}
            horizontal
            type="number"
          />
          <Field
            name="unitsPerProduct"
            label="Units per Product"
            component={TextField}
            horizontal
            required
            validators={[required]}
            type="number"
          />
          <Field
            name="unitMeasurement"
            label="Units of Measurement"
            component={SelectField}
            options={units}
            horizontal
            required
            validators={[required]}
          />
        </Col>
        <Col md={4}>
          <Field name="image" label="image" component={ImageUpload} />
        </Col>
      </Row>
      <Row>
        <Col md={10}>
          <Row style={{ paddingBottom: '10px' }}>
            <Button
              onClick={() => {
                props.addMrp('productForm', 'productMrp', {
                  productId: props.initialValues.id,
                  active: true
                });
              }}
              buttonText="Add MRP"
              buttonSize="small"
              buttonStyle="primary"
              className="pull-right"
            />
          </Row>
          <Row>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Kiosk</th>
                  <th>Sales Channel</th>
                  <th>Amount</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                <FieldArray name="productMrp" component={renderPricing} />
              </tbody>
            </Table>
          </Row>
        </Col>
      </Row>
    </Grid>
    <ButtonToolbar className="text-center" style={buttonToolbar}>
      <Button
        buttonText="Cancel"
        onClick={() => props.history.push('/products')}
      />
      <Button
        onClick={handleSubmit}
        type="submit"
        buttonText="Save"
        buttonStyle="primary"
      />
    </ButtonToolbar>
  </Form>
);

ProductForm.propTypes = propTypes;
ProductForm.defaultProps = defaultProps;

const mapStateToProps = state => ({
  initialValues: {
    id: get(state, 'selectedProduct.id', ''),
    active: get(state, 'selectedProduct.active', true),
    name: get(state, 'selectedProduct.name', ''),
    sku: get(state, 'selectedProduct.sku', ''),
    description: get(state, 'selectedProduct.description', ''),
    category: get(state, 'selectedProduct.category.id', ''),
    priceAmount: get(state, 'selectedProduct.priceAmount', ''),
    priceCurrency: get(state, 'selectedProduct.priceCurrency', ''),
    minQuantity: get(state, 'selectedProduct.minQuantity', ''),
    maxQuantity: get(state, 'selectedProduct.maxQuantity', ''),
    unitsPerProduct: get(state, 'selectedProduct.unitsPerProduct', ''),
    unitMeasurement: get(state, 'selectedProduct.unitMeasurement', ''),
    costOfGoods: get(state, 'selectedProduct.costOfGoods', ''),
    image: get(state, 'selectedProduct.base64Image', ''),
    productMrp: get(state, 'selectedProduct.productMrp', [])
  }
});

export default withRouter(
  connect(
    mapStateToProps,
    { addMrp: arrayPush }
  )(
    reduxForm({
      form: 'productForm',
      enableReinitialize: true,
      onSubmitSuccess: () => history.push('/products')
    })(ProductForm)
  )
);
