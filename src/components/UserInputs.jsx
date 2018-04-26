/*
eslint

class-methods-use-this: 0,
no-shadow: 0,
*/

import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormGroup, Input, ButtonGroup, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { isEmail, isURL, isEmpty } from 'validator';

import { updateTransferData, compileTransfers } from '../actions/UserActions';

class UserInputs extends PureComponent {
  static propTypes = {
    number: PropTypes.number.isRequired,
    user: PropTypes.number.isRequired,
    updateTransferData: PropTypes.func.isRequired,
    compileTransfers: PropTypes.func.isRequired,
    inputs: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  handleInput(number, target, event) {
    const { updateTransferData, compileTransfers } = this.props;
    const { name, value } = event.target;

    if (target !== undefined || target !== null) {
      updateTransferData(number, target, value);
    }

    updateTransferData(number, name, value);

    compileTransfers();
  }

  render() {
    const { number, user, inputs } = this.props;

    return (
      <Fragment>
        {
          (!isURL(inputs[number][`host_${user}`]) ||
          !isEmail(inputs[number][`user_${user}`]) ||
          isEmpty(inputs[number][`password_${user}`])) &&
          <h4>Missing fields:</h4>
        }
        <ButtonGroup>
          {
            !isURL(inputs[number][`host_${user}`]) &&
            <Button color="danger" size="sm">HOST</Button>
          }
          {
            !isEmail(inputs[number][`user_${user}`]) &&
            <Button color="danger" size="sm">USER</Button>
          }
          {
            isEmpty(inputs[number][`password_${user}`]) &&
            <Button color="danger" size="sm">PASSWORD</Button>
          }
        </ButtonGroup>
        <FormGroup>
          <Input
            type="url"
            placeholder="192.168.1.1 / mail.example.com"
            name={`host_${user}`}
            onChange={event => this.handleInput(number, null, event)}
            value={inputs[number][`host_${user}`]}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="email"
            placeholder="example@example.com"
            name={`user_${user}`}
            onChange={event => this.handleInput(number, 'user_2', event)}
            value={inputs[number][`user_${user}`]}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="text"
            placeholder="example123"
            name={`password_${user}`}
            onChange={event => this.handleInput(number, null, event)}
            value={inputs[number][`password_${user}`]}
          />
        </FormGroup>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  inputs: state.transfer.inputs,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateTransferData,
  compileTransfers,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserInputs);
