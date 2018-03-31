/*
eslint

class-methods-use-this: 0
*/

import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormGroup, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';

import { updateTransferData } from '../actions/UserActions';

class UserInputs extends PureComponent {
  static propTypes = {
    number: PropTypes.number.isRequired,
    user: PropTypes.number.isRequired,
    updateTransferData: PropTypes.func.isRequired,
  }

  handleInput(number, event) {
    const { updateTransferData } = this.props;
    const { name, value } = event.target;

    updateTransferData(number, name, value);
  }

  render() {
    const { number, user } = this.props;

    return (
      <Fragment>
        <FormGroup>
          <Label>Host</Label>
          <Input
            type="text"
            placeholder="192.168.1.1 / mail.example.com"
            name={`host_${user}`}
            onChange={event => this.handleInput(number, event)}
          />
        </FormGroup>
        <FormGroup>
          <Label>User</Label>
          <Input
            type="text"
            placeholder="example@example.com"
            name={`user_${user}`}
            onChange={event => this.handleInput(number, event)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input
            type="text"
            placeholder="example123"
            name={`password_${user}`}
            onChange={event => this.handleInput(number, event)}
          />
        </FormGroup>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateTransferData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserInputs);
