import { networks } from "../src"
import { buildRuneData, toVarInt, fromVarInt } from "../src/rune"
import ECPairFactory from 'ecpair'
import BIP32Factory from "bip32"
import * as ecc from 'tiny-secp256k1'
import * as bip39 from "bip39"
import * as bitcoin from "bitcoinjs-lib"

bitcoin.initEccLib(ecc)
const ECPair = ECPairFactory(ecc)
const network = networks.testnet
const bip32 = BIP32Factory(ecc)

function getSegWitAddress(node: any, network?: any): string {
    return bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }).address!
}

function getTaprootAddress(node: any, network?: any): string {
    const ecpair = ECPair.fromPublicKey(node.publicKey, { network: network })
    const schnorrPubKey = ecpair.publicKey.slice(1)
    return bitcoin.payments.p2tr({ pubkey: schnorrPubKey, network }).address!
}

describe('bitcoinjs-lib', ()=>{
test("Leather wallet", () => {

    const mnemonic = '<FILL IN MNEMONIC WORDS HERE>'
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    const root = bip32.fromSeed(seed)

    // Account 1
    const path1 = "m/84'/1'/0'/0/0"
    const child1 = root.derivePath(path1)
    const wif1 = child1.toWIF()
    const address1 = getSegWitAddress(child1, network)
    expect(address1).toEqual("tb1qld79qrdvr8ljkl49ph8wxx275y45k0l3jwdzud")

    // Account 1 Ordi
    const ordPath1 = "m/86'/1'/0'/0/0"
    const childOrd1 = root.derivePath(ordPath1)
    const wifOrd1 = childOrd1.toWIF()
    const addressOrd1 = getTaprootAddress(childOrd1, network)
    expect(addressOrd1).toEqual("tb1pyh6nhjflhdm77wy6eek7ua53d9vpyxjjsv0aec8l7ytj6r6k9cwq2h4lwl")

    // Account 2
    const path2 = "m/84'/1'/1'/0/0"
    const child2 = root.derivePath(path2)
    const wif2 = child2.toWIF()
    const address2 = getSegWitAddress(child2, network)
    expect(address2).toEqual("tb1q8wt6tkx2w3nr5q350ds9yv972nkdc8pe3ku0k4")


})

test("transfer with OP_RETURN", () => {

    const alice = ECPair.fromWIF('<FILL IN WIF HERE>')
    const address = getSegWitAddress( alice, network )
    expect(address).toEqual("tb1qld79qrdvr8ljkl49ph8wxx275y45k0l3jwdzud")

    const psbt = new bitcoin.Psbt({ network: network })

    // 1. Add Input
    psbt.addInput({
        hash: "c51c77557700af02fe47b8b1356be7dabd0da5f81006bcbc94f1c22bdff99317",
        index: 2,
        witnessUtxo: {
            script: Buffer.from("0014fb7c500dac19ff2b7ea50dcee3195ea12b4b3ff1", 'hex'),
            value: 53015,
        }
    })

    // 2. Add Output OP_RETURN
    
    const runeData = buildRuneData([{ id: 0x2aa16001b, output: 0, amount: 1000 }])
    const opReturnScript = bitcoin.script.compile([bitcoin.opcodes.OP_RETURN, Buffer.from('RUNE_TEST'), Buffer.from(runeData)])
    // const runeData = Buffer.from('Arbitrary OP_RETURN Message', 'utf8')
    // const embed = bitcoin.payments.embed({data: [runeData]})
    console.log("opReturnScript: ", opReturnScript )

    psbt
    .addOutput({
        address: address!,
        value: 52800,
    })
    .addOutput({
        // script: embed.output!,
        script:opReturnScript,
        value: 0,
    })

    // 3. Sign Input
    psbt.signInput(0, alice)

    psbt.finalizeAllInputs()
    const txHex = psbt.extractTransaction().toHex();
    expect(txHex).toEqual("020000000001011793f9df2bc2f194bcbc0610f8a50dbddae76b35b1b847fe02af007755771cc50200000000ffffffff0240ce000000000000160014fb7c500dac19ff2b7ea50dcee3195ea12b4b3ff10000000000000000156a0952554e455f544553540900a9cfd6ff1b86680002483045022100d09ca0fa6f21af113867f3b754c08f146c0e83439b65fe91e248da48466a8fc502204de4a579250e8e9afd81471dccd5d2a325dc9be1417576fd898cd06489bb62d1012102ad268ae319c4dc271753072ddd690cb6fbe85c3782259daa0faff0919b86e2c400000000")
})

test("varint full", () => {
  const testVectors: [number, Uint8Array][] = [
    [0, new Uint8Array([0x00])],
    [1, new Uint8Array([0x01])],
    [127, new Uint8Array([0x7F])],
    [128, new Uint8Array([0x80, 0x00])],
    [255, new Uint8Array([0x80, 0x7F])],
    [256, new Uint8Array([0x81, 0x00])],
    [16383, new Uint8Array([0xFE, 0x7F])],
    [16384, new Uint8Array([0xFF, 0x00])],
    [16511, new Uint8Array([0xFF, 0x7F])],
    [65535, new Uint8Array([0x82, 0xFE, 0x7F])],
    [4294967296, new Uint8Array([0x8E, 0xFE, 0xFE, 0xFF, 0x00])], // 1 << 32 = 1 in javascript
  ]

  for (const [n, encoding] of testVectors) {
    const actual = toVarInt(BigInt(n))
    expect(actual).toEqual(encoding)
    const [decoded, length] = fromVarInt(encoding)
    expect(decoded).toEqual(BigInt(n))
    expect(length).toBe(encoding.length)
  }
})

})