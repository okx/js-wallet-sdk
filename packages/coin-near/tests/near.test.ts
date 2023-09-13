import {
    createTransaction,
    getAddress,
    publicKeyFromSeed,
    signTransaction,
    transfer,
    validateAddress,
    createAccount,
    addKey,
    fullAccessKey,
} from '../src';
import { base, BN } from '@okxweb3/crypto-lib';

/*
// send tx
curl -X POST -d '{ "jsonrpc": "2.0", "id": "1", "method": "broadcast_tx_commit", "params": ["DwAAAHpoYW5nb2sudGVzdG5ldACf6rjt8O6+BK7k723hWb3a5AHS15+W7v9r14mgyDyhnQMTt1wPVgAAEgAAAHpoYW5ncWlvazMudGVzdG5ldMrT3+w+qj+2i9kCh1uOhqdpcM93vcaH0vIbNeiqxFl1AgAAAAAFANsvZOZ5puXw20LF3bpZEeI0MzXozU8Bx0isPfDpdNItAAAAAAAAAAABAK629ZISVCE2Uu/GFBZKy1xV1Fcfcyoj8fDV7yoVu8kwf/DCRBDFY1/T0CTUT9qWAfOnWde2uH8t1RQxMTw1AQE="]}' -H "Content-Type: application/json" https://rpc.testnet.near.org

// tx status
curl -X POST -d '{ "jsonrpc": "2.0", "id": "1", "method": "tx", "params": ["7B4zWAth9JWNA3SiczxCo5pjmpuroKLyntNLLdJrDbSH","zhangqiok.testnet"]}' -H "Content-Type: application/json" https://rpc.testnet.near.org

// query access key
curl -X POST -d '{ "jsonrpc": "2.0", "id": "1", "method": "query", "params": {"request_type": "view_access_key", "finality": "final", "account_id": "zhangok.testnet", "public_key": "ed25519:BmFQzNmj172sQ44jWnaJSSiMFUNgypCyeyheEE8gYbwr"}}' -H "Content-Type: application/json" https://rpc.testnet.near.org
*/

describe("near", () => {
  test("transfer", async () => {
      const encodedKey = "ed25519:4yNHZKYxR4bk76CZ3MFQxpMeavbPTJVuGNrPZSBp5nzZTc64w35xmrGggbTWLHM1sUJCN5moESgsZKbDVDCj1234"
      const parts = encodedKey.split(':');
      const pk = base.fromBase58(parts[1])

      const seedHex = base.toHex(pk.slice(0, 32))
      const addr = getAddress(seedHex)
      console.info(addr)

      const r = validateAddress(addr)
      console.info(r)

      // from to must be account_id, not public key
      const to = "toAccount.testnet"
      const publicKey = publicKeyFromSeed(seedHex)

      // blockHash must from valid blocks within 24h
      const blockHash = "EekjoegUYx2iibbWDuUSQENYCvUGkxj2Et1hTonbwBuN"

      const tx = createTransaction("zhangok.testnet", publicKey, to, 94623980000002, [], base.fromBase58(blockHash))

      const action = transfer(new BN(10).pow(new BN(24)))
      tx.actions.push(action)

      const [_, signedTx] = await signTransaction(tx, seedHex)

      // https://explorer.testnet.near.org/transactions/xxxx
      const result = base.toBase64(signedTx.encode())
      console.info(result)
  });

    test("createAccount", async () => {
        const encodedKey = "ed25519:4yNHZKYxR4bk76CZ3MFQxpMeavbPTJVuGNrPZSBp5nzZTc64w35xmrGggbTWLHM1sUJCN5moESgsZKbDVDCj1234"
        const parts = encodedKey.split(':');
        const pk = base.fromBase58(parts[1])

        const newSeed = base.randomBytes(32)
        console.info(base.toHex(newSeed))
        const newPublicKey = publicKeyFromSeed(base.toHex(newSeed))

        const seedHex = base.toHex(pk.slice(0, 32))
        const addr = getAddress(seedHex)
        console.info(addr)

        const r = validateAddress(addr)
        console.info(r)

        // from to must be account_id, not public key
        const to = "toAccount.testnet"
        const publicKey = publicKeyFromSeed(seedHex)

        // blockHash must from valid blocks within 24h
        const blockHash = "EekjoegUYx2iibbWDuUSQENYCvUGkxj2Et1hTonbwBuN"

        const tx = createTransaction("zhangok.testnet", publicKey, to, 94623980000003, [], base.fromBase58(blockHash))

        const action = createAccount()
        tx.actions.push(action)

        const action2 = addKey(newPublicKey, fullAccessKey())
        tx.actions.push(action2)

        const [_, signedTx] = await signTransaction(tx, seedHex)

        const result = base.toBase64(signedTx.encode())
        console.info(result)
    });
});
