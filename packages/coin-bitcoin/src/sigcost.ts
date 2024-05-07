import {REVERSE_OPS} from "./bitcoinjs-lib/ops";
import {Transaction} from "./bitcoinjs-lib";
import {getAddressType} from "./txBuild";
import {base} from "@okxweb3/crypto-lib";
import * as bitcoin from "./bitcoinjs-lib";

export function countScriptSigops(script: string, isRawScript: boolean = false, witness: boolean = false): number {
    if (!script?.length) {
        return 0;
    }

    let sigops = 0;
    // count OP_CHECKSIG and OP_CHECKSIGVERIFY
    sigops += (script.match(/OP_CHECKSIG/g)?.length || 0);

    // count OP_CHECKMULTISIG and OP_CHECKMULTISIGVERIFY
    if (isRawScript) {
        // in scriptPubKey or scriptSig, always worth 20
        sigops += 20 * (script.match(/OP_CHECKMULTISIG/g)?.length || 0);
    } else {
        // in redeem scripts and witnesses, worth N if preceded by OP_N, 20 otherwise
        const matches = script.matchAll(/(?:OP_(?:PUSHNUM_)?(\d+))? OP_CHECKMULTISIG/g);
        for (const match of matches) {
            const n = parseInt(match[1]);
            if (Number.isInteger(n)) {
                sigops += n;
            } else {
                sigops += 20;
            }
        }
    }

    return witness ? sigops : (sigops * 4);
}

export function convertScriptSigAsm(buf: Buffer): string {
    if (buf?.length == 0) {
        return ""
    }
    const b: string[] = [];

    let i = 0;
    while (i < buf.length) {
        const op = buf[i];
        if (op >= 0x01 && op <= 0x4e) {
            i++;
            let push: number;
            if (op === 0x4c) {
                push = buf.readUInt8(i);
                b.push('OP_PUSHDATA1');
                i += 1;
            } else if (op === 0x4d) {
                push = buf.readUInt16LE(i);
                b.push('OP_PUSHDATA2');
                i += 2;
            } else if (op === 0x4e) {
                push = buf.readUInt32LE(i);
                b.push('OP_PUSHDATA4');
                i += 4;
            } else {
                push = op;
                b.push('OP_PUSHBYTES_' + push);
            }

            const data = buf.slice(i, i + push);
            if (data.length !== push) {
                break;
            }

            b.push(data.toString('hex'));
            i += data.length;
        } else {
            if (op === 0x00) {
                b.push('OP_0');
            } else if (op === 0x4f) {
                b.push('OP_PUSHNUM_NEG1');
            } else if (op === 0xb1) {
                b.push('OP_CLTV');
            } else if (op === 0xb2) {
                b.push('OP_CSV');
            } else if (op === 0xba) {
                b.push('OP_CHECKSIGADD');
            } else {
                const opcode = REVERSE_OPS[op];
                if (opcode && op < 0xfd) {
                    if (/^OP_(\d+)$/.test(opcode)) {
                        b.push(opcode.replace(/^OP_(\d+)$/, 'OP_PUSHNUM_$1'));
                    } else {
                        b.push(opcode);
                    }
                } else {
                    b.push('OP_RETURN_' + op);
                }
            }
            i += 1;
        }
    }
    return b.join(' ');
}

export function countAdjustedVsize(transaction: Transaction, addresses: string[], net: bitcoin.Network): number {
    if (transaction == undefined || null) {
        return 0
    }
    if (net == undefined || null) {
        net = bitcoin.networks.bitcoin
    }
    let sigops = 0;
    if ((addresses != undefined || null) && (addresses.length == transaction.ins.length)) {
        transaction.ins.forEach((input, index) => {
            if (input.script != undefined || null) {
                sigops += countScriptSigops(convertScriptSigAsm(input.script), true);
            }
            if (addresses.length <= index || (addresses[index] == undefined || null) || addresses[index] == '') {
                return
            }
            const addressType = getAddressType(addresses[index], net)
            switch (true) {
                case addressType === 'segwit_nested' && input.witness?.length === 2 && input.script && base.toHex(input.script).startsWith('160014'):
                case addressType === 'segwit_native':
                    sigops += 1;
                    break;

                case addressType === 'segwit_nested' && input.witness?.length && input.script && base.toHex(input.script).startsWith('220020'):
                case addressType === 'segwit_native':
                    if (input.witness?.length) {
                        sigops += countScriptSigops(convertScriptSigAsm(input.witness[input.witness.length - 1]), false, true);
                    }
                    break;

                case addressType === 'segwit_nested':
                    if (input.script) {
                        sigops += countScriptSigops(convertScriptSigAsm(input.script));
                    }
                    break;
            }
        })
    }

    for (const output of transaction.outs) {
        if (output) {
            sigops += countScriptSigops(convertScriptSigAsm(output.script), true);
        }
    }
    const vsize = transaction.virtualSize()
    if (vsize > sigops * 5) {
        return vsize
    }
    return sigops * 5;
}
