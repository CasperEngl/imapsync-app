import * as path from 'path'
import { BrowserWindow, Menu, powerSaveBlocker } from 'electron'
import { notify } from 'node-notifier'
import isDev from 'electron-is-dev'
import serve from 'electron-serve'
import findProcess from 'find-process'

import { Transfer } from './Transfer'
import { menu } from './menu'

type NewCommand = {
  index: number;
  command: string[];
  commands: string[][];
}

const loadURL = serve({
  directory: 'build',
})

export class Main {
  public appName = 'Imapsync';

  public appIcon = path.join(__dirname, '../../assets/icon.png');

  public BrowserWindow: typeof BrowserWindow;

  public powerSaveBlock: number;

  public transfer?: any;

  private MainWindow!: Electron.BrowserWindow | null;

  private Application: Electron.App;

  private ipcMain: Electron.IpcMain;

  constructor(
    app: Electron.App,
    browserWindow: typeof BrowserWindow,
    ipcMain: Electron.IpcMain,
  ) {
    this.BrowserWindow = browserWindow
    this.Application = app
    this.Application.allowRendererProcessReuse = true
    this.ipcMain = ipcMain
    this.powerSaveBlock = powerSaveBlocker.start('prevent-display-sleep')

    this.onWindowAllClosed = this.onWindowAllClosed.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onReady = this.onReady.bind(this)
    this.onReadyToShow = this.onReadyToShow.bind(this)
    this.initialize = this.initialize.bind(this)
  }

  public initialize() {
    this.Application.on('window-all-closed', this.onWindowAllClosed)
    this.Application.on('ready', this.onReady)

    this.ipcMain.on(
      'command',
      async (event, {
        index,
        commands,
        command,
      }: NewCommand) => {
        const transfer = new Transfer({
          event,
          commands,
          command,
          index,
        })

        transfer.start()
      },
    )
    this.ipcMain.on(
      'command-cancelled',
      (event, pid: number) => {
        findProcess('pid', pid)
          .then((list: any) => {
            list.forEach((p: any) => process.kill(p))
          }, (err: any) => {
            console.error(err.stack || err)
          })

        event.sender.send('command-cancelled', pid)
      },
    )

    Menu.setApplicationMenu(menu)
  }

  private onWindowAllClosed() {
    // this.powerSaveBlock.stop();
    this.Application.quit()
  }

  private onClose() {
    this.MainWindow = null
  }

  private onReadyToShow() {
    if (this.MainWindow) {
      this.MainWindow.show()
    }
  }

  private onReady() {
    this.MainWindow = new BrowserWindow({
      titleBarStyle: 'hiddenInset',
      width: 1400,
      height: 900,
      minWidth: 320,
      minHeight: 645,
      backgroundColor: '#007bff',
      show: false,
      webPreferences: {
        nodeIntegration: true,
      },
    })

    if (this.MainWindow) {
      if (isDev) {
        this.MainWindow.loadURL('http://localhost:3000')
      } else {
        loadURL(this.MainWindow)
      }

      this.MainWindow.on('closed', this.onClose)
      this.MainWindow.once('ready-to-show', this.onReadyToShow)
    }

    notify({
      title: this.appName,
      icon: this.appIcon,
      message: 'Initialized',
    })
  }
}
