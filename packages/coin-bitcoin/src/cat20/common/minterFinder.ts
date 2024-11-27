import {MinterType} from "./cat20Enum";

export function isOpenMinter(md5: string) {
    return MinterType.OPEN_MINTER_V1 === md5 || MinterType.OPEN_MINTER_V2 === md5;
}
