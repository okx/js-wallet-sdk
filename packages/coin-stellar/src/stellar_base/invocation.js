import { Asset } from './asset';
import { Address } from './address';
import { scValToNative } from './scval';

/**
 * @typedef CreateInvocation
 *
 * @prop {'wasm'|'sac'} type  a type indicating if this creation was a custom
 *    contract or a wrapping of an existing Stellar asset
 * @prop {string} [token] when `type=='sac'`, the canonical {@link Asset} that
 *    is being wrapped by this Stellar Asset Contract
 * @prop {object} [wasm]  when `type=='wasm'`, add'l creation parameters
 *
 * @prop {string} wasm.hash     hex hash of WASM bytecode backing this contract
 * @prop {string} wasm.address  contract address of this deployment
 * @prop {string} wasm.salt     hex salt that the user consumed when creating
 *    this contract (encoded in the resulting address)
 */

/**
 * @typedef ExecuteInvocation
 *
 * @prop {string} source    the strkey of the contract (C...) being invoked
 * @prop {string} function  the name of the function being invoked
 * @prop {any[]}  args      the natively-represented parameters to the function
 *    invocation (see {@link scValToNative}) for rules on how they're
 *    represented a JS types
 */

/**
 * @typedef InvocationTree
 * @prop {'execute' | 'create'} type  the type of invocation occurring, either
 *    contract creation or host function execution
 * @prop {CreateInvocation | ExecuteInvocation} args  the parameters to the
 *    invocation, depending on the type
 * @prop {InvocationTree[]} invocations   any sub-invocations that (may) occur
 *    as a result of this invocation (i.e. a tree of call stacks)
 */

/**
 * Turns a raw invocation tree into a human-readable format.
 *
 * This is designed to make the invocation tree easier to understand in order to
 * inform users about the side-effects of their contract calls. This will help
 * make informed decisions about whether or not a particular invocation will
 * result in what you expect it to.
 *
 * @param {xdr.SorobanAuthorizedInvocation} root  the raw XDR of the invocation,
 *    likely acquired from transaction simulation. this is either from the
 *    {@link Operation.invokeHostFunction} itself (the `func` field), or from
 *    the authorization entries ({@link xdr.SorobanAuthorizationEntry}, the
 *    `rootInvocation` field)
 *
 * @returns {InvocationTree}  a human-readable version of the invocation tree
 *
 * @example
 * Here, we show a browser modal after simulating an arbitrary transaction,
 * `tx`, which we assume has an `Operation.invokeHostFunction` inside of it:
 *
 * ```typescript
 * import { Server, buildInvocationTree } from '@stellar/stellar-sdk';
 *
 * const s = new Server("fill in accordingly");
 *
 * s.simulateTransaction(tx).then(
 *  (resp: SorobanRpc.SimulateTransactionResponse) => {
 *    if (SorobanRpc.isSuccessfulSim(resp) && ) {
 *      // bold assumption: there's a valid result with an auth entry
 *      alert(
 *        "You are authorizing the following invocation:\n" +
 *        JSON.stringify(
 *          buildInvocationTree(resp.result!.auth[0].rootInvocation()),
 *          null,
 *          2
 *        )
 *      );
 *    }
 *  }
 * );
 * ```
 */
export function buildInvocationTree(root) {
  const fn = root.function();

  /** @type {InvocationTree} */
  const output = {};

  /** @type {xdr.CreateContractArgs | xdr.InvokeContractArgs} */
  const inner = fn.value();

  switch (fn.switch().value) {
    // sorobanAuthorizedFunctionTypeContractFn
    case 0:
      output.type = 'execute';
      output.args = {
        source: Address.fromScAddress(inner.contractAddress()).toString(),
        function: inner.functionName(),
        args: inner.args().map((arg) => scValToNative(arg))
      };
      break;

    // sorobanAuthorizedFunctionTypeCreateContractHostFn
    case 1: {
      output.type = 'create';
      output.args = {};

      // If the executable is a WASM, the preimage MUST be an address. If it's a
      // token, the preimage MUST be an asset. This is a cheeky way to check
      // that, because wasm=0, token=1 and address=0, asset=1 in the XDR switch
      // values.
      //
      // The first part may not be true in V2, but we'd need to update this code
      // anyway so it can still be an error.
      const [exec, preimage] = [inner.executable(), inner.contractIdPreimage()];
      if (!!exec.switch().value !== !!preimage.switch().value) {
        throw new Error(
          `creation function appears invalid: ${JSON.stringify(
            inner
          )} (should be wasm+address or token+asset)`
        );
      }

      switch (exec.switch().value) {
        // contractExecutableWasm
        case 0: {
          /** @type {xdr.ContractIdPreimageFromAddress} */
          const details = preimage.fromAddress();

          output.args.type = 'wasm';
          output.args.wasm = {
            salt: details.salt().toString('hex'),
            hash: exec.wasmHash().toString('hex'),
            address: Address.fromScAddress(details.address()).toString()
          };
          break;
        }

        // contractExecutableStellarAsset
        case 1:
          output.args.type = 'sac';
          output.args.asset = Asset.fromOperation(
            preimage.fromAsset()
          ).toString();
          break;

        default:
          throw new Error(`unknown creation type: ${JSON.stringify(exec)}`);
      }

      break;
    }

    default:
      throw new Error(
        `unknown invocation type (${fn.switch()}): ${JSON.stringify(fn)}`
      );
  }

  output.invocations = root.subInvocations().map((i) => buildInvocationTree(i));
  return output;
}

/**
 * @callback InvocationWalker
 *
 * @param {xdr.SorobanAuthorizedInvocation} node  the currently explored node
 * @param {number} depth  the depth of the tree this node is occurring at (the
 *    root starts at a depth of 1)
 * @param {xdr.SorobanAuthorizedInvocation} [parent]  this `node`s parent node,
 *    if any (i.e. this doesn't exist at the root)
 *
 * @returns {boolean|null|void}   returning exactly `false` is a hint to stop
 *    exploring, other values are ignored
 */

/**
 * Executes a callback function on each node in the tree until stopped.
 *
 * Nodes are walked in a depth-first order. Returning `false` from the callback
 * stops further depth exploration at that node, but it does not stop the walk
 * in a "global" view.
 *
 * @param {xdr.SorobanAuthorizedInvocation} root  the tree to explore
 * @param {InvocationWalker} callback  the callback to execute for each node
 * @returns {void}
 */
export function walkInvocationTree(root, callback) {
  walkHelper(root, 1, callback);
}

function walkHelper(node, depth, callback, parent) {
  if (callback(node, depth, parent) === false /* allow void rv */) {
    return;
  }

  node
    .subInvocations()
    .forEach((i) => walkHelper(i, depth + 1, callback, node));
}
