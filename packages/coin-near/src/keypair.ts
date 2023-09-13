/** All supported key types */
import { Assignable } from './enums';
import { base_decode, base_encode } from './serialize';
import { signUtil } from "@okxweb3/crypto-lib"

export enum KeyType {
  ED25519 = 0,
}

function key_type_to_str(keyType: KeyType): string {
  switch (keyType) {
    case KeyType.ED25519: return 'ed25519';
    default: throw new Error(`Unknown key type ${keyType}`);
  }
}

function str_to_key_type(keyType: string): KeyType {
  switch (keyType.toLowerCase()) {
    case 'ed25519': return KeyType.ED25519;
    default: throw new Error(`Unknown key type ${keyType}`);
  }
}

export class PublicKey extends Assignable {
  keyType: KeyType;
  data: Uint8Array;

  static fromRaw(data: Uint8Array): PublicKey {
    return new PublicKey({keyType: KeyType.ED25519, data: data});
  }

  static from(value: string | PublicKey): PublicKey {
    if (typeof value === 'string') {
      return PublicKey.fromString(value);
    }
    return value;
  }

  static fromString(encodedKey: string): PublicKey {
    const parts = encodedKey.split(':');
    if (parts.length === 1) {
      return new PublicKey({ keyType: KeyType.ED25519, data: base_decode(parts[0]) });
    } else if (parts.length === 2) {
      return new PublicKey({ keyType: str_to_key_type(parts[0]), data: base_decode(parts[1]) });
    } else {
      throw new Error('Invalid encoded key format, must be <curve>:<encoded key>');
    }
  }

  toString(): string {
    return `${key_type_to_str(this.keyType)}:${base_encode(this.data)}`;
  }

  verify(message: Uint8Array, signature: Uint8Array): boolean {
    switch (this.keyType) {
      case KeyType.ED25519: return signUtil.ed25519.verify(message, signature, this.data);
      default: throw new Error(`Unknown key type ${this.keyType}`);
    }
  }
}