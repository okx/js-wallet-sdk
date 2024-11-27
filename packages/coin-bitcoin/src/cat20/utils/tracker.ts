import {btc, MinterType, OpenMinterTokenInfo, SupportedNetwork} from "../common";
import {script2P2TR, toP2tr, toTokenAddress} from "./utils";
import {scaleConfig, tokenInfoParse} from "./paramsUtils";
import {byteString2Int} from "scrypt-ts";

export type State = {address: string, amount: string}

// additional functionality to get key state information from witness data as used in tracker
export function getTokenUtxo(txhex:string, operation: string, address?: string) {

    const tx = new btc.Transaction(txhex);
    let indexes: number[] = []
    let states: State[] = []
    let txoStateHashes : Buffer[]
    if (operation == 'transfer') {
        const witness = tx.inputs[1].witnesses
        const addrHash = toTokenAddress(address)

        // following packages/tracker/src/services/tx/tx.service.ts
        const stateHashes = witness.slice(0, 5);
        const ownerPubKeyHashes = witness.slice(5, 10);
        const tokenAmounts = witness.slice(10, 15);

        for (let i = 0; i < 5; i++) {
            const ownerPubKeyHash = ownerPubKeyHashes[i].toString('hex');
            if (ownerPubKeyHash != addrHash) {
                continue
            }

            indexes.push(i + 1)
            const tokenAmount = tokenAmounts[i]
            if (tokenAmount.length == 0) {
                continue
            }
            states.push({
                address: ownerPubKeyHash,
                amount: tokenAmount.readIntLE(0, tokenAmount.length).toString()
            })
        }
        txoStateHashes =stateHashes.map((s: Buffer) => s.toString('hex'))
    } else if (operation == 'mint') {
        const witness = tx.inputs[0].witnesses
        const stateHashes = witness.slice(0, 5);
        const ownerPubKeyHash = witness[5];
        const tokenAmount = witness[6];

        states.push({
            address: ownerPubKeyHash.toString('hex'),
            amount: tokenAmount.readIntLE(0, tokenAmount.length).toString()
        })

        txoStateHashes =stateHashes.map((s: Buffer) => s.toString('hex'))
        indexes.push(tx.outputs.findIndex((o: btc.Transaction.Output) => o.satoshis == 330))
    }

    return states.map((state, i) => {
        const outputIndex = indexes[i]
        return {
            utxo: {
                txId: tx.id,
                outputIndex,
                script: tx.outputs[outputIndex].script.toHex(),
                satoshis: tx.outputs[outputIndex].satoshis,
            },
            txoStateHashes,
            state,
        }
    })
}

export function getMintRemainingSupply(txhex: string, tokenMetadata: string, vout: number) {
    const metadata = tokenInfoParse(tokenMetadata, SupportedNetwork.fractalMainnet)
    const info = metadata.info as OpenMinterTokenInfo;
    const scaledInfo = scaleConfig(info);
    const minterP2TR = toP2tr(metadata.minterAddr);
    const tx = new btc.Transaction(txhex);

    if (tx.id === metadata.revealTxid) {
        if (metadata.info.minterMd5 == MinterType.OPEN_MINTER_V2) {
            return scaledInfo.max / scaledInfo.limit
        }
        return scaledInfo.max
    }

    for (let i = 0; i < tx.inputs.length; i++) {
        const witnesses = tx.inputs[i].getWitnesses();

        if (witnesses.length > 2) {
            const lockingScriptBuffer = witnesses[witnesses.length - 2];
            const {p2tr} = script2P2TR(lockingScriptBuffer);
            if (p2tr === minterP2TR) {
                return byteString2Int(witnesses[6 + vout].toString('hex'))
            }
        }
    }
}
