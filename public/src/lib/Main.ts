import { BrowserWindow, Menu } from 'electron';
import { join } from 'path';
import { notify } from 'node-notifier';
import * as isDev from 'electron-is-dev';

import { Command, transfer } from './transfer';
import { menu } from './menu';
import { getPlatform } from './platform';

export class Main {
	MainWindow!: Electron.BrowserWindow | null;
	Application: Electron.App;
	ipcMain: Electron.IpcMain;
	BrowserWindow: any;

	appName = 'Imapsync';
	appIcon = join(__dirname, '../assets/icon.png');

	constructor(app: Electron.App, browserWindow: typeof BrowserWindow, ipcMain: Electron.IpcMain) {
		this.BrowserWindow = browserWindow;
		this.Application = app;
		this.ipcMain = ipcMain;

		this.onWindowAllClosed = this.onWindowAllClosed.bind(this);
		this.onClose = this.onClose.bind(this);
		this.onReady = this.onReady.bind(this);
		this.onReadyToShow = this.onReadyToShow.bind(this);
		this.initialize = this.initialize.bind(this);
	}

	onWindowAllClosed() {
		if (getPlatform() !== 'darwin') {
			this.Application.quit();
		}
	}

	onClose() {
		this.MainWindow = null;
	}

	onReadyToShow() {
		if (this.MainWindow) {
			this.MainWindow.show();
		}
	}

	onReady() {
		this.MainWindow = new BrowserWindow({
			titleBarStyle: 'hiddenInset',
			width: 600,
			height: 645,
			minWidth: 320,
			minHeight: 645,
			show: false,
			backgroundColor: '#007bff',
			webPreferences: {
				nodeIntegration: true,
			},
		});

		if (this.MainWindow) {
			this.MainWindow.loadURL(
				isDev ? 'http://localhost:3000' : `file://${join(__dirname, '../build/index.html')}`
			);
			this.MainWindow.on('closed', this.onClose);
			this.MainWindow.once('ready-to-show', this.onReadyToShow);
		}

		notify({
			title: this.appName,
			icon: this.appIcon,
			message: 'Initialized',
		});
	}

	initialize() {
		this.Application.on('window-all-closed', this.onWindowAllClosed);
		this.Application.on('ready', this.onReady);

		this.ipcMain.on('command', (event: Electron.Event, commands: Command[]) => {
			if (commands.length) {
				transfer({
					event,
					commands,
					currentCommand: commands[0],
					index: 0,
				});
			} else {
				event.sender.send('command-stdout', 'No commands found.');
			}

			// 7z7R1!77q
		});

		Menu.setApplicationMenu(menu);
	}
}
