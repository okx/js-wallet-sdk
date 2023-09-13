import * as signUtil from './sdk/eth-sig-util';
import * as ethUtil from './sdk/ethereumjs-util';
import {base} from '@okxweb3/crypto-lib';

export enum MessageTypes {
    ETH_SIGN = 0,
    PERSONAL_SIGN = 1,
    TYPE_DATA_V1 = 2,
    TYPE_DATA_V3 = 3,
    TYPE_DATA_V4 = 4,
}

export const hashMessage = (messageType: MessageTypes, message: string): string => {
    switch (messageType) {
        case MessageTypes.ETH_SIGN:
            return ethUtil.addHexPrefix(message);
        case MessageTypes.PERSONAL_SIGN: {
            // default utf8
            const buffer = base.isHexString(message) ? base.fromHex(message) : Buffer.from(message);
            return ethUtil.addHexPrefix(
              ethUtil.hashPersonalMessage(buffer).toString('hex'),
            );
        }
        case MessageTypes.TYPE_DATA_V1:
            return ethUtil.addHexPrefix(
                signUtil.typedSignatureHash(JSON.parse(message)),
            );
        case MessageTypes.TYPE_DATA_V3:
            return ethUtil.addHexPrefix(
                signUtil.TypedDataUtils.eip712Hash(
                    JSON.parse(message),
                    signUtil.SignTypedDataVersion.V3,
                ).toString('hex'),
            );
        case MessageTypes.TYPE_DATA_V4:
            return ethUtil.addHexPrefix(
                signUtil.TypedDataUtils.eip712Hash(
                    JSON.parse(message),
                    signUtil.SignTypedDataVersion.V4,
                ).toString('hex'),
            );

        default:
            throw new Error(`Invalid messageType: ${messageType}`);
    }
};