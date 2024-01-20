// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import {parseTypeTag} from "../typeTag/parser";
import {TypeTag, TypeTagStruct} from "../typeTag";
import {AptosConfig} from "../../api/aptosConfig";
import {EntryFunctionArgumentTypes, SimpleEntryFunctionArgumentTypes, EntryFunctionABI} from "../types";
import {Bool, MoveOption, MoveString, MoveVector, U128, U16, U256, U32, U64, U8} from "../../bcs";
import {AccountAddress} from "../../core";
import {
    findFirstNonSignerArg,
    isBcsAddress,
    isBcsBool,
    isBcsString,
    isBcsU128,
    isBcsU16,
    isBcsU256,
    isBcsU32,
    isBcsU64,
    isBcsU8,
    isBool,
    isEncodedEntryFunctionArgument,
    isLargeNumber,
    isNull,
    isNumber,
    isString,
    throwTypeMismatch,
} from "./helpers";
import {TextEncoder} from "util";
import {MoveModuleBytecode} from "../../types";

const TEXT_ENCODER = new TextEncoder();

/**
 * Convert type arguments to only type tags, allowing for string representations of type tags
 */
export function standardizeTypeTags(typeArguments?: Array<TypeTag | string>): Array<TypeTag> {
    return (
        typeArguments?.map((typeArg: string | TypeTag): TypeTag => {
            // Convert to TypeTag if it's a string representation
            if (isString(typeArg)) {
                return parseTypeTag(typeArg);
            }
            return typeArg;
        }) ?? []
    );
}

/**
 * Fetches the ABI for an entry function from the module
 *
 * @param moduleAddress
 * @param moduleName
 * @param functionName
 * @param aptosConfig
 */
export async function fetchEntryFunctionAbi(
    moduleAddress: string,
    moduleName: string,
    functionName: string,
    aptosConfig?: AptosConfig,
    module?: MoveModuleBytecode,
): Promise<EntryFunctionABI> {
    // This fetch from the API is currently cached
    //const module = await getModule({aptosConfig, accountAddress: moduleAddress, moduleName});
    const m = "{\"bytecode\":\"0xa11ceb0b060000000d0100100210180328820104aa011605c00156079602ef040885072006a5073210d707a1040af80b100c880c86040d8e10040f92100400020003000400050006000700080009000a0600000b0800031204010001061a04010601021d0800000c000100000d000100000e020100000f020101000010000300001100010000130401010000140501000015060100001606010100011b000300051c070700031e00030100051f0707000111000b0003200c01010005210707000406000b0003220401010007230c000006240f01010601250c1001060315060101000326111201000c08090a0f080c0a0f0a120a140e150e1608170a060a01050003060c0a050a03010102050b0201090002060c0103060c0503010301080406030303030605060a05010900010c01060c0305070801080101080002070b030109000900010b0301090002060c03010b020109000767656e65736973107265736f757263655f6163636f756e740d6170746f735f6163636f756e74076163636f756e740a6170746f735f636f696e04636f696e0d6372656174655f7369676e6572056572726f72056576656e74067369676e657224446972656374436f696e5472616e73666572436f6e666967557064617465644576656e74144469726563745472616e73666572436f6e666967156173736572745f6163636f756e745f657869737473246173736572745f6163636f756e745f69735f726567697374657265645f666f725f6170740e62617463685f7472616e736665721462617463685f7472616e736665725f636f696e732163616e5f726563656976655f6469726563745f636f696e5f7472616e73666572730e6372656174655f6163636f756e7404436f696e0d6465706f7369745f636f696e731f7365745f616c6c6f775f6469726563745f636f696e5f7472616e7366657273087472616e736665720e7472616e736665725f636f696e731a6e65775f616c6c6f775f6469726563745f7472616e73666572731e616c6c6f775f6172626974726172795f636f696e5f7472616e73666572731b7570646174655f636f696e5f7472616e736665725f6576656e74730b4576656e7448616e646c65096578697374735f6174096e6f745f666f756e64094170746f73436f696e1569735f6163636f756e745f7265676973746572656410696e76616c69645f617267756d656e74087265676973746572117065726d697373696f6e5f64656e696564076465706f7369740a616464726573735f6f660a656d69745f6576656e74106e65775f6576656e745f68616e646c6508776974686472617700000000000000000000000000000000000000000000000000000000000000010308030000000000000003080400000000000000030801000000000000000308020000000000000003080500000000000000126170746f733a3a6d657461646174615f76318c0405010000000000000012454143434f554e545f4e4f545f464f554e44174163636f756e7420646f6573206e6f742065786973742e02000000000000001f454143434f554e545f4e4f545f524547495354455245445f464f525f415054294163636f756e74206973206e6f74207265676973746572656420746f2072656365697665204150542e03000000000000002e454143434f554e545f444f45535f4e4f545f4143434550545f4449524543545f434f494e5f5452414e53464552534b4163636f756e74206f70746564206f7574206f6620726563656976696e6720636f696e732074686174207468657920646964206e6f7420726567697374657220746f20726563656976652e04000000000000002f454143434f554e545f444f45535f4e4f545f4143434550545f4449524543545f544f4b454e5f5452414e5346455253334163636f756e74206f70746564206f7574206f66206469726563746c7920726563656976696e67204e465420746f6b656e732e05000000000000002a454d49534d41544348494e475f524543495049454e54535f414e445f414d4f554e54535f4c454e4754483c546865206c656e67746873206f662074686520726563697069656e747320616e6420616d6f756e7473206c6973747320646f6e2774206d617463682e00012163616e5f726563656976655f6469726563745f636f696e5f7472616e736665727301010000020117010102021801190b030108000001000001080b00110a040405070702110b270201010000010a0a0011000b003800040605090703110b27020201040009320e0141000e024107210407050c0b00010704110d270e010c080600000000000000000c040a0841000c060a040a0623042d05180a040a080a0442000c070c050e020b054207140c030a000b07140b0311080b04060100000000000000160c0405130b08010b000102030104010109320e0141000e024107210407050c0b00010704110d270e010c080600000000000000000c050a0841000c060a050a0623042d05180a050a080a0542000c070c040e020b044207140c030a000b07140b0338010b05060100000000000000160c0505130b08010b0001020401000101030e0a002901200407080c01050c0b002b011000140c010b0102050104000b060b00110e0c010e0138020206010001010b1b0a00110a2004070a001105280a0038032004170a001104040f051207001110270a0011110c020e0238040b000b0138050207010401010d2c0a0011130c020a022901041e0b00010b022a010c030a031000140a012104140b0301020a010a030f00150b030f010b0112003806052b0a010a00380712010c040d040f010b01120038060b000b042d0102080104000b140a01110a2004060a0111050a01380020040f0a0111110c030e0338020b000b010b02380802090104010101060b010b000b023809380a02010001010000000100\",\"abi\":{\"address\":\"0x1\",\"name\":\"aptos_account\",\"friends\":[\"0x1::genesis\",\"0x1::resource_account\"],\"exposed_functions\":[{\"name\":\"assert_account_exists\",\"visibility\":\"public\",\"is_entry\":false,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"address\"],\"return\":[]},{\"name\":\"assert_account_is_registered_for_apt\",\"visibility\":\"public\",\"is_entry\":false,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"address\"],\"return\":[]},{\"name\":\"batch_transfer\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"&signer\",\"vector<address>\",\"vector<u64>\"],\"return\":[]},{\"name\":\"batch_transfer_coins\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[{\"constraints\":[]}],\"params\":[\"&signer\",\"vector<address>\",\"vector<u64>\"],\"return\":[]},{\"name\":\"can_receive_direct_coin_transfers\",\"visibility\":\"public\",\"is_entry\":false,\"is_view\":true,\"generic_type_params\":[],\"params\":[\"address\"],\"return\":[\"bool\"]},{\"name\":\"create_account\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"address\"],\"return\":[]},{\"name\":\"deposit_coins\",\"visibility\":\"public\",\"is_entry\":false,\"is_view\":false,\"generic_type_params\":[{\"constraints\":[]}],\"params\":[\"address\",\"0x1::coin::Coin<T0>\"],\"return\":[]},{\"name\":\"set_allow_direct_coin_transfers\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"&signer\",\"bool\"],\"return\":[]},{\"name\":\"transfer\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[],\"params\":[\"&signer\",\"address\",\"u64\"],\"return\":[]},{\"name\":\"transfer_coins\",\"visibility\":\"public\",\"is_entry\":true,\"is_view\":false,\"generic_type_params\":[{\"constraints\":[]}],\"params\":[\"&signer\",\"address\",\"u64\"],\"return\":[]}],\"structs\":[{\"name\":\"DirectCoinTransferConfigUpdatedEvent\",\"is_native\":false,\"abilities\":[\"drop\",\"store\"],\"generic_type_params\":[],\"fields\":[{\"name\":\"new_allow_direct_transfers\",\"type\":\"bool\"}]},{\"name\":\"DirectTransferConfig\",\"is_native\":false,\"abilities\":[\"key\"],\"generic_type_params\":[],\"fields\":[{\"name\":\"allow_arbitrary_coin_transfers\",\"type\":\"bool\"},{\"name\":\"update_coin_transfer_events\",\"type\":\"0x1::event::EventHandle<0x1::aptos_account::DirectCoinTransferConfigUpdatedEvent>\"}]}]}}"
    module = JSON.parse(m);
    const functionAbi = module?.abi?.exposed_functions.find((func) => func.name === functionName);

    // If there's no ABI, then the function is invalid
    if (!functionAbi) {
        throw new Error(`Could not find entry function ABI for '${moduleAddress}::${moduleName}::${functionName}'`);
    }

    // Non-entry functions also can't be used
    if (!functionAbi.is_entry) {
        throw new Error(`'${moduleAddress}::${moduleName}::${functionName}' is not an entry function`);
    }

    // Remove the signer arguments
    const first = findFirstNonSignerArg(functionAbi);
    const params: TypeTag[] = [];
    for (let i = first; i < functionAbi.params.length; i += 1) {
        params.push(parseTypeTag(functionAbi.params[i], {allowGenerics: true}));
    }

    return {
        typeParameters: functionAbi.generic_type_params,
        parameters: params,
    };
}

/**
 * Converts a non-BCS encoded argument into BCS encoded, if necessary
 * @param functionName
 * @param functionAbi
 * @param arg
 * @param position
 */
export function convertArgument(
    functionName: string,
    functionAbi: EntryFunctionABI,
    arg: EntryFunctionArgumentTypes | SimpleEntryFunctionArgumentTypes,
    position: number,
    genericTypeParams: Array<TypeTag>,
) {
    // Ensure not too many arguments
    if (position >= functionAbi.parameters.length) {
        throw new Error(`Too many arguments for '${functionName}', expected ${functionAbi.parameters.length}`);
    }

    const param = functionAbi.parameters[position];
    return checkOrConvertArgument(arg, param, position, genericTypeParams);
}

export function checkOrConvertArgument(
    arg: SimpleEntryFunctionArgumentTypes | EntryFunctionArgumentTypes,
    param: TypeTag,
    position: number,
    genericTypeParams: Array<TypeTag>,
) {
    // If the argument is bcs encoded, we can just use it directly
    if (isEncodedEntryFunctionArgument(arg)) {
        // Ensure the type matches the ABI
        checkType(param, arg, position);
        return arg;
    }

    // If it is not BCS encoded, we will need to convert it with the ABI
    return parseArg(arg, param, position, genericTypeParams);
}

/**
 * Parses a non-BCS encoded argument into a BCS encoded argument recursively
 * @param arg
 * @param param
 * @param position
 * @param genericTypeParams
 */
function parseArg(
    arg: SimpleEntryFunctionArgumentTypes,
    param: TypeTag,
    position: number,
    genericTypeParams: Array<TypeTag>,
): EntryFunctionArgumentTypes {
    if (param.isBool()) {
        if (isBool(arg)) {
            return new Bool(arg);
        }
        throwTypeMismatch("boolean", position);
    }
    // TODO: support uint8array?
    if (param.isAddress()) {
        if (isString(arg)) {
            return AccountAddress.fromString(arg);
        }
        throwTypeMismatch("string | AccountAddress", position);
    }
    if (param.isU8()) {
        if (isNumber(arg)) {
            return new U8(arg);
        }
        throwTypeMismatch("number", position);
    }
    if (param.isU16()) {
        if (isNumber(arg)) {
            return new U16(arg);
        }
        throwTypeMismatch("number", position);
    }
    if (param.isU32()) {
        if (isNumber(arg)) {
            return new U32(arg);
        }
        throwTypeMismatch("number", position);
    }
    if (param.isU64()) {
        if (isLargeNumber(arg)) {
            return new U64(BigInt(arg));
        }
        throwTypeMismatch("bigint | number | string", position);
    }
    if (param.isU128()) {
        if (isLargeNumber(arg)) {
            return new U128(BigInt(arg));
        }
        throwTypeMismatch("bigint | number | string", position);
    }
    if (param.isU256()) {
        if (isLargeNumber(arg)) {
            return new U256(BigInt(arg));
        }
        throwTypeMismatch("bigint | number | string", position);
    }

    // Generic needs to use the sub-type
    if (param.isGeneric()) {
        const genericIndex = param.value;
        if (genericIndex < 0 || genericIndex >= genericTypeParams.length) {
            throw new Error(`Generic argument ${param.toString()} is invalid for argument ${position}`);
        }

        return checkOrConvertArgument(arg, genericTypeParams[genericIndex], position, genericTypeParams);
    }

    // We have to special case some vectors for Vector<u8>
    if (param.isVector()) {
        // Check special case for Vector<u8>
        if (param.value.isU8()) {
            // We don't allow vector<u8>, but we convert strings to UTF8 uint8array
            // This is legacy behavior from the original SDK
            if (isString(arg)) {
                return MoveVector.U8(TEXT_ENCODER.encode(arg));
            }
            if (arg instanceof Uint8Array) {
                return MoveVector.U8(arg);
            }
            if (arg instanceof ArrayBuffer) {
                return MoveVector.U8(new Uint8Array(arg));
            }
        }

        // TODO: Support Uint16Array, Uint32Array, BigUint64Array?

        if (Array.isArray(arg)) {
            return new MoveVector(arg.map((item) => checkOrConvertArgument(item, param.value, position, genericTypeParams)));
        }

        throw new Error(`Type mismatch for argument ${position}, type '${param.toString()}'`);
    }

    // Handle structs as they're more complex
    if (param.isStruct()) {
        if (param.isString()) {
            if (isString(arg)) {
                return new MoveString(arg);
            }
            throwTypeMismatch("string", position);
        }
        if (param.isObject()) {
            // The inner type of Object doesn't matter, since it's just syntactic sugar
            if (isString(arg)) {
                return AccountAddress.fromString(arg);
            }
            throwTypeMismatch("string | AccountAddress", position);
        }

        if (param.isOption()) {
            // Empty option must be handled specially
            if (isNull(arg)) {
                // Note: This is a placeholder U8 type, and does not match the actual type, as that can't be dynamically grabbed
                return new MoveOption<U8>(null);
            }

            return new MoveOption(checkOrConvertArgument(arg, param.value.typeArgs[0], position, genericTypeParams));
        }

        throw new Error(`Unsupported struct input type for argument ${position}, type '${param.toString()}'`);
    }

    throw new Error(`Type mismatch for argument ${position}, type '${param.toString()}'`);
}

/**
 * Checks that the type of an already BCS encoded argument matches the ABI
 * @param param
 * @param arg
 * @param position
 */
function checkType(param: TypeTag, arg: EntryFunctionArgumentTypes, position: number) {
    if (param.isBool()) {
        if (isBcsBool(arg)) {
            return;
        }
        throwTypeMismatch("Bool", position);
    }
    if (param.isAddress()) {
        if (isBcsAddress(arg)) {
            return;
        }
        throwTypeMismatch("AccountAddress", position);
    }
    if (param.isU8()) {
        if (isBcsU8(arg)) {
            return;
        }
        throwTypeMismatch("U8", position);
    }
    if (param.isU16()) {
        if (isBcsU16(arg)) {
            return;
        }
        throwTypeMismatch("U16", position);
    }
    if (param.isU32()) {
        if (isBcsU32(arg)) {
            return;
        }
        throwTypeMismatch("U32", position);
    }
    if (param.isU64()) {
        if (isBcsU64(arg)) {
            return;
        }
        throwTypeMismatch("U64", position);
    }
    if (param.isU128()) {
        if (isBcsU128(arg)) {
            return;
        }
        throwTypeMismatch("U128", position);
    }
    if (param.isU256()) {
        if (isBcsU256(arg)) {
            return;
        }
        throwTypeMismatch("U256", position);
    }
    if (param.isVector()) {
        if (arg instanceof MoveVector) {
            // If there's anything in it, check that the inner types match
            // Note that since it's typed, the first item should be the same as the rest
            if (arg.values.length > 0) {
                checkType(param.value, arg.values[0], position);
            }

            return;
        }
        throwTypeMismatch("MoveVector", position);
    }

    // Handle structs as they're more complex
    if (param instanceof TypeTagStruct) {
        if (param.isString()) {
            if (isBcsString(arg)) {
                return;
            }
            throwTypeMismatch("MoveString", position);
        }
        if (param.isObject()) {
            if (isBcsAddress(arg)) {
                return;
            }
            throwTypeMismatch("AccountAddress", position);
        }
        if (param.isOption()) {
            if (arg instanceof MoveOption) {
                // If there's a value, we can check the inner type (otherwise it doesn't really matter)
                if (arg.value !== undefined) {
                    checkType(param.value.typeArgs[0], arg.value, position);
                }
                return;
            }
            throwTypeMismatch("MoveOption", position);
        }
    }

    throw new Error(`Type mismatch for argument ${position}, expected '${param.toString()}'`);
}
