/*
eslint

no-restricted-syntax: 0,
no-multi-spaces: 0,
camelcase: 0
*/

import { isEmail, isURL, isEmpty } from 'validator';
import { store } from '../App';

export const ADD_TRANSFER = 'ADD_TRANSFER';
export const REMOVE_TRANSFER = 'REMOVE_TRANSFER';
export const COMPILE_TRANSFERS = 'COMPILE_TRANSFERS';
export const UPDATE_TRANSFER_DATA = 'UPDATE_TRANSFER_DATA';
export const CLEAR_TRANSFERS = 'CLEAR_TRANSFERS';
export const TOGGLE_SSL = 'TOGGLE_SSL';

export function addTransfer() {
  return {
    type: ADD_TRANSFER,
  };
}

export function compileTransfers() {
  const state = store.getState();
  let command = '';
  let shouldReturn = false;

  for (const input of state.transfer.inputs) {
    if (typeof input !== 'undefined') {
      const host_1      = input.host_1      || 'HOST_1';
      const user_1      = input.user_1      || 'USER_1';
      const password_1  = input.password_1  || 'PASSWORD_1';
      const host_2      = input.host_2      || 'HOST_2';
      const user_2      = input.user_2      || 'USER_2';
      const password_2  = input.password_2  || 'PASSWORD_2';
      const ssl_1       = state.compiler.ssl ? ' --ssl1' : '';
      const ssl_2       = state.compiler.ssl ? ' --ssl2' : '';

      if (isURL(host_1) &&
          isURL(host_2) &&
          isEmail(user_1) &&
          isEmail(user_2) &&
          isEmpty(password_1) !== true &&
          !isEmpty(password_2) !== true) {
        shouldReturn = true;
        command += `/Applications/imapsync/imapsync_bin_Darwin --host1 ${host_1} --user1 ${user_1} --password1 ${password_1}${ssl_1} --host2 ${host_2} --user2 ${user_2} --password2 ${password_2}${ssl_2}; `;
      }
    }
  }

  if (shouldReturn) {
    return {
      type: COMPILE_TRANSFERS,
      data: command,
    };
  }
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

export function toggleSSL() {
  return {
    type: TOGGLE_SSL,
  };
}
