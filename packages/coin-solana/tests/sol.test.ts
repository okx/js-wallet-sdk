import {web3, spl, api} from "../src"
import {PublicKey} from "../src/sdk/web3";
import {TokenStandard, transferNftBuilder, getSignedTransaction} from "../src/sdk/metaplex";
import {base} from "@okxweb3/crypto-lib";
import {ed25519_getRandomPrivateKey} from "@okxweb3/coin-base";

const privateKey = "037f00373589c700a411382ae702e258b01f30a509a32be2b2c84fb54de4c1e5fd5fd86d7d7b8355492b1517a96a2fbb17e1a374b80a21559bdfee0dfbaa0b32";
const privateKeyBase58 = base.toBase58(base.fromHex(privateKey))

describe("address", () => {
  test('private key',  () => {
    let key = ed25519_getRandomPrivateKey(true, 'hex')
    let key1 = ed25519_getRandomPrivateKey(true, 'base58')
    console.log(key)
    console.log(key1)
  })

  test("getNewAddress", async () => {
    const address = api.getNewAddress(privateKeyBase58);
    console.info(address);

    const valid = api.validAddress(address);
    console.info(valid);
  });

  /*
  // send transaction
  curl https://api.devnet.solana.com -X POST -H "Content-Type: application/json" -d '
    {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "sendTransaction",
      "params": [
        "57LfKuzLyqYLMzYUPVZePgRkQhhWVpiowQom9SmwCkGLYjGHZuExA7tUxQSFsBwAp6wt6tdDurUJThJye4epyTjgH2LPJnsgLgvMhUASimKCAGRiHPKpAhX4C4qsAzhBvCp2jDpvVN5HLJynahnv2sQHknot48rVPuU5dykC1k6GQE8Mo4QkeJAgoxCApccCTQorzB1D6AkppZjNVp5EAJQvsrWE2TSwUFaxyaEfFdQYqErvjokfCeL4n1BTBKzXVXFgDcCnB9Mc2pkyMRQGkhF7mq4rrsbVC6ctF"
      ]
    }'
  */

  test("transfer", async () => {
    const fromAddress = api.getNewAddress(privateKeyBase58);
    const toAddress = "7NRmECq1R4tCtXNvmvDAuXmii3vN1J9DRZWhMCuuUnkM"
    const amount = 1000000000
    const blockHash = "BHgsBbx9VQWsWdASiNC2wLq8aWFhuzJvpuwyKp2Jukk5";
    const t = api.createRawTransaction(fromAddress, blockHash)
    await api.appendTransferInstruction(t, fromAddress, toAddress, amount)
    const data = await api.signTransaction(t, privateKeyBase58)
    console.info(data);
  });

  test("associatedTokenAddress", async () => {
    const wallet = "9F3m9cPLjN4abNCoKPY9MKSc8zbzcoUoFSEiZ9hyU9Hb"
    const mint = "EE5L8cMU4itTsCSuor7NLK6RZx6JhsBe8GGV3oaAHm3P"
    const associatedAddress = await spl.getAssociatedTokenAddress(new web3.PublicKey(mint), new web3.PublicKey(wallet))
    console.info(new web3.PublicKey(associatedAddress).toString());
  });

  test("tokenTransfer", async () => {
    const fromAddress = api.getNewAddress(privateKeyBase58);
    const toAddress = "8DDy3CyJ8e3aGfAVn8PQPZ1jC5mAuNxNF9XbhbyPaFN4"
    const amount = 1000000
    const blockHash = "G6WMViEhWA2TM8AwFwG5FfcVow2WrfqVN7HsnTEcKgYz";
    const mint = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"

    const t = api.createRawTransaction(fromAddress, blockHash)
    await api.appendTokenTransferInstruction(t, fromAddress, toAddress, mint, amount, true)
    const data = await api.signTransaction(t, privateKeyBase58)
    console.info(data);
  });

  test("message", async () => {
    const fromAddress = api.getNewAddress(privateKeyBase58);
    const toAddress = "8DDy3CyJ8e3aGfAVn8PQPZ1jC5mAuNxNF9XbhbyPaFN4"
    const amount = 1000000
    const blockHash = "G6WMViEhWA2TM8AwFwG5FfcVow2WrfqVN7HsnTEcKgYz";
    const mint = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"

    const t = api.createRawTransaction(fromAddress, blockHash)
    await api.appendTokenTransferInstruction(t, fromAddress, toAddress, mint, amount, true)

    const message = t.serialize({requireAllSignatures: false, verifySignatures: false})
    const data = await api.signMessage(base.toBase58(message), privateKeyBase58)

    console.info(data);
  });

  test("pNftTransfer", async () => {
    const privateKey = "548yT115QRHH7Mpchg9JJ8YPX9RTKuan7oeB9ruMULDGhdqBmG18RBSv54Fpv2BvrC1yVpGdjzAPKHNYUwPBePKc";
    const from = api.getNewAddress(privateKey);
    const to = "9qinWp4oc3TvBocbwAvYZAZWfSswub2qM49Pn6rkCQ9q";

    const nft = {
      tokenStandard: TokenStandard.ProgrammableNonFungible,
      address: new PublicKey("DberpiNB1sttkWdd66amQV5hrnMGacBeDeMbcEFMVBiR"),
    };

    const authority = {
      publicKey: new PublicKey(from),
      secretKey: base.fromBase58(privateKey),
    };

    const builder = transferNftBuilder({
      nftOrSft: nft,
      authority,
      fromOwner: new PublicKey(from),
      toOwner: new PublicKey(to),
    }, authority);

    const signedTx = getSignedTransaction(builder, undefined, {
      blockhash: "8MnQifmv14ELwdkK5NJso9cofN8iNpHy6n6Nnxy7pn8v",
      lastValidBlockHeight: 181854107,
    });

    console.log(signedTx);
  });
})
