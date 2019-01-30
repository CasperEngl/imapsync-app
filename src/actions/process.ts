import { action } from "typesafe-actions";

export const ADD_PID = 'ADD_PID';
export const REMOVE_PID = 'REMOVE_PID';
export const CLEAR_PIDS = 'CLEAR_PIDS';
export const ADD_LOG = 'ADD_LOG';
export const REMOVE_LOG = 'REMOVE_LOG';
export const CLEAR_LOGS = 'CLEAR_LOGS';

interface Pid {
  email: string;
  pid: number;
}

interface Log {
  encoded: string;
  date: string;
  email: string;
}

export const addPid = (pid: Pid) => action(ADD_PID, {
  pid,
});

export const removePid = (pid: Pid) => action(REMOVE_PID, {
  pid,
});

export const clearPids = () => action(CLEAR_PIDS);

export const addLog = (log: Log) => action(ADD_LOG, {
  log,
});

export const removeLog = (log: Log) => action(REMOVE_LOG, {
  log,
});

export const clearLogs = () => action(CLEAR_LOGS);