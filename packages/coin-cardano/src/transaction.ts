import { base } from "@okxweb3/crypto-lib";
import Loader from "./libs/loader";

export type MultiAssetData = {
    policyId: string
    assets: {
        assetName: string
        amount: string
    }[]
}[];

export type TxInput = {
    txId: string
    index: number
    address: string
    amount: string
    multiAsset?: MultiAssetData
    privateKey: string
};

export type TxData = {
    inputs: TxInput[]
    address: string
    amount: string
    multiAsset?: MultiAssetData
    changeAddress: string
    fee?: string
    ttl?: string
    type?: string
    tx?: string
    privateKey?: string
};

export async function transfer(txData: TxData) {
    await Loader.load();
    // @ts-ignore
    const { hash_transaction, TransactionWitnessSet, Vkeywitnesses, PrivateKey, make_vkey_witness, Transaction } = Loader.Cardano;

    const tx = await buildTx(txData);

    const txHash = hash_transaction(tx.body());
    const witnesses = TransactionWitnessSet.new();

    const vkeyWitnesses = Vkeywitnesses.new();
    const privateKeySet = new Set<string>();
    txData.inputs.forEach(input => privateKeySet.add(input.privateKey));
    privateKeySet.forEach(privateKey => {
        const prvKey = PrivateKey.from_extended_bytes(base.fromHex(privateKey.slice(0, 128)));
        const vkeyWitness = make_vkey_witness(txHash, prvKey);
        vkeyWitnesses.add(vkeyWitness);
    });

    witnesses.set_vkeys(vkeyWitnesses);
    const transaction = Transaction.new(
        tx.body(),
        witnesses,
        undefined, // transaction metadata
    );

    return base.toBase64(transaction.to_bytes());
}

async function getMultiAsset(data: MultiAssetData) {
    await Loader.load();
    // @ts-ignore
    const { MultiAsset, Assets, AssetName, BigNum, ScriptHash } = Loader.Cardano;

    const multiAsset = MultiAsset.new();

    if (data) {
        data.forEach(item => {
            const assets = Assets.new();
            item.assets.forEach(asset => {
                assets.insert(
                    AssetName.new(base.fromHex(asset.assetName)),
                    BigNum.from_str(asset.amount),
                );
            });

            multiAsset.insert(ScriptHash.from_hex(item.policyId), assets);
        });
    }

    return multiAsset;
}

async function getTxBuilder(txData: TxData) {
    await Loader.load();
    // @ts-ignore
    const { TransactionBuilderConfigBuilder, LinearFee, BigNum, TransactionBuilder, Value, Address, TransactionInput, TransactionHash, TransactionOutput, ExUnits, ExUnitPrices, TransactionUnspentOutput } = Loader.Cardano;

    const txBuilderCfg = TransactionBuilderConfigBuilder.new()
        .fee_algo(LinearFee.new(BigNum.from_str('44'), BigNum.from_str('155381')))
        .pool_deposit(BigNum.from_str('500000000'))
        .key_deposit(BigNum.from_str('2000000'))
        .max_value_size(5000)
        .max_tx_size(16384)
        .coins_per_utxo_byte(BigNum.from_str('4310'))
        .collateral_percentage(150)
        .max_collateral_inputs(3)
        .max_tx_ex_units(ExUnits.new(BigNum.from_str('14000000'), BigNum.from_str('10000000000')))
        .ex_unit_prices(ExUnitPrices.from_float(5.77e-2, 7.21e-5))
        .build();

    const txBuilder = TransactionBuilder.new(txBuilderCfg);

    for (const input of txData.inputs) {
        const value = Value.new(BigNum.from_str(input.amount));
        if (input.multiAsset) {
            value.set_multiasset(await getMultiAsset(input.multiAsset));
        }
        txBuilder.add_input(
            TransactionUnspentOutput.new(
                TransactionInput.new(
                    TransactionHash.from_hex(input.txId),
                    BigNum.from_str(input.index.toString()),
                ),
                TransactionOutput.new(
                    Address.from_bech32(input.address),
                    value,
                )
            )
        );
    }

    const value = Value.new(BigNum.from_str(txData.amount));
    if (txData.multiAsset) {
        value.set_multiasset(await getMultiAsset(txData.multiAsset));
    }
    txBuilder.add_output(
        TransactionOutput.new(
            Address.from_bech32(txData.address),
            value,
        )
    );

    if (txData.ttl) {
        txBuilder.set_ttl(BigNum.from_str(txData.ttl));
    }

    return txBuilder;
}

async function buildTx(txData: TxData) {
    await Loader.load();
    // @ts-ignore
    const { Address } = Loader.Cardano;

    const txBuilder = await getTxBuilder(txData);
    txBuilder.balance(
        Address.from_bech32(txData.changeAddress)
    );

    return txBuilder.build_tx();
}

export async function calcTxHash(txData: string | TxData) {
    await Loader.load();
    // @ts-ignore
    const { hash_transaction, Transaction } = Loader.Cardano;

    if (typeof txData === 'string') {
        return hash_transaction(Transaction.from_bytes(base.fromBase64(txData)).body()).to_hex();
    } else {
        return hash_transaction(await buildTx(txData)).to_hex();
    }
}

export async function minAda(address: string, multiAsset?: MultiAssetData) {
    await Loader.load();
    // @ts-ignore
    const { Value, BigNum, TransactionOutput, Address, min_ada_required } = Loader.Cardano;

    const value = Value.new(BigNum.from_str('1000000'));
    if (multiAsset) {
        value.set_multiasset(await getMultiAsset(multiAsset));
    }
    const output = TransactionOutput.new(Address.from_bech32(address), value);
    return min_ada_required(output, BigNum.from_str("4310")).to_str();
}

export async function minFee(txData: TxData) {
    await Loader.load();
    // @ts-ignore
    const { Address, TransactionOutput } = Loader.Cardano;

    const txBuilder = await getTxBuilder(txData);
    const value = txBuilder.get_total_input().checked_sub(txBuilder.get_total_output());
    txBuilder.add_output(TransactionOutput.new(Address.from_bech32(txData.changeAddress), value));

    return txBuilder.min_fee().to_str();
}

export const signData = async (
  address: string,
  payload: string,
  privateKey: string,
) => {
    await Loader.load();
    // @ts-ignore
    const { PrivateKey } = Loader.Cardano;
    // @ts-ignore
    const { HeaderMap, Label, AlgorithmId, CBORValue, ProtectedHeaderMap, Headers, COSESign1Builder, COSEKey, KeyType, Int, BigNum } = Loader.Message;

    const keyHash = await extractKeyHash(address);
    const prefix = keyHash.startsWith('addr_vkh') ? 'addr_vkh' : 'stake_vkh';
    const paymentKey = PrivateKey.from_extended_bytes(base.fromHex(privateKey.slice(0, 128)));
    const stakeKey = PrivateKey.from_extended_bytes(base.fromHex(privateKey.slice(128)));
    const accountKey = prefix === 'addr_vkh' ? paymentKey : stakeKey;

    const publicKey = accountKey.to_public();
    if (keyHash !== publicKey.hash().to_bech32(prefix))
        throw new Error("Private key does not match address");
    const protectedHeaders = HeaderMap.new();
    protectedHeaders.set_algorithm_id(
      Label.from_algorithm_id(AlgorithmId.EdDSA)
    );
    protectedHeaders.set_header(
      Label.new_text('address'),
      CBORValue.new_bytes((await addressFromHexOrBech32(address)).to_bytes())
    );
    const protectedSerialized =
      ProtectedHeaderMap.new(protectedHeaders);
    const unprotectedHeaders = HeaderMap.new();
    const headers = Headers.new(
      protectedSerialized,
      unprotectedHeaders
    );
    const builder = COSESign1Builder.new(
      headers,
      base.fromHex(payload),
      false
    );
    const toSign = builder.make_data_to_sign().to_bytes();

    const signedSigStruc = accountKey.sign(toSign).to_bytes();
    const coseSign1 = builder.build(signedSigStruc);

    const key = COSEKey.new(
      Label.from_key_type(KeyType.OKP)
    );
    key.set_algorithm_id(
      Label.from_algorithm_id(AlgorithmId.EdDSA)
    );
    key.set_header(
      Label.new_int(
        Int.new_negative(BigNum.from_str('1'))
      ),
      CBORValue.new_int(
        Int.new_i32(6) // Loader.Message.CurveType.Ed25519
      )
    ); // crv (-1) set to Ed25519 (6)
    key.set_header(
      Label.new_int(
        Int.new_negative(BigNum.from_str('2'))
      ),
      CBORValue.new_bytes(publicKey.as_bytes())
    ); // x (-2) set to public key

    return {
        signature: base.toHex(coseSign1.to_bytes()),
        key: base.toHex(key.to_bytes()),
    };
};

export const signTx = async (
  tx: string,
  privateKey: string,
  partialSign: boolean = false,
) => {
    await Loader.load();
    // @ts-ignore
    const { PrivateKey } = Loader.Cardano;
    // @ts-ignore
    const { Transaction, TransactionWitnessSet, Vkeywitnesses, hash_transaction, make_vkey_witness } = Loader.Cardano;

    const paymentKey = PrivateKey.from_extended_bytes(base.fromHex(privateKey.slice(0, 128)));
    const stakeKey = PrivateKey.from_extended_bytes(base.fromHex(privateKey.slice(128)));
    const paymentKeyHash = base.toHex(paymentKey.to_public().hash().to_bytes());
    const stakeKeyHash = base.toHex(stakeKey.to_public().hash().to_bytes());

    const rawTx = Transaction.from_bytes(base.fromHex(tx));

    const txWitnessSet = TransactionWitnessSet.new();
    const vkeyWitnesses = Vkeywitnesses.new();
    const txHash = hash_transaction(rawTx.body());
    const keyHashes = [paymentKeyHash];
    keyHashes.forEach((keyHash) => {
        let signingKey;
        if (keyHash === paymentKeyHash) signingKey = paymentKey;
        else if (keyHash === stakeKeyHash) signingKey = stakeKey;
        else if (!partialSign) throw new Error("Could not sign the data");
        else return;
        const vkey = make_vkey_witness(txHash, signingKey);
        vkeyWitnesses.add(vkey);
    });

    txWitnessSet.set_vkeys(vkeyWitnesses);
    return base.toHex(txWitnessSet.to_bytes());
};

const addressFromHexOrBech32 = async (address: string) => {
    await Loader.load();
    // @ts-ignore
    const { Address } = Loader.Cardano;

    try {
        return Address.from_bytes(base.fromHex(address));
    } catch (e) {
        try {
            return Address.from_bech32(address);
        } catch (e) {
            throw new Error("Could not deserialize address.");
        }
    }
}

const extractKeyHash = async (address: string) => {
    await Loader.load();
    // @ts-ignore
    const { BaseAddress, EnterpriseAddress, PointerAddress, RewardAddress } = Loader.Cardano;


    const parsedAddress = await addressFromHexOrBech32(address);
    try {
        const baseAddress = BaseAddress.from_address(parsedAddress);
        return baseAddress.payment_cred().to_keyhash().to_bech32('addr_vkh');
    } catch (e) {}
    try {
        const enterpriseAddress = EnterpriseAddress.from_address(parsedAddress);
        return enterpriseAddress.payment_cred().to_keyhash().to_bech32('addr_vkh');
    } catch (e) {}
    try {
        const pointerAddress = PointerAddress.from_address(parsedAddress);
        return pointerAddress.payment_cred().to_keyhash().to_bech32('addr_vkh');
    } catch (e) {}
    try {
        const rewardAddress = RewardAddress.from_address(parsedAddress);
        return rewardAddress.payment_cred().to_keyhash().to_bech32('stake_vkh');
    } catch (e) {}
    throw new Error("Address not pk");
};
