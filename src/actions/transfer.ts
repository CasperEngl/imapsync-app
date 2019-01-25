export interface TransferData {
	number: number;
	name: string;
	content: string;
}

import { action } from 'typesafe-actions';

export const ADD_TRANSFER = 'ADD_TRANSFER';
export const DUPLICATE_TRANSFER = 'DUPLICATE_TRANSFER';
export const REMOVE_TRANSFER = 'REMOVE_TRANSFER';
export const UPDATE_TRANSFER_DATA = 'UPDATE_TRANSFER_DATA';
export const CLEAR_TRANSFERS = 'CLEAR_TRANSFERS';

export const addTransfer = () => action(ADD_TRANSFER);

export const duplicateTransfer = (number: number) => action(DUPLICATE_TRANSFER, number);

export const removeTransfer = (number: number) => action(REMOVE_TRANSFER, number);

export const clearTransfers = () => action(CLEAR_TRANSFERS);

export const updateTransferData = ({ number, name, content }: TransferData) => action(UPDATE_TRANSFER_DATA, {
	id: number,
	name,
	content,
});
