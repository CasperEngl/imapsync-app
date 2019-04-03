import * as React from 'react';
import { ButtonToolbar, ButtonGroup, Button, Input, Label, FormGroup, Row, Col } from 'reactstrap';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as base64 from 'base-64';
import * as isJSON from 'is-valid-json';

import { TransferState } from '../../reducers/transfer';

import { addTransfer, clearTransfers, importTransfers } from '../../actions/transfer';
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
	importTransfers(obj: TransferState): any;
	ssl?: boolean;
	locked?: boolean;
	transfer: TransferState;
}

interface State {
	compiler: Compiler;
	transfer: TransferState;
}

function ActionBar({
	addTransfer,
	compileTransfers,
	clearTransfers,
	toggleSSL,
	importTransfers,
	ssl,
	transfer,
}: Props) {
	const importFileInput = React.useRef(null);

	function triggerImport() {
		(importFileInput!.current! as any).click();
	}

	function handleImport(files: FileList) {
		const file = files[0];

		if (file) {
			const reader = new FileReader();
			reader.readAsText(file, 'UTF-8');
			reader.onload = (evt: any) => {
				if (isJSON(evt.target.result)) {
					importTransfers(JSON.parse(evt.target.result));
				}
			};
			reader.onerror = (evt: any) => {
				console.log('error loading file', evt);
			};

			(importFileInput!.current! as any).value = '';
		}
	}

	function reset() {
		clearTransfers();
		compileTransfers();
	}

	function sslCheck() {
		toggleSSL();
		compileTransfers();
	}

	return (
		<React.Fragment>
			<input
				type="file"
				ref={importFileInput}
				onChange={(e: any) => handleImport(e.target.files)}
				className="d-none"
			/>
			<Row>
				<Col xs="auto">
					<ButtonToolbar className="mt-3">
						<ButtonGroup>
							<Button color="primary" disabled={transfer.locked} onClick={addTransfer}>
								Add Transfer
							</Button>
							<Button
								color="warning"
								disabled={transfer.locked}
								onClick={reset}
							>
								Reset Transfers
							</Button>
						</ButtonGroup>
					</ButtonToolbar>
				</Col>
				<Col xs="auto">
					<ButtonToolbar className="mt-3">
						<ButtonGroup>
							<Button
								color="primary"
								disabled={transfer.locked}
								tag="a"
								href={`data:application/octet-stream;charset=utf-16le;base64,${base64.encode(
									JSON.stringify({
										transfers: transfer.transfers,
										inputs: transfer.inputs,
										count: transfer.count,
									})
								)}`}
								download={`imapsync_log-transfers-${new Date().toISOString()}.json`}
							>
								Export
							</Button>
							<Button 
								color="warning" 
								disabled={transfer.locked}
								onClick={() => triggerImport()}
							>
								Import
							</Button>
						</ButtonGroup>
					</ButtonToolbar>
				</Col>
			</Row>
			<FormGroup check className="mt-3">
				<Label>
					<Input
						type="checkbox"
						disabled={transfer.locked}
						checked={ssl}
						onChange={sslCheck}
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
	transfer: state.transfer,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			addTransfer,
			compileTransfers,
			clearTransfers,
			toggleSSL,
			importTransfers,
		},
		dispatch
	);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ActionBar);
