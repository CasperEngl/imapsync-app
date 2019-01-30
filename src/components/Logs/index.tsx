import * as React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Transition, animated } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { lockTransfers } from '../../actions/transfer';
import { addLog, removeLog } from '../../actions/process';
import { slideUp } from '../../transition';

const { ipcRenderer } = window.require('electron');

interface Log {
  encoded?: string;
  date?: string;
  email?: string;
}

interface Process {
  logs: Log[];
}

interface State {
  process: Process;
}

interface Props {
  lockTransfers(lock?: boolean): void;
  addLog(log: Log): void;
  logs?: Log[];
}

class Logs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.listener = this.listener.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('command-log', this.listener);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('command-log', this.listener);
  }

  listener(event: any, log: Log) {
    const { lockTransfers, addLog } = this.props;

    lockTransfers(false);
    addLog(log);
  }

	render() {
    const { logs } = this.props;

    if (!logs) {
      return (null);
    }

		return (
			<Transition
				items={logs}
				keys={(item: Log) => item.date}
				from={slideUp.from}
				enter={slideUp.enter}
				leave={slideUp.leave}
			>
				{(item: Log) => (styles: any) => (
					<animated.div style={styles} className="w-100 my-2">
						<div className="download">
							<a
								href={`data:application/octet-stream;charset=utf-16le;base64,${item.encoded}`}
								download={`imapsync_log-${item.email}-${item.date}.txt`}
								className="font-weight-bold"
							>
								{`Download ${item.email} log`}
							</a>
              <FontAwesomeIcon icon="cross" />
						</div>
					</animated.div>
				)}
			</Transition>
		);
	}
}

const mapStateToProps = (state: State) => ({
  logs: state.process.logs,
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  lockTransfers,
  addLog,
  removeLog,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Logs);