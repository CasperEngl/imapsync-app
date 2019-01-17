import { homedir } from 'os';
import * as path from 'path';
import ElectronPreferences from 'electron-preferences';
import { app, Menu } from 'electron';

export const preferences = new ElectronPreferences({
	dataStore: path.resolve(app.getPath('userData'), 'preferences.json'),
	defaults: {
		notes: {
			folder: path.resolve(homedir(), 'Notes'),
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
	onLoad: (preferences: any) => preferences,
	sections: [
		{
			id: 'settings',
			label: 'Settings',
			icon: 'folder-15',
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
});

export const menu = Menu.buildFromTemplate([
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
]);
