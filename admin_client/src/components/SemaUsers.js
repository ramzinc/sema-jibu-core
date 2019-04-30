import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { submit } from 'redux-form';
import * as healthCheckActions from 'actions/healthCheckActions';
import { withRouter } from 'react-router';
import {
  fetchUsers,
  deleteUser,
  createUser,
  updateUser,
  toggleUser
} from 'actions/UserActions';
import UserList from './common/UserList';
import Button from './common/Button';
import Modal from './common/Modal';
import UserForm from './common/UserForm';
import Alert from './common/Alert';

// TODO split up container and presentational components
import SeamaDatabaseError from './SeamaDatabaseError';
import SeamaServiceError from './SeamaServiceError';
import {
  createLoadingSelector,
  createAlertMessageSelector
} from '../reducers/selectors';

class SemaUsers extends Component {
  constructor(props) {
    super(props);

    this.openCreateModal = this.openCreateModal.bind(this);
    this.closeCreateModal = this.closeCreateModal.bind(this);
    this.editUser = this.editUser.bind(this);
    this.state = {
      show: false,
      editMode: false,
      editUser: {}
    };
  }

  componentDidMount() {
    this.props.fetchUsers();
  }

  clearState() {
    this.setState({ show: false, editMode: false, editUser: {} });
  }

  editUser(id) {
    const { users } = this.props;
    const user = users.filter(user => id === user.id);
    this.setState({ editMode: true, editUser: user });
    this.openCreateModal();
  }

  openCreateModal() {
    this.setState({ show: true });
  }

  closeCreateModal() {
    this.clearState();
  }

  showContent() {
    const { healthCheck, users, loading, alert } = this.props;
    const { editMode } = this.state;

    if (healthCheck.server !== 'Ok') {
      return SeamaServiceError();
    }
    if (healthCheck.database !== 'Ok') {
      return SeamaDatabaseError();
    }

    return (
      <div>
        {alert && <Alert type="danger" message={alert.message} />}
        <div className="">
          <Button
            buttonStyle="primary"
            className="pull-right"
            onClick={this.openCreateModal}
            icon="plus"
            buttonText="Create User"
          />
          <h2>Users</h2>
        </div>
        <hr />
        {this.state.show && (
          <Modal
            show
            onClose={this.closeCreateModal}
            onSave={this.props.onSave}
            title={editMode ? 'Edit User' : 'Create User'}
          >
            <UserForm
              editMode={editMode}
              user={this.state.editUser}
              onSubmit={values => {
                editMode
                  ? this.props.updateUser(values)
                  : this.props.createUser(values);
                this.closeCreateModal();
              }}
            />
          </Modal>
        )}

        <UserList
          loading={loading}
          data={users}
          onToggleUser={id => this.props.toggleUser(id)}
          onEditClick={id => this.editUser(id)}
          onDeleteClick={id => this.props.deleteUser(id)}
        />
      </div>
    );
  }

  render() {
    return this.showContent();
  }
}

const loadingSelector = createLoadingSelector([
  'FETCH_USERS',
  'CREATE_USER',
  'UPDATE_USER',
  'DELETE_USER',
  'TOGGLE_USER'
]);
const alertSelector = createAlertMessageSelector([
  'FETCH_USERS',
  'CREATE_USER',
  'UPDATE_USER',
  'DELETE_USER',
  'TOGGLE_USER'
]);

function mapStateToProps(state) {
  return {
    healthCheck: state.healthCheck,
    users: state.users,
    loading: loadingSelector(state),
    alert: alertSelector(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    healthCheckActions: bindActionCreators(healthCheckActions, dispatch),
    fetchUsers: bindActionCreators(fetchUsers, dispatch),
    deleteUser: bindActionCreators(deleteUser, dispatch),
    createUser: bindActionCreators(createUser, dispatch),
    updateUser: bindActionCreators(updateUser, dispatch),
    toggleUser: bindActionCreators(toggleUser, dispatch),
    onSave: () => dispatch(submit('userForm'))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SemaUsers)
);
