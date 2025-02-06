import {UTXO} from 'scrypt-ts';


export function pickLargeFeeUtxo(feeUtxos: Array<UTXO>): UTXO {
    let max = feeUtxos[0];

    for (const utxo of feeUtxos) {
        if (utxo.satoshis > max.satoshis) {
            max = utxo;
        }
    }
    return max;
}
