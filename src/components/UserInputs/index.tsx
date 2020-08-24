import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  FormGroup,
  Input as BInput,
} from 'reactstrap'
import validator from 'validator'

import { updateTransferData, TransferData } from '../../actions/transfer'
import { compileTransfers } from '../../actions/compiler'

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
}

interface Transfer {
  inputs: Input[];
  locked: boolean;
}

interface RState {
  transfer: Transfer;
}

interface Props {
  number: number;
  user: number;
  locked: boolean;
  updateTransferData(args: TransferData): void;
  compileTransfers(): void;
  inputs: Input[];
}

class UserInputs extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.validateInputs = this.validateInputs.bind(this)
    this.toggleDropdown = this.toggleDropdown.bind(this)

    this.state = {
      hostValidated: false,
      userValidated: false,
      passwordValidated: false,
      dropdownOpen: false,
    }
  }

  componentDidMount() {
    this.validateInputs()
  }

  validateInputs() {
    const { number, user, inputs } = this.props

    if (
      !inputs[number]
      || (!inputs[number][`host_${user}`]
        && inputs[number][`user_${user}`]
        && inputs[number][`password_${user}`])
    ) {
      return
    }

    this.setState({
      hostValidated:
        validator.isEmpty(inputs[number][`host_${user}`])
        || validator.isURL(inputs[number][`host_${user}`])
        || validator.isIP(inputs[number][`host_${user}`]),
      userValidated:
        validator.isEmpty(inputs[number][`user_${user}`])
        || !validator.isEmpty(inputs[number][`user_${user}`]),
      passwordValidated: !validator.isEmpty(inputs[number][`password_${user}`]),
    })
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
    const { updateTransferData, compileTransfers } = this.props
    const { name, value: content } = event.target

    if (target) {
      updateTransferData({
        number,
        name: target,
        content,
      })
    }

    updateTransferData({
      number,
      name,
      content,
    })
    compileTransfers()

    setTimeout(() => this.validateInputs(), 250)
  }

  handleServerClick(content: string) {
    const { number, user } = this.props
    const { updateTransferData, compileTransfers } = this.props

    updateTransferData({
      number,
      name: `host_${user}`,
      content,
    })
    compileTransfers()
  }

  toggleDropdown() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }))
  }

  render() {
    const {
      number,
      user,
      inputs,
      locked,
    } = this.props
    const {
      hostValidated,
      userValidated,
      passwordValidated,
    } = this.state

    if (!inputs[number]) {
      return null
    }

    return (
      <>
        {/* {servers.length && (
          <Dropdown isOpen={dropdownOpen} toggle={this.toggleDropdown}>
            <DropdownToggle color="primary" caret className="mb-4" disabled={locked}>
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
        )} */}
        <FormGroup>
          <BInput
            type="url"
            placeholder="192.168.1.1 / mail.example.com"
            name={`host_${user}`}
            onChange={(event) => this.handleInput({
              number,
              event,
            })}
            value={inputs[number][`host_${user}`]}
            invalid={!hostValidated}
            disabled={locked}
          />
        </FormGroup>
        <FormGroup>
          <BInput
            type="email"
            placeholder="example@example.com"
            name={`user_${user}`}
            onChange={(event) => this.handleInput({
              number,
              target: 'user_2',
              event,
            })}
            value={inputs[number][`user_${user}`]}
            invalid={!userValidated}
            disabled={locked}
          />
        </FormGroup>
        <FormGroup>
          <BInput
            type="text"
            placeholder="example123"
            name={`password_${user}`}
            onChange={(event) => this.handleInput({
              number,
              event,
            })}
            value={inputs[number][`password_${user}`]}
            invalid={!passwordValidated}
            disabled={locked}
          />
        </FormGroup>
        <FormGroup>
          <BInput
            type="text"
            placeholder={`--gmail${user} --office${user} --exchange${user}`}
            name={`args_${user}`}
            onChange={(event) => this.handleInput({
              number,
              event,
            })}
            value={inputs[number][`args_${user}`]}
            disabled={locked}
          />
        </FormGroup>
      </>
    )
  }
}

const mapStateToProps = (state: RState) => ({
  inputs: state.transfer.inputs,
  locked: state.transfer.locked,
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(
  {
    updateTransferData,
    compileTransfers,
  },
  dispatch,
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserInputs)
