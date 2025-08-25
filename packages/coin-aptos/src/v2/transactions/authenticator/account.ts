// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/naming-convention */

import { Serializer, Deserializer, Serializable } from "../../bcs";
import { AnyPublicKey, AnySignature } from "../../core/crypto";
import { Ed25519PublicKey, Ed25519Signature } from "../../core/crypto/ed25519";
import { MultiEd25519PublicKey, MultiEd25519Signature } from "../../core/crypto/multiEd25519";
import { MultiKey, MultiKeySignature } from "../../core/crypto/multiKey";
import {AccountAuthenticatorVariant, HexInput, MoveFunctionId} from "../../types";
import {AccountAddress} from "../../core";
import {getFunctionParts, isValidFunctionInfo} from "../../utils/helpers";
import {AbstractionAuthDataVariant} from "../../types/abstraction";
import {Hex} from "../../core/hex";


/**
 * Represents an account authenticator that can handle multiple authentication variants.
 * This class serves as a base for different types of account authenticators, allowing for serialization
 * and deserialization of various authenticator types.
 *
 * @extends Serializable
 * @group Implementation
 * @category Transactions
 */
export abstract class AccountAuthenticator extends Serializable {
    abstract serialize(serializer: Serializer): void;

    /**
     * Deserializes an AccountAuthenticator from the provided deserializer.
     * This function helps in reconstructing the AccountAuthenticator object based on the variant index.
     *
     * @param deserializer - The deserializer instance used to read the serialized data.
     * @group Implementation
     * @category Transactions
     */
    static deserialize(deserializer: Deserializer): AccountAuthenticator {
        const index = deserializer.deserializeUleb128AsU32();
        switch (index) {
            case AccountAuthenticatorVariant.Ed25519:
                return AccountAuthenticatorEd25519.load(deserializer);
            case AccountAuthenticatorVariant.MultiEd25519:
                return AccountAuthenticatorMultiEd25519.load(deserializer);
            case AccountAuthenticatorVariant.SingleKey:
                return AccountAuthenticatorSingleKey.load(deserializer);
            case AccountAuthenticatorVariant.MultiKey:
                return AccountAuthenticatorMultiKey.load(deserializer);
            case AccountAuthenticatorVariant.NoAccountAuthenticator:
                return AccountAuthenticatorNoAccountAuthenticator.load(deserializer);
            case AccountAuthenticatorVariant.Abstraction:
                return AccountAuthenticatorAbstraction.load(deserializer);
            default:
                throw new Error(`Unknown variant index for AccountAuthenticator: ${index}`);
        }
    }

    /**
     * Determines if the current instance is an Ed25519 account authenticator.
     *
     * @returns {boolean} True if the instance is of type AccountAuthenticatorEd25519, otherwise false.
     * @group Implementation
     * @category Transactions
     */
    isEd25519(): this is AccountAuthenticatorEd25519 {
        return this instanceof AccountAuthenticatorEd25519;
    }

    /**
     * Determines if the current instance is of type AccountAuthenticatorMultiEd25519.
     *
     * @returns {boolean} True if the instance is a multi-signature Ed25519 account authenticator, otherwise false.
     * @group Implementation
     * @category Transactions
     */
    isMultiEd25519(): this is AccountAuthenticatorMultiEd25519 {
        return this instanceof AccountAuthenticatorMultiEd25519;
    }

    /**
     * Determines if the current instance is of the type AccountAuthenticatorSingleKey.
     *
     * @returns {boolean} True if the instance is an AccountAuthenticatorSingleKey, otherwise false.
     * @group Implementation
     * @category Transactions
     */
    isSingleKey(): this is AccountAuthenticatorSingleKey {
        return this instanceof AccountAuthenticatorSingleKey;
    }

    /**
     * Determine if the current instance is of type AccountAuthenticatorMultiKey.
     *
     * @returns {boolean} Returns true if the instance is an AccountAuthenticatorMultiKey, otherwise false.
     * @group Implementation
     * @category Transactions
     */
    isMultiKey(): this is AccountAuthenticatorMultiKey {
        return this instanceof AccountAuthenticatorMultiKey;
    }
}

/**
 * Represents an Ed25519 transaction authenticator for multi-signer transactions.
 * This class encapsulates the account's Ed25519 public key and signature.
 *
 * @param public_key - The Ed25519 public key associated with the account.
 * @param signature - The Ed25519 signature for the account.
 * @group Implementation
 * @category Transactions
 */
export class AccountAuthenticatorEd25519 extends AccountAuthenticator {
    public readonly public_key: Ed25519PublicKey;

    public readonly signature: Ed25519Signature;

    /**
     * Creates an instance of the class with the specified public keys and signatures.
     *
     * @param public_key The public key used for verification.
     * @param signature The signatures corresponding to the public keys.
     * @group Implementation
     * @category Transactions
     */
    constructor(public_key: Ed25519PublicKey, signature: Ed25519Signature) {
        super();
        this.public_key = public_key;
        this.signature = signature;
    }

    /**
     * Serializes the account authenticator data into the provided serializer.
     * This function captures the multi-key variant, public keys, and signatures for serialization.
     *
     * @param serializer - The serializer instance used to perform the serialization.
     * @group Implementation
     * @category Transactions
     */
    serialize(serializer: Serializer): void {
        serializer.serializeU32AsUleb128(AccountAuthenticatorVariant.Ed25519);
        this.public_key.serialize(serializer);
        this.signature.serialize(serializer);
    }

    /**
     * Loads an instance of AccountAuthenticatorMultiKey from the provided deserializer.
     * This function helps in reconstructing the authenticator object using the deserialized public keys and signatures.
     *
     * @param deserializer - The deserializer used to extract the necessary data for loading the authenticator.
     * @group Implementation
     * @category Transactions
     */
    static load(deserializer: Deserializer): AccountAuthenticatorEd25519 {
        const public_key = Ed25519PublicKey.deserialize(deserializer);
        const signature = Ed25519Signature.deserialize(deserializer);
        return new AccountAuthenticatorEd25519(public_key, signature);
    }
}

/**
 * Represents a transaction authenticator for Multi Ed25519, designed for multi-signer transactions.
 *
 * @param public_key - The MultiEd25519 public key of the account.
 * @param signature - The MultiEd25519 signature of the account.
 * @group Implementation
 * @category Transactions
 */
export class AccountAuthenticatorMultiEd25519 extends AccountAuthenticator {
    public readonly public_key: MultiEd25519PublicKey;

    public readonly signature: MultiEd25519Signature;

    constructor(public_key: MultiEd25519PublicKey, signature: MultiEd25519Signature) {
        super();
        this.public_key = public_key;
        this.signature = signature;
    }

    serialize(serializer: Serializer): void {
        serializer.serializeU32AsUleb128(AccountAuthenticatorVariant.MultiEd25519);
        this.public_key.serialize(serializer);
        this.signature.serialize(serializer);
    }

    static load(deserializer: Deserializer): AccountAuthenticatorMultiEd25519 {
        const public_key = MultiEd25519PublicKey.deserialize(deserializer);
        const signature = MultiEd25519Signature.deserialize(deserializer);
        return new AccountAuthenticatorMultiEd25519(public_key, signature);
    }
}

/**
 * Represents an account authenticator that utilizes a single key for signing.
 * This class is designed to handle authentication using a public key and its corresponding signature.
 *
 * @param public_key - The public key used for authentication.
 * @param signature - The signature associated with the public key.
 * @group Implementation
 * @category Transactions
 */
export class AccountAuthenticatorSingleKey extends AccountAuthenticator {
    public readonly public_key: AnyPublicKey;

    public readonly signature: AnySignature;

    constructor(public_key: AnyPublicKey, signature: AnySignature) {
        super();
        this.public_key = public_key;
        this.signature = signature;
    }

    serialize(serializer: Serializer): void {
        serializer.serializeU32AsUleb128(AccountAuthenticatorVariant.SingleKey);
        this.public_key.serialize(serializer);
        this.signature.serialize(serializer);
    }

    static load(deserializer: Deserializer): AccountAuthenticatorSingleKey {
        const public_key = AnyPublicKey.deserialize(deserializer);
        const signature = AnySignature.deserialize(deserializer);
        return new AccountAuthenticatorSingleKey(public_key, signature);
    }
}

/**
 * Represents an account authenticator that supports multiple keys and signatures for multi-signature scenarios.
 *
 * @param public_keys - The public keys used for authentication.
 * @param signatures - The signatures corresponding to the public keys.
 * @group Implementation
 * @category Transactions
 */
export class AccountAuthenticatorMultiKey extends AccountAuthenticator {
    public readonly public_keys: MultiKey;

    public readonly signatures: MultiKeySignature;

    constructor(public_keys: MultiKey, signatures: MultiKeySignature) {
        super();
        this.public_keys = public_keys;
        this.signatures = signatures;
    }

    serialize(serializer: Serializer): void {
        serializer.serializeU32AsUleb128(AccountAuthenticatorVariant.MultiKey);
        this.public_keys.serialize(serializer);
        this.signatures.serialize(serializer);
    }

    static load(deserializer: Deserializer): AccountAuthenticatorMultiKey {
        const public_keys = MultiKey.deserialize(deserializer);
        const signatures = MultiKeySignature.deserialize(deserializer);
        return new AccountAuthenticatorMultiKey(public_keys, signatures);
    }
}

/**
 * AccountAuthenticatorNoAccountAuthenticator for no account authenticator
 * It represents the absence of a public key for transaction simulation.
 * It allows skipping the public/auth key check during the simulation.
 */
export class AccountAuthenticatorNoAccountAuthenticator extends AccountAuthenticator {
    // eslint-disable-next-line class-methods-use-this
    serialize(serializer: Serializer): void {
        serializer.serializeU32AsUleb128(AccountAuthenticatorVariant.NoAccountAuthenticator);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static load(deserializer: Deserializer): AccountAuthenticatorNoAccountAuthenticator {
        return new AccountAuthenticatorNoAccountAuthenticator();
    }
}

export class AccountAuthenticatorAbstraction extends AccountAuthenticator {
    public readonly functionInfo: string;

    public readonly signingMessageDigest: Hex;

    public readonly authenticator: Hex;

    constructor(functionInfo: string, signingMessageDigest: HexInput, authenticator: HexInput) {
        super();
        if (!isValidFunctionInfo(functionInfo)) {
            throw new Error(`Invalid function info ${functionInfo} passed into AccountAuthenticatorAbstraction`);
        }
        this.functionInfo = functionInfo;
        this.authenticator = Hex.fromHexInput(authenticator);
        this.signingMessageDigest = Hex.fromHexInput(Hex.fromHexInput(signingMessageDigest).toUint8Array());
    }

    serialize(serializer: Serializer): void {
        serializer.serializeU32AsUleb128(AccountAuthenticatorVariant.Abstraction);
        const { moduleAddress, moduleName, functionName } = getFunctionParts(this.functionInfo as MoveFunctionId);
        AccountAddress.fromString(moduleAddress).serialize(serializer);
        serializer.serializeStr(moduleName);
        serializer.serializeStr(functionName);
        serializer.serializeU32AsUleb128(AbstractionAuthDataVariant.V1);
        serializer.serializeBytes(this.signingMessageDigest.toUint8Array());
        serializer.serializeFixedBytes(this.authenticator.toUint8Array());
    }

    static load(deserializer: Deserializer): AccountAuthenticatorAbstraction {
        const moduleAddress = AccountAddress.deserialize(deserializer);
        const moduleName = deserializer.deserializeStr();
        const functionName = deserializer.deserializeStr();
        const variant = deserializer.deserializeUleb128AsU32();
        if (variant === AbstractionAuthDataVariant.V1) {
            const signingMessageDigest = deserializer.deserializeBytes();
            const authenticator = deserializer.deserializeFixedBytes(deserializer.remaining());
            return new AccountAuthenticatorAbstraction(
                `${moduleAddress}::${moduleName}::${functionName}`,
                signingMessageDigest,
                authenticator,
            );
        }
        throw new Error(`Unknown variant index for AccountAuthenticatorAbstraction: ${variant}`);
    }
}