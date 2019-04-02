import { action } from 'typesafe-actions';
import { Dispatch } from 'redux';
import { isEmail, isURL, isIP, isEmpty } from 'validator';
import { store } from '../App';

export const COMPILE_TRANSFERS = 'COMPILE_TRANSFERS';
export const TOGGLE_SSL = 'TOGGLE_SSL';

export type Input = {
  host_1: 'HOST_1' | string;
  host_2: 'HOST_2' | string;
  user_1: 'USER_1' | string;
  user_2: 'USER_2' | string;
  password_1: 'PASSWORD_1' | string;
  password_2: 'PASSWORD_2' | string;
};

export function compileTransfers() {
  return async function(dispatch: Dispatch) {
    try {
      const state = store.getState();
      let text = '';
      const json = [];

      for (const input of state.transfer.inputs) {
        if (input) {
          const {
            host_1 = 'HOST_1',
            user_1 = 'USER_1',
            password_1 = 'PASSWORD_1',
            host_2 = 'HOST_2',
            user_2 = 'USER_2',
            password_2 = 'PASSWORD_2',
          }: Input = input;

          const args_1 = input.args_1 ? ` ${input.args_1}` : '';
          const args_2 = input.args_2 ? ` ${input.args_2}` : '';
          const ssl_1 = state.compiler.ssl
            ? ` --ssl1 --sslargs1 'SSL_cipher_list=DEFAULT'`
            : '';
          const ssl_2 = state.compiler.ssl
            ? ` --ssl2 --sslargs2 'SSL_cipher_list=DEFAULT'`
            : '';

          const allArgs_1 = `${args_1}${ssl_1}`;
          const allArgs_2 = `${args_2}${ssl_2}`;

          if (
            (isURL(host_1) || isIP(host_1)) &&
            (isURL(host_2) || isIP(host_2)) &&
            isEmail(user_1) &&
            isEmail(user_2) &&
            password_1 !== 'PASSWORD_1' &&
            !isEmpty(password_1) &&
            password_2 !== 'PASSWORD_2' &&
            !isEmpty(password_2)
          ) {
            const newCommand = `./imapsync_bin --host1 '${host_1}' --user1 '${user_1}' --password1 '${password_1}'${allArgs_1} --host2 '${host_2}' --user2 '${user_2}' --password2 '${password_2}'${allArgs_2};`;

            const commands = newCommand
              .split(' ')
              .filter(arg => {
                if (!arg.length || arg.includes('./imapsync_bin')) {
                  return;
                }

                return arg;
              })
              .map(arg =>
                arg
                  .replace(/;$/, '')
                  .replace(/^'(.*)'$/, '$1')
                  .trim(),
              )
              .filter(arg => arg.length);

            json.push(commands);
            text += newCommand;
          }
        }
      }

      return dispatch({
        type: COMPILE_TRANSFERS,
        payload: {
          text,
          json,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
}

export const toggleSSL = () => action(TOGGLE_SSL);
