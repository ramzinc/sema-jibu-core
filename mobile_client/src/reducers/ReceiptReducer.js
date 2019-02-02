
import {
    SET_REMOTE_RECEIPTS,
    ADD_REMOTE_RECEIPT,
    SET_LOCAL_RECEIPTS,
    UPDATE_REMOTE_RECEIPT,
    UPDATE_LOCAL_RECEIPT,
    UPDATE_RECEIPT_LINE_ITEM,
    REMOVE_LOCAL_RECEIPT,
    CLEAR_LOGGED_RECEIPTS
} from "../actions/ReceiptActions";

import moment from 'moment-timezone';

let initialState = {
    localReceipts: [],
    remoteReceipts: [],
    updatedRemoteReceipts: []
};

const receiptReducer = (state = initialState, action) => {
    console.log("receiptReducer: " + action.type, action.data);

    let newState;

    switch (action.type) {
        case SET_REMOTE_RECEIPTS:
            let { remoteReceipts } = action.data;
            newState = { ...state };
            remoteReceipts = remoteReceipts.length ? remoteReceipts : newState.remoteReceipts;
            remoteReceipts = remoteReceipts.map(receipt => {
                // Make sure we don't sync a logged receipt for no reason on next sync
                if (receipt.updated) {
                    receipt.updated = false;
                }
                receipt.isLocal = false;
                return receipt;
            })
            // Take care of receipts that are not from today
            .filter(receipt => {
                let today = moment.tz(new Date(Date.now()), moment.tz.guess()).format('YYYY-MM-DD');
                return moment.tz(receipt.id, moment.tz.guess()).isSameOrAfter(today);
            });
            newState.remoteReceipts = remoteReceipts;
            return newState;
        case ADD_REMOTE_RECEIPT:
            let { receipt } = action.data;
            newState = { ...state };
            newState.remoteReceipts.push(receipt);
            return newState;
        case SET_LOCAL_RECEIPTS:
            let { localReceipts } = action.data;
            newState = { ...state };
            newState.localReceipts = localReceipts;
            return newState;
        case UPDATE_REMOTE_RECEIPT:
            let {
                remoteReceiptIndex,
                updatedRemoteFields
            } = action.data;
            newState = { ...state };
            newState.remoteReceipts[remoteReceiptIndex] = { ...newState.remoteReceipts[remoteReceiptIndex], ...updatedRemoteFields, updated: true};
            newState.remoteReceipts[remoteReceiptIndex].receipt_line_items = newState.remoteReceipts[remoteReceiptIndex].receipt_line_items.map(item => {
                item.active = updatedRemoteFields.active;
                return item;
            });
            return newState;
        case UPDATE_RECEIPT_LINE_ITEM:
            let {
                receiptIndex,
                lineItemIndex,
                updatedLineItemFields
            } = action.data;
            newState = { ...state };
            newState.remoteReceipts[receiptIndex] = { ...newState.remoteReceipts[receiptIndex], updated: true, updatedLineItem: true};
            newState.remoteReceipts[receiptIndex].receipt_line_items[lineItemIndex] = { ...newState.remoteReceipts[receiptIndex].receipt_line_items[lineItemIndex], ...updatedLineItemFields};
            return newState;
        case UPDATE_LOCAL_RECEIPT:
            let {
                localReceiptIndex,
                updatedLocalFields
            } = action.data;
            newState = { ...state };
            newState.localReceipts[localReceiptIndex] = { ...newState.localReceipts[localReceiptIndex], ...updatedLocalFields };
            return newState;
        case REMOVE_LOCAL_RECEIPT:
            let {
                receiptId
            } = action.data;
            newState = { ...state };
            newState.remoteReceipts = newState.remoteReceipts.map(receipt => {
                if (receipt.id === receiptId) {
                    receipt.isLocal = false;
                }
                return receipt;
            });
            return newState;
        case CLEAR_LOGGED_RECEIPTS:
            newState = {...initialState};
            return newState;
        default:
            return state;
    }
};

export default receiptReducer;


