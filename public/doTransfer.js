// @type-check

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const appRootDir = require('app-root-dir');
const isDev = require('electron-is-dev');
const base64 = require('base-64');
const notifier = require('node-notifier');
const { promisify } = require('util');
const { isEmail } = require('validator');

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);

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

  cmd.on('exit', async () => {
    const log = {
      encoded: base64.encode(outputLog),
      date: new Date().toISOString(),
      email: '',
    };

    /* eslint-disable */
    for (const arg of currentCommand) {
      if (isEmail(arg)) {
        log.email = arg;
      }
    }
    /* eslint-enable */

    notifier.notify({
      title: 'Imapsync',
      subtitle: new Date(log.date).toLocaleTimeString(),
      message: `Finished ${log.email}`,
      icon: path.join(__dirname, '../assets/icon.png'),
      contentImage: false,
    });

    // Check if there are more transfers to complete
    if (commands.length > 1 && commands.length > index + 1) {
      doTransfer({
        event,
        commands,
        currentCommand: commands[index + 1],
        index: index + 1,
      });
    }

    try {
      const directory = `${os.homedir()}/Documents/IMAPSYNC_LOG`;
      const dirExists = exists(directory);

      if (!dirExists) {
        await mkdir(directory, {
          recursive: true,
        });
      }

      await writeFile(`${directory}/imapsync_log-${log.email}-${log.date}.txt`, outputLog, 'utf8');
    } catch (err) {
      console.error(err);
    }
    event.sender.send('command-log', log);
  });
};

module.exports = {
  doTransfer,
};
