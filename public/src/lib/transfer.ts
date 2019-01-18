import * as path from 'path';
import { homedir } from 'os';
import { spawn } from 'child_process';
import { app } from 'electron';
import { notify } from 'node-notifier';
import { isEmail } from 'validator';
import { promisifyAll } from 'bluebird';
import isDev from 'electron-is-dev';
import * as base64 from 'base-64';

import { getPlatform } from './platform';

const fs = promisifyAll(require('fs'));

const execPath = isDev
	? path.join(app.getAppPath(), 'resources', getPlatform())
	: path.join(app.getAppPath(), '../bin');

export type Command = string[];

export type Transfer = {
	event: Electron.Event;
	commands: Command[];
	currentCommand: Command;
	index: number;
};

export function transfer({ event, commands, currentCommand, index }: Transfer): void {
	let outputLog = '';

	const cmd = spawn(`${path.join(execPath, 'sync_bin')}`, [...currentCommand, '--nolog'], {
		detached: true,
	});

	cmd.stdout.on('data', (data: Buffer) => {
		outputLog += data.toString();

		event.sender.send('command-stdout', data.toString());
	});

	cmd.on('exit', async () => {
		const log = {
			encoded: base64.encode(outputLog),
			date: new Date().toISOString(),
			email: '',
		};

		for (const arg of currentCommand) {
			if (isEmail(arg)) {
				log.email = arg;
			}
		}

		notify({
			title: 'Imapsync',
			message: `Finished ${log.email}`,
			icon: path.join(__dirname, '../assets/icon.png'),
		});

		// Check if there are more transfers to complete
		if (commands.length > 1 && commands.length > index + 1) {
			transfer({
				event,
				commands,
				currentCommand: commands[index + 1],
				index: index + 1,
			});
		}

		try {
			const directory = `${homedir()}/Documents/IMAPSYNC_LOG`;

			await fs.mkdirAsync(directory, {
				recursive: true,
			});

			await fs.writeFileAsync(`${directory}/imapsync_log-${log.email}-${log.date}.txt`, outputLog, 'utf8');
		} catch (err) {
			// console.error(err);
		}

		event.sender.send('command-log', log);
	});
}
