import * as React from 'react';
import { ButtonToolbar, ButtonGroup, Button, Input, Label, FormGroup } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { addTransfer, clearTransfers } from '../../actions/transfer';
import { compileTransfers, toggleSSL } from '../../actions/compiler';

interface Compiler {
  ssl: boolean;
  extraArgs: string;
}

interface Transfer {
  locked: boolean;
}

interface Props {
  addTransfer(): any;
  compileTransfers(): any;
  clearTransfers(): any;
  toggleSSL(): any;
  addExtraArgs(args: string): any;
  ssl?: boolean;
  locked?: boolean;
}

interface State {
  compiler: Compiler;
  transfer: Transfer;
}

function ActionBar({
  addTransfer,
  compileTransfers,
  clearTransfers,
  toggleSSL,
  ssl,
  locked,
}: Props) {
  return (
    <React.Fragment>
      <ButtonToolbar className="actionbar--mobile-fixed mt-3">
        <ButtonGroup>
          <Button
            color="primary"
            disabled={locked}
            onClick={addTransfer}
          >
            Add Transfer
          </Button>
          <Button
            color="warning"
            disabled={locked}
            onClick={() => {
              clearTransfers();
              compileTransfers();
            }}
          >
            Clear
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
      <FormGroup check className="mt-3">
        <Label>
          <Input
            type="checkbox"
            disabled={locked}
            checked={ssl}
            onChange={() => {
              toggleSSL();
              compileTransfers();
            }}
          />
          Toggle SSL
        </Label>
      </FormGroup>
    </React.Fragment>
  );
}

const mapStateToProps = (state: State) => ({
  ssl: state.compiler.ssl,
  extraArgs: state.compiler.extraArgs,
  locked: state.transfer.locked,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      addTransfer,
      compileTransfers,
      clearTransfers,
      toggleSSL,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionBar);
