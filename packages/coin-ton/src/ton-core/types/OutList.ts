/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


import { SendMode } from "./SendMode";
import {loadMessageRelaxed, MessageRelaxed, storeMessageRelaxed} from "./MessageRelaxed";
import {beginCell, Builder} from "../boc/Builder";
import { Cell } from "../boc/Cell";
import {Slice} from "../boc/Slice";
import {loadStorageInfo, storeStorageInfo} from "./StorageInto";
import {loadAccountStorage, storeAccountStorage} from "./AccountStorage";
import {Account} from "./Account";
import {loadMessage} from "./Message";

export interface OutActionSendMsg {
    type: 'sendMsg',
    mode: SendMode;
    outMsg: MessageRelaxed;
}

export interface OutActionSetCode {
    type: 'setCode',
    newCode: Cell;
}

export type OutAction = OutActionSendMsg | OutActionSetCode;

export function storeOutAction(action: OutAction) {
    switch (action.type) {
        case 'sendMsg':
            return storeOutActionSendMsg(action);
        case 'setCode':
            return storeOutActionSetCode(action);
        default:
            throw new Error(`Unknown action type ${(action as OutAction).type}`)
    }
}

/*
action_send_msg#0ec3c86d mode:(## 8)
  out_msg:^(MessageRelaxed Any) = OutAction;
*/
const outActionSendMsgTag = 0x0ec3c86d;
function storeOutActionSendMsg(action: OutActionSendMsg) {
    return (builder: Builder) => {
        builder.storeUint(outActionSendMsgTag, 32)
            .storeUint(action.mode, 8)
            .storeRef(beginCell().store(storeMessageRelaxed(action.outMsg)).endCell());
    }
}

/*
action_set_code#ad4de08e new_code:^Cell = OutAction;
 */
const outActionSetCodeTag = 0xad4de08e;
function storeOutActionSetCode(action: OutActionSetCode) {
    return (builder: Builder) => {
        builder.storeUint(outActionSetCodeTag, 32).storeRef(action.newCode);
    }
}


export function loadOutAction(slice: Slice): OutAction  {
    const tag = slice.loadUint(32);
    if (tag === outActionSendMsgTag) {
        const mode = slice.loadUint(8);
        const outMsg = loadMessageRelaxed(slice.loadRef().beginParse());

        return {
            type: 'sendMsg',
            mode,
            outMsg
        }
    }

    if (tag === outActionSetCodeTag) {
        const newCode = slice.loadRef();

        return {
            type: 'setCode',
            newCode
        }
    }

    throw new Error(`Unknown out action tag 0x${tag.toString(16)}`);
}



/*
out_list_empty$_ = OutList 0;
out_list$_ {n:#} prev:^(OutList n) action:OutAction
  = OutList (n + 1);
 */
export function storeOutList(actions: OutAction[]) {
    const cell = actions.reduce((cell, action) => beginCell()
            .storeRef(cell)
            .store(storeOutAction(action))
            .endCell(),
        beginCell().endCell()
    );

    return (builder: Builder) => {
        builder.storeSlice(cell.beginParse());
    }
}

export function loadOutList(slice: Slice): OutAction[] {
    const actions: OutAction[] = [];
    while (slice.remainingRefs) {
        const nextCell = slice.loadRef();

        actions.push(loadOutAction(slice));
        slice = nextCell.beginParse();
    }

    return actions.reverse();
}

