import { COMPILE_TRANSFERS, TOGGLE_SSL, EXTRA_ARGUMENTS } from '../actions/UserActions';

const initialState = {
  command: '',
  ssl: true,
  extraArgs: '',
};

export default function (state = initialState, action) {
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
