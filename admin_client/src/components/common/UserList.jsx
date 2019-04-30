import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

import 'react-table/react-table.css';

const propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  onDeleteClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onToggleUser: PropTypes.func
};

const defaultProps = {
  columns: [],
  data: [],
  onDeleteClick: () => {},
  onEditClick: () => {},
  onToggleUser: () => {}
};

class UserList extends React.Component {
  renderRole(row) {
    const roles = row.original.role || [];
    const displayRole = roles.map(role => role.authority);
    return displayRole.join(' ');
  }

  renderButtons(row) {
    const userId = row.original.id;
    const active = row.original.active;
    const { onEditClick, onDeleteClick, onToggleUser } = this.props;
    return (
      <ButtonToolbar>
        <Button
          bsStyle={active ? 'info' : 'success'}
          bsSize="small"
          onClick={e => onToggleUser(userId)}
        >
          {active ? 'Deactivate' : 'Activate'}
        </Button>
        <Button
          bsStyle="primary"
          bsSize="small"
          onClick={e => onEditClick(userId)}
        >
          Edit
        </Button>
        <Button
          bsStyle="danger"
          bsSize="small"
          onClick={e => onDeleteClick(userId)}
        >
          Delete
        </Button>
      </ButtonToolbar>
    );
  }

  render() {
    const userColumns = [
      {
        Header: 'Username',
        accessor: 'username'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        id: 'name',
        Header: 'Name',
        accessor: d => `${d.firstName} ${d.lastName}`
      },
      {
        Header: 'Role',
        Cell: row => this.renderRole(row)
      },
      {
        Header: 'Actions',
        Cell: row => this.renderButtons(row)
      }
    ];

    return (
      <ReactTable
        data={this.props.data}
        columns={userColumns}
        className="-striped -highlight"
        defaultPageSize={20}
        loading={this.props.loading}
      />
    );
  }
}

UserList.propTypes = propTypes;
UserList.defaultProps = defaultProps;

export default UserList;
