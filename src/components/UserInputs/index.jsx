/*
eslint

jsx-a11y/tabindex-no-positive: 0,
*/

import React, { PureComponent, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  FormGroup,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  isURL,
  isIP,
  isEmail,
  isEmpty,
} from 'validator';

import { updateTransferData, compileTransfers } from '../../actions/UserActions';

class UserInputs extends PureComponent {
  static propTypes = {
    number: PropTypes.number.isRequired,
    user: PropTypes.number.isRequired,
    updateTransferData: PropTypes.func.isRequired,
    compileTransfers: PropTypes.func.isRequired,
    inputs: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      hostValidated: false,
      userValidated: false,
      passwordValidated: false,
      dropdownOpen: false,
    };

    this.validateInputs = this.validateInputs.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentDidMount() {
    this.validateInputs();
  }

  validateInputs() {
    const { number, user, inputs } = this.props;

    if (!inputs[number] || (
      !inputs[number][`host_${user}`]
      && inputs[number][`user_${user}`]
      && inputs[number][`password_${user}`]
    )) {
      return;
    }

    this.setState({
      hostValidated: isEmpty(inputs[number][`host_${user}`]) || isURL(inputs[number][`host_${user}`]) || isIP(inputs[number][`host_${user}`]),
      userValidated: isEmpty(inputs[number][`user_${user}`]) || isEmail(inputs[number][`user_${user}`]),
      passwordValidated: !isEmpty(inputs[number][`password_${user}`]),
    });
  }

  handleInput(number, target, event) {
    const { updateTransferData, compileTransfers } = this.props;
    const { name, value } = event.target;

    if (target !== undefined || target !== null) {
      updateTransferData(number, target, value);
    }

    updateTransferData(number, name, value);
    compileTransfers();

    setTimeout(() => this.validateInputs(), 250);
  }

  handleServerClick(value) {
    const { number, user } = this.props;
    const { updateTransferData, compileTransfers } = this.props;

    updateTransferData(number, `host_${user}`, value);
    compileTransfers();
  }

  toggleDropdown() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  render() {
    const { number, user, inputs } = this.props;
    const {
      hostValidated,
      userValidated,
      passwordValidated,
      dropdownOpen,
    } = this.state;

    if (!inputs[number]) {
      return null;
    }

    return (
      <Fragment>
        <Dropdown isOpen={dropdownOpen} toggle={this.toggleDropdown}>
          <DropdownToggle color="primary" caret className="mb-4">
            Server
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => this.handleServerClick('he1.danaweb.org')}>he1.danaweb.org</DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('mail.danaweb.org')}>mail.danaweb.org</DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('imap.gigahost.dk')}>imap.gigahost.dk</DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('mail.office365.com')}>mail.office365.com</DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('mail.surftown.com')}>mail.surftown.com</DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('mail.onlinemail.io')}>mail.onlinemail.io (Curanet)</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <FormGroup>
          <Input
            type="url"
            placeholder="192.168.1.1 / mail.example.com"
            name={`host_${user}`}
            onChange={event => this.handleInput(number, null, event)}
            value={inputs[number][`host_${user}`]}
            invalid={!hostValidated}
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
            invalid={!userValidated}
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
            invalid={!passwordValidated}
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
