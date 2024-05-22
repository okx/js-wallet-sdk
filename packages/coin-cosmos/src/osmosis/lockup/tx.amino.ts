import { MsgLockTokens, MsgBeginUnlockingAll, MsgBeginUnlocking, MsgExtendLockup, MsgForceUnlock, MsgSetRewardReceiverAddress } from "./tx";
export const LockupAminoConverter = {
    "/osmosis.lockup.MsgLockTokens": {
        aminoType: "osmosis/lockup/lock-tokens",
        toAmino: MsgLockTokens.toAmino,
        fromAmino: MsgLockTokens.fromAmino
    },
    "/osmosis.lockup.MsgBeginUnlockingAll": {
        aminoType: "osmosis/lockup/begin-unlock-tokens",
        toAmino: MsgBeginUnlockingAll.toAmino,
        fromAmino: MsgBeginUnlockingAll.fromAmino
    },
    "/osmosis.lockup.MsgBeginUnlocking": {
        aminoType: "osmosis/lockup/begin-unlock-period-lock",
        toAmino: MsgBeginUnlocking.toAmino,
        fromAmino: MsgBeginUnlocking.fromAmino
    },
    "/osmosis.lockup.MsgExtendLockup": {
        aminoType: "osmosis/lockup/extend-lockup",
        toAmino: MsgExtendLockup.toAmino,
        fromAmino: MsgExtendLockup.fromAmino
    },
    "/osmosis.lockup.MsgForceUnlock": {
        aminoType: "osmosis/lockup/force-unlock-tokens",
        toAmino: MsgForceUnlock.toAmino,
        fromAmino: MsgForceUnlock.fromAmino
    },
    "/osmosis.lockup.MsgSetRewardReceiverAddress": {
        aminoType: "osmosis/lockup/set-reward-receiver-address",
        toAmino: MsgSetRewardReceiverAddress.toAmino,
        fromAmino: MsgSetRewardReceiverAddress.fromAmino
    }
};
