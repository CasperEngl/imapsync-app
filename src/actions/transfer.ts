import { action } from 'typesafe-actions';

import { TransferState } from '../reducers/transfer';

export interface TransferData {
	number: number;
	name: string;
	content: string;
}

export const ADD_TRANSFER = 'ADD_TRANSFER';
export const DUPLICATE_TRANSFER = 'DUPLICATE_TRANSFER';
export const REMOVE_TRANSFER = 'REMOVE_TRANSFER';
export const UPDATE_TRANSFER_DATA = 'UPDATE_TRANSFER_DATA';
export const CLEAR_TRANSFERS = 'CLEAR_TRANSFERS';
export const LOCK_TRANSFERS = 'LOCK_TRANSFERS';
export const IMPORT_TRANSFERS = 'IMPORT_TRANSFERS';
export const SET_CANCELLED = 'SET_CANCELLED';

export const addTransfer = () => action(ADD_TRANSFER);

export const duplicateTransfer = (id: number) => action(DUPLICATE_TRANSFER, {
	id,
});

export const removeTransfer = (id: number) => action(REMOVE_TRANSFER, {
	id,
});

export const clearTransfers = () => action(CLEAR_TRANSFERS);

export const updateTransferData = ({ number, name, content }: TransferData) => action(UPDATE_TRANSFER_DATA, {
	id: number,
	name,
	content,
});

export const lockTransfers = (lock: boolean = false) => action(LOCK_TRANSFERS, {
	lock,
});

export const importTransfers = ({
	transfers,
	inputs,
	count,
}: TransferState) => action(IMPORT_TRANSFERS, {
	transfers,
	inputs,
	count,
});

export const setCancelled = (cancelled: boolean = false) => action(SET_CANCELLED, {
	cancelled,
});