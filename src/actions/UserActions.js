/*
eslint

no-restricted-syntax: 0,
no-multi-spaces: 0,
camelcase: 0,
quotes: 0,
no-regex-spaces: 0,
*/

import { isEmail, isURL, isEmpty } from 'validator';
import { store } from '../App';
import '../components/trimLiteral';

export const ADD_TRANSFER = 'ADD_TRANSFER';
export const DUPLICATE_TRANSFER = 'DUPLICATE_TRANSFER';
export const REMOVE_TRANSFER = 'REMOVE_TRANSFER';
export const COMPILE_TRANSFERS = 'COMPILE_TRANSFERS';
export const UPDATE_TRANSFER_DATA = 'UPDATE_TRANSFER_DATA';
export const CLEAR_TRANSFERS = 'CLEAR_TRANSFERS';
export const TOGGLE_SSL = 'TOGGLE_SSL';
export const EXTRA_ARGUMENTS = 'EXTRA_ARGUMENTS';

String.prototype.trimLiteral = function () {
  if (this.length === 0) {
    return this;
  }

  return this
    .replace(/\n/gm, '') // Replace newlines
    .replace(/  /gm, ''); // Replace double spaces
};

export function addTransfer() {
  return {
    type: ADD_TRANSFER,
  };
}

export function duplicateTransfer(number) {
  return {
    type: DUPLICATE_TRANSFER,
    data: number,
  };
}

export function compileTransfers() {
  const state = store.getState();
  let command = '';

  for (const input of state.transfer.inputs) {
    if (typeof input !== 'undefined') {
      const host_1      = input.host_1      || 'HOST_1';
      const user_1      = input.user_1      || 'USER_1';
      const password_1  = input.password_1  || 'PASSWORD_1';
      const host_2      = input.host_2      || 'HOST_2';
      const user_2      = input.user_2      || 'USER_2';
      const password_2  = input.password_2  || 'PASSWORD_2';

      const args_1      = input.args_1              ? ` ${input.args_1}` : '';
      const args_2      = input.args_2              ? ` ${input.args_2}` : '';
      const extraArgs   = state.compiler.extraArgs  ? ` ${state.compiler.extraArgs}` : '';
      const ssl_1       = state.compiler.ssl        ? ` --ssl1 --sslargs1 'SSL_cipher_list=DEFAULT'` : '';
      const ssl_2       = state.compiler.ssl        ? ` --ssl2 --sslargs2 'SSL_cipher_list=DEFAULT'` : '';

      const allExtraArgs_1 = `${args_1}${ssl_1}${extraArgs}`;
      const allExtraArgs_2 = `${args_2}${ssl_2}${extraArgs}`;

      if (isURL(host_1) &&
          isURL(host_2) &&
          isEmail(user_1) &&
          isEmail(user_2) &&
          password_1 !== 'PASSWORD_1' &&
          !isEmpty(password_1) &&
          password_2 !== 'PASSWORD_2' &&
          !isEmpty(password_2)) {
        command += `
          /Applications/imapsync/imapsync_bin_Darwin 
          --host1 '${host_1}' --user1 '${user_1}' --password1 '${password_1}'${allExtraArgs_1} 
          --host2 '${host_2}' --user2 '${user_2}' --password2 '${password_2}'${allExtraArgs_2}; 
        `.trimLiteral();
      }
    }
  }

  return {
    type: COMPILE_TRANSFERS,
    data: command,
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

export function toggleSSL() {
  return {
    type: TOGGLE_SSL,
  };
}

export function addExtraArgs(string) {
  return {
    type: EXTRA_ARGUMENTS,
    data: string,
  };
}

export function stringAlign(string) {
  return string
    .replace(/\n/gm, '') // Replace newlines
    .replace(/  /gm, ''); // Replace double spaces
}
