import * as path from 'path'
import { homedir } from 'os'
import { app, Menu } from 'electron'
import ElectronPreferences from 'electron-preferences'

export const preferences = new ElectronPreferences({
  dataStore: path.resolve(app.getPath('userData'), 'preferences.json'),
  defaults: {
    settings: {
      output_bg: '#343a40',
      output_color: 'rgba(255, 255, 255, 0.75)',
      documents_directory: path.resolve(homedir(), 'Documents'),
    },
  },
  onLoad: (preferences: any) => preferences,
  sections: [
    {
      id: 'settings',
      label: 'Settings',
      icon: 'preferences',
      form: {
        groups: [
          {
            label: 'Output',
            fields: [
              {
                label: 'Background color',
                key: 'output_bg',
                type: 'text',
                help: 'Enter hex, rgb, rgba, hsl or other valid CSS color types.',
              },
              {
                label: 'Text color',
                key: 'output_color',
                type: 'text',
                help: 'Enter hex, rgb, rgba, hsl or other valid CSS color types.',
              },
            ],
          },
        ],
      },
    },
  ],
})

export const menu = Menu.buildFromTemplate([
  {
    label: 'Menu',
    submenu: [
      {
        label: 'Settings',
        accelerator: 'CmdOrCtrl+E',
        click() {
          preferences.show()
        },
      },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click() {
          app.quit()
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo',
      },
      {
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        role: 'cut',
      },
      {
        role: 'copy',
      },
      {
        role: 'paste',
      },
      {
        role: 'pasteandmatchstyle',
      },
      {
        role: 'delete',
      },
      {
        role: 'selectall',
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        role: 'reload',
      },
      {
        role: 'forcereload',
      },
      {
        role: 'toggledevtools',
      },
      {
        type: 'separator',
      },
      {
        role: 'resetzoom',
      },
      {
        role: 'zoomin',
      },
      {
        role: 'zoomout',
      },
      {
        type: 'separator',
      },
      {
        role: 'togglefullscreen',
      },
    ],
  },
])
