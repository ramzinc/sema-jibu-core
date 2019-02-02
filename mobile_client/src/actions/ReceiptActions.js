import PosStorage from "../database/PosStorage";

export const SET_REMOTE_RECEIPTS = 'SET_REMOTE_RECEIPTS';
export const ADD_REMOTE_RECEIPT = 'ADD_REMOTE_RECEIPT';
export const SET_LOCAL_RECEIPTS = 'SET_LOCAL_RECEIPTS';
export const UPDATE_REMOTE_RECEIPT = 'UPDATE_REMOTE_RECEIPT';
export const UPDATE_LOCAL_RECEIPT = 'UPDATE_LOCAL_RECEIPT';
export const UPDATE_RECEIPT_LINE_ITEM = 'UPDATE_RECEIPT_LINE_ITEM';
export const REMOVE_LOCAL_RECEIPT = 'REMOVE_LOCAL_RECEIPT';
export const CLEAR_LOGGED_RECEIPTS = 'CLEAR_LOGGED_RECEIPTS';

export function setRemoteReceipts(remoteReceipts) {
    console.log("setRemoteReceipts - action");
    return (dispatch) => { dispatch({ type: SET_REMOTE_RECEIPTS, data: { remoteReceipts } }) };
}

export function addRemoteReceipt(receipt) {
    console.log('addRemoteReceipt - action');
    return dispatch => { dispatch({ type: ADD_REMOTE_RECEIPT, data: { receipt } }) };
}

export function clearLoggedReceipts(receipt) {
    console.log('clearLoggedReceipts - action');
    return dispatch => { dispatch({ type: CLEAR_LOGGED_RECEIPTS, data: {} }) };
}

export function setLocalReceipts(localReceipts) {
    console.log('setLocalReceipts - action');
    return dispatch => { dispatch({ type: SET_LOCAL_RECEIPTS, data: { localReceipts } }) };
}

export function removeLocalReceipt(receiptId) {
    console.log(`removeLocalReceipt - action ${receiptId}`);
    return dispatch => { dispatch({ type: REMOVE_LOCAL_RECEIPT, data: { receiptId } }) };
}

export function updateRemoteReceipt(receiptIndex, updatedFields) {
    console.log('updateRemoteReceipt - action');
    return dispatch => {
        dispatch({
            type: UPDATE_REMOTE_RECEIPT,
            data: {
                remoteReceiptIndex: receiptIndex,
                updatedRemoteFields: updatedFields
            }
        })
    };
}

export function updateReceiptLineItem(receiptIndex, lineItemIndex, updatedFields) {
    console.log('updateRemoteReceipt - action');
    return dispatch => {
        dispatch({
            type: UPDATE_RECEIPT_LINE_ITEM,
            data: {
                receiptIndex,
                lineItemIndex,
                updatedLineItemFields: updatedFields
            }
        })
    };
}

// export function updateLocalReceipt(item, updatedFields) {
//     console.log('updateLocalReceipt - action');

//     PosStorage._loadPendingSale(item.id).then((sale) => {
//         return ({ key: item.id, sale });
//     })
//         .then(receipt => {
//             const saleData = {
//                 key: item.id,
//                 sale: {
//                     ...receipt.sale,
//                     ...updatedFields
//                 }
//             }

//             PosStorage.updatePendingSale(item.id, saleData);
//         });

//     return dispatch => {
//         dispatch({
//             type: UPDATE_LOCAL_RECEIPT,
//             data: {
//                 localReceiptIndex: item.index,
//                 updatedLocalFields: updatedFields
//             }
//         })
//     };
// }