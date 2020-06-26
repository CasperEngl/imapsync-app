import * as path from 'path'
import { promises as fs } from 'fs'
import { homedir } from 'os'
import { spawn, ChildProcessWithoutNullStreams, ChildProcess } from 'child_process'
import { app } from 'electron'
import { notify } from 'node-notifier'
import isDev from 'electron-is-dev'
import * as base64 from 'base-64'
import mkdirp from 'mkdirp'
import iconv from 'iconv-lite'

import { getPlatform } from './platform'

const execPath = isDev
  ? path.join(app.getAppPath(), 'resources', getPlatform())
  : path.join(app.getAppPath(), '../bin')

export interface ITransfer {
  event: Electron.IpcMainEvent;
  command: string[];
  commands: string[][];
  index: number;
}

export interface ILog {
  encoded: string;
  date: string;
  email?: string[];
}

export class Transfer {
  public outputLog: string;

  public event: Electron.IpcMainEvent;

  public command: string[];

  public commands: string[][];

  public index: number;

  public process: any;

  constructor({
    event,
    command,
    commands,
    index,
  }: ITransfer) {
    this.event = event
    this.command = this.filterBin(command ?? commands[index])
    this.commands = commands
    this.index = index

    this.outputLog = ''

    this.onStdout = this.onStdout.bind(this)
    this.onExit = this.onExit.bind(this)
    this.writeLogToDisk = this.writeLogToDisk.bind(this)
  }

  public start(): void {
    if (!this.command) {
      return
    }

    this.process = spawn(
      `${path.join(execPath, 'sync_bin')}`,
      [...this.command, '--nolog'],
      { detached: true },
    )

    this.process.stdout.on('data', this.onStdout)
    this.process.on('exit', this.onExit)

    this.event.sender.send('command-pid', {
      email: this.getUsersArguments(this.command),
      pid: this.process.pid,
    })
  }

  private onStdout(data: Buffer): void {
    this.outputLog += data.toString()

    this.event.sender.send('command-stdout', data.toString())
  }

  private async onExit(): Promise<void> {
    try {
      const log = await this.writeLogToDisk()
      await this.notification(log)

      this.event.sender.send('command-log', log)
      this.event.sender.send('command-exit', this.process.pid)

      this.restart()
    } catch (err) {
      console.error(err)
    }
  }

  private async notification(log: ILog | undefined): Promise<void> {
    if (log && log.email && log.email.length) {
      notify({
        title: 'Transfer complete',
        message: `Finished ${log.email.join(' -> ')}`,
        icon: path.join(__dirname, '../assets/icon.png'),
      })
    } else {
      notify({
        title: 'Transfer complete',
        icon: path.join(__dirname, '../assets/icon.png'),
      })
    }
  }

  private filterBin(command: string[]) {
    return command.filter((arg) => !arg.includes('imapsync_bin'))
  }

  private getUsersArguments(command: string[]) {
    // Get user1 argument by adding 1 to the index of user1
    const user1Index = command.indexOf('--user1')
    const user2Index = command.indexOf('--user2')

    // Find the argument for user1 in command
    return [
      command[user1Index + 1],
      command[user2Index + 1],
    ]
  }

  private async writeLogToDisk(): Promise<ILog | undefined> {
    const output = iconv.decode(Buffer.from(this.outputLog, 'utf8'), 'ISO-8859-1')

    const log: ILog = {
      encoded: base64.encode(output),
      date: new Date().toISOString(),
      email: this.getUsersArguments(this.command),
    }

    const directory = `${homedir()}/Documents/IMAPSYNC_LOG`

    await mkdirp(directory)

    await fs.writeFile(`${directory}/imapsync_log-${log.email}-${log.date}.txt`, this.outputLog, 'utf8')

    return log
  }

  private async restart(): Promise<void> {
    if (this.commands.length > 1 && this.commands.length > this.index + 1) {
      const transfer = new Transfer({
        event: this.event,
        commands: this.commands,
        command: this.commands[this.index + 1],
        index: this.index + 1,
      })

      transfer.start()
    }
  }
}
