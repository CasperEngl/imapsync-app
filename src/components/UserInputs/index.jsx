/*
eslint

class-methods-use-this: 0,
no-shadow: 0,
jsx-a11y/tabindex-no-positive: 0,
*/

import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormGroup, Input } from 'reactstrap';
import { Dropdown, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { updateTransferData, compileTransfers } from '../../actions/UserActions';

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

  handleDropdown(number, target, event) {
    const { updateTransferData, compileTransfers } = this.props;
    const value = event;

    updateTransferData(number, target, value);
    compileTransfers();
  }

  render() {
    const { number, user, inputs } = this.props;

    const StyledDropdown = styled(Dropdown)`
      display: block;
      margin: 0;
      padding: 0;

      > button {
        margin: 0 0 1rem;
      }
    `;

    if (!inputs[number]) {
      return null;
    }

    return (
      <Fragment>
        <StyledDropdown
          id={`host_${user}_${number}`}
          bsStyle="primary"
          className="btn-sm"
          onSelect={event => this.handleDropdown(number, `host_${user}`, event)}
        >
          <Dropdown.Toggle bsStyle="primary">Servers</Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem eventKey="he1.danaweb.org">he1.danaweb.org</MenuItem>
            <MenuItem eventKey="mail.danaweb.org">mail.danaweb.org</MenuItem>
            <MenuItem eventKey="imap.gigahost.dk">imap.gigahost.dk</MenuItem>
            <MenuItem eventKey="mail.office365.com">mail.office365.com</MenuItem>
            <MenuItem eventKey="mail.surftown.com">mail.surftown.com</MenuItem>
          </Dropdown.Menu>
        </StyledDropdown>
        <FormGroup>
          <Input
            type="url"
            placeholder="192.168.1.1 / mail.example.com"
            name={`host_${user}`}
            onChange={event => this.handleInput(number, null, event)}
            value={inputs[number][`host_${user}`]}
            tabIndex="1"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="email"
            placeholder="example@example.com"
            name={`user_${user}`}
            onChange={event => this.handleInput(number, 'user_2', event)}
            value={inputs[number][`user_${user}`]}
            tabIndex="1"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="text"
            placeholder="example123"
            name={`password_${user}`}
            onChange={event => this.handleInput(number, null, event)}
            value={inputs[number][`password_${user}`]}
            tabIndex="1"
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="text"
            placeholder={`--gmail${user} --office${user} --exchange${user}`}
            name={`args_${user}`}
            onChange={event => this.handleInput(number, null, event)}
            value={inputs[number][`args_${user}`]}
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
