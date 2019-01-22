import * as path from 'path';
import { BrowserWindow, Menu, powerSaveBlocker } from 'electron';
import { notify } from 'node-notifier';
import isDev from 'electron-is-dev';
import serve from 'electron-serve';

import { Command, Transfer } from './Transfer';
import { menu } from './menu';

const loadURL = serve({
	directory: 'build',
});

// 7z7R1!77q

export class Main {
	public appName = 'Imapsync';
	public appIcon = path.join(__dirname, '../../assets/icon.png');
	public BrowserWindow: typeof BrowserWindow;
	public powerSaveBlock: number;

	private MainWindow!: Electron.BrowserWindow | null;
	private Application: Electron.App;
	private ipcMain: Electron.IpcMain;

	constructor(app: Electron.App, browserWindow: typeof BrowserWindow, ipcMain: Electron.IpcMain) {
		this.BrowserWindow = browserWindow;
		this.Application = app;
		this.ipcMain = ipcMain;
		this.powerSaveBlock = powerSaveBlocker.start('prevent-display-sleep');

		this.onWindowAllClosed = this.onWindowAllClosed.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onReady = this.onReady.bind(this);
		this.onReadyToShow = this.onReadyToShow.bind(this);
		this.initialize = this.initialize.bind(this);
	}

	public initialize() {
		this.Application.on('window-all-closed', this.onWindowAllClosed);
		this.Application.on('ready', this.onReady);

		this.ipcMain.on('command', async (event: Electron.Event, commands: Command[]) => {
			const transfer = new Transfer({
				event,
				commands,
				command: commands[0],
				index: 0,
			});

			transfer.start();
		});
		this.ipcMain.on('command-cancelled', (event: Electron.Event, pid: number) => {
			process.kill(pid);

			event.sender.send('command-cancelled', pid);
		});

		Menu.setApplicationMenu(menu);
	}

	private onWindowAllClosed() {
		// this.powerSaveBlock.stop();
		this.Application.quit();
	}

	private onClose() {
		this.MainWindow = null;
	}

	private onReadyToShow() {
		if (this.MainWindow) {
			this.MainWindow.show();
		}
	}

	private onReady() {
		this.MainWindow = new BrowserWindow({
			titleBarStyle: 'hiddenInset',
			width: 600,
			height: 645,
			minWidth: 320,
			minHeight: 645,
			backgroundColor: '#007bff',
			show: false,
			webPreferences: {
				nodeIntegration: true,
			},
		});

		if (this.MainWindow) {
			if (isDev) {
				this.MainWindow.loadURL('http://localhost:3000');
			} else {
				loadURL(this.MainWindow);
			}

			this.MainWindow.on('closed', this.onClose);
			this.MainWindow.once('ready-to-show', this.onReadyToShow);
		}

		notify({
			title: this.appName,
			icon: this.appIcon,
			message: 'Initialized',
		});
	}
}
