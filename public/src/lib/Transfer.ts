import * as path from 'path';
import { promises as fs } from 'fs';
import { homedir } from 'os';
import { spawn } from 'child_process';
import { app } from 'electron';
import { notify } from 'node-notifier';
import { isEmail } from 'validator';
import isDev from 'electron-is-dev';
import * as base64 from 'base-64';
import mkdirp from 'mkdirp';

import { getPlatform } from './platform';

const execPath = isDev
	? path.join(app.getAppPath(), 'resources', getPlatform())
	: path.join(app.getAppPath(), '../bin');

export type Command = string[];

export interface ITransfer {
	event: Electron.Event;
	command: Command;
	index: number;
}

export interface ILog {
	encoded: string;
	date: string;
	email: string | undefined;
}

export class Transfer {
	public outputLog: string;
	public event: Electron.Event;
	public command: Command;
	public index: number;
	public process: any;

	constructor({ event, command, index }: ITransfer) {
		this.event = event;
		this.command = command;
		this.index = index;

		this.outputLog = '';

		this.onStdout = this.onStdout.bind(this);
		this.onExit = this.onExit.bind(this);
		this.writeLogToDisk = this.writeLogToDisk.bind(this);
	}

	public start(): NodeJS.Process | void {
		try {
			if (!this.command) {
				return;
			}

			this.process = spawn(`${path.join(execPath, 'sync_bin')}`, [...this.command, '--nolog', '--noreleasecheck'], {
				detached: true,
			});

			this.event.sender.send('command-pid', {
				email: this.command.reverse().find((arg) => isEmail(arg)),
				pid: this.process.pid,
			});

			this.process.stdout.on('data', this.onStdout);
			this.process.on('exit', this.onExit);

			return process;
		} catch (err) {
			console.error(err);
		}
	}

	public stop(): void {
		try {
			this.command = [''];
		} catch (err) {
			console.error(err);
		}
	}

	private onStdout(data: Buffer): void {
		try {
			this.outputLog += data.toString();

			this.event.sender.send('command-stdout', data.toString());
		} catch (err) {
			console.error(err);
		}
	}

	private async onExit(): Promise<any> {
		try {
			const log = await this.writeLogToDisk();
			await this.notification(log);

			this.event.sender.send('command-log', log);
			this.event.sender.send('command-exit', {
				index: this.index,
				pid: this.process.pid
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	private async notification(log: ILog | undefined): Promise<void> {
		try {
			if (log && log.email) {
				notify({
					title: 'Imapsync',
					message: `Finished ${log.email}`,
					icon: path.join(__dirname, '../assets/icon.png'),
				});
			} else {
				notify({
					title: 'Imapsync',
					icon: path.join(__dirname, '../assets/icon.png'),
				});
			}
		} catch (err) {
			console.error(err);
		}
	}

	private async writeLogToDisk(): Promise<ILog | undefined> {
		try {
			const log: ILog = {
				encoded: base64.encode(this.outputLog),
				date: new Date().toISOString(),
				email: this.command.reverse().find((arg) => isEmail(arg)),
			};

			const directory = `${homedir()}/Documents/IMAPSYNC_LOG`;

			mkdirp(directory, async (err: any) => {
				if (err) {
					throw new Error(err);
				}

				await fs.writeFile(`${directory}/imapsync_log-${log.email}-${log.date}.txt`, this.outputLog, 'utf8');
			});

			return log;
		} catch (err) {
			console.error(err);
		}
	}
}
