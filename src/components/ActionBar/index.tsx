import * as React from 'react';
import { ButtonToolbar, ButtonGroup, Button, Input } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { StyledFormGroup, StyledLabel } from '../Styled';

import { addTransfer, clearTransfers } from '../../actions/transfer';
import {
  compileTransfers,
  toggleSSL,
  addExtraArgs,
} from '../../actions/compiler';

interface Compiler {
  ssl: boolean;
  extraArgs: string;
}

interface Props {
  addTransfer(): any;
  compileTransfers(): any;
  clearTransfers(): any;
  toggleSSL(): any;
  addExtraArgs(args: string): any;
  ssl: boolean;
}

interface State {
  compiler: Compiler;
}

class ActionBar extends React.Component<Props, State> {
  handleExtraArgs(event: { target: HTMLInputElement }) {
    const { addExtraArgs, compileTransfers } = this.props;
    const { value } = event.target;

    addExtraArgs(value);
    compileTransfers();
  }

  render() {
    const {
      addTransfer,
      compileTransfers,
      clearTransfers,
      toggleSSL,
      ssl,
    } = this.props;

    return (
      <React.Fragment>
        <ButtonToolbar className="actionbar--mobile-fixed">
          <ButtonGroup>
            <Button color="primary" onClick={addTransfer}>
              Add Transfer
            </Button>
            <Button
              color="warning"
              onClick={() => {
                clearTransfers();
                compileTransfers();
              }}
            >
              Clear
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
        <StyledFormGroup check>
          <StyledLabel>
            <Input
              type="checkbox"
              onChange={() => {
                toggleSSL();
                compileTransfers();
              }}
              checked={ssl}
            />
            Toggle SSL
          </StyledLabel>
        </StyledFormGroup>
        <StyledFormGroup>
          <StyledLabel for="extra-args">
            Extra arguments <small>(for all transfers)</small>
          </StyledLabel>
          <Input
            id="extra-args"
            type="text"
            onChange={(event: any) => this.handleExtraArgs(event)}
          />
        </StyledFormGroup>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: State) => ({
  ssl: state.compiler.ssl,
  extraArgs: state.compiler.extraArgs,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addTransfer,
      compileTransfers,
      clearTransfers,
      toggleSSL,
      addExtraArgs,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionBar);
