import { COMPILE_TRANSFERS, TOGGLE_SSL } from '../actions/compiler';

interface Command {
	text: string;
	json: string[];
}

interface State {
	command: Command;
	ssl: boolean;
}

const initialState: State = {
	command: {
		text: '',
		json: [],
	},
	ssl: true,
};

export default function(state = initialState, action: any) {
	const { type, payload } = action;

	switch (type) {
		case COMPILE_TRANSFERS:
			return {
				...state,
				command: payload,
			};
		case TOGGLE_SSL:
			return {
				...state,
				ssl: !state.ssl,
			};

		default:
			return state;
	}
}
