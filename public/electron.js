const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
} = require('electron');
const ElectronPreferences = require('electron-preferences');
const notifier = require('node-notifier');
const appRootDir = require('app-root-dir');
const path = require('path');
const isDev = require('electron-is-dev');
const shell = require('shelljs');
const { spawn } = require('child_process');
const os = require('os');

const getPlatform = require('./get-platform');

const execPath = isDev
  ? path.join(appRootDir.get(), 'resources', getPlatform())
  : path.join(path.dirname(appRootDir.get()), 'bin');

shell.config.execPath = shell.which('node');

let mainWindow;

const preferences = new ElectronPreferences({
  dataStore: path.resolve(app.getPath('userData'), 'preferences.json'),
  defaults: {
    notes: {
      folder: path.resolve(os.homedir(), 'Notes'),
    },
    markdown: {
      auto_format_links: true,
      show_gutter: false,
    },
    preview: {
      show: true,
    },
    drawer: {
      show: true,
    },
  },
  /**
   * If the `onLoad` method is specified, this function will be called immediately after
   * preferences are loaded for the first time.
   * The return value of this method will be stored as the preferences object.
   */
  onLoad: preferences => preferences, // eslint-disable-line
  /**
   * The preferences window is divided into sections. Each section has a label, an icon, and one or
   * more fields associated with it. Each section should also be given a unique ID.
   */
  sections: [
    {
      id: 'about',
      label: 'About You',
      /**
           * See the list of available icons below.
           */
      icon: 'single-01',
      form: {
        groups: [
          {
            /**
                       * Group heading is optional.
                       */
            label: 'About You',
            fields: [
              {
                label: 'First Name',
                key: 'first_name',
                type: 'text',
                /**
                               * Optional text to be displayed beneath the field.
                               */
                help: 'What is your first name?',
              },
              {
                label: 'Last Name',
                key: 'last_name',
                type: 'text',
                help: 'What is your last name?',
              },
              {
                label: 'Gender',
                key: 'gender',
                type: 'dropdown',
                options: [
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Unspecified', value: 'unspecified' },
                ],
                help: 'What is your gender?',
              },
              {
                label: 'Which of the following foods do you like?',
                key: 'foods',
                type: 'checkbox',
                options: [
                  { label: 'Ice Cream', value: 'ice_cream' },
                  { label: 'Carrots', value: 'carrots' },
                  { label: 'Cake', value: 'cake' },
                  { label: 'Spinach', value: 'spinach' },
                ],
                help: 'Select one or more foods that you like.',
              },
              {
                label: 'Coolness',
                key: 'coolness',
                type: 'slider',
                min: 0,
                max: 9001,
              },
              {
                label: 'Eye Color',
                key: 'eye_color',
                type: 'color',
                format: 'hex', // can be hex, hsl or rgb
                help: 'Your eye color',
              },
              {
                label: 'Hair Color',
                key: 'hair_color',
                type: 'color',
                format: 'rgb',
                help: 'Your hair color',
              },
            ],
          },
        ],
      },
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: 'folder-15',
      form: {
        groups: [
          {
            label: 'Stuff',
            fields: [
              {
                label: 'Read notes from folder',
                key: 'folder',
                type: 'directory',
                help: 'The location where your notes will be stored.',
              },
              {
                heading: 'Important Message',
                content: '<p>The quick brown fox jumps over the long white fence. The quick brown fox jumps over the long white fence. The quick brown fox jumps over the long white fence. The quick brown fox jumps over the long white fence.</p>',
                type: 'message',
              },
            ],
          },
        ],
      },
    },
    {
      id: 'space',
      label: 'Other Settings',
      icon: 'spaceship',
      form: {
        groups: [
          {
            label: 'Other Settings',
            fields: [
              {
                label: 'Phone Number',
                key: 'phone_number',
                type: 'text',
                help: 'What is your phone number?',
              },
              {
                label: 'Foo or Bar?',
                key: 'foobar',
                type: 'radio',
                options: [
                  { label: 'Foo', value: 'foo' },
                  { label: 'Bar', value: 'bar' },
                  { label: 'FooBar', value: 'foobar' },
                ],
                help: 'Foo? Bar?',
              },
            ],
          },
        ],
      },
    },
  ],
});

const menu = Menu.buildFromTemplate([
  {
    label: 'Menu',
    submenu: [
      {
        label: 'Settings',
        click() {
          preferences.show();
        },
        accelerator: 'CmdOrCtrl+E',
      },
      {
        label: 'Quit',
        click() {
          app.quit();
        },
        accelerator: 'CmdOrCtrl+Q',
      },
    ],
  },
]);

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

  Menu.setApplicationMenu(menu);
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
    console.log(command);
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