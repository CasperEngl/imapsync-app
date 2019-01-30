import * as React from 'react';
import { ButtonGroup, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { clearPids, clearLogs } from '../../actions/process';
import { compileTransfers } from '../../actions/compiler';

const { ipcRenderer } = window.require('electron');

interface Command {
	command: Command;
	text: string;
	json: string[];
}

interface Transfer {
  locked: boolean;
}

interface Compiler {
  command: Command;
}

interface State {
  transfer: Transfer;
  compiler: Compiler;
}

interface Props {
  compileTransfers(): void;
  clearPids(): void;
  clearLogs(): void;
  locked: boolean;
  commandList: string[];
}

function Controller({ compileTransfers, clearPids, clearLogs, commandList, locked }: Props) {
  async function execute() {
		await compileTransfers();

		if (commandList.length) {
			ipcRenderer.send('command', commandList);
		}
  }

  function reset() {
		clearPids();
		clearLogs();
  }
  
  return (
    <ButtonGroup>
      <Button color="primary" onClick={execute} disabled={locked}>
        Execute
      </Button>
      <Button color="warning" onClick={reset} disabled={locked}>
        Reset
      </Button>
    </ButtonGroup>
  )
}

const mapStateToProps = (state: State) => ({
  locked: state.transfer.locked,
	commandList: state.compiler.command.json,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  compileTransfers,
  clearPids,
  clearLogs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Controller);