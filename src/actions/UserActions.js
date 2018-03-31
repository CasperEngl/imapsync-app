export const ADD_TRANSFER = 'ADD_TRANSFER';
export const REMOVE_TRANSFER = 'REMOVE_TRANSFER';
export const COMPILE_TRANSFERS = 'COMPILE_TRANSFERS';
export const UPDATE_TRANSFER_DATA = 'UPDATE_TRANSFER_DATA';
export const CLEAR_TRANSFERS = 'CLEAR_TRANSFERS';

export function addTransfer() {
  return {
    type: ADD_TRANSFER,
  };
}

export function compileTransfers() {
  return {
    type: COMPILE_TRANSFERS,
    data: 'yay',
  };
}

export function removeTransfer(number) {
  return {
    type: REMOVE_TRANSFER,
    data: number,
  };
}

export function clearTransfers() {
  return {
    type: CLEAR_TRANSFERS,
  };
}

export function updateTransferData(number, name, content) {
  return {
    type: UPDATE_TRANSFER_DATA,
    data: {
      id: number,
      name,
      content,
    },
  };
}
