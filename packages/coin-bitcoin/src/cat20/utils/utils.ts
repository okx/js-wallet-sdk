import {
    BurnGuard,
    CAT20,
    ClosedMinter,
    int32,
    OpenMinter,
    OpenMinterV2,
    ProtocolState,
    TransferGuard,
    TxOutpoint,
} from '@cat-protocol/cat-smartcontracts';

import {btc, MinterType, SupportedNetwork} from '../common';
import {
    bsv,
    ByteString,
    ContractTransaction,
    DummyProvider,
    hash160,
    int2ByteString,
    SmartContract,
    TestWallet,
    toByteString,
    UTXO
} from 'scrypt-ts';

import {Tap} from '@cmdcode/tapscript';
import {randomBytes} from 'crypto';
import Decimal from 'decimal.js';
import {EcKeyService} from "./eckey";

const ISSUE_PUBKEY =
    '0250929b74c1a04954b78b4b6035e97a5e078a5a0f28ec96d547bfee9ace803ac0';

export function toXOnly(pubkey: Buffer): Buffer {
    return pubkey.subarray(1, 33);
}


export const byteStringToBuffer = function (byteStringList: ByteString[]) {
    const bufferList: Buffer[] = [];
    for (const byteString of byteStringList) {
        bufferList.push(Buffer.from(byteString, 'hex'));
    }
    return bufferList;
};

export function strToByteString(s: string) {
    return toByteString(Buffer.from(s, 'utf-8').toString('hex'));
}

export function contract2P2TR(contract: SmartContract): {
    p2tr: string;
    tapScript: string;
    cblock: string;
    script: string,
    contract: SmartContract;
} {
    const script = contract.lockingScript.toBuffer()
    const p2tr = script2P2TR(script);
    return {
        ...p2tr,
        script: script.toString('hex'),
        contract,
    };
}

export function script2P2TR(script: Buffer): {
    p2tr: string;
    tapScript: string;
    cblock: string;
} {
    const tapScript = Tap.encodeScript(script);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [p2tr, cblock] = Tap.getPubKey(ISSUE_PUBKEY, {
        target: tapScript,
    });
    return {
        p2tr: new btc.Script(`OP_1 32 0x${p2tr}}`).toHex(),
        tapScript: tapScript,
        cblock,
    };
}

export enum GuardType {
    Transfer,
    Burn,
}

export function getGuardsP2TR(guardType: GuardType = GuardType.Transfer): {
    p2tr: string;
    tapScript: string;
    cblock: string;
    script: string;
    contract: SmartContract;
} {
    const burnGuard = new BurnGuard();
    const transferGuard = new TransferGuard();
    const tapleafKeyBurnGuard = Tap.encodeScript(
        burnGuard.lockingScript.toBuffer(),
    );
    const tapleafKeyTransferGuard = Tap.encodeScript(
        transferGuard.lockingScript.toBuffer(),
    );

    const tapTree = [tapleafKeyBurnGuard, tapleafKeyTransferGuard];
    const [tpubkeyGuards] = Tap.getPubKey(ISSUE_PUBKEY, {
        tree: tapTree,
    });

    const [, cblockKeyBurnGuard] = Tap.getPubKey(ISSUE_PUBKEY, {
        target: tapleafKeyBurnGuard,
        tree: tapTree,
    });
    const [, cblockKeyTransferGuard] = Tap.getPubKey(ISSUE_PUBKEY, {
        target: tapleafKeyTransferGuard,
        tree: tapTree,
    });

    const p2tr = new btc.Script(`OP_1 32 0x${tpubkeyGuards}}`).toHex();

    if (guardType === GuardType.Transfer) {
        return {
            p2tr,
            tapScript: tapleafKeyTransferGuard,
            cblock: cblockKeyTransferGuard,
            script: transferGuard.lockingScript.toBuffer().toString('hex'),
            contract: transferGuard,
        };
    }
    return {
        p2tr,
        tapScript: tapleafKeyBurnGuard,
        cblock: cblockKeyBurnGuard,
        script: burnGuard.lockingScript.toBuffer().toString('hex'),
        contract: burnGuard,
    };
}

export function getTokenContract(minterP2TR: string, guardsP2TR: string) {
    return new CAT20(minterP2TR, toByteString(guardsP2TR));
}

export function getTokenContractP2TR(minterP2TR: string) {
    const {p2tr: guardsP2TR} = getGuardsP2TR();
    return contract2P2TR(getTokenContract(minterP2TR, guardsP2TR));
}

export function getClosedMinterContract(
    issuerAddress: string,
    genesisId: ByteString,
) {
    return new ClosedMinter(issuerAddress, genesisId);
}

export function getOpenMinterContract(
    genesisId: ByteString,
    max: int32,
    premine: int32,
    limit: int32,
    premineAddress: ByteString,
    minterMd5: string = MinterType.OPEN_MINTER_V2,
) {
    if (minterMd5 === MinterType.OPEN_MINTER_V1) {
        return new OpenMinter(genesisId, max, premine, limit, premineAddress);
    }
    const maxCount = max / limit;
    const premineCount = premine / limit;
    return new OpenMinterV2(
        genesisId,
        maxCount,
        premine,
        premineCount,
        limit,
        premineAddress,
    );
}

export function getOpenMinterContractP2TR(
    genesisId: ByteString,
    max: int32,
    premine: int32,
    limit: int32,
    premineAddress: ByteString,
    minterMd5: string,
) {
    return contract2P2TR(
        getOpenMinterContract(
            genesisId,
            max,
            premine,
            limit,
            premineAddress,
            minterMd5,
        ),
    );
}

export function getClosedMinterContractP2TR(
    issuerAddress: string,
    genesisId: ByteString,
) {
    return contract2P2TR(getClosedMinterContract(issuerAddress, genesisId));
}

export function toTxOutpoint(txid: string, outputIndex: number): TxOutpoint {
    const outputBuf = Buffer.alloc(4, 0);
    outputBuf.writeUInt32LE(outputIndex);
    return {
        txhash: Buffer.from(txid, 'hex').reverse().toString('hex'),
        outputIndex: outputBuf.toString('hex'),
    };
}

export function outpoint2TxOutpoint(outpoint: string): TxOutpoint {
    const [txid, vout] = outpoint.split('_');
    return toTxOutpoint(txid, parseInt(vout));
}

export const outpoint2ByteString = function (outpoint: string) {
    const txOutpoint = outpoint2TxOutpoint(outpoint);
    return txOutpoint.txhash + txOutpoint.outputIndex;
};

export function getDummySigner(
    privateKey?: bsv.PrivateKey | bsv.PrivateKey[],
): TestWallet {
    return new TestWallet(
        bsv.PrivateKey.fromWIF(
            'cRn63kHoi3EWnYeT4e8Fz6rmGbZuWkDtDG5qHnEZbmE5mGvENhrv',
        ),
        new DummyProvider(),
    );
}

export const dummyUTXO = {
    txId: randomBytes(32).toString('hex'),
    outputIndex: 0,
    script: '', // placeholder
    satoshis: 10000,
};

export function getDummyUTXO(satoshis: number = 10000, unique = false): UTXO {
    if (unique) {
        return Object.assign({}, dummyUTXO, {
            satoshis,
            txId: randomBytes(32).toString('hex'),
        });
    }
    return Object.assign({}, dummyUTXO, {satoshis});
}

export const callToBufferList = function (ct: ContractTransaction) {
    const callArgs = ct.tx.inputs[ct.atInputIndex].script.chunks.map((value) => {
        if (!value.buf) {
            if (value.opcodenum >= 81 && value.opcodenum <= 96) {
                const hex = int2ByteString(BigInt(value.opcodenum - 80));
                return Buffer.from(hex, 'hex');
            } else {
                return Buffer.from(toByteString(''));
            }
        }
        return value.buf;
    });
    return callArgs;
};

export const toStateScript = function (state: ProtocolState) {
    return new btc.Script(`6a1863617401${state.hashRoot}`);
};

export function toBitcoinNetwork(network: SupportedNetwork): btc.Network {
    if (network === 'btc-signet') {
        return btc.Networks.testnet;
    } else if (network === 'fractal-mainnet' || 'fractal-testnet') {
        return btc.Networks.mainnet;
    } else {
        throw new Error(`invalid network ${network}`);
    }
}

export function p2tr2Address(
    p2tr: string | btc.Script,
    network: SupportedNetwork,
) {
    const script = typeof p2tr === 'string' ? btc.Script.fromHex(p2tr) : p2tr;
    return btc.Address.fromScript(script, toBitcoinNetwork(network)).toString();
}

export function toP2tr(address: string | btc.Address): string {
    const p2trAddress =
        typeof address === 'string' ? btc.Address.fromString(address) : address;

    if (p2trAddress.type !== 'taproot') {
        throw new Error(`address ${address} is not taproot`);
    }

    return btc.Script.fromAddress(address).toHex();
}

export function scaleByDecimals(amount: bigint, decimals: number) {
    return amount * BigInt(Math.pow(10, decimals));
}

export function unScaleByDecimals(amount: bigint, decimals: number): string {
    return new Decimal(amount.toString().replace('n', ''))
        .div(Math.pow(10, decimals))
        .toFixed(decimals);
}

export function resetTx(tx: btc.Transaction) {
    for (let i = 0; i < tx.inputs.length; i++) {
        const input = tx.inputs[i];
        if (input.hasWitnesses()) {
            input.setWitnesses([]);
        }
    }
    tx.nLockTime = 0;
}

export function toTokenAddress(address: btc.Address | string): string {
    if (typeof address === 'string') {
        address = btc.Address.fromString(address);
    }
    if (address.type === btc.Address.PayToTaproot) {
        return hash160(address.hashBuffer.toString('hex'));
    } else if (address.type === btc.Address.PayToWitnessPublicKeyHash) {
        return address.hashBuffer.toString('hex');
    } else {
        throw new Error(`Unsupported address type: ${address.type}`);
    }
}

export function verifyContract(
    utxo: UTXO,
    tx: btc.Transaction,
    inputIndex: number,
    witnesses: Buffer[],
): string | true {
    const interpreter = new btc.Script.Interpreter();
    const flags =
        btc.Script.Interpreter.SCRIPT_VERIFY_WITNESS
        | btc.Script.Interpreter.SCRIPT_VERIFY_TAPROOT;
    const res = interpreter.verify(
        new btc.Script(''),
        new btc.Script(utxo.script),
        tx,
        inputIndex,
        flags,
        witnesses,
        utxo.satoshis,
    );
    if (!res) {
        return interpreter.errstr;
    }
    return true;
}

export function getDummyEcKey(){
    return new EcKeyService({privateKey: 'L4EpxBBbTqztn8Q9W73Cf7e36ttHhDWRSzr4sHazjUcCrucwEJLy'})
}
export function getFee(tx: btc.Transaction){
    return tx.inputs.reduce((acc: number, i: any) => acc + i.output.satoshis, 0)
        - tx.outputs.reduce((acc: number, o: any) => acc + o.satoshis, 0)
}
