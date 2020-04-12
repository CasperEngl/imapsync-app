import { SET_OUTPUT_BACKGROUND, SET_OUTPUT_COLOR } from '../actions/settings'

interface State {
  outputBackground: string;
  outputColor: string;
}

const initialState: State = {
  outputBackground: '#343a40',
  outputColor: 'rgba(255, 255, 255, 0.75)',
}

export default function (state = initialState, action: any) {
  const { type, payload } = action

  switch (type) {
    case SET_OUTPUT_BACKGROUND:
      return {
        ...state,
        outputBackground: payload.color,
      }
    case SET_OUTPUT_COLOR:
      return {
        ...state,
        outputColor: payload.color,
      }

    default:
      return state
  }
}
