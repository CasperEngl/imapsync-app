declare global {
  interface Window {
    require: any;
  }
}

import * as React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Transition, animated } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Row, Col } from 'reactstrap';

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
	removeLog(log: Log): void;
	logs?: Log[];
}

function Logs({ logs, lockTransfers, addLog, removeLog }: Props) {
	function listener(event: any, log: Log) {
		lockTransfers(false);
		addLog(log);
	}

	function remove(log: Log) {
		removeLog(log);
	}

	React.useEffect(() => {
		ipcRenderer.on('command-log', listener);

		return () => {
			ipcRenderer.removeListener('command-log', listener);
		}
	})

	if (!logs) {
		return null;
	}

	return (
		<Row>
			<Transition
				items={logs}
				keys={(item: Log) => item.date}
				from={slideUp.from}
				enter={slideUp.enter}
				leave={slideUp.leave}
			>
				{(item: Log) => (styles: any) => {
					if (!item.email) {
						return null;
					}

					return (
						<animated.div
							style={styles}
							className="col-12"
							key={item.date}
						>
							<Row className="my-n2">
								<Col>
									<Button
										color="primary"
										tag="a"
										href={`data:application/octet-stream;charset=utf-16le;base64,${item.encoded}`}
										download={`imapsync_log-${item.email}-${item.date}.txt`}
										className="w-100"
									>
										{`Download ${item.email} log`}
									</Button>
								</Col>
								<Col xs="auto" className="pl-0">
									<Button color="warning" onClick={() => remove(item)}>
										<FontAwesomeIcon icon="times" />
									</Button>
								</Col>
							</Row>
						</animated.div>
					)
				}}
			</Transition>
		</Row>
	);
}

const mapStateToProps = (state: State) => ({
	logs: state.process.logs,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			lockTransfers,
			addLog,
			removeLog,
		},
		dispatch
	);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Logs);
