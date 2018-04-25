import { COMPILE_TRANSFERS, TOGGLE_SSL } from '../actions/UserActions';

const initialState = {
  command: '',
  ssl: true,
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

    default:
      return state;
  }
}
