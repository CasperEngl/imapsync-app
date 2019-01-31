declare global {
	interface Window {
		require: any;
	}
}

import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Container, Jumbotron, FormGroup, Input } from 'reactstrap';

import OutputWindow from '../OutputWindow';
import Pids from '../Pids';
import Logs from '../Logs';
import Controller from '../Controller';

import { compileTransfers } from '../../actions/compiler';
import { lockTransfers } from '../../actions/transfer';
import { clearPids, clearLogs } from '../../actions/process';

interface Command {
	command: Command;
	text: string;
	json: string[];
}

interface Transfer {
	locked: boolean;
}

interface Settings {
	outputBackground: string;
	outputColor: string;
}

interface State {
	compiler: Command;
	transfer: Transfer;
	settings: Settings;
}

interface Props {
	command: string;
	commandList: string[];
	locked: boolean;
	outputBackground: string;
	outputColor: string;
	compileTransfers(): void;
	lockTransfers(lock?: boolean): void;
	clearPids(): void;
	clearLogs(): void;
}

class Hero extends React.PureComponent<Props> {
	render() {
		const { command, outputBackground, outputColor } = this.props;

		return (
			<Jumbotron className="hero mt-4 mb-0 pb-3 overflow-hidden">
				<Container>
					<FormGroup>
						<Input
							type="text"
							placeholder="./imapsync_bin --host1 '127.0.0.1' --user1 'user@domain.com' --host2 '127.0.0.1' --user2 'user@domain.com';"
							value={command}
							style={{
								backgroundColor: outputBackground,
								color: outputColor,
							}}
							readOnly
						/>
					</FormGroup>
					<OutputWindow />
					<FormGroup className="my-3">
						<Pids />
						<Controller />
					</FormGroup>
					<div className="bg-white p-4 border-radius-sm" style={{ margin: '0 -1.5rem' }}>
						<Logs />
					</div>
				</Container>
			</Jumbotron>
		);
	}
}

const mapStateToProps = (state: State) => ({
	command: state.compiler.command.text,
	locked: state.transfer.locked,
	outputBackground: state.settings.outputBackground,
	outputColor: state.settings.outputColor,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			compileTransfers,
			lockTransfers,
			clearPids,
			clearLogs,
		},
		dispatch
	);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Hero);
