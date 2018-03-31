import { COMPILE_TRANSFERS } from '../actions/UserActions';

const initialState = {
  compile: '',
};

export default function (state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case COMPILE_TRANSFERS:
      return {
        ...state,
        compile: data,
      };

    default:
      return state;
  }
}
