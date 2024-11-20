import { Schema, serialize } from 'borsh';

export interface SignMessageParamsNEP {
    message: string
    recipient: string
    nonce: Buffer
    callbackUrl?: string
    state?: string
}


export interface SignMessageParams {
    chainId: string
    messageParams: SignMessageParamsNEP & {
        accountId?: string
    }
}

export class MessagePayload {
    tag: number
    message: string
    nonce: Buffer
    recipient: string
    callbackUrl?: string

    constructor(data: SignMessageParamsNEP) {
        // The tag's value is a hardcoded value as per
        // defined in the NEP [NEP413](https://github.com/near/NEPs/blob/master/neps/nep-0413.md)
        this.tag = 2147484061
        this.message = data.message
        this.nonce = data.nonce
        this.recipient = data.recipient
        if (data.callbackUrl) {
            this.callbackUrl = data.callbackUrl
        }
    }
}