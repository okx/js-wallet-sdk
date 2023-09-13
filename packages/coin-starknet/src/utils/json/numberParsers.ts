import { LosslessNumber } from './LosslessNumber'
import { isInteger } from './utils'

export function parseLosslessNumber(value: string): LosslessNumber {
    return new LosslessNumber(value)
}

export function parseNumberAndBigInt(value: string): number | bigint {
    return isInteger(value) ? BigInt(value) : parseFloat(value)
}