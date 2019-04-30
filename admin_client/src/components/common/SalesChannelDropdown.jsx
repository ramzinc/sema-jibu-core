// TODO combine with KioskDropdown.jsx
import React from 'react';
import { connect } from 'react-redux';
import { getSalesChannels } from '../../actions/SalesChannelActions';
import SelectField from './SelectField';

class SalesChannelDropdown extends React.Component {
  componentDidMount() {
    this.props.getSalesChannels();
  }

  render() {
    const { salesChannels = [], getSalesChannels, ...rest } = this.props;
    const salesChannelOptions = salesChannels.map(salesChannel => ({
      value: salesChannel.id,
      label: salesChannel.name
    }));

    return <SelectField {...rest} options={salesChannelOptions} />;
  }
}

export default connect(
  state => ({
    salesChannels: state.salesChannels
  }),
  { getSalesChannels }
)(SalesChannelDropdown);
