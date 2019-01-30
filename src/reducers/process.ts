import {
  ADD_PID,
  REMOVE_PID,
  CLEAR_PIDS,
  ADD_LOG,
  REMOVE_LOG,
  CLEAR_LOGS,
} from "../actions/process";

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
};

export default function(state = initialState, action: any) {
	const { type, payload } = action;

	switch (type) {
		case ADD_PID:
			return {
				...state,
				pids: [
          ...state.pids,
          payload.pid,
        ]
      };
    case REMOVE_PID:
      return {
        ...state,
        pids: state.pids.filter((item: Pid) => {
          console.log(item);

          return true;
        }),
      };
    case CLEAR_PIDS:
      return {
        ...state,
        pids: initialState.pids,
      };
		case ADD_LOG:
			return {
				...state,
				pids: [
          ...state.pids,
          payload.pid,
        ]
      };
    case REMOVE_LOG:
      return {
        ...state,
        pids: state.pids.filter((item: Pid) => {
          console.log(item);

          return true
        }),
      };
    case CLEAR_LOGS:
      return {
        ...state,
        pids: initialState.pids,
      };

		default:
			return state;
	}
}
