import { action } from 'typesafe-actions'

export const ADD_PID = 'ADD_PID'
export const REMOVE_PID = 'REMOVE_PID'
export const CLEAR_PIDS = 'CLEAR_PIDS'
export const ADD_LOG = 'ADD_LOG'
export const REMOVE_LOG = 'REMOVE_LOG'
export const CLEAR_LOGS = 'CLEAR_LOGS'

export interface Pid {
  pid: number;
  email: string;
}

export interface Log {
  encoded: string;
  date: string;
  email: string;
}

export const addPid = ({ pid, email }: Pid) => action(ADD_PID, {
  pid,
  email,
})

export const removePid = ({ pid, email }: Pid) => action(REMOVE_PID, {
  pid,
  email,
})

export const clearPids = () => action(CLEAR_PIDS)

export const addLog = (log: Log) => action(ADD_LOG, {
  log,
})

export const removeLog = (log: Log) => action(REMOVE_LOG, {
  log,
})

export const clearLogs = () => action(CLEAR_LOGS)
