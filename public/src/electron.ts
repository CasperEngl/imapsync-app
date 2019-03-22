
import { app as application, BrowserWindow, ipcMain } from 'electron';
import { Main } from './lib/Main';

// require('update-electron-app')();

const app = new Main(application, BrowserWindow, ipcMain);

app.initialize();
