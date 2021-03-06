import {
  ADD_TRANSFER,
  REMOVE_TRANSFER,
  UPDATE_TRANSFER_DATA,
  CLEAR_TRANSFERS,
  DUPLICATE_TRANSFER,
  LOCK_TRANSFERS,
  IMPORT_TRANSFERS,
  SET_CANCELLED,
} from '../actions/transfer'

export interface Transfer {
  id: number;
}

export interface Input {
  id?: number;
  host_1?: string;
  user_1?: string;
  password_1?: string;
  args_1?: string;
  host_2?: string;
  user_2?: string;
  password_2?: string;
  args_2?: string;
}

export interface TransferState {
  transfers: Transfer[];
  count: number;
  inputs: Input[];
  locked: boolean,
  cancelled: boolean,
}

const initialState: TransferState = {
  locked: false,
  cancelled: false,
  transfers: [
    {
      id: 1,
    },
  ],
  count: 2,
  inputs: [
    {},
    {
      id: 1,
      host_1: '',
      user_1: '',
      password_1: '',
      args_1: '',
      host_2: 'mail.surftown.com',
      user_2: '',
      password_2: '',
      args_2: '',
    },
  ],
}

export default function (state = initialState, action: any) {
  const { type, payload } = action

  switch (type) {
    case ADD_TRANSFER:
      return {
        ...state,
        count: state.count + 1,
        transfers: [
          ...state.transfers,
          {
            id: state.count,
          },
        ],
        inputs: [
          ...state.inputs,
          {
            id: state.count,
            host_1: initialState.inputs[1].host_1,
            user_1: initialState.inputs[1].user_1,
            password_1: initialState.inputs[1].password_1,
            args_1: initialState.inputs[1].args_1,
            host_2: initialState.inputs[1].host_2,
            user_2: initialState.inputs[1].user_2,
            password_2: initialState.inputs[1].password_2,
            args_2: initialState.inputs[1].args_2,
          },
        ],
      }
    case DUPLICATE_TRANSFER:
      const duplicate = state.inputs.find((input) => input.id === payload.id)

      return {
        ...state,
        count: state.count + 1,
        transfers: [
          ...state.transfers,
          {
            id: state.count,
          },
        ],
        inputs: [
          ...state.inputs,
          {
            id: state.count,
            host_1: duplicate.host_1 ?? '',
            user_1: duplicate.user_1 ?? '',
            password_1: duplicate.password_1 ?? '',
            args_1: duplicate.args_1 ?? '',
            host_2: duplicate.host_2 ?? '',
            user_2: duplicate.user_2 ?? '',
            password_2: duplicate.password_2 ?? '',
            args_2: duplicate.args_2 ?? '',
          },
        ],
      }
    case REMOVE_TRANSFER:
      return {
        ...state,
        transfers: state.transfers.filter((transfer) => transfer.id !== payload.id),
        inputs: state.inputs.map((input) => {
          if (input.id === payload.id) {
            return {
              ...input,
              host_1: initialState.inputs[1].host_1,
              user_1: initialState.inputs[1].user_1,
              password_1: initialState.inputs[1].password_1,
              args_1: initialState.inputs[1].args_1,
              host_2: initialState.inputs[1].host_2,
              user_2: initialState.inputs[1].user_2,
              password_2: initialState.inputs[1].password_2,
              args_2: initialState.inputs[1].args_2,
            }
          }

          return input
        }),
      }
    case CLEAR_TRANSFERS:
      return {
        ...state,
        transfers: initialState.transfers,
        count: initialState.count,
        inputs: initialState.inputs,
      }
    case UPDATE_TRANSFER_DATA:
      return {
        ...state,
        inputs: Object.assign([...state.inputs], {
          [payload.id]: {
            host_1: '',
            user_1: '',
            password_1: '',
            args_1: '',
            host_2: '',
            user_2: '',
            password_2: '',
            args_2: '',
            ...state.inputs[payload.id],
            [payload.name]: payload.content,
          },
        }),
      }
    case LOCK_TRANSFERS:
      return {
        ...state,
        locked: payload.lock,
      }
    case IMPORT_TRANSFERS:
      return {
        ...state,
        transfers: payload.transfers,
        inputs: payload.inputs,
        count: payload.count,
      }
    case SET_CANCELLED:
      return {
        ...state,
        cancelled: payload.cancelled,
      }

    default:
      return state
  }
}
