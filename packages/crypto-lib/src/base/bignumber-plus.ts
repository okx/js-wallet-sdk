import {BigNumber} from '../index';

import {check} from './precondtion';

const toBigIntHex = (value: BigNumber): string => {
    let hexStr = value.integerValue().toString(16);

    hexStr = '0x' + hexStr;
    return hexStr;
};

const fromBigIntHex = (value: string): BigNumber => {
    check(value && value.startsWith('0x'), `Invalid hex string. value: ${value}`);
    return new BigNumber(value).integerValue();
};

const bigNumber2String = (value: BigNumber, base?: number): string => {
    return value.integerValue().toString(base);
};

const string2BigNumber = (n: string | number, base?: number): BigNumber => {
    return new BigNumber(n, base);
};

export {toBigIntHex, fromBigIntHex, bigNumber2String, string2BigNumber};
