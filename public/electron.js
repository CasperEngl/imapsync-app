const { app, BrowserWindow, ipcMain } = require('electron');
const notifier = require('node-notifier');
const appRootDir = require('app-root-dir');
const path = require('path');
const isDev = require('electron-is-dev');
const shell = require('shelljs');
const { spawn } = require('child_process');

const getPlatform = require('./get-platform');

const execPath = isDev
  ? path.join(appRootDir.get(), 'resources', getPlatform())
  : path.join(path.dirname(appRootDir.get()), 'bin');

shell.config.execPath = shell.which('node');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    width: 600,
    height: 645,
    minWidth: 320,
    minHeight: 645,
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
    const args = [
      '--host1',
      command.host_1,
      '--user1',
      command.user_1,
      '--password1',
      command.password_1,
      '--ssl1',
      '--sslargs1',
      'SSL_cipher_list=DEFAULT',

      '--host2',
      command.host_2,
      '--user2',
      command.user_2,
      '--password2',
      command.password_2,
      '--ssl2',
      '--sslargs2',
      'SSL_cipher_list=DEFAULT',

      '--nolog',
    ];

    const cmd = spawn(`${path.join(execPath, 'sync_bin')}`, args);

    cmd.stdout.on('data', (data) => {
      event.sender.send('command-stdout', data.toString());
    });

    cmd.stderr.on('data', () => {
      // console.log(data.toString());
    });

    // 7z7R1!77q
  });
});

notifier.notify({
  title: 'Imapsync',
  message: 'Initialized',
  icon: path.join(__dirname, '../assets/icon.png'),
});
