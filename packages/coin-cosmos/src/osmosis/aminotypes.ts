import {GammAminoConverters} from "./gamm/v1beta1/aminotypes";
import {PoolManagerAminoConverter} from "./poolmanager/v1beta1/tx.amino";
import {LockupAminoConverter} from "./lockup/tx.amino";
import {SuperfluidAminoConverter} from "./superfluid/tx.amino";
import {TokenFactoryAminoConverter} from "./tokenfactory/v1beta1/tx.amino";

export const OsmosisAminoConverters = {
    ...GammAminoConverters,
    ...LockupAminoConverter,
    ...PoolManagerAminoConverter,
    ...SuperfluidAminoConverter,
    ...TokenFactoryAminoConverter
}
