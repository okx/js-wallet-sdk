import {
    Cardano,
    coalesceValueQuantities,
    Serialization,
} from '@cardano-sdk/core';
import {
    computeMinimumCost,
    createTransactionInternals,
    minAdaRequired,
} from '@cardano-sdk/tx-construction';
import { Selection } from '@cardano-sdk/input-selection';
import * as Crypto from '@cardano-sdk/crypto';
import { HexBlob } from '@cardano-sdk/util';
import { DefaultMainnetProtocolParameters } from './parameters';
import { base } from '@okxweb3/coin-base';

export type MultiAssetData = {
    policyId: string;
    assets: {
        assetName: string;
        amount: string;
    }[];
}[];

export type TxInput = {
    txId: string;
    index: number;
    address: string;
    amount: string;
    multiAsset?: MultiAssetData;
    privateKey?: string;
};

export type TxData = {
    inputs: TxInput[];
    address: string;
    amount: string;
    multiAsset?: MultiAssetData;
    changeAddress: string;
    fee?: string;
    ttl?: string;
    type?: string;
    tx?: string;
    privateKey?: string;
    max?: boolean; // When true, first output receives maximum ADA
};

export type MinFeeData = {
    valid: boolean; // Whether transaction has sufficient funds
    fee: string; // Calculated fee in lovelace
    change: string; // Multi-asset change output ADA (0 if no MA change)
};

export type SelectionResult = {
    selection: Selection;
    valid: boolean;
    maChangeAda: bigint;
};

export function getMultiAsset(multiAsset?: MultiAssetData) {
    const assets = new Map<Cardano.AssetId, Cardano.Lovelace>();
    // Add multi-assets to the output if present
    if (multiAsset && multiAsset.length > 0) {
        for (const policy of multiAsset) {
            for (const asset of policy.assets) {
                const assetId = Cardano.AssetId(
                    `${policy.policyId}${asset.assetName}`
                );
                assets.set(assetId, BigInt(asset.amount));
            }
        }
    }
    return assets;
}

export function getUtxos(inputs: TxInput[]): Cardano.Utxo[] {
    // Convert inputs to Cardano.Utxo format
    return inputs.map((input) => {
        // Create basic UTXO with ADA amount
        const value: Cardano.Value = {
            coins: BigInt(input.amount),
        };

        const assets = getMultiAsset(input.multiAsset);
        if (assets.size > 0) {
            value.assets = assets;
        }

        return [
            {
                txId: Cardano.TransactionId(input.txId),
                index: input.index,
                address: Cardano.PaymentAddress(input.address),
            },
            {
                address: Cardano.PaymentAddress(input.address),
                value,
            },
        ] as Cardano.Utxo;
    });
}

export function hasSufficientAda(output: Cardano.TxOut) {
    const requiredAda = minAdaRequired(
        output,
        BigInt(DefaultMainnetProtocolParameters.coinsPerUtxoByte)
    );
    return output.value.coins >= requiredAda;
}

/**
 * Calculate remaining assets after output (input assets - output assets)
 */
export function calculateChangeAssets(
    utxos: Cardano.Utxo[],
    outputAssets?: Map<Cardano.AssetId, bigint>
): Map<Cardano.AssetId, bigint> {
    const changeAssets = new Map<Cardano.AssetId, bigint>();

    // Sum all input assets
    for (const utxo of utxos) {
        const assets = utxo[1].value.assets;
        if (assets) {
            for (const [assetId, qty] of assets.entries()) {
                changeAssets.set(
                    assetId,
                    (changeAssets.get(assetId) ?? 0n) + qty
                );
            }
        }
    }

    // Subtract output assets
    if (outputAssets) {
        for (const [assetId, qty] of outputAssets.entries()) {
            const remaining = (changeAssets.get(assetId) ?? 0n) - qty;
            if (remaining < 0n) {
                throw new Error(`not enough input assets ${assetId}`);
            }
            if (remaining === 0n) {
                changeAssets.delete(assetId);
            } else {
                changeAssets.set(assetId, remaining);
            }
        }
    }

    return changeAssets;
}

/**
 * Build multi-asset change output if there are leftover tokens.
 * @returns TxOut or undefined if no token change
 */
export function buildMultiAssetChangeOutput(
    changeAddress: string,
    changeAssets: Map<Cardano.AssetId, bigint>
): Cardano.TxOut | undefined {
    if (changeAssets.size === 0) {
        return undefined;
    }

    const output: Cardano.TxOut = {
        address: Cardano.PaymentAddress(changeAddress),
        value: {
            coins: 0n,
            assets: changeAssets,
        },
    };

    const minAda = minAdaRequired(
        output,
        BigInt(DefaultMainnetProtocolParameters.coinsPerUtxoByte)
    );
    output.value.coins = minAda;

    return output;
}

export async function signTxBody(
    txBody: Serialization.TransactionBody,
    auxilaryData?: Serialization.AuxiliaryData,
    privKey?: string
): Promise<Serialization.Transaction> {
    const txHash = HexBlob(txBody.hash());

    let publicKey = new Crypto.Ed25519PublicKey(Buffer.alloc(32));
    let signature = new Crypto.Ed25519Signature(Buffer.alloc(64));

    if (privKey) {
        await Crypto.ready();
        const privateKey = Crypto.Ed25519PrivateKey.fromExtendedBytes(
            base.fromHex(privKey.toLowerCase()).slice(0, 64) // payment key
        );
        publicKey = privateKey.toPublic();
        signature = privateKey.sign(txHash);
    }

    const vKeys = Serialization.CborSet.fromCore(
        [[publicKey.hex(), signature.hex()]],
        Serialization.VkeyWitness.fromCore
    );
    const witnessSet = new Serialization.TransactionWitnessSet();
    witnessSet.setVkeys(vKeys);

    // Create a transaction with body and witness set
    return new Serialization.Transaction(txBody, witnessSet, auxilaryData);
}

export function makeSelectionResult(
    selection: Selection,
    maChangeAda: bigint,
    fee: bigint,
    valid: boolean
): SelectionResult {
    selection.fee = fee;
    return { selection, valid, maChangeAda };
}

export async function calcSelectionMinFee(
    selection: Selection,
    ttl?: string,
    privateKey?: string
): Promise<bigint> {
    const buildTx = async (sel: any) => {
        const txBody = createTransactionInternals({
            inputSelection: sel,
            validityInterval: {
                invalidHereafter: ttl
                    ? Cardano.Slot(parseInt(ttl))
                    : undefined,
            },
        });
        const tx = await signTxBody(
            Serialization.TransactionBody.fromCore(txBody.body),
            undefined,
            privateKey
        );
        return tx.toCore();
    };
    return (
        await computeMinimumCost(
            DefaultMainnetProtocolParameters,
            buildTx,
            { evaluate: () => Promise.resolve([]) },
            {}
        )(selection)
    ).fee;
}

export async function finalizeWithoutAdaChange(
    selection: Selection,
    maChangeAda: bigint,
    changeAda: bigint,
    machgOutput: Cardano.TxOut | undefined,
    ttl?: string,
    privateKey?: string
): Promise<SelectionResult> {
    const minFee = await calcSelectionMinFee(selection, ttl, privateKey);
    if (changeAda < minFee) {
        return makeSelectionResult(selection, maChangeAda, minFee, false);
    }

    if (machgOutput) {
        // Add extra ADA to multi-asset change output (sender gets it back)
        machgOutput.value.coins += changeAda - minFee;
        return makeSelectionResult(selection, maChangeAda, minFee, true);
    } else {
        // No machg to receive extra ADA, burn as fee
        return makeSelectionResult(selection, maChangeAda, changeAda, true);
    }
}

export async function getSelection(
    txData: TxData
): Promise<{ selection: Selection; valid: boolean; maChangeAda: bigint }> {
    const utxoToSpend = getUtxos(txData.inputs);

    const totalInputAda = txData.inputs.reduce(
        (acc, input) => acc + BigInt(input.amount),
        0n
    );
    const outputAda = txData.max ? 0n : BigInt(txData.amount);

    const output: Cardano.TxOut = {
        address: Cardano.PaymentAddress(txData.address),
        value: {
            coins: outputAda,
        },
    };
    const outputAssets = getMultiAsset(txData.multiAsset);
    if (outputAssets.size > 0) {
        output.value.assets = outputAssets;
    }

    // Validate output minAda (skip for max mode - will be set later)
    if (!txData.max) {
        if (!hasSufficientAda(output)) {
            throw new Error('not enough ada for output');
        }
        if (totalInputAda < outputAda) {
            throw new Error('not enough input ada');
        }
    }

    const changeAssets = calculateChangeAssets(
        utxoToSpend,
        output.value.assets
    );

    let changeAda = totalInputAda - outputAda;
    let maChangeAda = 0n;
    let minFee = 300000n;

    const selection: Selection = {
        change: [],
        fee: 300000n,
        inputs: new Set([...utxoToSpend]),
        outputs: new Set([output]),
    };

    const makeResult = (fee: bigint, valid: boolean) =>
        makeSelectionResult(selection, maChangeAda, fee, valid);

    const calcMinFee = () => calcSelectionMinFee(selection, txData.ttl, txData.privateKey);

    const machgOutput = buildMultiAssetChangeOutput(
        txData.changeAddress,
        changeAssets
    );
    if (machgOutput) {
        maChangeAda = machgOutput.value.coins;
        changeAda -= machgOutput.value.coins;
        selection.outputs.add(machgOutput);

        if (changeAda < 0n) {
            minFee = await calcMinFee();
            return makeResult(minFee, false);
        }
    }

    // === MAX MODE ===
    if (txData.max) {
        output.value.coins = changeAda;
        minFee = await calcMinFee();

        const maxAda = changeAda - minFee;
        if (maxAda <= 0n) {
            return makeResult(minFee, false);
        }

        output.value.coins = maxAda;

        if (!hasSufficientAda(output)) {
            return makeResult(minFee, false);
        }

        return makeResult(minFee, true);
    }

    const adachgOutput: Cardano.TxOut = {
        address: Cardano.PaymentAddress(txData.changeAddress),
        value: { coins: changeAda },
    };

    if (!hasSufficientAda(adachgOutput)) {
        // ADA change too small for own output - finalize without it
        return await finalizeWithoutAdaChange(
            selection,
            maChangeAda,
            changeAda,
            machgOutput,
            txData.ttl,
            txData.privateKey
        );
    }

    selection.change.push(adachgOutput);
    minFee = await calcMinFee();

    if (changeAda > minFee) {
        adachgOutput.value.coins = changeAda - minFee;

        if (hasSufficientAda(adachgOutput)) {
            return makeResult(minFee, true);
        }
    }

    // ADA change insufficient after fee - remove it and finalize
    selection.change = [];
    return await finalizeWithoutAdaChange(
        selection,
        maChangeAda,
        changeAda,
        machgOutput,
        txData.ttl,
        txData.privateKey
    );
}

export async function buildTx(txData: TxData) {
    const { selection, valid } = await getSelection(txData);
    if (!valid) {
        throw new Error(`not enough input ada`);
    }

    const tx = createTransactionInternals({
        inputSelection: selection,
        validityInterval: {
            invalidHereafter: txData.ttl
                ? Cardano.Slot(parseInt(txData.ttl))
                : undefined,
        },
    });

    return Serialization.TransactionBody.fromCore(tx.body);
}

export async function transfer(txData: TxData, privateKey?: string) {
    const txBodyWithHash = await buildTx(txData);
    const privKey =
        privateKey ??
        txData.privateKey ??
        txData.inputs.find((input) => input.privateKey)?.privateKey;
    const transaction = await signTxBody(txBodyWithHash, undefined, privKey);
    return base.toBase64(base.fromHex(transaction.toCbor()));
}

export async function calcTxHash(txData: string | TxData) {
    if (typeof txData === 'string') {
        txData = base.toHex(base.fromBase64(txData));
        const tx = Serialization.Transaction.fromCbor(
            Serialization.TxCBOR(txData)
        );
        return tx.getId().toString();
    } else {
        const txBody = await buildTx(txData);
        return txBody.hash().toString();
    }
}

export async function calcMinAda(address: string, multiAsset?: MultiAssetData) {
    const assets = getMultiAsset(multiAsset);
    const output: Cardano.TxOut = {
        address: Cardano.PaymentAddress(address),
        value: {
            coins: BigInt('1000000'),
        },
    };
    if (assets.size > 0) {
        output.value.assets = assets;
    }
    return minAdaRequired(
        output,
        BigInt(DefaultMainnetProtocolParameters.coinsPerUtxoByte)
    ).toString();
}

export async function calcMinFee(txData: TxData): Promise<MinFeeData> {
    const { selection, valid, maChangeAda } = await getSelection(txData);
    return {
        valid,
        fee: selection.fee.toString(),
        change: maChangeAda.toString(),
    };
}

export async function signTx(tx: string, privateKey: string) {
    const transaction = Serialization.Transaction.fromCbor(
        Serialization.TxCBOR(tx)
    );

    const signedTx = await signTxBody(
        transaction.body(),
        transaction.auxiliaryData(),
        privateKey
    );
    return signedTx.witnessSet().toCbor();
}

// reference: https://github.com/input-output-hk/cardano-js-sdk/blob/17add5a25bceebc2eb0440fb39c9a544971efe18/packages/wallet/src/cip30.ts#L128-L148
export function filterUtxos(utxos: Cardano.Utxo[], target: Cardano.Value) {
    const selectedUtxos: Cardano.Utxo[] = [];
    const filterAmountAssets = [...(target.assets?.entries() || [])];
    let foundEnough = false;
    for (const utxo of utxos) {
        selectedUtxos.push(utxo);
        const selectedValue = coalesceValueQuantities(
            selectedUtxos.map(([_, { value }]) => value)
        );
        foundEnough =
            selectedValue.coins >= target.coins &&
            filterAmountAssets.every(
                ([assetId, requestedQuantity]) =>
                    (selectedValue.assets?.get(assetId) || 0n) >=
                    requestedQuantity
            );
        if (foundEnough) {
            break;
        }
    }
    if (!foundEnough) {
        return [];
    }
    return selectedUtxos;
}

export function getFilteredUtxos(txInputs: TxInput[], filterCbor?: string) {
    let utxos = getUtxos(txInputs);
    if (filterCbor) {
        const val = Serialization.Value.fromCbor(HexBlob(filterCbor)).toCore();
        utxos = filterUtxos(utxos, val);
    }
    return utxos.map((utxo) =>
        Serialization.TransactionUnspentOutput.fromCore(utxo)
            .toCbor()
            .toString()
    );
}

export function getBalance(txInputs: TxInput[]) {
    let utxos = getUtxos(txInputs);
    const value = coalesceValueQuantities(utxos.map(([_, { value }]) => value));
    return Serialization.Value.fromCore(value).toCbor().toString();
}

export function getNetworkId(txCbor: string) {
    const tx = Serialization.Transaction.fromCbor(Serialization.TxCBOR(txCbor));
    let networkId = tx.body().networkId();
    if (networkId === undefined) {
        networkId = tx.body().outputs()[0].address().getNetworkId().valueOf();
    }
    return networkId.valueOf();
}

export function getTxFee(txCbor: string) {
    const tx = Serialization.Transaction.fromCbor(Serialization.TxCBOR(txCbor));
    return tx.body().fee().toString();
}
