// @type-check

const path = require('path');
const { spawn } = require('child_process');
const appRootDir = require('app-root-dir');
const isDev = require('electron-is-dev');
const base64 = require('base-64');

const getPlatform = require('./get-platform');

const execPath = isDev
  ? path.join(appRootDir.get(), 'resources', getPlatform())
  : path.join(path.dirname(appRootDir.get()), 'bin');

const doTransfer = ({
  event,
  commands,
  currentCommand,
  index,
}) => {
  let outputLog = '';

  const cmd = spawn(`${path.join(execPath, 'sync_bin')}`, [...currentCommand, '--nolog'], {
    detached: true,
  });

  cmd.stdout.on('data', (data) => {
    outputLog += data.toString();

    event.sender.send('command-stdout', data.toString());
  });

  cmd.stderr.on('data', () => {
    // console.log(data.toString());
  });

  cmd.on('exit', () => {
    // Check if there are more transfers to complete
    if (commands.length > 1 && commands.length > index + 1) {
      doTransfer({
        event,
        commands,
        currentCommand: commands[index + 1],
        index: index + 1,
      });
    }

    event.sender.send('command-log', {
      encoded: base64.encode(outputLog),
      date: new Date().toISOString(),
    });
  });
};

module.exports = {
  doTransfer,
};
