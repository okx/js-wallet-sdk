import {
    AccountAddress, Bool,
    Deserializer,
    HexInput, MoveVector, parseTypeTag,
    ScriptFunctionArgumentTypes,
    ScriptTransactionArgumentVariants, Serialized,
    TypeArgument, U128, U16, U256, U32, U64, U8
} from "./v2";
import {InputScriptData} from "./v2/transactions";
import {base} from "@okxweb3/crypto-lib";

export type InputScriptDataParam = {
    bytecode: string;
    typeArguments?: Array<string>;
    functionArguments: Array<string>;
};


export function parseInputScriptDataParam(param: InputScriptDataParam){
    const functionArguments = param.functionArguments.map(item => {
        let d = new Deserializer(base.fromHex(item))
        let n = d.deserializeUleb128AsU32()
        switch (n){
            case ScriptTransactionArgumentVariants.U8:
                return new U8(d.deserializeU8())
            case ScriptTransactionArgumentVariants.U64:
                return new U64(d.deserializeU64())
            case ScriptTransactionArgumentVariants.U128:
                return new U128(d.deserializeU128())
            case ScriptTransactionArgumentVariants.Address:
                return AccountAddress.deserialize(d)
            case ScriptTransactionArgumentVariants.U8Vector:
                return MoveVector.deserialize<U8>(d, U8)
            case ScriptTransactionArgumentVariants.Bool:
                return new Bool(d.deserializeBool())
            case ScriptTransactionArgumentVariants.U16:
                return new U16(d.deserializeU16())
            case ScriptTransactionArgumentVariants.U32:
                return new U32(d.deserializeU32())
            case ScriptTransactionArgumentVariants.U256:
                return new U256(d.deserializeU256())
            case ScriptTransactionArgumentVariants.Serialized:
                return Serialized.deserialize(d)
            default:
                throw new Error("Invalid Param")
        }
    })
    if (param.typeArguments){
        return {
            bytecode: param.bytecode,
            typeArguments: param.typeArguments.map(item => parseTypeTag(item, {allowGenerics:true})),
            functionArguments: functionArguments,
        };
    } else {
        return {
            bytecode: param.bytecode,
            functionArguments: functionArguments,
        };
    }
}