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

function ActionBar({
  addTransfer,
  compileTransfers,
  clearTransfers,
  toggleSSL,
  ssl,
}: Props) {
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
      <FormGroup check className="mt-3">
        <Label>
          <Input
            type="checkbox"
            onChange={() => {
              toggleSSL();
              compileTransfers();
            }}
            checked={ssl}
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
