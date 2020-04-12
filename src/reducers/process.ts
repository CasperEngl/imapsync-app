import {
  ADD_PID,
  REMOVE_PID,
  CLEAR_PIDS,
  ADD_LOG,
  REMOVE_LOG,
  CLEAR_LOGS,
} from '../actions/process'

interface Pid {
  email: string;
  pid: number;
}

interface Log {
  encoded: string;
  date: string;
  email: string;
}

interface State {
  pids: Pid[];
  logs: Log[];
}

const initialState: State = {
  pids: [],
  logs: [],
}

export default function (state = initialState, action: any) {
  const { type, payload } = action

  switch (type) {
    case ADD_PID:
      return {
        ...state,
        pids: [
          ...state.pids,
          payload,
        ],
      }
    case REMOVE_PID:
      return {
        ...state,
        pids: state.pids.filter((item: Pid) => item.pid !== payload.pid),
      }
    case CLEAR_PIDS:
      return {
        ...state,
        pids: initialState.pids,
      }
    case ADD_LOG:
      return {
        ...state,
        logs: [
          ...state.logs,
          payload.log,
        ],
      }
    case REMOVE_LOG:
      return {
        ...state,
        logs: state.logs.filter((item: Log) => item.date !== payload.log.date),
      }
    case CLEAR_LOGS:
      return {
        ...state,
        logs: initialState.logs,
      }

    default:
      return state
  }
}
