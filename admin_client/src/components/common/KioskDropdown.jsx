import React from 'react';
import { connect } from 'react-redux';
import { getKiosks } from '../../actions/KioskActions';
import SelectField from './SelectField';

class KioskDropdown extends React.Component {
  componentDidMount() {
    this.props.getKiosks();
  }

  render() {
    const { kiosks, getKiosks, ...rest } = this.props;
    const kioskOptions = kiosks.map(kiosk => ({
      value: kiosk.id,
      label: kiosk.name
    }));

    return <SelectField {...rest} options={kioskOptions} />;
  }
}

export default connect(
  state => ({
    kiosks: state.kiosks
  }),
  { getKiosks }
)(KioskDropdown);
