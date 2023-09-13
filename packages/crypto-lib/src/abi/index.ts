/**
 * Mozilla Public License Version 2.0
 *
 *
 * https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/LICENSE
 *
 * */

const ABI = require("./abi.js")
function RawEncode(types: string[], values: any[]): Buffer {
    return ABI.rawEncode(types, values)
}

function SoliditySHA3(types: string[], values: any[]): Buffer {
    return ABI.soliditySHA3(types, values)
}

export {ABI, RawEncode, SoliditySHA3}