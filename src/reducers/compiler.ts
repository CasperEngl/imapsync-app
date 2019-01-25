import { COMPILE_TRANSFERS, TOGGLE_SSL, EXTRA_ARGUMENTS } from '../actions/compiler';

const initialState = {
	command: {
		text: '',
		json: [
			{
				host_1: '',
				user_1: '',
				password_1: '',
				host_2: '',
				user_2: '',
				password_2: '',
			},
		],
	},
	ssl: true,
	extraArgs: '',
};

export default function(state = initialState, action: any) {
	const { type, data } = action;

	switch (type) {
		case COMPILE_TRANSFERS:
			return {
				...state,
				command: data,
			};
		case TOGGLE_SSL:
			return {
				...state,
				ssl: !state.ssl,
			};
		case EXTRA_ARGUMENTS:
			return {
				...state,
				extraArgs: data,
			};

		default:
			return state;
	}
}
