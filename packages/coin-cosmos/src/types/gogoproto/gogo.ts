/* eslint-disable */
import {Long} from "@okxweb3/crypto-lib";
import { _m0 } from "@okxweb3/crypto-lib";

export const protobufPackage = "gogoproto";

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
