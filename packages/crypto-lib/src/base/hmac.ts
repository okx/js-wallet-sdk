import {Input} from "@noble/hashes/utils";

import {hmac} from "@noble/hashes/hmac"
import {sha256, sha512} from "./hash"

export function hmacSHA256(key: Input, buffer: Input): Buffer {
    return Buffer.from(hmac(sha256, key, buffer));
}

export function hmacSHA512(key: Input, buffer: Input): Buffer {
    return Buffer.from(hmac(sha512, key, buffer));
}