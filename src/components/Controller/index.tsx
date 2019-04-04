import * as React from 'react';
import { ButtonGroup, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { setCancelled } from '../../actions/transfer';
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
  cancelled: boolean;
}

interface Compiler {
  command: Command;
}

interface State {
  transfer: Transfer;
  compiler: Compiler;
}

interface Pid {
  index: number;
  pid: number;
}

interface Props {
  compileTransfers(): void;
  clearPids(): void;
  clearLogs(): void;
  setCancelled(cancelled: boolean): void;
  locked: boolean;
  cancelled: boolean;
  commandList: string[];
}

export type NewCommand = {
  index: number;
  command: Command;
}

function Controller({ 
  compileTransfers, 
  clearPids, 
  clearLogs, 
  setCancelled,
  commandList, 
  locked, 
  cancelled, 
}: Props) {
  async function execute() {
    setCancelled(false);
		await compileTransfers();

		if (commandList.length) {
			ipcRenderer.send('command', {
        command: commandList[0],
        index: 0,
      });
		}
  }
  
  function exitListener(event: any, pid: Pid) {
    if (commandList.length >= pid.index + 1 && !cancelled) {
      ipcRenderer.send('command', {
        command: commandList[pid.index + 1],
        index: pid.index + 1,
      })
    } else {
      setCancelled(!cancelled);
    }
  }

  function clear() {
		clearPids();
		clearLogs();
  }

  React.useEffect(() => {
    ipcRenderer.on('command-exit', exitListener);
    
    return () => {
      ipcRenderer.removeListener('command-exit', exitListener);
    }
  }, []);
  
  return (
    <ButtonGroup>
      <Button 
        color="primary"
        onClick={execute}
        disabled={locked}
      >
        Execute
      </Button>
      <Button 
        color="warning"
        onClick={clear}
        disabled={locked}
      >
        Clear
      </Button>
    </ButtonGroup>
  )
}

const mapStateToProps = (state: State) => ({
  locked: state.transfer.locked,
  commandList: state.compiler.command.json,
  cancelled: state.transfer.cancelled,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  compileTransfers,
  clearPids,
  clearLogs,
  setCancelled,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Controller);