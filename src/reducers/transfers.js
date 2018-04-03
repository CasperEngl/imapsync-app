/*
eslint

no-plusplus: 0,
no-case-declarations: 0
*/

import { ADD_TRANSFER, REMOVE_TRANSFER, UPDATE_TRANSFER_DATA, CLEAR_TRANSFERS } from '../actions/UserActions';

const initialState = {
  transfers: [
    {
      id: 1,
    },
  ],
  transfersCount: 2,
  inputs: [],
};

export default function (state = initialState, action) {
  const { type, data } = action;

  switch (type) {
    case ADD_TRANSFER:
      return {
        ...state,
        transfersCount: state.transfersCount + 1,
        transfers: [...state.transfers, {
          id: state.transfersCount,
        }],
      };
    case REMOVE_TRANSFER:
      return {
        ...state,
        transfers: state.transfers.filter(transfer => transfer.id !== data),
      };
    case CLEAR_TRANSFERS:
      return {
        ...state,
        transfers: initialState.transfers,
        transfersCount: initialState.transfersCount,
        inputs: initialState.inputs,
      };
    case UPDATE_TRANSFER_DATA:
      return {
        ...state,
        inputs: Object.assign([...state.inputs], {
          [data.id]: {
            ...state.inputs[data.id],
            id: data.id,
            [data.name]: data.content,
          },
        }),
      };

    default:
      return state;
  }
}
