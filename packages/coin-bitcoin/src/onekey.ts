import {utxoInput, utxoOutput, utxoTx} from "./type";
import {Transaction} from "./bitcoinjs-lib";
import {reverseBuffer} from "./bitcoinjs-lib/bufferutils";
import {base} from "@okxweb3/crypto-lib";
import {convert2UtxoTx, number2Hex} from "./wallet";
import {getAddressType, signBtc} from "./txBuild";
import {bitcoin, Network} from "./bitcoinjs-lib/networks";

type Input = {
    address_n: number[]
    prev_index: number
    prev_hash: string
    amount: string
    script_type: string
}

type Output = {
    address_n?: number[]
    address?: string
    amount: string
    script_type: string
    op_return_data?: string
}

type RefInput = {
    prev_hash: string
    prev_index: number
    script_sig: string
    sequence: number
}

type RefOutput = {
    amount: number
    script_pubkey: string
}

type RefTx = {
    hash: string
    inputs: RefInput[]
    bin_outputs: RefOutput[]
    lock_time: number
    version: number
}

export type OneKeyBtcTx = {
    inputs: Input[]
    outputs: Output[]
    refTxs: RefTx[]
    coin: string
}

const addressTypeToOneKeyInputScriptType = {
    "legacy": "SPENDADDRESS",
    "segwit_native": "SPENDWITNESS",
    "segwit_nested": "SPENDP2SHWITNESS",
    "segwit_taproot": "SPENDTAPROOT",
};

const addressTypeToOneKeyOutputScriptType = {
    "legacy": "PAYTOADDRESS",
    "segwit_native": "PAYTOWITNESS",
    "segwit_nested": "PAYTOP2SHWITNESS",
    "segwit_taproot": "PAYTOTAPROOT",
};

export function oneKeyBuildBtcTx(txData: utxoTx, network: Network = bitcoin): OneKeyBtcTx {
    const tx = convert2UtxoTx(txData);
    if (tx.omni) {
        const coinType = number2Hex(tx.omni.coinType || 31, 8);
        const amount = number2Hex(tx.omni.amount, 16);
        const omniScript = "6f6d6e69" + "0000" + "0000" + coinType + amount;
        tx.outputs.push({
            address: "",
            amount: 0,
            omniScript,
        } as never);
    }
    const changeAmount = parseInt(signBtc(tx, "", network, undefined, true, true));
    const dustSize = txData.dustSize || 546;
    if (changeAmount >= dustSize) {
        tx.outputs.push({
            address: tx.address,
            amount: changeAmount,
            derivationPath: tx.derivationPath,
            isChange: true,
        } as never);
    }

    const inputs: Input[] = [];
    const refTxs: RefTx[] = [];
    tx.inputs.forEach((input: utxoInput) => {
        const address_n = parseDerivationPath(input.derivationPath!);
        inputs.push({
            address_n,
            prev_hash: input.txId,
            prev_index: input.vOut,
            amount: input.amount.toString(),
            script_type: addressTypeToOneKeyInputScriptType[getAddressType(input.address!, network)],
        });

        refTxs.push(parseRefTx(input.nonWitnessUtxo!, input.txId));
    });

    const outputs: Output[] = [];
    tx.outputs.forEach((output: utxoOutput) => {
        if (output.isChange) {
            outputs.push({
                address_n: parseDerivationPath(output.derivationPath!),
                amount: output.amount.toString(),
                script_type: addressTypeToOneKeyOutputScriptType[getAddressType(output.address, network)],
            });
        } else if (output.omniScript) {
            outputs.push({
                amount: "0",
                op_return_data: output.omniScript,
                script_type: "PAYTOOPRETURN",
            });
        } else {
            outputs.push({
                address: output.address,
                amount: output.amount.toString(),
                script_type: "PAYTOADDRESS",
            });
        }
    });

    return {
        inputs: inputs,
        outputs: outputs,
        refTxs: refTxs,
        coin: "btc",
    };
}

function parseRefTx(rawTx: string, txId: string): RefTx {
    const transaction = Transaction.fromHex(rawTx);

    const refInputs: RefInput[] = [];
    transaction.ins.forEach(input => {
        refInputs.push({
            prev_hash: base.toHex(reverseBuffer(input.hash)),
            prev_index: input.index,
            script_sig: base.toHex(input.script),
            sequence: input.sequence,
        });
    });

    const refOutputs: RefOutput[] = [];
    transaction.outs.forEach(output => {
        refOutputs.push({
            amount: output.value,
            script_pubkey: base.toHex(output.script),
        });
    });

    return {
        hash: txId,
        inputs: refInputs,
        bin_outputs: refOutputs,
        lock_time: transaction.locktime,
        version: transaction.version,
    };
}

function parseDerivationPath(path: string): number[] {
    let splitPath = path.split('/');
    if (splitPath[0] === 'm') {
        splitPath = splitPath.slice(1);
    }
    const address_n: number[] = [];
    splitPath.forEach(indexStr => {
        let index;
        if (indexStr.slice(-1) === `'`) {
            index = harden(parseInt(indexStr.slice(0, -1), 10));
        } else {
            index = parseInt(indexStr, 10);
        }
        address_n.push(index);
    });

    return address_n;
}

function harden(num: number) {
    return 0x80000000 + num;
}
