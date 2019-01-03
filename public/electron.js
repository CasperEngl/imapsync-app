const { app, BrowserWindow, ipcMain } = require('electron');
const notifier = require('node-notifier');
const appRootDir = require('app-root-dir');
const path = require('path');
const isDev = require('electron-is-dev');
const shell = require('shelljs');
const { spawn } = require('child_process');

const getPlatform = require('./get-platform');

const execPath = (!isDev)
  ? path.join(path.dirname(appRootDir.get()), 'bin')
  : path.join(appRootDir.get(), 'resources', getPlatform());

require('../src/components/trimLiteral');

shell.config.execPath = shell.which('node');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    resizable: false,
    width: 1024,
    height: 1400,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
	mainWindow.on('closed', () => (mainWindow = null)); // eslint-disable-line
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('command', (event, commands) => {
  commands.forEach((command) => {
    const args = `
      --host1 '${command.host_1}' --user1 '${command.user_1}' --password1 '${command.password_1}' 
      --host2 '${command.host_2}' --user2 '${command.user_2}' --password2 '${command.password_2}';
    `.trimLiteral();

    const cmd = spawn(`${path.join(execPath, 'sync_bin')}`, ['--testslive']);

    cmd.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    // exec(`${cmd} --testslive`, (err, stdout, stderr) => {
    //   if (err) {
    //     console.error(err);
    //     event.sender.send('command-error', err);
    //     return;
    //   }

    //   event.sender.send('command-stdout', stdout);
    //   console.log(`stdout: ${stdout}`);
    //   event.sender.send('command-stderr', stderr);
    //   console.log(`stderr: ${stderr}`);

    //   notifier.notify({
    //     title: 'Imapsync',
    //     message: `Finished ${commands[0].user_1}`,
    //     icon: path.join(__dirname, '../assets/icon.png'),
    //   });
    // });

    // exec(`${cmd} ${args}`, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(error);
    //     return;
    //   }

    //   console.log(`stdout: ${stdout}`);
    //   console.log(`stderr: ${stderr}`);
    // });
  });
});

notifier.notify({
  title: 'Imapsync',
  message: 'Initialized',
  icon: path.join(__dirname, '../assets/icon.png'),
});
