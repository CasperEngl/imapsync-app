import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Container } from 'reactstrap';
import tinycolor from 'tinycolor2';

import Header from '../Header';
import Hero from '../Hero';
import Transfers from '../Transfers';
import ActionBar from '../ActionBar';

import { setOutputBackground, setOutputColor } from '../../actions/settings';
const { ipcRenderer } = window.require('electron');

interface Props {
	setOutputBackground(color: string): void;
	setOutputColor(color: string): void;
}

function ProxyApp({ setOutputBackground, setOutputColor }: Props) {
	const preferences = ipcRenderer.sendSync('getPreferences');

	if (preferences) {
		const { output_bg: opBg, output_color: opColor } = preferences.settings;

		const outputBg = tinycolor(opBg);
		const outputColor = tinycolor(opColor);

		setOutputBackground(outputBg.toRgbString());
		setOutputColor(outputColor.toRgbString());
	}

	return (
		<>
			<Header />
			<Hero />
			<Container>
				<ActionBar />
				<Transfers />
			</Container>
		</>
	);
}

const mapDispatchToProps = (dispatch: Dispatch) =>
	bindActionCreators(
		{
			setOutputBackground,
			setOutputColor,
		},
		dispatch
	);

export default connect(
	null,
	mapDispatchToProps
)(ProxyApp);
