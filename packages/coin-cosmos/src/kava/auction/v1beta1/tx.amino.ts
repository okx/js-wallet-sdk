import { MsgPlaceBid } from "./tx";
export const AuctionAminoConverter = {
  "/kava.auction.v1beta1.MsgPlaceBid": {
    aminoType: "auction/MsgPlaceBid",
    toAmino: MsgPlaceBid.toAmino,
    fromAmino: MsgPlaceBid.fromAmino
  }
};