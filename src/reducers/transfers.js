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
      inputs: {
        host_1: '',
        user_1: '',
        password_1: '',
        host_2: '',
        user_2: '',
        password_2: '',
      },
    },
  ],
  transfersCount: 2,
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
      const entry = `${data.id}_${data.name}`;

      return {
        ...state,
        
      };

    default:
      return state;
  }
}
