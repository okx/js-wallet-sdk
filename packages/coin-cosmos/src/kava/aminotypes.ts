import {AuctionAminoConverter} from "./auction/v1beta1/tx.amino";
import {HardAminoConverter} from "./hard/v1beta1/tx.amino";
import {SwapAminoConverter} from "./swap/v1beta1/tx.amino";

export const KavaAminoConverters = {
    ...AuctionAminoConverter,
    ...HardAminoConverter,
    ...SwapAminoConverter
}