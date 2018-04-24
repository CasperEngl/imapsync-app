import { COMPILE_TRANSFERS } from '../actions/UserActions';

const initialState = {
  command: '',
};

export default function (state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case COMPILE_TRANSFERS:
      return {
        ...state,
        command: data,
      };

    default:
      return state;
  }
}
