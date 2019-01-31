declare global {
  interface Window {
    require: any;
  }
}

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Transition, animated } from 'react-spring';

import { lockTransfers } from '../../actions/transfer';
import { addPid, removePid, clearPids } from '../../actions/process';
import { slideUp } from '../../transition';

import { compileTransfers } from '../../actions/compiler';

const { ipcRenderer } = window.require('electron');

interface Pid {
  email: string;
  pid: number;
}

interface Process {
  pids: Pid[];
}

interface State {
  process: Process;
}

interface Props {
  pids?: Pid[];
  lockTransfers(lock?: boolean): void;
  addPid(pid: Pid): void;
  removePid(pid: Pid): void;
  clearPids(): void;
  compileTransfers(): void;
}

class Pids extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.listener = this.listener.bind(this);
    this.exitListener = this.exitListener.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    const { clearPids } = this.props;

    clearPids();

    ipcRenderer.on('command-pid', this.listener);
    ipcRenderer.on('command-exit', this.exitListener);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('command-pid', this.listener);
    ipcRenderer.removeListener('command-exit', this.exitListener);
  }

  listener(event: any, pid: Pid) {
    const { lockTransfers, addPid } = this.props;

    lockTransfers(true);
    addPid(pid);
  }
  
  exitListener(event: any, pid: Pid) {
    const { lockTransfers, removePid } = this.props;
  
    lockTransfers(false);
    removePid(pid);
  }

  async cancel(pid: number) {
    const { compileTransfers } = this.props;

    await compileTransfers();

    ipcRenderer.send('command-cancelled', pid);
  }

	render() {
    const { pids } = this.props;
    
    if (!pids) {
      return (null);
    }

		return (
			<Transition
				items={pids}
				keys={(item: any) => item.pid}
				from={slideUp.from}
				enter={slideUp.enter}
				leave={slideUp.leave}
			>
				{(item: Pid) => (styles: any) => (
					<animated.div
						style={styles}
						className="btn btn-warning w-100 my-2"
						onClick={() => this.cancel(item.pid)}
					>
						Cancel {item.email}
					</animated.div>
				)}
			</Transition>
		);
	}
}

const mapStateToProps = (state: State) => ({
  pids: state.process.pids,
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  lockTransfers,
  compileTransfers,
  addPid,
  removePid,
  clearPids,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Pids);