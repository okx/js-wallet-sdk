# Attribution for metamask/eth-sig-util

We have incorporated code from the [metamask/eth-sig-util](https://github.com/MetaMask/eth-sig-util/tree/v4.0.0) into MyProject. Here is a list of modifications made to the original code:

1. In `src/encryption.ts`, we made changes to the `encrypt`,`encryptSafely` function's input `data` param type from `unknow` to `string`.
2. In `src/index.ts`, we added `padWithZeroes`,`legacyToBuffer`,`isNullish` function from `src/utils.ts`.
3. In `src/sign-typed-data.ts`, we made changes to the `_typedSignatureHash` function to fix eth v1 sign bug.

## Deleted Code

In the process of integrating metamask/eth-sig-util into MyProject, we have removed the following code that was originally part of metamask/eth-sig-util:

- In `src/utils.ts`, we removed the `concatSig`,`recoverPublicKey`,`normalize` function, because it was no longer needed in our project.
- In `src/sign-typed-data.ts`, we removed the `signTypedData`,`recoverTypedSignature` function, because it was no longer needed in our project.
- In `src/personal-sign.ts`, we removed the entire module since it was not used in MyProject.