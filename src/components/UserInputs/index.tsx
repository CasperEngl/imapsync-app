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
import { isURL, isIP, isEmail, isEmpty } from 'validator';

import { updateTransferData, TransferData } from '../../actions/transfer';
import { compileTransfers } from '../../actions/compiler';

interface Server {
  name: string;
  host: string;
}

interface Input {
  [key: string]: any;
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

interface State {
  hostValidated: boolean;
  userValidated: boolean;
  passwordValidated: boolean;
  dropdownOpen: boolean;
  servers: Server[];
}

interface Transfer {
  inputs: Input[];
}

interface RState {
  transfer: Transfer;
}

interface Props {
  number: number;
  user: number;
  updateTransferData(args: TransferData): void;
  compileTransfers(): void;
  inputs: Input[];
}

class UserInputs extends React.PureComponent<Props, State> {
  state: State = {
    hostValidated: false,
    userValidated: false,
    passwordValidated: false,
    dropdownOpen: false,
    servers: [
      {
        host: 'he1.danaweb.org',
        name: 'he1.danaweb.org',
      },
      {
        host: 'mail.danaweb.org',
        name: 'mail.danaweb.org',
      },
      {
        host: 'imap.gigahost.dk',
        name: 'imap.gigahost.dk',
      },
      {
        host: 'mail.office365.com',
        name: 'mail.office365.com',
      },
      {
        host: 'mail.surftown.com',
        name: 'mail.surftown.com',
      },
      {
        host: 'mail.onlinemail.io',
        name: 'mail.onlinemail.io (Curanet)',
      },
      {
        host: 'imap.one.com',
        name: 'imap.one.com',
      },
      {
        host: 'mail.atriumweb.dk',
        name: 'mail.atriumweb.dk',
      },
      {
        host: 'mail.unoeuro.com',
        name: 'mail.unoeuro.com',
      },
      {
        host: 'mail.mail-1.dk',
        name: 'mail.mail-1.dk (Søgemedier)',
      },
    ]
  };

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
      !inputs[number] ||
      (!inputs[number][`host_${user}`] &&
        inputs[number][`user_${user}`] &&
        inputs[number][`password_${user}`])
    ) {
      return;
    }

    this.setState({
      hostValidated:
        isEmpty(inputs[number][`host_${user}`]) ||
        isURL(inputs[number][`host_${user}`]) ||
        isIP(inputs[number][`host_${user}`]),
      userValidated:
        isEmpty(inputs[number][`user_${user}`]) ||
        isEmail(inputs[number][`user_${user}`]),
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
    event: { target: HTMLInputElement };
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
      hostValidated,
      userValidated,
      passwordValidated,
      dropdownOpen,
      servers,
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
            {
              servers.map((server) => (
                <DropdownItem
                  key={server.host}
                  onClick={() => this.handleServerClick(server.host)}
                >
                  {server.name}
                </DropdownItem>
              ))
            }
          </DropdownMenu>
        </Dropdown>
        <FormGroup>
          <BInput
            type="url"
            placeholder="192.168.1.1 / mail.example.com"
            name={`host_${user}`}
            onChange={event =>
              this.handleInput({
                number,
                event,
              })
            }
            value={inputs[number][`host_${user}`]}
            invalid={!hostValidated}
          />
        </FormGroup>
        <FormGroup>
          <BInput
            type="email"
            placeholder="example@example.com"
            name={`user_${user}`}
            onChange={event =>
              this.handleInput({
                number,
                target: 'user_2',
                event,
              })
            }
            value={inputs[number][`user_${user}`]}
            invalid={!userValidated}
          />
        </FormGroup>
        <FormGroup>
          <BInput
            type="text"
            placeholder="example123"
            name={`password_${user}`}
            onChange={event =>
              this.handleInput({
                number,
                event,
              })
            }
            value={inputs[number][`password_${user}`]}
            invalid={!passwordValidated}
          />
        </FormGroup>
        <FormGroup>
          <BInput
            type="text"
            placeholder={`--gmail${user} --office${user} --exchange${user}`}
            name={`args_${user}`}
            onChange={event =>
              this.handleInput({
                number,
                event,
              })
            }
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

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
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
