import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  FormGroup,
  Input as BInput,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import {
  isURL,
  isIP,
  isEmail,
  isEmpty,
} from 'validator';

import { updateTransferData, TransferData } from '../../actions/transfer';
import { compileTransfers } from '../../actions/compiler';

interface Input {
  id: number;
  host_1: string;
  host_2: string;
  user_1: string;
  user_2: string;
  password_1: string;
  password_2: string;
  args_1: string;
  args_2: string;
}

interface Inputs {
  [key: number]: any;
}

interface State {
  hostValidated: boolean;
  userValidated: boolean;
  passwordValidated: boolean;
  dropdownOpen: boolean;
}

interface Transfer {
  [key: string]: Input;
}

interface RState {
  transfer: Transfer;
}

interface Props {
  transfer: Input[];
  number: number;
  user: number;
  updateTransferData(args: TransferData): void;
  compileTransfers(): void;
  inputs: Inputs;
}

class UserInputs extends React.PureComponent<Props, State> {
  public state: State = {
    hostValidated: false,
    userValidated: false,
    passwordValidated: false,
    dropdownOpen: false,
  }

  constructor(props: Props) {
    super(props);

    this.validateInputs = this.validateInputs.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentDidMount() {
    this.validateInputs();
  }

  validateInputs() {
    const { number, user, inputs } = this.props;

    if (
      !inputs[number]
      || (!inputs[number][`host_${user}`] && inputs[number][`user_${user}`] && inputs[number][`password_${user}`])
    ) {
      return;
    }

    this.setState({
      hostValidated:
        isEmpty(inputs[number][`host_${user}`])
        || isURL(inputs[number][`host_${user}`])
        || isIP(inputs[number][`host_${user}`]),
      userValidated: isEmpty(inputs[number][`user_${user}`]) || isEmail(inputs[number][`user_${user}`]),
      passwordValidated: !isEmpty(inputs[number][`password_${user}`]),
    });
  }

  handleInput({
    number,
    target,
    event,
  }: {
    number: number;
    target?: string;
    event: { target: HTMLInputElement }
  }) {
    const { updateTransferData, compileTransfers } = this.props;
    const { name, value: content } = event.target;

    if (target) {
      updateTransferData({
        number,
        name: target,
        content,
      });
    }

    updateTransferData({
      number,
      name,
      content,
    });
    compileTransfers();

    setTimeout(() => this.validateInputs(), 250);
  }

  handleServerClick(content: string) {
    const { number, user } = this.props;
    const { updateTransferData, compileTransfers } = this.props;

    updateTransferData({
      number,
      name: `host_${user}`,
      content,
    });
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
      hostValidated, userValidated, passwordValidated, dropdownOpen,
    } = this.state;

    if (!inputs[number]) {
      return null;
    }

    return (
      <React.Fragment>
        <Dropdown isOpen={dropdownOpen} toggle={this.toggleDropdown}>
          <DropdownToggle color="primary" caret className="mb-4">
            Server
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => this.handleServerClick('he1.danaweb.org')}>
              he1.danaweb.org

            </DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('mail.danaweb.org')}>
              mail.danaweb.org

            </DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('imap.gigahost.dk')}>
              imap.gigahost.dk

            </DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('mail.office365.com')}>
              mail.office365.com

            </DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('mail.surftown.com')}>
              mail.surftown.com

            </DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('mail.onlinemail.io')}>
              mail.onlinemail.io (Curanet)

            </DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('imap.one.com')}>imap.one.com</DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('mail.atriumweb.dk')}>
              mail.atriumweb.dk

            </DropdownItem>
            <DropdownItem onClick={() => this.handleServerClick('mail.unoeuro.com')}>
              mail.unoeuro.com

            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <FormGroup>
          <BInput
            type="url"
            placeholder="192.168.1.1 / mail.example.com"
            name={`host_${user}`}
            onChange={event => this.handleInput({
              number,
              event
            })}
            value={inputs[number][`host_${user}`]}
            invalid={!hostValidated}
          />
        </FormGroup>
        <FormGroup>
          <BInput
            type="email"
            placeholder="example@example.com"
            name={`user_${user}`}
            onChange={event => this.handleInput({
              number,
              target: 'user_2',
              event
            })}
            value={inputs[number][`user_${user}`]}
            invalid={!userValidated}
          />
        </FormGroup>
        <FormGroup>
          <BInput
            type="text"
            placeholder="example123"
            name={`password_${user}`}
            onChange={event => this.handleInput({
              number,
              event
            })}
            value={inputs[number][`password_${user}`]}
            invalid={!passwordValidated}
          />
        </FormGroup>
        <FormGroup>
          <BInput
            type="text"
            placeholder={`--gmail${user} --office${user} --exchange${user}`}
            name={`args_${user}`}
            onChange={event => this.handleInput({
              number,
              event
            })}
            value={inputs[number][`args_${user}`]}
          />
        </FormGroup>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: RState) => ({
  inputs: state.transfer.inputs,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
  {
    updateTransferData,
    compileTransfers,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserInputs);
