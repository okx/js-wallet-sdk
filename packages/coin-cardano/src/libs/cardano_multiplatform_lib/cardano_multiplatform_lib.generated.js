// @generated file from wasmbuild -- do not edit
// deno-lint-ignore-file
// deno-fmt-ignore-file
// source-hash: ab17726f2df5571be15d036e67423022ed8f63e4
let wasm;

const cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

function getObject(idx) {
  return heap[idx];
}

function dropObject(idx) {
  if (idx < 132) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder("utf-8");

const encodeString = function (arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
};

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len);

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

function debugString(val) {
  // primitive types
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val);
  }
  if (className == "Object") {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className;
}

const CLOSURE_DTORS = new FinalizationRegistry((state) => {
  wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
});

function makeMutClosure(arg0, arg1, dtor, f) {
  const state = { a: arg0, b: arg1, cnt: 1, dtor };
  const real = (...args) => {
    // First up with a closure we increment the internal reference
    // count. This ensures that the Rust closure environment won't
    // be deallocated while we're invoking it.
    state.cnt++;
    const a = state.a;
    state.a = 0;
    try {
      return f(a, state.b, ...args);
    } finally {
      if (--state.cnt === 0) {
        wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);
        CLOSURE_DTORS.unregister(state);
      } else {
        state.a = a;
      }
    }
  };
  real.original = state;
  CLOSURE_DTORS.register(real, state, state);
  return real;
}
function __wbg_adapter_30(arg0, arg1, arg2) {
  wasm
    ._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h9de9452916ac8cca(
      arg0,
      arg1,
      addHeapObject(arg2),
    );
}

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
  return instance.ptr;
}

function getArrayU8FromWasm0(ptr, len) {
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1);
  getUint8Memory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
/**
 * @param {string} password
 * @param {string} salt
 * @param {string} nonce
 * @param {string} data
 * @returns {string}
 */
export function encrypt_with_password(password, salt, nonce, data) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(
      password,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(
      salt,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(
      nonce,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passStringToWasm0(
      data,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len3 = WASM_VECTOR_LEN;
    wasm.encrypt_with_password(
      retptr,
      ptr0,
      len0,
      ptr1,
      len1,
      ptr2,
      len2,
      ptr3,
      len3,
    );
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    var ptr4 = r0;
    var len4 = r1;
    if (r3) {
      ptr4 = 0;
      len4 = 0;
      throw takeObject(r2);
    }
    return getStringFromWasm0(ptr4, len4);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_free(ptr4, len4);
  }
}

/**
 * @param {string} password
 * @param {string} data
 * @returns {string}
 */
export function decrypt_with_password(password, data) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(
      password,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(
      data,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    wasm.decrypt_with_password(retptr, ptr0, len0, ptr1, len1);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    var ptr2 = r0;
    var len2 = r1;
    if (r3) {
      ptr2 = 0;
      len2 = 0;
      throw takeObject(r2);
    }
    return getStringFromWasm0(ptr2, len2);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_free(ptr2, len2);
  }
}

/**
 * @param {Transaction} tx
 * @param {LinearFee} linear_fee
 * @param {ExUnitPrices} ex_unit_prices
 * @returns {BigNum}
 */
export function min_fee(tx, linear_fee, ex_unit_prices) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    _assertClass(tx, Transaction);
    _assertClass(linear_fee, LinearFee);
    _assertClass(ex_unit_prices, ExUnitPrices);
    wasm.min_fee(retptr, tx.ptr, linear_fee.ptr, ex_unit_prices.ptr);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return BigNum.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {Uint8Array} bytes
 * @returns {TransactionMetadatum}
 */
export function encode_arbitrary_bytes_as_metadatum(bytes) {
  const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;
  const ret = wasm.encode_arbitrary_bytes_as_metadatum(ptr0, len0);
  return TransactionMetadatum.__wrap(ret);
}

/**
 * @param {TransactionMetadatum} metadata
 * @returns {Uint8Array}
 */
export function decode_arbitrary_bytes_from_metadatum(metadata) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    _assertClass(metadata, TransactionMetadatum);
    wasm.decode_arbitrary_bytes_from_metadatum(retptr, metadata.ptr);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    if (r3) {
      throw takeObject(r2);
    }
    var v0 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v0;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {string} json
 * @param {number} schema
 * @returns {TransactionMetadatum}
 */
export function encode_json_str_to_metadatum(json, schema) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(
      json,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.encode_json_str_to_metadatum(retptr, ptr0, len0, schema);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return TransactionMetadatum.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {TransactionMetadatum} metadatum
 * @param {number} schema
 * @returns {string}
 */
export function decode_metadatum_to_json_str(metadatum, schema) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    _assertClass(metadatum, TransactionMetadatum);
    wasm.decode_metadatum_to_json_str(retptr, metadatum.ptr, schema);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    var ptr0 = r0;
    var len0 = r1;
    if (r3) {
      ptr0 = 0;
      len0 = 0;
      throw takeObject(r2);
    }
    return getStringFromWasm0(ptr0, len0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_free(ptr0, len0);
  }
}

/**
 * @param {string} json
 * @param {number} schema
 * @returns {PlutusData}
 */
export function encode_json_str_to_plutus_datum(json, schema) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(
      json,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.encode_json_str_to_plutus_datum(retptr, ptr0, len0, schema);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return PlutusData.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {PlutusData} datum
 * @param {number} schema
 * @returns {string}
 */
export function decode_plutus_datum_to_json_str(datum, schema) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    _assertClass(datum, PlutusData);
    wasm.decode_plutus_datum_to_json_str(retptr, datum.ptr, schema);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    var ptr0 = r0;
    var len0 = r1;
    if (r3) {
      ptr0 = 0;
      len0 = 0;
      throw takeObject(r2);
    }
    return getStringFromWasm0(ptr0, len0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_free(ptr0, len0);
  }
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
  if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
    cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
  }
  return cachedUint32Memory0;
}

function passArray32ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 4);
  getUint32Memory0().set(arg, ptr / 4);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}

function getArrayU32FromWasm0(ptr, len) {
  return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}
/**
 * @param {TransactionHash} tx_body_hash
 * @param {ByronAddress} addr
 * @param {LegacyDaedalusPrivateKey} key
 * @returns {BootstrapWitness}
 */
export function make_daedalus_bootstrap_witness(tx_body_hash, addr, key) {
  _assertClass(tx_body_hash, TransactionHash);
  _assertClass(addr, ByronAddress);
  _assertClass(key, LegacyDaedalusPrivateKey);
  const ret = wasm.make_daedalus_bootstrap_witness(
    tx_body_hash.ptr,
    addr.ptr,
    key.ptr,
  );
  return BootstrapWitness.__wrap(ret);
}

/**
 * @param {TransactionHash} tx_body_hash
 * @param {ByronAddress} addr
 * @param {Bip32PrivateKey} key
 * @returns {BootstrapWitness}
 */
export function make_icarus_bootstrap_witness(tx_body_hash, addr, key) {
  _assertClass(tx_body_hash, TransactionHash);
  _assertClass(addr, ByronAddress);
  _assertClass(key, Bip32PrivateKey);
  const ret = wasm.make_icarus_bootstrap_witness(
    tx_body_hash.ptr,
    addr.ptr,
    key.ptr,
  );
  return BootstrapWitness.__wrap(ret);
}

/**
 * @param {TransactionHash} tx_body_hash
 * @param {PrivateKey} sk
 * @returns {Vkeywitness}
 */
export function make_vkey_witness(tx_body_hash, sk) {
  _assertClass(tx_body_hash, TransactionHash);
  _assertClass(sk, PrivateKey);
  const ret = wasm.make_vkey_witness(tx_body_hash.ptr, sk.ptr);
  return Vkeywitness.__wrap(ret);
}

/**
 * @param {AuxiliaryData} auxiliary_data
 * @returns {AuxiliaryDataHash}
 */
export function hash_auxiliary_data(auxiliary_data) {
  _assertClass(auxiliary_data, AuxiliaryData);
  const ret = wasm.hash_auxiliary_data(auxiliary_data.ptr);
  return AuxiliaryDataHash.__wrap(ret);
}

/**
 * @param {TransactionBody} tx_body
 * @returns {TransactionHash}
 */
export function hash_transaction(tx_body) {
  _assertClass(tx_body, TransactionBody);
  const ret = wasm.hash_transaction(tx_body.ptr);
  return TransactionHash.__wrap(ret);
}

/**
 * @param {PlutusData} plutus_data
 * @returns {DataHash}
 */
export function hash_plutus_data(plutus_data) {
  _assertClass(plutus_data, PlutusData);
  const ret = wasm.hash_plutus_data(plutus_data.ptr);
  return DataHash.__wrap(ret);
}

/**
 * @param {Uint8Array} data
 * @returns {Uint8Array}
 */
export function hash_blake2b256(data) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.hash_blake2b256(retptr, ptr0, len0);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v1 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v1;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {Uint8Array} data
 * @returns {Uint8Array}
 */
export function hash_blake2b224(data) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.hash_blake2b224(retptr, ptr0, len0);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v1 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v1;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {Redeemers} redeemers
 * @param {Costmdls} cost_models
 * @param {PlutusList | undefined} datums
 * @returns {ScriptDataHash}
 */
export function hash_script_data(redeemers, cost_models, datums) {
  _assertClass(redeemers, Redeemers);
  _assertClass(cost_models, Costmdls);
  let ptr0 = 0;
  if (!isLikeNone(datums)) {
    _assertClass(datums, PlutusList);
    ptr0 = datums.__destroy_into_raw();
  }
  const ret = wasm.hash_script_data(redeemers.ptr, cost_models.ptr, ptr0);
  return ScriptDataHash.__wrap(ret);
}

/**
 * @param {TransactionBody} txbody
 * @param {BigNum} pool_deposit
 * @param {BigNum} key_deposit
 * @returns {Value}
 */
export function get_implicit_input(txbody, pool_deposit, key_deposit) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    _assertClass(txbody, TransactionBody);
    _assertClass(pool_deposit, BigNum);
    _assertClass(key_deposit, BigNum);
    wasm.get_implicit_input(
      retptr,
      txbody.ptr,
      pool_deposit.ptr,
      key_deposit.ptr,
    );
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return Value.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {TransactionBody} txbody
 * @param {BigNum} pool_deposit
 * @param {BigNum} key_deposit
 * @returns {BigNum}
 */
export function get_deposit(txbody, pool_deposit, key_deposit) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    _assertClass(txbody, TransactionBody);
    _assertClass(pool_deposit, BigNum);
    _assertClass(key_deposit, BigNum);
    wasm.get_deposit(retptr, txbody.ptr, pool_deposit.ptr, key_deposit.ptr);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return BigNum.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {TransactionOutput} output
 * @param {BigNum} coins_per_utxo_byte
 * @returns {BigNum}
 */
export function min_ada_required(output, coins_per_utxo_byte) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    _assertClass(output, TransactionOutput);
    _assertClass(coins_per_utxo_byte, BigNum);
    wasm.min_ada_required(retptr, output.ptr, coins_per_utxo_byte.ptr);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return BigNum.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * Receives a script JSON string
 * and returns a NativeScript.
 * Cardano Wallet and Node styles are supported.
 *
 * * wallet: https://github.com/input-output-hk/cardano-wallet/blob/master/specifications/api/swagger.yaml
 * * node: https://github.com/input-output-hk/cardano-node/blob/master/doc/reference/simple-scripts.md
 *
 * self_xpub is expected to be a Bip32PublicKey as hex-encoded bytes
 * @param {string} json
 * @param {string} self_xpub
 * @param {number} schema
 * @returns {NativeScript}
 */
export function encode_json_str_to_native_script(json, self_xpub, schema) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(
      json,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(
      self_xpub,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    wasm.encode_json_str_to_native_script(
      retptr,
      ptr0,
      len0,
      ptr1,
      len1,
      schema,
    );
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return NativeScript.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {PlutusList} params
 * @param {PlutusScript} plutus_script
 * @returns {PlutusScript}
 */
export function apply_params_to_plutus_script(params, plutus_script) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    _assertClass(params, PlutusList);
    _assertClass(plutus_script, PlutusScript);
    var ptr0 = plutus_script.__destroy_into_raw();
    wasm.apply_params_to_plutus_script(retptr, params.ptr, ptr0);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return PlutusScript.__wrap(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
  }
}
function __wbg_adapter_1680(arg0, arg1, arg2, arg3) {
  wasm.wasm_bindgen__convert__closures__invoke2_mut__h36afefe016e25d40(
    arg0,
    arg1,
    addHeapObject(arg2),
    addHeapObject(arg3),
  );
}

/** */
export const StakeCredKind = Object.freeze({
  Key: 0,
  "0": "Key",
  Script: 1,
  "1": "Script",
});
/** */
export const GovernanceActionKind = Object.freeze({
  ParameterChangeAction: 0,
  "0": "ParameterChangeAction",
  HardForkInitiationAction: 1,
  "1": "HardForkInitiationAction",
  TreasuryWithdrawalsAction: 2,
  "2": "TreasuryWithdrawalsAction",
  NoConfidence: 3,
  "3": "NoConfidence",
  NewCommittee: 4,
  "4": "NewCommittee",
  NewConstitution: 5,
  "5": "NewConstitution",
  InfoAction: 6,
  "6": "InfoAction",
});
/** */
export const VoterKind = Object.freeze({
  CommitteeHotKeyHash: 0,
  "0": "CommitteeHotKeyHash",
  CommitteeHotScriptHash: 1,
  "1": "CommitteeHotScriptHash",
  DrepKeyHash: 2,
  "2": "DrepKeyHash",
  DrepScriptHash: 3,
  "3": "DrepScriptHash",
  StakingPoolKeyHash: 4,
  "4": "StakingPoolKeyHash",
});
/** */
export const VoteKind = Object.freeze({
  No: 0,
  "0": "No",
  Yes: 1,
  "1": "Yes",
  Abstain: 2,
  "2": "Abstain",
});
/** */
export const DrepKind = Object.freeze({
  KeyHash: 0,
  "0": "KeyHash",
  ScriptHash: 1,
  "1": "ScriptHash",
  Abstain: 2,
  "2": "Abstain",
  NoConfidence: 3,
  "3": "NoConfidence",
});
/** */
export const TransactionMetadatumKind = Object.freeze({
  MetadataMap: 0,
  "0": "MetadataMap",
  MetadataList: 1,
  "1": "MetadataList",
  Int: 2,
  "2": "Int",
  Bytes: 3,
  "3": "Bytes",
  Text: 4,
  "4": "Text",
});
/** */
export const MetadataJsonSchema = Object.freeze({
  NoConversions: 0,
  "0": "NoConversions",
  BasicConversions: 1,
  "1": "BasicConversions",
  DetailedSchema: 2,
  "2": "DetailedSchema",
});
/** */
export const LanguageKind = Object.freeze({
  PlutusV1: 0,
  "0": "PlutusV1",
  PlutusV2: 1,
  "1": "PlutusV2",
  PlutusV3: 2,
  "2": "PlutusV3",
});
/** */
export const PlutusDataKind = Object.freeze({
  ConstrPlutusData: 0,
  "0": "ConstrPlutusData",
  Map: 1,
  "1": "Map",
  List: 2,
  "2": "List",
  Integer: 3,
  "3": "Integer",
  Bytes: 4,
  "4": "Bytes",
});
/** */
export const RedeemerTagKind = Object.freeze({
  Spend: 0,
  "0": "Spend",
  Mint: 1,
  "1": "Mint",
  Cert: 2,
  "2": "Cert",
  Reward: 3,
  "3": "Reward",
  Drep: 4,
  "4": "Drep",
});
/**
 * JSON <-> PlutusData conversion schemas.
 * Follows ScriptDataJsonSchema in cardano-cli defined at:
 * https://github.com/input-output-hk/cardano-node/blob/master/cardano-api/src/Cardano/Api/ScriptData.hs#L254
 *
 * All methods here have the following restrictions due to limitations on dependencies:
 * * JSON numbers above u64::MAX (positive) or below i64::MIN (negative) will throw errors
 * * Hex strings for bytes don't accept odd-length (half-byte) strings.
 *      cardano-cli seems to support these however but it seems to be different than just 0-padding
 *      on either side when tested so proceed with caution
 */
export const PlutusDatumSchema = Object.freeze({
  /**
   * ScriptDataJsonNoSchema in cardano-node.
   *
   * This is the format used by --script-data-value in cardano-cli
   * This tries to accept most JSON but does not support the full spectrum of Plutus datums.
   * From JSON:
   * * null/true/false/floats NOT supported
   * * strings starting with 0x are treated as hex bytes. All other strings are encoded as their utf8 bytes.
   * To JSON:
   * * ConstrPlutusData not supported in ANY FORM (neither keys nor values)
   * * Lists not supported in keys
   * * Maps not supported in keys
   */
  BasicConversions: 0,
  "0": "BasicConversions",
  /**
   * ScriptDataJsonDetailedSchema in cardano-node.
   *
   * This is the format used by --script-data-file in cardano-cli
   * This covers almost all (only minor exceptions) Plutus datums, but the JSON must conform to a strict schema.
   * The schema specifies that ALL keys and ALL values must be contained in a JSON map with 2 cases:
   * 1. For ConstrPlutusData there must be two fields "constructor" contianing a number and "fields" containing its fields
   *    e.g. { "constructor": 2, "fields": [{"int": 2}, {"list": [{"bytes": "CAFEF00D"}]}]}
   * 2. For all other cases there must be only one field named "int", "bytes", "list" or "map"
   *    Integer's value is a JSON number e.g. {"int": 100}
   *    Bytes' value is a hex string representing the bytes WITHOUT any prefix e.g. {"bytes": "CAFEF00D"}
   *    Lists' value is a JSON list of its elements encoded via the same schema e.g. {"list": [{"bytes": "CAFEF00D"}]}
   *    Maps' value is a JSON list of objects, one for each key-value pair in the map, with keys "k" and "v"
   *          respectively with their values being the plutus datum encoded via this same schema
   *          e.g. {"map": [
   *              {"k": {"int": 2}, "v": {"int": 5}},
   *              {"k": {"map": [{"k": {"list": [{"int": 1}]}, "v": {"bytes": "FF03"}}]}, "v": {"list": []}}
   *          ]}
   * From JSON:
   * * null/true/false/floats NOT supported
   * * the JSON must conform to a very specific schema
   * To JSON:
   * * all Plutus datums should be fully supported outside of the integer range limitations outlined above.
   */
  DetailedSchema: 1,
  "1": "DetailedSchema",
});
/** */
export const ScriptKind = Object.freeze({
  NativeScript: 0,
  "0": "NativeScript",
  PlutusScriptV1: 1,
  "1": "PlutusScriptV1",
  PlutusScriptV2: 2,
  "2": "PlutusScriptV2",
  PlutusScriptV3: 3,
  "3": "PlutusScriptV3",
});
/** */
export const DatumKind = Object.freeze({
  Hash: 0,
  "0": "Hash",
  Data: 1,
  "1": "Data",
});
/**
 * Each new language uses a different namespace for hashing its script
 * This is because you could have a language where the same bytes have different semantics
 * So this avoids scripts in different languages mapping to the same hash
 * Note that the enum value here is different than the enum value for deciding the cost model of a script
 * https://github.com/input-output-hk/cardano-ledger/blob/9c3b4737b13b30f71529e76c5330f403165e28a6/eras/alonzo/impl/src/Cardano/Ledger/Alonzo.hs#L127
 */
export const ScriptHashNamespace = Object.freeze({
  NativeScript: 0,
  "0": "NativeScript",
  PlutusV1: 1,
  "1": "PlutusV1",
  PlutusV2: 2,
  "2": "PlutusV2",
});
/**
 * Used to choose the schema for a script JSON string
 */
export const ScriptSchema = Object.freeze({
  Wallet: 0,
  "0": "Wallet",
  Node: 1,
  "1": "Node",
});
/** */
export const ScriptWitnessKind = Object.freeze({
  NativeWitness: 0,
  "0": "NativeWitness",
  PlutusWitness: 1,
  "1": "PlutusWitness",
});
/** */
export const CertificateKind = Object.freeze({
  StakeRegistration: 0,
  "0": "StakeRegistration",
  StakeDeregistration: 1,
  "1": "StakeDeregistration",
  StakeDelegation: 2,
  "2": "StakeDelegation",
  PoolRegistration: 3,
  "3": "PoolRegistration",
  PoolRetirement: 4,
  "4": "PoolRetirement",
  GenesisKeyDelegation: 5,
  "5": "GenesisKeyDelegation",
  MoveInstantaneousRewardsCert: 6,
  "6": "MoveInstantaneousRewardsCert",
  RegCert: 7,
  "7": "RegCert",
  UnregCert: 8,
  "8": "UnregCert",
  VoteDelegCert: 9,
  "9": "VoteDelegCert",
  StakeVoteDelegCert: 10,
  "10": "StakeVoteDelegCert",
  StakeRegDelegCert: 11,
  "11": "StakeRegDelegCert",
  VoteRegDelegCert: 12,
  "12": "VoteRegDelegCert",
  StakeVoteRegDelegCert: 13,
  "13": "StakeVoteRegDelegCert",
  RegCommitteeHotKeyCert: 14,
  "14": "RegCommitteeHotKeyCert",
  UnregCommitteeHotKeyCert: 15,
  "15": "UnregCommitteeHotKeyCert",
  RegDrepCert: 16,
  "16": "RegDrepCert",
  UnregDrepCert: 17,
  "17": "UnregDrepCert",
});
/** */
export const MIRPot = Object.freeze({
  Reserves: 0,
  "0": "Reserves",
  Treasury: 1,
  "1": "Treasury",
});
/** */
export const MIRKind = Object.freeze({
  ToOtherPot: 0,
  "0": "ToOtherPot",
  ToStakeCredentials: 1,
  "1": "ToStakeCredentials",
});
/** */
export const RelayKind = Object.freeze({
  SingleHostAddr: 0,
  "0": "SingleHostAddr",
  SingleHostName: 1,
  "1": "SingleHostName",
  MultiHostName: 2,
  "2": "MultiHostName",
});
/** */
export const NativeScriptKind = Object.freeze({
  ScriptPubkey: 0,
  "0": "ScriptPubkey",
  ScriptAll: 1,
  "1": "ScriptAll",
  ScriptAny: 2,
  "2": "ScriptAny",
  ScriptNOfK: 3,
  "3": "ScriptNOfK",
  TimelockStart: 4,
  "4": "TimelockStart",
  TimelockExpiry: 5,
  "5": "TimelockExpiry",
});
/** */
export const NetworkIdKind = Object.freeze({
  Testnet: 0,
  "0": "Testnet",
  Mainnet: 1,
  "1": "Mainnet",
});

const AddressFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_address_free(ptr)
);
/** */
export class Address {
  static __wrap(ptr) {
    const obj = Object.create(Address.prototype);
    obj.ptr = ptr;
    AddressFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    AddressFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_address_free(ptr);
  }
  /**
   * @param {Uint8Array} data
   * @returns {Address}
   */
  static from_bytes(data) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.address_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Address.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.address_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.address_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Address}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.address_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Address.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.address_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string | undefined} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      var ptr0 = isLikeNone(prefix)
        ? 0
        : passStringToWasm0(
          prefix,
          wasm.__wbindgen_malloc,
          wasm.__wbindgen_realloc,
        );
      var len0 = WASM_VECTOR_LEN;
      wasm.address_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {Address}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.address_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Address.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number}
   */
  network_id() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.address_network_id(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return r0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {ByronAddress | undefined}
   */
  as_byron() {
    const ret = wasm.address_as_byron(this.ptr);
    return ret === 0 ? undefined : ByronAddress.__wrap(ret);
  }
  /**
   * @returns {RewardAddress | undefined}
   */
  as_reward() {
    const ret = wasm.address_as_reward(this.ptr);
    return ret === 0 ? undefined : RewardAddress.__wrap(ret);
  }
  /**
   * @returns {PointerAddress | undefined}
   */
  as_pointer() {
    const ret = wasm.address_as_pointer(this.ptr);
    return ret === 0 ? undefined : PointerAddress.__wrap(ret);
  }
  /**
   * @returns {EnterpriseAddress | undefined}
   */
  as_enterprise() {
    const ret = wasm.address_as_enterprise(this.ptr);
    return ret === 0 ? undefined : EnterpriseAddress.__wrap(ret);
  }
  /**
   * @returns {BaseAddress | undefined}
   */
  as_base() {
    const ret = wasm.address_as_base(this.ptr);
    return ret === 0 ? undefined : BaseAddress.__wrap(ret);
  }
}

const AnchorFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_anchor_free(ptr)
);
/** */
export class Anchor {
  static __wrap(ptr) {
    const obj = Object.create(Anchor.prototype);
    obj.ptr = ptr;
    AnchorFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    AnchorFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_anchor_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.anchor_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Anchor}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.anchor_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Anchor.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.anchor_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.anchor_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Anchor}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.anchor_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Anchor.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Url}
   */
  anchor_url() {
    const ret = wasm.anchor_anchor_url(this.ptr);
    return Url.__wrap(ret);
  }
  /**
   * @returns {DataHash}
   */
  anchor_data_hash() {
    const ret = wasm.anchor_anchor_data_hash(this.ptr);
    return DataHash.__wrap(ret);
  }
  /**
   * @param {Url} anchor_url
   * @param {DataHash} anchor_data_hash
   * @returns {Anchor}
   */
  static new(anchor_url, anchor_data_hash) {
    _assertClass(anchor_url, Url);
    _assertClass(anchor_data_hash, DataHash);
    const ret = wasm.anchor_new(anchor_url.ptr, anchor_data_hash.ptr);
    return Anchor.__wrap(ret);
  }
}

const AssetNameFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_assetname_free(ptr)
);
/** */
export class AssetName {
  static __wrap(ptr) {
    const obj = Object.create(AssetName.prototype);
    obj.ptr = ptr;
    AssetNameFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    AssetNameFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_assetname_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assetname_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {AssetName}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.assetname_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return AssetName.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assetname_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assetname_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {AssetName}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.assetname_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return AssetName.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} name
   * @returns {AssetName}
   */
  static new(name) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(name, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.assetname_new(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return AssetName.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  name() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assetname_name(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const AssetNamesFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_assetnames_free(ptr)
);
/** */
export class AssetNames {
  static __wrap(ptr) {
    const obj = Object.create(AssetNames.prototype);
    obj.ptr = ptr;
    AssetNamesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    AssetNamesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_assetnames_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assetnames_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {AssetNames}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.assetnames_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return AssetNames.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assetnames_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assetnames_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {AssetNames}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.assetnames_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return AssetNames.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {AssetNames}
   */
  static new() {
    const ret = wasm.assetnames_new();
    return AssetNames.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {AssetName}
   */
  get(index) {
    const ret = wasm.assetnames_get(this.ptr, index);
    return AssetName.__wrap(ret);
  }
  /**
   * @param {AssetName} elem
   */
  add(elem) {
    _assertClass(elem, AssetName);
    wasm.assetnames_add(this.ptr, elem.ptr);
  }
}

const AssetsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_assets_free(ptr)
);
/** */
export class Assets {
  static __wrap(ptr) {
    const obj = Object.create(Assets.prototype);
    obj.ptr = ptr;
    AssetsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    AssetsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_assets_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assets_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Assets}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.assets_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Assets.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assets_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assets_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Assets}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.assets_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Assets.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Assets}
   */
  static new() {
    const ret = wasm.assets_new();
    return Assets.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {AssetName} key
   * @param {BigNum} value
   * @returns {BigNum | undefined}
   */
  insert(key, value) {
    _assertClass(key, AssetName);
    _assertClass(value, BigNum);
    const ret = wasm.assets_insert(this.ptr, key.ptr, value.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {AssetName} key
   * @returns {BigNum | undefined}
   */
  get(key) {
    _assertClass(key, AssetName);
    const ret = wasm.assets_get(this.ptr, key.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @returns {AssetNames}
   */
  keys() {
    const ret = wasm.assets_keys(this.ptr);
    return AssetNames.__wrap(ret);
  }
}

const AuxiliaryDataFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_auxiliarydata_free(ptr)
);
/** */
export class AuxiliaryData {
  static __wrap(ptr) {
    const obj = Object.create(AuxiliaryData.prototype);
    obj.ptr = ptr;
    AuxiliaryDataFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    AuxiliaryDataFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_auxiliarydata_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydata_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {AuxiliaryData}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydata_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return AuxiliaryData.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydata_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydata_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {AuxiliaryData}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydata_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return AuxiliaryData.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {AuxiliaryData}
   */
  static new() {
    const ret = wasm.auxiliarydata_new();
    return AuxiliaryData.__wrap(ret);
  }
  /**
   * @returns {GeneralTransactionMetadata | undefined}
   */
  metadata() {
    const ret = wasm.auxiliarydata_metadata(this.ptr);
    return ret === 0 ? undefined : GeneralTransactionMetadata.__wrap(ret);
  }
  /**
   * @param {GeneralTransactionMetadata} metadata
   */
  set_metadata(metadata) {
    _assertClass(metadata, GeneralTransactionMetadata);
    wasm.auxiliarydata_set_metadata(this.ptr, metadata.ptr);
  }
  /**
   * @returns {NativeScripts | undefined}
   */
  native_scripts() {
    const ret = wasm.auxiliarydata_native_scripts(this.ptr);
    return ret === 0 ? undefined : NativeScripts.__wrap(ret);
  }
  /**
   * @param {NativeScripts} native_scripts
   */
  set_native_scripts(native_scripts) {
    _assertClass(native_scripts, NativeScripts);
    wasm.auxiliarydata_set_native_scripts(this.ptr, native_scripts.ptr);
  }
  /**
   * @returns {PlutusScripts | undefined}
   */
  plutus_scripts() {
    const ret = wasm.auxiliarydata_plutus_scripts(this.ptr);
    return ret === 0 ? undefined : PlutusScripts.__wrap(ret);
  }
  /**
   * @returns {PlutusScripts | undefined}
   */
  plutus_v2_scripts() {
    const ret = wasm.auxiliarydata_plutus_v2_scripts(this.ptr);
    return ret === 0 ? undefined : PlutusScripts.__wrap(ret);
  }
  /**
   * @returns {PlutusScripts | undefined}
   */
  plutus_v3_scripts() {
    const ret = wasm.auxiliarydata_plutus_v3_scripts(this.ptr);
    return ret === 0 ? undefined : PlutusScripts.__wrap(ret);
  }
  /**
   * @param {PlutusScripts} plutus_scripts
   */
  set_plutus_scripts(plutus_scripts) {
    _assertClass(plutus_scripts, PlutusScripts);
    wasm.auxiliarydata_set_plutus_scripts(this.ptr, plutus_scripts.ptr);
  }
  /**
   * @param {PlutusScripts} plutus_scripts
   */
  set_plutus_v2_scripts(plutus_scripts) {
    _assertClass(plutus_scripts, PlutusScripts);
    wasm.auxiliarydata_set_plutus_v2_scripts(this.ptr, plutus_scripts.ptr);
  }
  /**
   * @param {PlutusScripts} plutus_scripts
   */
  set_plutus_v3_scripts(plutus_scripts) {
    _assertClass(plutus_scripts, PlutusScripts);
    wasm.auxiliarydata_set_plutus_v3_scripts(this.ptr, plutus_scripts.ptr);
  }
}

const AuxiliaryDataHashFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_auxiliarydatahash_free(ptr)
);
/** */
export class AuxiliaryDataHash {
  static __wrap(ptr) {
    const obj = Object.create(AuxiliaryDataHash.prototype);
    obj.ptr = ptr;
    AuxiliaryDataHashFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    AuxiliaryDataHashFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_auxiliarydatahash_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {AuxiliaryDataHash}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydatahash_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return AuxiliaryDataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        prefix,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydatahash_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {AuxiliaryDataHash}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydatahash_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return AuxiliaryDataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} hex
   * @returns {AuxiliaryDataHash}
   */
  static from_hex(hex) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        hex,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydatahash_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return AuxiliaryDataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const AuxiliaryDataSetFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_auxiliarydataset_free(ptr)
);
/** */
export class AuxiliaryDataSet {
  static __wrap(ptr) {
    const obj = Object.create(AuxiliaryDataSet.prototype);
    obj.ptr = ptr;
    AuxiliaryDataSetFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    AuxiliaryDataSetFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_auxiliarydataset_free(ptr);
  }
  /**
   * @returns {AuxiliaryDataSet}
   */
  static new() {
    const ret = wasm.auxiliarydataset_new();
    return AuxiliaryDataSet.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.auxiliarydataset_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {BigNum} tx_index
   * @param {AuxiliaryData} data
   * @returns {AuxiliaryData | undefined}
   */
  insert(tx_index, data) {
    _assertClass(tx_index, BigNum);
    _assertClass(data, AuxiliaryData);
    const ret = wasm.auxiliarydataset_insert(this.ptr, tx_index.ptr, data.ptr);
    return ret === 0 ? undefined : AuxiliaryData.__wrap(ret);
  }
  /**
   * @param {BigNum} tx_index
   * @returns {AuxiliaryData | undefined}
   */
  get(tx_index) {
    _assertClass(tx_index, BigNum);
    const ret = wasm.auxiliarydataset_get(this.ptr, tx_index.ptr);
    return ret === 0 ? undefined : AuxiliaryData.__wrap(ret);
  }
  /**
   * @returns {TransactionIndexes}
   */
  indices() {
    const ret = wasm.auxiliarydataset_indices(this.ptr);
    return TransactionIndexes.__wrap(ret);
  }
}

const BaseAddressFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_baseaddress_free(ptr)
);
/** */
export class BaseAddress {
  static __wrap(ptr) {
    const obj = Object.create(BaseAddress.prototype);
    obj.ptr = ptr;
    BaseAddressFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    BaseAddressFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_baseaddress_free(ptr);
  }
  /**
   * @param {number} network
   * @param {StakeCredential} payment
   * @param {StakeCredential} stake
   * @returns {BaseAddress}
   */
  static new(network, payment, stake) {
    _assertClass(payment, StakeCredential);
    _assertClass(stake, StakeCredential);
    const ret = wasm.baseaddress_new(network, payment.ptr, stake.ptr);
    return BaseAddress.__wrap(ret);
  }
  /**
   * @returns {StakeCredential}
   */
  payment_cred() {
    const ret = wasm.baseaddress_payment_cred(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {StakeCredential}
   */
  stake_cred() {
    const ret = wasm.baseaddress_stake_cred(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {Address}
   */
  to_address() {
    const ret = wasm.baseaddress_to_address(this.ptr);
    return Address.__wrap(ret);
  }
  /**
   * @param {Address} addr
   * @returns {BaseAddress | undefined}
   */
  static from_address(addr) {
    _assertClass(addr, Address);
    const ret = wasm.address_as_base(addr.ptr);
    return ret === 0 ? undefined : BaseAddress.__wrap(ret);
  }
}

const BigIntFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_bigint_free(ptr)
);
/** */
export class BigInt {
  static __wrap(ptr) {
    const obj = Object.create(BigInt.prototype);
    obj.ptr = ptr;
    BigIntFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    BigIntFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_bigint_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bigint_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {BigInt}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.bigint_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigInt.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {BigNum | undefined}
   */
  as_u64() {
    const ret = wasm.bigint_as_u64(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @returns {Int | undefined}
   */
  as_int() {
    const ret = wasm.bigint_as_int(this.ptr);
    return ret === 0 ? undefined : Int.__wrap(ret);
  }
  /**
   * @param {string} text
   * @returns {BigInt}
   */
  static from_str(text) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        text,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.bigint_from_str(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigInt.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_str() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bigint_to_str(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
}

const BigNumFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_bignum_free(ptr)
);
/** */
export class BigNum {
  static __wrap(ptr) {
    const obj = Object.create(BigNum.prototype);
    obj.ptr = ptr;
    BigNumFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    BigNumFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_bignum_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bignum_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {BigNum}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.bignum_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} string
   * @returns {BigNum}
   */
  static from_str(string) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        string,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.bignum_from_str(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_str() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bignum_to_str(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @returns {BigNum}
   */
  static zero() {
    const ret = wasm.bignum_zero();
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {boolean}
   */
  is_zero() {
    const ret = wasm.bignum_is_zero(this.ptr);
    return ret !== 0;
  }
  /**
   * @param {BigNum} other
   * @returns {BigNum}
   */
  checked_mul(other) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(other, BigNum);
      wasm.bignum_checked_mul(retptr, this.ptr, other.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {BigNum} other
   * @returns {BigNum}
   */
  checked_add(other) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(other, BigNum);
      wasm.bignum_checked_add(retptr, this.ptr, other.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {BigNum} other
   * @returns {BigNum}
   */
  checked_sub(other) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(other, BigNum);
      wasm.bignum_checked_sub(retptr, this.ptr, other.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {BigNum} other
   * @returns {BigNum}
   */
  checked_div(other) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(other, BigNum);
      wasm.bignum_checked_div(retptr, this.ptr, other.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {BigNum} other
   * @returns {BigNum}
   */
  checked_div_ceil(other) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(other, BigNum);
      wasm.bignum_checked_div_ceil(retptr, this.ptr, other.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * returns 0 if it would otherwise underflow
   * @param {BigNum} other
   * @returns {BigNum}
   */
  clamped_sub(other) {
    _assertClass(other, BigNum);
    const ret = wasm.bignum_clamped_sub(this.ptr, other.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} rhs_value
   * @returns {number}
   */
  compare(rhs_value) {
    _assertClass(rhs_value, BigNum);
    const ret = wasm.bignum_compare(this.ptr, rhs_value.ptr);
    return ret;
  }
}

const Bip32PrivateKeyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_bip32privatekey_free(ptr)
);
/** */
export class Bip32PrivateKey {
  static __wrap(ptr) {
    const obj = Object.create(Bip32PrivateKey.prototype);
    obj.ptr = ptr;
    Bip32PrivateKeyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    Bip32PrivateKeyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_bip32privatekey_free(ptr);
  }
  /**
   * derive this private key with the given index.
   *
   * # Security considerations
   *
   * * hard derivation index cannot be soft derived with the public key
   *
   * # Hard derivation vs Soft derivation
   *
   * If you pass an index below 0x80000000 then it is a soft derivation.
   * The advantage of soft derivation is that it is possible to derive the
   * public key too. I.e. derivation the private key with a soft derivation
   * index and then retrieving the associated public key is equivalent to
   * deriving the public key associated to the parent private key.
   *
   * Hard derivation index does not allow public key derivation.
   *
   * This is why deriving the private key should not fail while deriving
   * the public key may fail (if the derivation index is invalid).
   * @param {number} index
   * @returns {Bip32PrivateKey}
   */
  derive(index) {
    const ret = wasm.bip32privatekey_derive(this.ptr, index);
    return Bip32PrivateKey.__wrap(ret);
  }
  /**
   * 128-byte xprv a key format in Cardano that some software still uses or requires
   * the traditional 96-byte xprv is simply encoded as
   * prv | chaincode
   * however, because some software may not know how to compute a public key from a private key,
   * the 128-byte inlines the public key in the following format
   * prv | pub | chaincode
   * so be careful if you see the term "xprv" as it could refer to either one
   * our library does not require the pub (instead we compute the pub key when needed)
   * @param {Uint8Array} bytes
   * @returns {Bip32PrivateKey}
   */
  static from_128_xprv(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.bip32privatekey_from_128_xprv(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Bip32PrivateKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * see from_128_xprv
   * @returns {Uint8Array}
   */
  to_128_xprv() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bip32privatekey_to_128_xprv(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Bip32PrivateKey}
   */
  static generate_ed25519_bip32() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bip32privatekey_generate_ed25519_bip32(retptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Bip32PrivateKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {PrivateKey}
   */
  to_raw_key() {
    const ret = wasm.bip32privatekey_to_raw_key(this.ptr);
    return PrivateKey.__wrap(ret);
  }
  /**
   * @returns {Bip32PublicKey}
   */
  to_public() {
    const ret = wasm.bip32privatekey_to_public(this.ptr);
    return Bip32PublicKey.__wrap(ret);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Bip32PrivateKey}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.bip32privatekey_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Bip32PrivateKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  as_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bip32privatekey_as_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} bech32_str
   * @returns {Bip32PrivateKey}
   */
  static from_bech32(bech32_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech32_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.bip32privatekey_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Bip32PrivateKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_bech32() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bip32privatekey_to_bech32(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {Uint8Array} entropy
   * @param {Uint8Array} password
   * @returns {Bip32PrivateKey}
   */
  static from_bip39_entropy(entropy, password) {
    const ptr0 = passArray8ToWasm0(entropy, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(password, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.bip32privatekey_from_bip39_entropy(ptr0, len0, ptr1, len1);
    return Bip32PrivateKey.__wrap(ret);
  }
  /**
   * @returns {Uint8Array}
   */
  chaincode() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bip32privatekey_chaincode(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const Bip32PublicKeyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_bip32publickey_free(ptr)
);
/** */
export class Bip32PublicKey {
  static __wrap(ptr) {
    const obj = Object.create(Bip32PublicKey.prototype);
    obj.ptr = ptr;
    Bip32PublicKeyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    Bip32PublicKeyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_bip32publickey_free(ptr);
  }
  /**
   * derive this public key with the given index.
   *
   * # Errors
   *
   * If the index is not a soft derivation index (< 0x80000000) then
   * calling this method will fail.
   *
   * # Security considerations
   *
   * * hard derivation index cannot be soft derived with the public key
   *
   * # Hard derivation vs Soft derivation
   *
   * If you pass an index below 0x80000000 then it is a soft derivation.
   * The advantage of soft derivation is that it is possible to derive the
   * public key too. I.e. derivation the private key with a soft derivation
   * index and then retrieving the associated public key is equivalent to
   * deriving the public key associated to the parent private key.
   *
   * Hard derivation index does not allow public key derivation.
   *
   * This is why deriving the private key should not fail while deriving
   * the public key may fail (if the derivation index is invalid).
   * @param {number} index
   * @returns {Bip32PublicKey}
   */
  derive(index) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bip32publickey_derive(retptr, this.ptr, index);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Bip32PublicKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {PublicKey}
   */
  to_raw_key() {
    const ret = wasm.bip32publickey_to_raw_key(this.ptr);
    return PublicKey.__wrap(ret);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Bip32PublicKey}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.bip32publickey_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Bip32PublicKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  as_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bip32publickey_as_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} bech32_str
   * @returns {Bip32PublicKey}
   */
  static from_bech32(bech32_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech32_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.bip32publickey_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Bip32PublicKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_bech32() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bip32publickey_to_bech32(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  chaincode() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bip32publickey_chaincode(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const BlockFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_block_free(ptr)
);
/** */
export class Block {
  static __wrap(ptr) {
    const obj = Object.create(Block.prototype);
    obj.ptr = ptr;
    BlockFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    BlockFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_block_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.block_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Block}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.block_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Block.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.block_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.block_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Block}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.block_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Block.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Header}
   */
  header() {
    const ret = wasm.block_header(this.ptr);
    return Header.__wrap(ret);
  }
  /**
   * @returns {TransactionBodies}
   */
  transaction_bodies() {
    const ret = wasm.block_transaction_bodies(this.ptr);
    return TransactionBodies.__wrap(ret);
  }
  /**
   * @returns {TransactionWitnessSets}
   */
  transaction_witness_sets() {
    const ret = wasm.block_transaction_witness_sets(this.ptr);
    return TransactionWitnessSets.__wrap(ret);
  }
  /**
   * @returns {AuxiliaryDataSet}
   */
  auxiliary_data_set() {
    const ret = wasm.block_auxiliary_data_set(this.ptr);
    return AuxiliaryDataSet.__wrap(ret);
  }
  /**
   * @returns {TransactionIndexes}
   */
  invalid_transactions() {
    const ret = wasm.block_invalid_transactions(this.ptr);
    return TransactionIndexes.__wrap(ret);
  }
  /**
   * @param {Header} header
   * @param {TransactionBodies} transaction_bodies
   * @param {TransactionWitnessSets} transaction_witness_sets
   * @param {AuxiliaryDataSet} auxiliary_data_set
   * @param {TransactionIndexes} invalid_transactions
   * @returns {Block}
   */
  static new(
    header,
    transaction_bodies,
    transaction_witness_sets,
    auxiliary_data_set,
    invalid_transactions,
  ) {
    _assertClass(header, Header);
    _assertClass(transaction_bodies, TransactionBodies);
    _assertClass(transaction_witness_sets, TransactionWitnessSets);
    _assertClass(auxiliary_data_set, AuxiliaryDataSet);
    _assertClass(invalid_transactions, TransactionIndexes);
    const ret = wasm.block_new(
      header.ptr,
      transaction_bodies.ptr,
      transaction_witness_sets.ptr,
      auxiliary_data_set.ptr,
      invalid_transactions.ptr,
    );
    return Block.__wrap(ret);
  }
}

const BlockHashFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_blockhash_free(ptr)
);
/** */
export class BlockHash {
  static __wrap(ptr) {
    const obj = Object.create(BlockHash.prototype);
    obj.ptr = ptr;
    BlockHashFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    BlockHashFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_blockhash_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {BlockHash}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.blockhash_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BlockHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        prefix,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydatahash_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {BlockHash}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.blockhash_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BlockHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} hex
   * @returns {BlockHash}
   */
  static from_hex(hex) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        hex,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.blockhash_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BlockHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const BlockfrostFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_blockfrost_free(ptr)
);
/** */
export class Blockfrost {
  static __wrap(ptr) {
    const obj = Object.create(Blockfrost.prototype);
    obj.ptr = ptr;
    BlockfrostFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    BlockfrostFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_blockfrost_free(ptr);
  }
  /**
   * @param {string} url
   * @param {string} project_id
   * @returns {Blockfrost}
   */
  static new(url, project_id) {
    const ptr0 = passStringToWasm0(
      url,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(
      project_id,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.blockfrost_new(ptr0, len0, ptr1, len1);
    return Blockfrost.__wrap(ret);
  }
  /**
   * @returns {string}
   */
  url() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.blockfrost_url(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @returns {string}
   */
  project_id() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.blockfrost_project_id(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
}

const BootstrapWitnessFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_bootstrapwitness_free(ptr)
);
/** */
export class BootstrapWitness {
  static __wrap(ptr) {
    const obj = Object.create(BootstrapWitness.prototype);
    obj.ptr = ptr;
    BootstrapWitnessFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    BootstrapWitnessFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_bootstrapwitness_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bootstrapwitness_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {BootstrapWitness}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.bootstrapwitness_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BootstrapWitness.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bootstrapwitness_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bootstrapwitness_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {BootstrapWitness}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.bootstrapwitness_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BootstrapWitness.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Vkey}
   */
  vkey() {
    const ret = wasm.bootstrapwitness_vkey(this.ptr);
    return Vkey.__wrap(ret);
  }
  /**
   * @returns {Ed25519Signature}
   */
  signature() {
    const ret = wasm.bootstrapwitness_signature(this.ptr);
    return Ed25519Signature.__wrap(ret);
  }
  /**
   * @returns {Uint8Array}
   */
  chain_code() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assetname_name(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  attributes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bootstrapwitness_attributes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Vkey} vkey
   * @param {Ed25519Signature} signature
   * @param {Uint8Array} chain_code
   * @param {Uint8Array} attributes
   * @returns {BootstrapWitness}
   */
  static new(vkey, signature, chain_code, attributes) {
    _assertClass(vkey, Vkey);
    _assertClass(signature, Ed25519Signature);
    const ptr0 = passArray8ToWasm0(chain_code, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(attributes, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.bootstrapwitness_new(
      vkey.ptr,
      signature.ptr,
      ptr0,
      len0,
      ptr1,
      len1,
    );
    return BootstrapWitness.__wrap(ret);
  }
}

const BootstrapWitnessesFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_bootstrapwitnesses_free(ptr)
);
/** */
export class BootstrapWitnesses {
  static __wrap(ptr) {
    const obj = Object.create(BootstrapWitnesses.prototype);
    obj.ptr = ptr;
    BootstrapWitnessesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    BootstrapWitnessesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_bootstrapwitnesses_free(ptr);
  }
  /**
   * @returns {BootstrapWitnesses}
   */
  static new() {
    const ret = wasm.assetnames_new();
    return BootstrapWitnesses.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {BootstrapWitness}
   */
  get(index) {
    const ret = wasm.bootstrapwitnesses_get(this.ptr, index);
    return BootstrapWitness.__wrap(ret);
  }
  /**
   * @param {BootstrapWitness} elem
   */
  add(elem) {
    _assertClass(elem, BootstrapWitness);
    wasm.bootstrapwitnesses_add(this.ptr, elem.ptr);
  }
}

const ByronAddressFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_byronaddress_free(ptr)
);
/** */
export class ByronAddress {
  static __wrap(ptr) {
    const obj = Object.create(ByronAddress.prototype);
    obj.ptr = ptr;
    ByronAddressFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ByronAddressFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_byronaddress_free(ptr);
  }
  /**
   * @returns {string}
   */
  to_base58() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.byronaddress_to_base58(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.byronaddress_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ByronAddress}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.byronaddress_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ByronAddress.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * returns the byron protocol magic embedded in the address, or mainnet id if none is present
   * note: for bech32 addresses, you need to use network_id instead
   * @returns {number}
   */
  byron_protocol_magic() {
    const ret = wasm.byronaddress_byron_protocol_magic(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {Uint8Array}
   */
  attributes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.byronaddress_attributes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number}
   */
  network_id() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.byronaddress_network_id(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return r0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} s
   * @returns {ByronAddress}
   */
  static from_base58(s) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        s,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.byronaddress_from_base58(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ByronAddress.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Bip32PublicKey} key
   * @param {number} protocol_magic
   * @returns {ByronAddress}
   */
  static icarus_from_key(key, protocol_magic) {
    _assertClass(key, Bip32PublicKey);
    const ret = wasm.byronaddress_icarus_from_key(key.ptr, protocol_magic);
    return ByronAddress.__wrap(ret);
  }
  /**
   * @param {string} s
   * @returns {boolean}
   */
  static is_valid(s) {
    const ptr0 = passStringToWasm0(
      s,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.byronaddress_is_valid(ptr0, len0);
    return ret !== 0;
  }
  /**
   * @returns {Address}
   */
  to_address() {
    const ret = wasm.byronaddress_to_address(this.ptr);
    return Address.__wrap(ret);
  }
  /**
   * @param {Address} addr
   * @returns {ByronAddress | undefined}
   */
  static from_address(addr) {
    _assertClass(addr, Address);
    const ret = wasm.address_as_byron(addr.ptr);
    return ret === 0 ? undefined : ByronAddress.__wrap(ret);
  }
}

const CertificateFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_certificate_free(ptr)
);
/** */
export class Certificate {
  static __wrap(ptr) {
    const obj = Object.create(Certificate.prototype);
    obj.ptr = ptr;
    CertificateFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    CertificateFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_certificate_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.certificate_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Certificate}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.certificate_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Certificate.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.certificate_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.certificate_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Certificate}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.certificate_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Certificate.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {StakeRegistration} stake_registration
   * @returns {Certificate}
   */
  static new_stake_registration(stake_registration) {
    _assertClass(stake_registration, StakeRegistration);
    const ret = wasm.certificate_new_stake_registration(stake_registration.ptr);
    return Certificate.__wrap(ret);
  }
  /**
   * @param {StakeDeregistration} stake_deregistration
   * @returns {Certificate}
   */
  static new_stake_deregistration(stake_deregistration) {
    _assertClass(stake_deregistration, StakeDeregistration);
    const ret = wasm.certificate_new_stake_deregistration(
      stake_deregistration.ptr,
    );
    return Certificate.__wrap(ret);
  }
  /**
   * @param {StakeDelegation} stake_delegation
   * @returns {Certificate}
   */
  static new_stake_delegation(stake_delegation) {
    _assertClass(stake_delegation, StakeDelegation);
    const ret = wasm.certificate_new_stake_delegation(stake_delegation.ptr);
    return Certificate.__wrap(ret);
  }
  /**
   * @param {PoolRegistration} pool_registration
   * @returns {Certificate}
   */
  static new_pool_registration(pool_registration) {
    _assertClass(pool_registration, PoolRegistration);
    const ret = wasm.certificate_new_pool_registration(pool_registration.ptr);
    return Certificate.__wrap(ret);
  }
  /**
   * @param {PoolRetirement} pool_retirement
   * @returns {Certificate}
   */
  static new_pool_retirement(pool_retirement) {
    _assertClass(pool_retirement, PoolRetirement);
    const ret = wasm.certificate_new_pool_retirement(pool_retirement.ptr);
    return Certificate.__wrap(ret);
  }
  /**
   * @param {GenesisKeyDelegation} genesis_key_delegation
   * @returns {Certificate}
   */
  static new_genesis_key_delegation(genesis_key_delegation) {
    _assertClass(genesis_key_delegation, GenesisKeyDelegation);
    const ret = wasm.certificate_new_genesis_key_delegation(
      genesis_key_delegation.ptr,
    );
    return Certificate.__wrap(ret);
  }
  /**
   * @param {MoveInstantaneousRewardsCert} move_instantaneous_rewards_cert
   * @returns {Certificate}
   */
  static new_move_instantaneous_rewards_cert(move_instantaneous_rewards_cert) {
    _assertClass(move_instantaneous_rewards_cert, MoveInstantaneousRewardsCert);
    const ret = wasm.certificate_new_move_instantaneous_rewards_cert(
      move_instantaneous_rewards_cert.ptr,
    );
    return Certificate.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.certificate_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {StakeRegistration | undefined}
   */
  as_stake_registration() {
    const ret = wasm.certificate_as_stake_registration(this.ptr);
    return ret === 0 ? undefined : StakeRegistration.__wrap(ret);
  }
  /**
   * @returns {StakeDeregistration | undefined}
   */
  as_stake_deregistration() {
    const ret = wasm.certificate_as_stake_deregistration(this.ptr);
    return ret === 0 ? undefined : StakeDeregistration.__wrap(ret);
  }
  /**
   * @returns {StakeDelegation | undefined}
   */
  as_stake_delegation() {
    const ret = wasm.certificate_as_stake_delegation(this.ptr);
    return ret === 0 ? undefined : StakeDelegation.__wrap(ret);
  }
  /**
   * @returns {PoolRegistration | undefined}
   */
  as_pool_registration() {
    const ret = wasm.certificate_as_pool_registration(this.ptr);
    return ret === 0 ? undefined : PoolRegistration.__wrap(ret);
  }
  /**
   * @returns {PoolRetirement | undefined}
   */
  as_pool_retirement() {
    const ret = wasm.certificate_as_pool_retirement(this.ptr);
    return ret === 0 ? undefined : PoolRetirement.__wrap(ret);
  }
  /**
   * @returns {GenesisKeyDelegation | undefined}
   */
  as_genesis_key_delegation() {
    const ret = wasm.certificate_as_genesis_key_delegation(this.ptr);
    return ret === 0 ? undefined : GenesisKeyDelegation.__wrap(ret);
  }
  /**
   * @returns {MoveInstantaneousRewardsCert | undefined}
   */
  as_move_instantaneous_rewards_cert() {
    const ret = wasm.certificate_as_move_instantaneous_rewards_cert(this.ptr);
    return ret === 0 ? undefined : MoveInstantaneousRewardsCert.__wrap(ret);
  }
  /**
   * @returns {RegCert | undefined}
   */
  as_reg_cert() {
    const ret = wasm.certificate_as_reg_cert(this.ptr);
    return ret === 0 ? undefined : RegCert.__wrap(ret);
  }
  /**
   * @returns {UnregCert | undefined}
   */
  as_unreg_cert() {
    const ret = wasm.certificate_as_unreg_cert(this.ptr);
    return ret === 0 ? undefined : UnregCert.__wrap(ret);
  }
  /**
   * @returns {VoteDelegCert | undefined}
   */
  as_vote_deleg_cert() {
    const ret = wasm.certificate_as_vote_deleg_cert(this.ptr);
    return ret === 0 ? undefined : VoteDelegCert.__wrap(ret);
  }
  /**
   * @returns {StakeVoteDelegCert | undefined}
   */
  as_stake_vote_deleg_cert() {
    const ret = wasm.certificate_as_stake_vote_deleg_cert(this.ptr);
    return ret === 0 ? undefined : StakeVoteDelegCert.__wrap(ret);
  }
  /**
   * @returns {StakeRegDelegCert | undefined}
   */
  as_stake_reg_deleg_cert() {
    const ret = wasm.certificate_as_stake_reg_deleg_cert(this.ptr);
    return ret === 0 ? undefined : StakeRegDelegCert.__wrap(ret);
  }
  /**
   * @returns {VoteRegDelegCert | undefined}
   */
  as_vote_reg_deleg_cert() {
    const ret = wasm.certificate_as_vote_reg_deleg_cert(this.ptr);
    return ret === 0 ? undefined : VoteRegDelegCert.__wrap(ret);
  }
  /**
   * @returns {StakeVoteRegDelegCert | undefined}
   */
  as_stake_vote_reg_deleg_cert() {
    const ret = wasm.certificate_as_stake_vote_reg_deleg_cert(this.ptr);
    return ret === 0 ? undefined : StakeVoteRegDelegCert.__wrap(ret);
  }
  /**
   * @returns {RegCommitteeHotKeyCert | undefined}
   */
  as_reg_committee_hot_key_cert() {
    const ret = wasm.certificate_as_reg_committee_hot_key_cert(this.ptr);
    return ret === 0 ? undefined : RegCommitteeHotKeyCert.__wrap(ret);
  }
  /**
   * @returns {UnregCommitteeHotKeyCert | undefined}
   */
  as_unreg_committee_hot_key_cert() {
    const ret = wasm.certificate_as_unreg_committee_hot_key_cert(this.ptr);
    return ret === 0 ? undefined : UnregCommitteeHotKeyCert.__wrap(ret);
  }
  /**
   * @returns {RegDrepCert | undefined}
   */
  as_reg_drep_cert() {
    const ret = wasm.certificate_as_reg_drep_cert(this.ptr);
    return ret === 0 ? undefined : RegDrepCert.__wrap(ret);
  }
  /**
   * @returns {UnregDrepCert | undefined}
   */
  as_unreg_drep_cert() {
    const ret = wasm.certificate_as_unreg_drep_cert(this.ptr);
    return ret === 0 ? undefined : UnregDrepCert.__wrap(ret);
  }
}

const CertificatesFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_certificates_free(ptr)
);
/** */
export class Certificates {
  static __wrap(ptr) {
    const obj = Object.create(Certificates.prototype);
    obj.ptr = ptr;
    CertificatesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    CertificatesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_certificates_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.certificates_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Certificates}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.certificates_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Certificates.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.certificates_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.certificates_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Certificates}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.certificates_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Certificates.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Certificates}
   */
  static new() {
    const ret = wasm.certificates_new();
    return Certificates.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {Certificate}
   */
  get(index) {
    const ret = wasm.certificates_get(this.ptr, index);
    return Certificate.__wrap(ret);
  }
  /**
   * @param {Certificate} elem
   */
  add(elem) {
    _assertClass(elem, Certificate);
    wasm.certificates_add(this.ptr, elem.ptr);
  }
}

const ConstrPlutusDataFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_constrplutusdata_free(ptr)
);
/** */
export class ConstrPlutusData {
  static __wrap(ptr) {
    const obj = Object.create(ConstrPlutusData.prototype);
    obj.ptr = ptr;
    ConstrPlutusDataFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ConstrPlutusDataFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_constrplutusdata_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.constrplutusdata_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ConstrPlutusData}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.constrplutusdata_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ConstrPlutusData.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {BigNum}
   */
  alternative() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {PlutusList}
   */
  data() {
    const ret = wasm.constrplutusdata_data(this.ptr);
    return PlutusList.__wrap(ret);
  }
  /**
   * @param {BigNum} alternative
   * @param {PlutusList} data
   * @returns {ConstrPlutusData}
   */
  static new(alternative, data) {
    _assertClass(alternative, BigNum);
    _assertClass(data, PlutusList);
    const ret = wasm.constrplutusdata_new(alternative.ptr, data.ptr);
    return ConstrPlutusData.__wrap(ret);
  }
}

const CostModelFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_costmodel_free(ptr)
);
/** */
export class CostModel {
  static __wrap(ptr) {
    const obj = Object.create(CostModel.prototype);
    obj.ptr = ptr;
    CostModelFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    CostModelFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_costmodel_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.costmodel_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {CostModel}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.costmodel_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return CostModel.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {CostModel}
   */
  static new() {
    const ret = wasm.costmodel_new();
    return CostModel.__wrap(ret);
  }
  /**
   * @returns {CostModel}
   */
  static new_plutus_v2() {
    const ret = wasm.costmodel_new_plutus_v2();
    return CostModel.__wrap(ret);
  }
  /**
   * @returns {CostModel}
   */
  static new_plutus_v3() {
    const ret = wasm.costmodel_new_plutus_v3();
    return CostModel.__wrap(ret);
  }
  /**
   * @param {number} operation
   * @param {Int} cost
   * @returns {Int}
   */
  set(operation, cost) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(cost, Int);
      wasm.costmodel_set(retptr, this.ptr, operation, cost.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Int.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} operation
   * @returns {Int}
   */
  get(operation) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.costmodel_get(retptr, this.ptr, operation);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Int.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
}

const CostmdlsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_costmdls_free(ptr)
);
/** */
export class Costmdls {
  static __wrap(ptr) {
    const obj = Object.create(Costmdls.prototype);
    obj.ptr = ptr;
    CostmdlsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    CostmdlsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_costmdls_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.costmdls_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Costmdls}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.costmdls_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Costmdls.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Costmdls}
   */
  static new() {
    const ret = wasm.assets_new();
    return Costmdls.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {Language} key
   * @param {CostModel} value
   * @returns {CostModel | undefined}
   */
  insert(key, value) {
    _assertClass(key, Language);
    _assertClass(value, CostModel);
    const ret = wasm.costmdls_insert(this.ptr, key.ptr, value.ptr);
    return ret === 0 ? undefined : CostModel.__wrap(ret);
  }
  /**
   * @param {Language} key
   * @returns {CostModel | undefined}
   */
  get(key) {
    _assertClass(key, Language);
    const ret = wasm.costmdls_get(this.ptr, key.ptr);
    return ret === 0 ? undefined : CostModel.__wrap(ret);
  }
  /**
   * @returns {Languages}
   */
  keys() {
    const ret = wasm.costmdls_keys(this.ptr);
    return Languages.__wrap(ret);
  }
}

const DNSRecordAorAAAAFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_dnsrecordaoraaaa_free(ptr)
);
/** */
export class DNSRecordAorAAAA {
  static __wrap(ptr) {
    const obj = Object.create(DNSRecordAorAAAA.prototype);
    obj.ptr = ptr;
    DNSRecordAorAAAAFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    DNSRecordAorAAAAFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_dnsrecordaoraaaa_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.dnsrecordaoraaaa_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {DNSRecordAorAAAA}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.dnsrecordaoraaaa_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return DNSRecordAorAAAA.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} dns_name
   * @returns {DNSRecordAorAAAA}
   */
  static new(dns_name) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        dns_name,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.dnsrecordaoraaaa_new(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return DNSRecordAorAAAA.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  record() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.blockfrost_url(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
}

const DNSRecordSRVFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_dnsrecordsrv_free(ptr)
);
/** */
export class DNSRecordSRV {
  static __wrap(ptr) {
    const obj = Object.create(DNSRecordSRV.prototype);
    obj.ptr = ptr;
    DNSRecordSRVFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    DNSRecordSRVFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_dnsrecordsrv_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.dnsrecordsrv_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {DNSRecordSRV}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.dnsrecordsrv_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return DNSRecordSRV.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} dns_name
   * @returns {DNSRecordSRV}
   */
  static new(dns_name) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        dns_name,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.dnsrecordsrv_new(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return DNSRecordSRV.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  record() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.blockfrost_url(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
}

const DataFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_data_free(ptr)
);
/** */
export class Data {
  static __wrap(ptr) {
    const obj = Object.create(Data.prototype);
    obj.ptr = ptr;
    DataFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    DataFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_data_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.data_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Data}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.data_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Data.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.data_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.data_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Data}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.data_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Data.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {PlutusData} plutus_data
   * @returns {Data}
   */
  static new(plutus_data) {
    _assertClass(plutus_data, PlutusData);
    const ret = wasm.data_new(plutus_data.ptr);
    return Data.__wrap(ret);
  }
  /**
   * @returns {PlutusData}
   */
  get() {
    const ret = wasm.data_get(this.ptr);
    return PlutusData.__wrap(ret);
  }
}

const DataHashFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_datahash_free(ptr)
);
/** */
export class DataHash {
  static __wrap(ptr) {
    const obj = Object.create(DataHash.prototype);
    obj.ptr = ptr;
    DataHashFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    DataHashFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_datahash_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {DataHash}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.datahash_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return DataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        prefix,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydatahash_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {DataHash}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.datahash_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return DataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} hex
   * @returns {DataHash}
   */
  static from_hex(hex) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        hex,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.datahash_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return DataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const DatumFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_datum_free(ptr)
);
/** */
export class Datum {
  static __wrap(ptr) {
    const obj = Object.create(Datum.prototype);
    obj.ptr = ptr;
    DatumFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    DatumFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_datum_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.datum_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Datum}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.datum_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Datum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.datum_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.datum_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Datum}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.datum_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Datum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {DataHash} data_hash
   * @returns {Datum}
   */
  static new_data_hash(data_hash) {
    _assertClass(data_hash, DataHash);
    const ret = wasm.datum_new_data_hash(data_hash.ptr);
    return Datum.__wrap(ret);
  }
  /**
   * @param {Data} data
   * @returns {Datum}
   */
  static new_data(data) {
    _assertClass(data, Data);
    const ret = wasm.datum_new_data(data.ptr);
    return Datum.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.datum_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {DataHash | undefined}
   */
  as_data_hash() {
    const ret = wasm.datum_as_data_hash(this.ptr);
    return ret === 0 ? undefined : DataHash.__wrap(ret);
  }
  /**
   * @returns {Data | undefined}
   */
  as_data() {
    const ret = wasm.datum_as_data(this.ptr);
    return ret === 0 ? undefined : Data.__wrap(ret);
  }
}

const DrepFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_drep_free(ptr)
);
/** */
export class Drep {
  static __wrap(ptr) {
    const obj = Object.create(Drep.prototype);
    obj.ptr = ptr;
    DrepFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    DrepFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_drep_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.drep_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Drep}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.drep_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Drep.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.drep_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.drep_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Drep}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.drep_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Drep.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Ed25519KeyHash} keyhash
   * @returns {Drep}
   */
  static new_keyhash(keyhash) {
    _assertClass(keyhash, Ed25519KeyHash);
    const ret = wasm.drep_new_keyhash(keyhash.ptr);
    return Drep.__wrap(ret);
  }
  /**
   * @param {ScriptHash} scripthash
   * @returns {Drep}
   */
  static new_scripthash(scripthash) {
    _assertClass(scripthash, ScriptHash);
    const ret = wasm.drep_new_scripthash(scripthash.ptr);
    return Drep.__wrap(ret);
  }
  /**
   * @returns {Drep}
   */
  static new_abstain() {
    const ret = wasm.drep_new_abstain();
    return Drep.__wrap(ret);
  }
  /**
   * @returns {Drep}
   */
  static new_no_confidence() {
    const ret = wasm.drep_new_no_confidence();
    return Drep.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.drep_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {Ed25519KeyHash | undefined}
   */
  as_keyhash() {
    const ret = wasm.drep_as_keyhash(this.ptr);
    return ret === 0 ? undefined : Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @returns {ScriptHash | undefined}
   */
  as_scripthash() {
    const ret = wasm.drep_as_scripthash(this.ptr);
    return ret === 0 ? undefined : ScriptHash.__wrap(ret);
  }
}

const DrepVotingThresholdsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_drepvotingthresholds_free(ptr)
);
/** */
export class DrepVotingThresholds {
  static __wrap(ptr) {
    const obj = Object.create(DrepVotingThresholds.prototype);
    obj.ptr = ptr;
    DrepVotingThresholdsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    DrepVotingThresholdsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_drepvotingthresholds_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.drepvotingthresholds_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {DrepVotingThresholds}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.drepvotingthresholds_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return DrepVotingThresholds.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.drepvotingthresholds_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.drepvotingthresholds_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {DrepVotingThresholds}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.drepvotingthresholds_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return DrepVotingThresholds.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {UnitInterval}
   */
  motion_no_confidence() {
    const ret = wasm.drepvotingthresholds_motion_no_confidence(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  committee_normal() {
    const ret = wasm.drepvotingthresholds_committee_normal(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  committee_no_confidence() {
    const ret = wasm.drepvotingthresholds_committee_no_confidence(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  update_constitution() {
    const ret = wasm.drepvotingthresholds_update_constitution(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  hard_fork_initiation() {
    const ret = wasm.drepvotingthresholds_hard_fork_initiation(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  pp_network_group() {
    const ret = wasm.drepvotingthresholds_pp_network_group(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  pp_economic_group() {
    const ret = wasm.drepvotingthresholds_pp_economic_group(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  pp_technical_group() {
    const ret = wasm.drepvotingthresholds_pp_technical_group(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  pp_governance_group() {
    const ret = wasm.drepvotingthresholds_pp_governance_group(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  treasury_withdrawal() {
    const ret = wasm.drepvotingthresholds_treasury_withdrawal(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @param {UnitInterval} motion_no_confidence
   * @param {UnitInterval} committee_normal
   * @param {UnitInterval} committee_no_confidence
   * @param {UnitInterval} update_constitution
   * @param {UnitInterval} hard_fork_initiation
   * @param {UnitInterval} pp_network_group
   * @param {UnitInterval} pp_economic_group
   * @param {UnitInterval} pp_technical_group
   * @param {UnitInterval} pp_governance_group
   * @param {UnitInterval} treasury_withdrawal
   * @returns {DrepVotingThresholds}
   */
  static new(
    motion_no_confidence,
    committee_normal,
    committee_no_confidence,
    update_constitution,
    hard_fork_initiation,
    pp_network_group,
    pp_economic_group,
    pp_technical_group,
    pp_governance_group,
    treasury_withdrawal,
  ) {
    _assertClass(motion_no_confidence, UnitInterval);
    _assertClass(committee_normal, UnitInterval);
    _assertClass(committee_no_confidence, UnitInterval);
    _assertClass(update_constitution, UnitInterval);
    _assertClass(hard_fork_initiation, UnitInterval);
    _assertClass(pp_network_group, UnitInterval);
    _assertClass(pp_economic_group, UnitInterval);
    _assertClass(pp_technical_group, UnitInterval);
    _assertClass(pp_governance_group, UnitInterval);
    _assertClass(treasury_withdrawal, UnitInterval);
    const ret = wasm.drepvotingthresholds_new(
      motion_no_confidence.ptr,
      committee_normal.ptr,
      committee_no_confidence.ptr,
      update_constitution.ptr,
      hard_fork_initiation.ptr,
      pp_network_group.ptr,
      pp_economic_group.ptr,
      pp_technical_group.ptr,
      pp_governance_group.ptr,
      treasury_withdrawal.ptr,
    );
    return DrepVotingThresholds.__wrap(ret);
  }
}

const Ed25519KeyHashFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_ed25519keyhash_free(ptr)
);
/** */
export class Ed25519KeyHash {
  static __wrap(ptr) {
    const obj = Object.create(Ed25519KeyHash.prototype);
    obj.ptr = ptr;
    Ed25519KeyHashFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    Ed25519KeyHashFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_ed25519keyhash_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Ed25519KeyHash}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.ed25519keyhash_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ed25519KeyHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        prefix,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.ed25519keyhash_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {Ed25519KeyHash}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.ed25519keyhash_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ed25519KeyHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhash_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} hex
   * @returns {Ed25519KeyHash}
   */
  static from_hex(hex) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        hex,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.ed25519keyhash_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ed25519KeyHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const Ed25519KeyHashesFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_ed25519keyhashes_free(ptr)
);
/** */
export class Ed25519KeyHashes {
  static __wrap(ptr) {
    const obj = Object.create(Ed25519KeyHashes.prototype);
    obj.ptr = ptr;
    Ed25519KeyHashesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    Ed25519KeyHashesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_ed25519keyhashes_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhashes_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Ed25519KeyHashes}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.ed25519keyhashes_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ed25519KeyHashes.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhashes_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhashes_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Ed25519KeyHashes}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.ed25519keyhashes_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ed25519KeyHashes.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Ed25519KeyHashes}
   */
  static new() {
    const ret = wasm.ed25519keyhashes_new();
    return Ed25519KeyHashes.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {Ed25519KeyHash}
   */
  get(index) {
    const ret = wasm.ed25519keyhashes_get(this.ptr, index);
    return Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @param {Ed25519KeyHash} elem
   */
  add(elem) {
    _assertClass(elem, Ed25519KeyHash);
    wasm.ed25519keyhashes_add(this.ptr, elem.ptr);
  }
}

const Ed25519SignatureFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_ed25519signature_free(ptr)
);
/** */
export class Ed25519Signature {
  static __wrap(ptr) {
    const obj = Object.create(Ed25519Signature.prototype);
    obj.ptr = ptr;
    Ed25519SignatureFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    Ed25519SignatureFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_ed25519signature_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519signature_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_bech32() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519signature_to_bech32(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519signature_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} bech32_str
   * @returns {Ed25519Signature}
   */
  static from_bech32(bech32_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech32_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.ed25519signature_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ed25519Signature.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} input
   * @returns {Ed25519Signature}
   */
  static from_hex(input) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        input,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.ed25519signature_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ed25519Signature.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Ed25519Signature}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.ed25519signature_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ed25519Signature.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const EnterpriseAddressFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_enterpriseaddress_free(ptr)
);
/** */
export class EnterpriseAddress {
  static __wrap(ptr) {
    const obj = Object.create(EnterpriseAddress.prototype);
    obj.ptr = ptr;
    EnterpriseAddressFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    EnterpriseAddressFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_enterpriseaddress_free(ptr);
  }
  /**
   * @param {number} network
   * @param {StakeCredential} payment
   * @returns {EnterpriseAddress}
   */
  static new(network, payment) {
    _assertClass(payment, StakeCredential);
    const ret = wasm.enterpriseaddress_new(network, payment.ptr);
    return EnterpriseAddress.__wrap(ret);
  }
  /**
   * @returns {StakeCredential}
   */
  payment_cred() {
    const ret = wasm.baseaddress_payment_cred(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {Address}
   */
  to_address() {
    const ret = wasm.enterpriseaddress_to_address(this.ptr);
    return Address.__wrap(ret);
  }
  /**
   * @param {Address} addr
   * @returns {EnterpriseAddress | undefined}
   */
  static from_address(addr) {
    _assertClass(addr, Address);
    const ret = wasm.address_as_enterprise(addr.ptr);
    return ret === 0 ? undefined : EnterpriseAddress.__wrap(ret);
  }
}

const ExUnitPricesFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_exunitprices_free(ptr)
);
/** */
export class ExUnitPrices {
  static __wrap(ptr) {
    const obj = Object.create(ExUnitPrices.prototype);
    obj.ptr = ptr;
    ExUnitPricesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ExUnitPricesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_exunitprices_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.exunitprices_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ExUnitPrices}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.exunitprices_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ExUnitPrices.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {UnitInterval}
   */
  mem_price() {
    const ret = wasm.drepvotingthresholds_motion_no_confidence(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  step_price() {
    const ret = wasm.drepvotingthresholds_committee_normal(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @param {UnitInterval} mem_price
   * @param {UnitInterval} step_price
   * @returns {ExUnitPrices}
   */
  static new(mem_price, step_price) {
    _assertClass(mem_price, UnitInterval);
    _assertClass(step_price, UnitInterval);
    const ret = wasm.exunitprices_new(mem_price.ptr, step_price.ptr);
    return ExUnitPrices.__wrap(ret);
  }
  /**
   * @param {number} mem_price
   * @param {number} step_price
   * @returns {ExUnitPrices}
   */
  static from_float(mem_price, step_price) {
    const ret = wasm.exunitprices_from_float(mem_price, step_price);
    return ExUnitPrices.__wrap(ret);
  }
}

const ExUnitsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_exunits_free(ptr)
);
/** */
export class ExUnits {
  static __wrap(ptr) {
    const obj = Object.create(ExUnits.prototype);
    obj.ptr = ptr;
    ExUnitsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ExUnitsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_exunits_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.exunits_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ExUnits}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.exunits_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ExUnits.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {BigNum}
   */
  mem() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  steps() {
    const ret = wasm.exunits_steps(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} mem
   * @param {BigNum} steps
   * @returns {ExUnits}
   */
  static new(mem, steps) {
    _assertClass(mem, BigNum);
    _assertClass(steps, BigNum);
    const ret = wasm.exunits_new(mem.ptr, steps.ptr);
    return ExUnits.__wrap(ret);
  }
}

const GeneralTransactionMetadataFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_generaltransactionmetadata_free(ptr)
);
/** */
export class GeneralTransactionMetadata {
  static __wrap(ptr) {
    const obj = Object.create(GeneralTransactionMetadata.prototype);
    obj.ptr = ptr;
    GeneralTransactionMetadataFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    GeneralTransactionMetadataFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_generaltransactionmetadata_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.generaltransactionmetadata_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {GeneralTransactionMetadata}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.generaltransactionmetadata_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GeneralTransactionMetadata.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.generaltransactionmetadata_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.generaltransactionmetadata_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {GeneralTransactionMetadata}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.generaltransactionmetadata_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GeneralTransactionMetadata.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {GeneralTransactionMetadata}
   */
  static new() {
    const ret = wasm.auxiliarydataset_new();
    return GeneralTransactionMetadata.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.auxiliarydataset_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {BigNum} key
   * @param {TransactionMetadatum} value
   * @returns {TransactionMetadatum | undefined}
   */
  insert(key, value) {
    _assertClass(key, BigNum);
    _assertClass(value, TransactionMetadatum);
    const ret = wasm.generaltransactionmetadata_insert(
      this.ptr,
      key.ptr,
      value.ptr,
    );
    return ret === 0 ? undefined : TransactionMetadatum.__wrap(ret);
  }
  /**
   * @param {BigNum} key
   * @returns {TransactionMetadatum | undefined}
   */
  get(key) {
    _assertClass(key, BigNum);
    const ret = wasm.generaltransactionmetadata_get(this.ptr, key.ptr);
    return ret === 0 ? undefined : TransactionMetadatum.__wrap(ret);
  }
  /**
   * @returns {TransactionMetadatumLabels}
   */
  keys() {
    const ret = wasm.generaltransactionmetadata_keys(this.ptr);
    return TransactionMetadatumLabels.__wrap(ret);
  }
}

const GenesisDelegateHashFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_genesisdelegatehash_free(ptr)
);
/** */
export class GenesisDelegateHash {
  static __wrap(ptr) {
    const obj = Object.create(GenesisDelegateHash.prototype);
    obj.ptr = ptr;
    GenesisDelegateHashFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    GenesisDelegateHashFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_genesisdelegatehash_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {GenesisDelegateHash}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.genesisdelegatehash_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GenesisDelegateHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        prefix,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.ed25519keyhash_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {GenesisDelegateHash}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.genesisdelegatehash_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GenesisDelegateHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhash_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} hex
   * @returns {GenesisDelegateHash}
   */
  static from_hex(hex) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        hex,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.genesisdelegatehash_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GenesisDelegateHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const GenesisHashFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_genesishash_free(ptr)
);
/** */
export class GenesisHash {
  static __wrap(ptr) {
    const obj = Object.create(GenesisHash.prototype);
    obj.ptr = ptr;
    GenesisHashFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    GenesisHashFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_genesishash_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {GenesisHash}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.genesishash_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GenesisHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        prefix,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.ed25519keyhash_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {GenesisHash}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.genesishash_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GenesisHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhash_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} hex
   * @returns {GenesisHash}
   */
  static from_hex(hex) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        hex,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.genesishash_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GenesisHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const GenesisHashesFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_genesishashes_free(ptr)
);
/** */
export class GenesisHashes {
  static __wrap(ptr) {
    const obj = Object.create(GenesisHashes.prototype);
    obj.ptr = ptr;
    GenesisHashesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    GenesisHashesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_genesishashes_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.genesishashes_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {GenesisHashes}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.genesishashes_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GenesisHashes.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhashes_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhashes_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {GenesisHashes}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.genesishashes_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GenesisHashes.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {GenesisHashes}
   */
  static new() {
    const ret = wasm.ed25519keyhashes_new();
    return GenesisHashes.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {GenesisHash}
   */
  get(index) {
    const ret = wasm.genesishashes_get(this.ptr, index);
    return GenesisHash.__wrap(ret);
  }
  /**
   * @param {GenesisHash} elem
   */
  add(elem) {
    _assertClass(elem, GenesisHash);
    wasm.ed25519keyhashes_add(this.ptr, elem.ptr);
  }
}

const GenesisKeyDelegationFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_genesiskeydelegation_free(ptr)
);
/** */
export class GenesisKeyDelegation {
  static __wrap(ptr) {
    const obj = Object.create(GenesisKeyDelegation.prototype);
    obj.ptr = ptr;
    GenesisKeyDelegationFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    GenesisKeyDelegationFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_genesiskeydelegation_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.genesiskeydelegation_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {GenesisKeyDelegation}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.genesiskeydelegation_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GenesisKeyDelegation.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.genesiskeydelegation_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.genesiskeydelegation_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {GenesisKeyDelegation}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.genesiskeydelegation_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GenesisKeyDelegation.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {GenesisHash}
   */
  genesishash() {
    const ret = wasm.genesiskeydelegation_genesishash(this.ptr);
    return GenesisHash.__wrap(ret);
  }
  /**
   * @returns {GenesisDelegateHash}
   */
  genesis_delegate_hash() {
    const ret = wasm.genesiskeydelegation_genesis_delegate_hash(this.ptr);
    return GenesisDelegateHash.__wrap(ret);
  }
  /**
   * @returns {VRFKeyHash}
   */
  vrf_keyhash() {
    const ret = wasm.genesiskeydelegation_vrf_keyhash(this.ptr);
    return VRFKeyHash.__wrap(ret);
  }
  /**
   * @param {GenesisHash} genesishash
   * @param {GenesisDelegateHash} genesis_delegate_hash
   * @param {VRFKeyHash} vrf_keyhash
   * @returns {GenesisKeyDelegation}
   */
  static new(genesishash, genesis_delegate_hash, vrf_keyhash) {
    _assertClass(genesishash, GenesisHash);
    _assertClass(genesis_delegate_hash, GenesisDelegateHash);
    _assertClass(vrf_keyhash, VRFKeyHash);
    const ret = wasm.genesiskeydelegation_new(
      genesishash.ptr,
      genesis_delegate_hash.ptr,
      vrf_keyhash.ptr,
    );
    return GenesisKeyDelegation.__wrap(ret);
  }
}

const GovernanceActionFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_governanceaction_free(ptr)
);
/** */
export class GovernanceAction {
  static __wrap(ptr) {
    const obj = Object.create(GovernanceAction.prototype);
    obj.ptr = ptr;
    GovernanceActionFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    GovernanceActionFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_governanceaction_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.governanceaction_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {GovernanceAction}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.governanceaction_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GovernanceAction.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.governanceaction_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.governanceaction_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {GovernanceAction}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.governanceaction_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GovernanceAction.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {ParameterChangeAction} parameter_change_action
   * @returns {GovernanceAction}
   */
  static new_parameter_change_action(parameter_change_action) {
    _assertClass(parameter_change_action, ParameterChangeAction);
    const ret = wasm.governanceaction_new_parameter_change_action(
      parameter_change_action.ptr,
    );
    return GovernanceAction.__wrap(ret);
  }
  /**
   * @param {HardForkInitiationAction} hard_fork_initiation_action
   * @returns {GovernanceAction}
   */
  static new_hard_fork_initiation_action(hard_fork_initiation_action) {
    _assertClass(hard_fork_initiation_action, HardForkInitiationAction);
    const ret = wasm.governanceaction_new_hard_fork_initiation_action(
      hard_fork_initiation_action.ptr,
    );
    return GovernanceAction.__wrap(ret);
  }
  /**
   * @param {TreasuryWithdrawalsAction} treasury_withdrawals_action
   * @returns {GovernanceAction}
   */
  static new_treasury_withdrawals_action(treasury_withdrawals_action) {
    _assertClass(treasury_withdrawals_action, TreasuryWithdrawalsAction);
    const ret = wasm.governanceaction_new_treasury_withdrawals_action(
      treasury_withdrawals_action.ptr,
    );
    return GovernanceAction.__wrap(ret);
  }
  /**
   * @returns {GovernanceAction}
   */
  static new_no_confidence() {
    const ret = wasm.governanceaction_new_no_confidence();
    return GovernanceAction.__wrap(ret);
  }
  /**
   * @param {NewCommittee} new_committe
   * @returns {GovernanceAction}
   */
  static new_new_committee(new_committe) {
    _assertClass(new_committe, NewCommittee);
    const ret = wasm.governanceaction_new_new_committee(new_committe.ptr);
    return GovernanceAction.__wrap(ret);
  }
  /**
   * @param {NewConstitution} new_constitution
   * @returns {GovernanceAction}
   */
  static new_new_constitution(new_constitution) {
    _assertClass(new_constitution, NewConstitution);
    const ret = wasm.governanceaction_new_new_constitution(
      new_constitution.ptr,
    );
    return GovernanceAction.__wrap(ret);
  }
  /**
   * @returns {GovernanceAction}
   */
  static new_info_action() {
    const ret = wasm.governanceaction_new_info_action();
    return GovernanceAction.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.governanceaction_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {ParameterChangeAction | undefined}
   */
  as_parameter_change_action() {
    const ret = wasm.governanceaction_as_parameter_change_action(this.ptr);
    return ret === 0 ? undefined : ParameterChangeAction.__wrap(ret);
  }
  /**
   * @returns {HardForkInitiationAction | undefined}
   */
  as_hard_fork_initiation_action() {
    const ret = wasm.governanceaction_as_hard_fork_initiation_action(this.ptr);
    return ret === 0 ? undefined : HardForkInitiationAction.__wrap(ret);
  }
  /**
   * @returns {TreasuryWithdrawalsAction | undefined}
   */
  as_treasury_withdrawals_action() {
    const ret = wasm.governanceaction_as_treasury_withdrawals_action(this.ptr);
    return ret === 0 ? undefined : TreasuryWithdrawalsAction.__wrap(ret);
  }
  /**
   * @returns {NewCommittee | undefined}
   */
  as_new_committee() {
    const ret = wasm.governanceaction_as_new_committee(this.ptr);
    return ret === 0 ? undefined : NewCommittee.__wrap(ret);
  }
  /**
   * @returns {NewConstitution | undefined}
   */
  as_new_constitution() {
    const ret = wasm.governanceaction_as_new_constitution(this.ptr);
    return ret === 0 ? undefined : NewConstitution.__wrap(ret);
  }
}

const GovernanceActionIdFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_governanceactionid_free(ptr)
);
/** */
export class GovernanceActionId {
  static __wrap(ptr) {
    const obj = Object.create(GovernanceActionId.prototype);
    obj.ptr = ptr;
    GovernanceActionIdFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    GovernanceActionIdFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_governanceactionid_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.governanceactionid_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {GovernanceActionId}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.governanceactionid_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GovernanceActionId.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.governanceactionid_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.governanceactionid_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {GovernanceActionId}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.governanceactionid_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return GovernanceActionId.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionHash}
   */
  transaction_id() {
    const ret = wasm.governanceactionid_transaction_id(this.ptr);
    return TransactionHash.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  governance_action_index() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {TransactionHash} transaction_id
   * @param {BigNum} governance_action_index
   * @returns {GovernanceActionId}
   */
  static new(transaction_id, governance_action_index) {
    _assertClass(transaction_id, TransactionHash);
    _assertClass(governance_action_index, BigNum);
    const ret = wasm.governanceactionid_new(
      transaction_id.ptr,
      governance_action_index.ptr,
    );
    return GovernanceActionId.__wrap(ret);
  }
}

const HardForkInitiationActionFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_hardforkinitiationaction_free(ptr)
);
/** */
export class HardForkInitiationAction {
  static __wrap(ptr) {
    const obj = Object.create(HardForkInitiationAction.prototype);
    obj.ptr = ptr;
    HardForkInitiationActionFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    HardForkInitiationActionFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_hardforkinitiationaction_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.hardforkinitiationaction_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {HardForkInitiationAction}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.hardforkinitiationaction_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return HardForkInitiationAction.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.hardforkinitiationaction_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.hardforkinitiationaction_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {HardForkInitiationAction}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.hardforkinitiationaction_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return HardForkInitiationAction.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {ProtocolVersion}
   */
  protocol_version() {
    const ret = wasm.hardforkinitiationaction_new(this.ptr);
    return ProtocolVersion.__wrap(ret);
  }
  /**
   * @param {ProtocolVersion} protocol_version
   * @returns {HardForkInitiationAction}
   */
  static new(protocol_version) {
    _assertClass(protocol_version, ProtocolVersion);
    const ret = wasm.hardforkinitiationaction_new(protocol_version.ptr);
    return HardForkInitiationAction.__wrap(ret);
  }
}

const HeaderFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_header_free(ptr)
);
/** */
export class Header {
  static __wrap(ptr) {
    const obj = Object.create(Header.prototype);
    obj.ptr = ptr;
    HeaderFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    HeaderFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_header_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.header_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Header}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.header_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Header.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.header_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.header_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Header}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.header_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Header.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {HeaderBody}
   */
  header_body() {
    const ret = wasm.header_header_body(this.ptr);
    return HeaderBody.__wrap(ret);
  }
  /**
   * @returns {KESSignature}
   */
  body_signature() {
    const ret = wasm.header_body_signature(this.ptr);
    return KESSignature.__wrap(ret);
  }
  /**
   * @param {HeaderBody} header_body
   * @param {KESSignature} body_signature
   * @returns {Header}
   */
  static new(header_body, body_signature) {
    _assertClass(header_body, HeaderBody);
    _assertClass(body_signature, KESSignature);
    const ret = wasm.header_new(header_body.ptr, body_signature.ptr);
    return Header.__wrap(ret);
  }
}

const HeaderBodyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_headerbody_free(ptr)
);
/** */
export class HeaderBody {
  static __wrap(ptr) {
    const obj = Object.create(HeaderBody.prototype);
    obj.ptr = ptr;
    HeaderBodyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    HeaderBodyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_headerbody_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.headerbody_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {HeaderBody}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.headerbody_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return HeaderBody.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.headerbody_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.headerbody_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {HeaderBody}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.headerbody_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return HeaderBody.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number}
   */
  block_number() {
    const ret = wasm.headerbody_block_number(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {BigNum}
   */
  slot() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {BlockHash | undefined}
   */
  prev_hash() {
    const ret = wasm.headerbody_prev_hash(this.ptr);
    return ret === 0 ? undefined : BlockHash.__wrap(ret);
  }
  /**
   * @returns {Vkey}
   */
  issuer_vkey() {
    const ret = wasm.headerbody_issuer_vkey(this.ptr);
    return Vkey.__wrap(ret);
  }
  /**
   * @returns {VRFVKey}
   */
  vrf_vkey() {
    const ret = wasm.headerbody_vrf_vkey(this.ptr);
    return VRFVKey.__wrap(ret);
  }
  /**
   * @returns {VRFCert}
   */
  nonce_vrf() {
    const ret = wasm.headerbody_nonce_vrf(this.ptr);
    return VRFCert.__wrap(ret);
  }
  /**
   * @returns {VRFCert}
   */
  leader_vrf() {
    const ret = wasm.headerbody_leader_vrf(this.ptr);
    return VRFCert.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  block_body_size() {
    const ret = wasm.headerbody_block_body_size(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {BlockHash}
   */
  block_body_hash() {
    const ret = wasm.headerbody_block_body_hash(this.ptr);
    return BlockHash.__wrap(ret);
  }
  /**
   * @returns {OperationalCert}
   */
  operational_cert() {
    const ret = wasm.headerbody_operational_cert(this.ptr);
    return OperationalCert.__wrap(ret);
  }
  /**
   * @returns {ProtocolVersion}
   */
  protocol_version() {
    const ret = wasm.headerbody_protocol_version(this.ptr);
    return ProtocolVersion.__wrap(ret);
  }
  /**
   * @param {number} block_number
   * @param {BigNum} slot
   * @param {BlockHash | undefined} prev_hash
   * @param {Vkey} issuer_vkey
   * @param {VRFVKey} vrf_vkey
   * @param {VRFCert} nonce_vrf
   * @param {VRFCert} leader_vrf
   * @param {number} block_body_size
   * @param {BlockHash} block_body_hash
   * @param {OperationalCert} operational_cert
   * @param {ProtocolVersion} protocol_version
   * @returns {HeaderBody}
   */
  static new(
    block_number,
    slot,
    prev_hash,
    issuer_vkey,
    vrf_vkey,
    nonce_vrf,
    leader_vrf,
    block_body_size,
    block_body_hash,
    operational_cert,
    protocol_version,
  ) {
    _assertClass(slot, BigNum);
    let ptr0 = 0;
    if (!isLikeNone(prev_hash)) {
      _assertClass(prev_hash, BlockHash);
      ptr0 = prev_hash.__destroy_into_raw();
    }
    _assertClass(issuer_vkey, Vkey);
    _assertClass(vrf_vkey, VRFVKey);
    _assertClass(nonce_vrf, VRFCert);
    _assertClass(leader_vrf, VRFCert);
    _assertClass(block_body_hash, BlockHash);
    _assertClass(operational_cert, OperationalCert);
    _assertClass(protocol_version, ProtocolVersion);
    const ret = wasm.headerbody_new(
      block_number,
      slot.ptr,
      ptr0,
      issuer_vkey.ptr,
      vrf_vkey.ptr,
      nonce_vrf.ptr,
      leader_vrf.ptr,
      block_body_size,
      block_body_hash.ptr,
      operational_cert.ptr,
      protocol_version.ptr,
    );
    return HeaderBody.__wrap(ret);
  }
}

const IntFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_int_free(ptr)
);
/** */
export class Int {
  static __wrap(ptr) {
    const obj = Object.create(Int.prototype);
    obj.ptr = ptr;
    IntFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    IntFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_int_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.int_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Int}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.int_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Int.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {BigNum} x
   * @returns {Int}
   */
  static new(x) {
    _assertClass(x, BigNum);
    const ret = wasm.int_new(x.ptr);
    return Int.__wrap(ret);
  }
  /**
   * @param {BigNum} x
   * @returns {Int}
   */
  static new_negative(x) {
    _assertClass(x, BigNum);
    const ret = wasm.int_new_negative(x.ptr);
    return Int.__wrap(ret);
  }
  /**
   * @param {number} x
   * @returns {Int}
   */
  static new_i32(x) {
    const ret = wasm.int_new_i32(x);
    return Int.__wrap(ret);
  }
  /**
   * @returns {boolean}
   */
  is_positive() {
    const ret = wasm.int_is_positive(this.ptr);
    return ret !== 0;
  }
  /**
   * BigNum can only contain unsigned u64 values
   *
   * This function will return the BigNum representation
   * only in case the underlying i128 value is positive.
   *
   * Otherwise nothing will be returned (undefined).
   * @returns {BigNum | undefined}
   */
  as_positive() {
    const ret = wasm.int_as_positive(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * BigNum can only contain unsigned u64 values
   *
   * This function will return the *absolute* BigNum representation
   * only in case the underlying i128 value is negative.
   *
   * Otherwise nothing will be returned (undefined).
   * @returns {BigNum | undefined}
   */
  as_negative() {
    const ret = wasm.int_as_negative(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * !!! DEPRECATED !!!
   * Returns an i32 value in case the underlying original i128 value is within the limits.
   * Otherwise will just return an empty value (undefined).
   * @returns {number | undefined}
   */
  as_i32() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.int_as_i32(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Returns the underlying value converted to i32 if possible (within limits)
   * Otherwise will just return an empty value (undefined).
   * @returns {number | undefined}
   */
  as_i32_or_nothing() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.int_as_i32(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Returns the underlying value converted to i32 if possible (within limits)
   * JsError in case of out of boundary overflow
   * @returns {number}
   */
  as_i32_or_fail() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.int_as_i32_or_fail(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return r0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Returns string representation of the underlying i128 value directly.
   * Might contain the minus sign (-) in case of negative value.
   * @returns {string}
   */
  to_str() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.int_to_str(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} string
   * @returns {Int}
   */
  static from_str(string) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        string,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.int_from_str(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Int.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const Ipv4Finalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_ipv4_free(ptr)
);
/** */
export class Ipv4 {
  static __wrap(ptr) {
    const obj = Object.create(Ipv4.prototype);
    obj.ptr = ptr;
    Ipv4Finalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    Ipv4Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_ipv4_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ipv4_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Ipv4}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.ipv4_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ipv4.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ipv4_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ipv4_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Ipv4}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.ipv4_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ipv4.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} data
   * @returns {Ipv4}
   */
  static new(data) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.ipv4_new(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ipv4.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  ip() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ipv4_ip(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const Ipv6Finalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_ipv6_free(ptr)
);
/** */
export class Ipv6 {
  static __wrap(ptr) {
    const obj = Object.create(Ipv6.prototype);
    obj.ptr = ptr;
    Ipv6Finalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    Ipv6Finalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_ipv6_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ipv6_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Ipv6}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.ipv6_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ipv6.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ipv6_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ipv6_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Ipv6}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.ipv6_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ipv6.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} data
   * @returns {Ipv6}
   */
  static new(data) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.ipv6_new(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Ipv6.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  ip() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ipv6_ip(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const KESSignatureFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_kessignature_free(ptr)
);
/** */
export class KESSignature {
  static __wrap(ptr) {
    const obj = Object.create(KESSignature.prototype);
    obj.ptr = ptr;
    KESSignatureFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    KESSignatureFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_kessignature_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assetname_name(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {KESSignature}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.kessignature_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return KESSignature.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const KESVKeyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_kesvkey_free(ptr)
);
/** */
export class KESVKey {
  static __wrap(ptr) {
    const obj = Object.create(KESVKey.prototype);
    obj.ptr = ptr;
    KESVKeyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    KESVKeyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_kesvkey_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {KESVKey}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.kesvkey_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return KESVKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        prefix,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydatahash_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {KESVKey}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.kesvkey_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return KESVKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} hex
   * @returns {KESVKey}
   */
  static from_hex(hex) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        hex,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.kesvkey_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return KESVKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const LanguageFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_language_free(ptr)
);
/** */
export class Language {
  static __wrap(ptr) {
    const obj = Object.create(Language.prototype);
    obj.ptr = ptr;
    LanguageFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    LanguageFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_language_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.language_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Language}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.language_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Language.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Language}
   */
  static new_plutus_v1() {
    const ret = wasm.language_new_plutus_v1();
    return Language.__wrap(ret);
  }
  /**
   * @returns {Language}
   */
  static new_plutus_v2() {
    const ret = wasm.language_new_plutus_v2();
    return Language.__wrap(ret);
  }
  /**
   * @returns {Language}
   */
  static new_plutus_v3() {
    const ret = wasm.language_new_plutus_v3();
    return Language.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.language_kind(this.ptr);
    return ret >>> 0;
  }
}

const LanguagesFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_languages_free(ptr)
);
/** */
export class Languages {
  static __wrap(ptr) {
    const obj = Object.create(Languages.prototype);
    obj.ptr = ptr;
    LanguagesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    LanguagesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_languages_free(ptr);
  }
  /**
   * @returns {Languages}
   */
  static new() {
    const ret = wasm.ed25519keyhashes_new();
    return Languages.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {Language}
   */
  get(index) {
    const ret = wasm.languages_get(this.ptr, index);
    return Language.__wrap(ret);
  }
  /**
   * @param {Language} elem
   */
  add(elem) {
    _assertClass(elem, Language);
    var ptr0 = elem.__destroy_into_raw();
    wasm.languages_add(this.ptr, ptr0);
  }
}

const LegacyDaedalusPrivateKeyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_legacydaedalusprivatekey_free(ptr)
);
/** */
export class LegacyDaedalusPrivateKey {
  static __wrap(ptr) {
    const obj = Object.create(LegacyDaedalusPrivateKey.prototype);
    obj.ptr = ptr;
    LegacyDaedalusPrivateKeyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    LegacyDaedalusPrivateKeyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_legacydaedalusprivatekey_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {LegacyDaedalusPrivateKey}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.legacydaedalusprivatekey_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return LegacyDaedalusPrivateKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  as_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.legacydaedalusprivatekey_as_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  chaincode() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.legacydaedalusprivatekey_chaincode(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const LinearFeeFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_linearfee_free(ptr)
);
/** */
export class LinearFee {
  static __wrap(ptr) {
    const obj = Object.create(LinearFee.prototype);
    obj.ptr = ptr;
    LinearFeeFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    LinearFeeFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_linearfee_free(ptr);
  }
  /**
   * @returns {BigNum}
   */
  constant() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  coefficient() {
    const ret = wasm.exunits_steps(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} coefficient
   * @param {BigNum} constant
   * @returns {LinearFee}
   */
  static new(coefficient, constant) {
    _assertClass(coefficient, BigNum);
    _assertClass(constant, BigNum);
    const ret = wasm.linearfee_new(coefficient.ptr, constant.ptr);
    return LinearFee.__wrap(ret);
  }
}

const MIRToStakeCredentialsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_mirtostakecredentials_free(ptr)
);
/** */
export class MIRToStakeCredentials {
  static __wrap(ptr) {
    const obj = Object.create(MIRToStakeCredentials.prototype);
    obj.ptr = ptr;
    MIRToStakeCredentialsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    MIRToStakeCredentialsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_mirtostakecredentials_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.mirtostakecredentials_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {MIRToStakeCredentials}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.mirtostakecredentials_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MIRToStakeCredentials.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.mirtostakecredentials_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.mirtostakecredentials_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {MIRToStakeCredentials}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.mirtostakecredentials_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MIRToStakeCredentials.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {MIRToStakeCredentials}
   */
  static new() {
    const ret = wasm.auxiliarydataset_new();
    return MIRToStakeCredentials.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.auxiliarydataset_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {StakeCredential} cred
   * @param {Int} delta
   * @returns {Int | undefined}
   */
  insert(cred, delta) {
    _assertClass(cred, StakeCredential);
    _assertClass(delta, Int);
    const ret = wasm.mirtostakecredentials_insert(
      this.ptr,
      cred.ptr,
      delta.ptr,
    );
    return ret === 0 ? undefined : Int.__wrap(ret);
  }
  /**
   * @param {StakeCredential} cred
   * @returns {Int | undefined}
   */
  get(cred) {
    _assertClass(cred, StakeCredential);
    const ret = wasm.mirtostakecredentials_get(this.ptr, cred.ptr);
    return ret === 0 ? undefined : Int.__wrap(ret);
  }
  /**
   * @returns {StakeCredentials}
   */
  keys() {
    const ret = wasm.mirtostakecredentials_keys(this.ptr);
    return StakeCredentials.__wrap(ret);
  }
}

const MetadataListFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_metadatalist_free(ptr)
);
/** */
export class MetadataList {
  static __wrap(ptr) {
    const obj = Object.create(MetadataList.prototype);
    obj.ptr = ptr;
    MetadataListFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    MetadataListFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_metadatalist_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.metadatalist_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {MetadataList}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.metadatalist_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MetadataList.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {MetadataList}
   */
  static new() {
    const ret = wasm.certificates_new();
    return MetadataList.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {TransactionMetadatum}
   */
  get(index) {
    const ret = wasm.metadatalist_get(this.ptr, index);
    return TransactionMetadatum.__wrap(ret);
  }
  /**
   * @param {TransactionMetadatum} elem
   */
  add(elem) {
    _assertClass(elem, TransactionMetadatum);
    wasm.metadatalist_add(this.ptr, elem.ptr);
  }
}

const MetadataMapFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_metadatamap_free(ptr)
);
/** */
export class MetadataMap {
  static __wrap(ptr) {
    const obj = Object.create(MetadataMap.prototype);
    obj.ptr = ptr;
    MetadataMapFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    MetadataMapFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_metadatamap_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.metadatamap_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {MetadataMap}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.metadatamap_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MetadataMap.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {MetadataMap}
   */
  static new() {
    const ret = wasm.auxiliarydataset_new();
    return MetadataMap.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.auxiliarydataset_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {TransactionMetadatum} key
   * @param {TransactionMetadatum} value
   * @returns {TransactionMetadatum | undefined}
   */
  insert(key, value) {
    _assertClass(key, TransactionMetadatum);
    _assertClass(value, TransactionMetadatum);
    const ret = wasm.metadatamap_insert(this.ptr, key.ptr, value.ptr);
    return ret === 0 ? undefined : TransactionMetadatum.__wrap(ret);
  }
  /**
   * @param {string} key
   * @param {TransactionMetadatum} value
   * @returns {TransactionMetadatum | undefined}
   */
  insert_str(key, value) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        key,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      _assertClass(value, TransactionMetadatum);
      wasm.metadatamap_insert_str(retptr, this.ptr, ptr0, len0, value.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return r0 === 0 ? undefined : TransactionMetadatum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} key
   * @param {TransactionMetadatum} value
   * @returns {TransactionMetadatum | undefined}
   */
  insert_i32(key, value) {
    _assertClass(value, TransactionMetadatum);
    const ret = wasm.metadatamap_insert_i32(this.ptr, key, value.ptr);
    return ret === 0 ? undefined : TransactionMetadatum.__wrap(ret);
  }
  /**
   * @param {TransactionMetadatum} key
   * @returns {TransactionMetadatum}
   */
  get(key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(key, TransactionMetadatum);
      wasm.metadatamap_get(retptr, this.ptr, key.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionMetadatum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} key
   * @returns {TransactionMetadatum}
   */
  get_str(key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        key,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.metadatamap_get_str(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionMetadatum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} key
   * @returns {TransactionMetadatum}
   */
  get_i32(key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.metadatamap_get_i32(retptr, this.ptr, key);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionMetadatum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {TransactionMetadatum} key
   * @returns {boolean}
   */
  has(key) {
    _assertClass(key, TransactionMetadatum);
    const ret = wasm.metadatamap_has(this.ptr, key.ptr);
    return ret !== 0;
  }
  /**
   * @returns {MetadataList}
   */
  keys() {
    const ret = wasm.metadatamap_keys(this.ptr);
    return MetadataList.__wrap(ret);
  }
}

const MintFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_mint_free(ptr)
);
/** */
export class Mint {
  static __wrap(ptr) {
    const obj = Object.create(Mint.prototype);
    obj.ptr = ptr;
    MintFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    MintFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_mint_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.mint_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Mint}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.mint_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Mint.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.mint_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.mint_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Mint}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.mint_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Mint.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Mint}
   */
  static new() {
    const ret = wasm.assets_new();
    return Mint.__wrap(ret);
  }
  /**
   * @param {ScriptHash} key
   * @param {MintAssets} value
   * @returns {Mint}
   */
  static new_from_entry(key, value) {
    _assertClass(key, ScriptHash);
    _assertClass(value, MintAssets);
    const ret = wasm.mint_new_from_entry(key.ptr, value.ptr);
    return Mint.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {ScriptHash} key
   * @param {MintAssets} value
   * @returns {MintAssets | undefined}
   */
  insert(key, value) {
    _assertClass(key, ScriptHash);
    _assertClass(value, MintAssets);
    const ret = wasm.mint_insert(this.ptr, key.ptr, value.ptr);
    return ret === 0 ? undefined : MintAssets.__wrap(ret);
  }
  /**
   * @param {ScriptHash} key
   * @returns {MintAssets | undefined}
   */
  get(key) {
    _assertClass(key, ScriptHash);
    const ret = wasm.mint_get(this.ptr, key.ptr);
    return ret === 0 ? undefined : MintAssets.__wrap(ret);
  }
  /**
   * @returns {ScriptHashes}
   */
  keys() {
    const ret = wasm.mint_keys(this.ptr);
    return ScriptHashes.__wrap(ret);
  }
  /**
   * Returns the multiasset where only positive (minting) entries are present
   * @returns {MultiAsset}
   */
  as_positive_multiasset() {
    const ret = wasm.mint_as_positive_multiasset(this.ptr);
    return MultiAsset.__wrap(ret);
  }
  /**
   * Returns the multiasset where only negative (burning) entries are present
   * @returns {MultiAsset}
   */
  as_negative_multiasset() {
    const ret = wasm.mint_as_negative_multiasset(this.ptr);
    return MultiAsset.__wrap(ret);
  }
}

const MintAssetsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_mintassets_free(ptr)
);
/** */
export class MintAssets {
  static __wrap(ptr) {
    const obj = Object.create(MintAssets.prototype);
    obj.ptr = ptr;
    MintAssetsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    MintAssetsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_mintassets_free(ptr);
  }
  /**
   * @returns {MintAssets}
   */
  static new() {
    const ret = wasm.assets_new();
    return MintAssets.__wrap(ret);
  }
  /**
   * @param {AssetName} key
   * @param {Int} value
   * @returns {MintAssets}
   */
  static new_from_entry(key, value) {
    _assertClass(key, AssetName);
    _assertClass(value, Int);
    var ptr0 = value.__destroy_into_raw();
    const ret = wasm.mintassets_new_from_entry(key.ptr, ptr0);
    return MintAssets.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {AssetName} key
   * @param {Int} value
   * @returns {Int | undefined}
   */
  insert(key, value) {
    _assertClass(key, AssetName);
    _assertClass(value, Int);
    var ptr0 = value.__destroy_into_raw();
    const ret = wasm.mintassets_insert(this.ptr, key.ptr, ptr0);
    return ret === 0 ? undefined : Int.__wrap(ret);
  }
  /**
   * @param {AssetName} key
   * @returns {Int | undefined}
   */
  get(key) {
    _assertClass(key, AssetName);
    const ret = wasm.mintassets_get(this.ptr, key.ptr);
    return ret === 0 ? undefined : Int.__wrap(ret);
  }
  /**
   * @returns {AssetNames}
   */
  keys() {
    const ret = wasm.mintassets_keys(this.ptr);
    return AssetNames.__wrap(ret);
  }
}

const MoveInstantaneousRewardFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_moveinstantaneousreward_free(ptr)
);
/** */
export class MoveInstantaneousReward {
  static __wrap(ptr) {
    const obj = Object.create(MoveInstantaneousReward.prototype);
    obj.ptr = ptr;
    MoveInstantaneousRewardFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    MoveInstantaneousRewardFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_moveinstantaneousreward_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.moveinstantaneousreward_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {MoveInstantaneousReward}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.moveinstantaneousreward_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MoveInstantaneousReward.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.moveinstantaneousreward_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.moveinstantaneousreward_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {MoveInstantaneousReward}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.moveinstantaneousreward_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MoveInstantaneousReward.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} pot
   * @param {BigNum} amount
   * @returns {MoveInstantaneousReward}
   */
  static new_to_other_pot(pot, amount) {
    _assertClass(amount, BigNum);
    const ret = wasm.moveinstantaneousreward_new_to_other_pot(pot, amount.ptr);
    return MoveInstantaneousReward.__wrap(ret);
  }
  /**
   * @param {number} pot
   * @param {MIRToStakeCredentials} amounts
   * @returns {MoveInstantaneousReward}
   */
  static new_to_stake_creds(pot, amounts) {
    _assertClass(amounts, MIRToStakeCredentials);
    const ret = wasm.moveinstantaneousreward_new_to_stake_creds(
      pot,
      amounts.ptr,
    );
    return MoveInstantaneousReward.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  pot() {
    const ret = wasm.moveinstantaneousreward_pot(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.moveinstantaneousreward_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {BigNum | undefined}
   */
  as_to_other_pot() {
    const ret = wasm.moveinstantaneousreward_as_to_other_pot(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @returns {MIRToStakeCredentials | undefined}
   */
  as_to_stake_creds() {
    const ret = wasm.moveinstantaneousreward_as_to_stake_creds(this.ptr);
    return ret === 0 ? undefined : MIRToStakeCredentials.__wrap(ret);
  }
}

const MoveInstantaneousRewardsCertFinalization = new FinalizationRegistry(
  (ptr) => wasm.__wbg_moveinstantaneousrewardscert_free(ptr)
);
/** */
export class MoveInstantaneousRewardsCert {
  static __wrap(ptr) {
    const obj = Object.create(MoveInstantaneousRewardsCert.prototype);
    obj.ptr = ptr;
    MoveInstantaneousRewardsCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    MoveInstantaneousRewardsCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_moveinstantaneousrewardscert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.moveinstantaneousrewardscert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {MoveInstantaneousRewardsCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.moveinstantaneousrewardscert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MoveInstantaneousRewardsCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.moveinstantaneousrewardscert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.moveinstantaneousrewardscert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {MoveInstantaneousRewardsCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.moveinstantaneousrewardscert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MoveInstantaneousRewardsCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {MoveInstantaneousReward}
   */
  move_instantaneous_reward() {
    const ret = wasm.moveinstantaneousrewardscert_move_instantaneous_reward(
      this.ptr,
    );
    return MoveInstantaneousReward.__wrap(ret);
  }
  /**
   * @param {MoveInstantaneousReward} move_instantaneous_reward
   * @returns {MoveInstantaneousRewardsCert}
   */
  static new(move_instantaneous_reward) {
    _assertClass(move_instantaneous_reward, MoveInstantaneousReward);
    const ret = wasm.moveinstantaneousrewardscert_new(
      move_instantaneous_reward.ptr,
    );
    return MoveInstantaneousRewardsCert.__wrap(ret);
  }
}

const MultiAssetFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_multiasset_free(ptr)
);
/** */
export class MultiAsset {
  static __wrap(ptr) {
    const obj = Object.create(MultiAsset.prototype);
    obj.ptr = ptr;
    MultiAssetFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    MultiAssetFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_multiasset_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.multiasset_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {MultiAsset}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.multiasset_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MultiAsset.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.multiasset_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.multiasset_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {MultiAsset}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.multiasset_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MultiAsset.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {MultiAsset}
   */
  static new() {
    const ret = wasm.assets_new();
    return MultiAsset.__wrap(ret);
  }
  /**
   * the number of unique policy IDs in the multiasset
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * set (and replace if it exists) all assets with policy {policy_id} to a copy of {assets}
   * @param {ScriptHash} policy_id
   * @param {Assets} assets
   * @returns {Assets | undefined}
   */
  insert(policy_id, assets) {
    _assertClass(policy_id, ScriptHash);
    _assertClass(assets, Assets);
    const ret = wasm.multiasset_insert(this.ptr, policy_id.ptr, assets.ptr);
    return ret === 0 ? undefined : Assets.__wrap(ret);
  }
  /**
   * all assets under {policy_id}, if any exist, or else None (undefined in JS)
   * @param {ScriptHash} policy_id
   * @returns {Assets | undefined}
   */
  get(policy_id) {
    _assertClass(policy_id, ScriptHash);
    const ret = wasm.multiasset_get(this.ptr, policy_id.ptr);
    return ret === 0 ? undefined : Assets.__wrap(ret);
  }
  /**
   * sets the asset {asset_name} to {value} under policy {policy_id}
   * returns the previous amount if it was set, or else None (undefined in JS)
   * @param {ScriptHash} policy_id
   * @param {AssetName} asset_name
   * @param {BigNum} value
   * @returns {BigNum | undefined}
   */
  set_asset(policy_id, asset_name, value) {
    _assertClass(policy_id, ScriptHash);
    _assertClass(asset_name, AssetName);
    _assertClass(value, BigNum);
    var ptr0 = value.__destroy_into_raw();
    const ret = wasm.multiasset_set_asset(
      this.ptr,
      policy_id.ptr,
      asset_name.ptr,
      ptr0,
    );
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * returns the amount of asset {asset_name} under policy {policy_id}
   * If such an asset does not exist, 0 is returned.
   * @param {ScriptHash} policy_id
   * @param {AssetName} asset_name
   * @returns {BigNum}
   */
  get_asset(policy_id, asset_name) {
    _assertClass(policy_id, ScriptHash);
    _assertClass(asset_name, AssetName);
    const ret = wasm.multiasset_get_asset(
      this.ptr,
      policy_id.ptr,
      asset_name.ptr,
    );
    return BigNum.__wrap(ret);
  }
  /**
   * returns all policy IDs used by assets in this multiasset
   * @returns {ScriptHashes}
   */
  keys() {
    const ret = wasm.mint_keys(this.ptr);
    return ScriptHashes.__wrap(ret);
  }
  /**
   * removes an asset from the list if the result is 0 or less
   * does not modify this object, instead the result is returned
   * @param {MultiAsset} rhs_ma
   * @returns {MultiAsset}
   */
  sub(rhs_ma) {
    _assertClass(rhs_ma, MultiAsset);
    const ret = wasm.multiasset_sub(this.ptr, rhs_ma.ptr);
    return MultiAsset.__wrap(ret);
  }
}

const MultiHostNameFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_multihostname_free(ptr)
);
/** */
export class MultiHostName {
  static __wrap(ptr) {
    const obj = Object.create(MultiHostName.prototype);
    obj.ptr = ptr;
    MultiHostNameFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    MultiHostNameFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_multihostname_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.multihostname_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {MultiHostName}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.multihostname_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MultiHostName.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.multihostname_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.multihostname_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {MultiHostName}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.multihostname_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MultiHostName.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {DNSRecordSRV}
   */
  dns_name() {
    const ret = wasm.anchor_anchor_url(this.ptr);
    return DNSRecordSRV.__wrap(ret);
  }
  /**
   * @param {DNSRecordSRV} dns_name
   * @returns {MultiHostName}
   */
  static new(dns_name) {
    _assertClass(dns_name, DNSRecordSRV);
    const ret = wasm.multihostname_new(dns_name.ptr);
    return MultiHostName.__wrap(ret);
  }
}

const NativeScriptFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_nativescript_free(ptr)
);
/** */
export class NativeScript {
  static __wrap(ptr) {
    const obj = Object.create(NativeScript.prototype);
    obj.ptr = ptr;
    NativeScriptFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    NativeScriptFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_nativescript_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.nativescript_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {NativeScript}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.nativescript_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return NativeScript.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.nativescript_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.nativescript_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {NativeScript}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.nativescript_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return NativeScript.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} namespace
   * @returns {ScriptHash}
   */
  hash(namespace) {
    const ret = wasm.nativescript_hash(this.ptr, namespace);
    return ScriptHash.__wrap(ret);
  }
  /**
   * @param {ScriptPubkey} script_pubkey
   * @returns {NativeScript}
   */
  static new_script_pubkey(script_pubkey) {
    _assertClass(script_pubkey, ScriptPubkey);
    const ret = wasm.nativescript_new_script_pubkey(script_pubkey.ptr);
    return NativeScript.__wrap(ret);
  }
  /**
   * @param {ScriptAll} script_all
   * @returns {NativeScript}
   */
  static new_script_all(script_all) {
    _assertClass(script_all, ScriptAll);
    const ret = wasm.nativescript_new_script_all(script_all.ptr);
    return NativeScript.__wrap(ret);
  }
  /**
   * @param {ScriptAny} script_any
   * @returns {NativeScript}
   */
  static new_script_any(script_any) {
    _assertClass(script_any, ScriptAny);
    const ret = wasm.nativescript_new_script_any(script_any.ptr);
    return NativeScript.__wrap(ret);
  }
  /**
   * @param {ScriptNOfK} script_n_of_k
   * @returns {NativeScript}
   */
  static new_script_n_of_k(script_n_of_k) {
    _assertClass(script_n_of_k, ScriptNOfK);
    const ret = wasm.nativescript_new_script_n_of_k(script_n_of_k.ptr);
    return NativeScript.__wrap(ret);
  }
  /**
   * @param {TimelockStart} timelock_start
   * @returns {NativeScript}
   */
  static new_timelock_start(timelock_start) {
    _assertClass(timelock_start, TimelockStart);
    const ret = wasm.nativescript_new_timelock_start(timelock_start.ptr);
    return NativeScript.__wrap(ret);
  }
  /**
   * @param {TimelockExpiry} timelock_expiry
   * @returns {NativeScript}
   */
  static new_timelock_expiry(timelock_expiry) {
    _assertClass(timelock_expiry, TimelockExpiry);
    const ret = wasm.nativescript_new_timelock_expiry(timelock_expiry.ptr);
    return NativeScript.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.nativescript_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {ScriptPubkey | undefined}
   */
  as_script_pubkey() {
    const ret = wasm.nativescript_as_script_pubkey(this.ptr);
    return ret === 0 ? undefined : ScriptPubkey.__wrap(ret);
  }
  /**
   * @returns {ScriptAll | undefined}
   */
  as_script_all() {
    const ret = wasm.nativescript_as_script_all(this.ptr);
    return ret === 0 ? undefined : ScriptAll.__wrap(ret);
  }
  /**
   * @returns {ScriptAny | undefined}
   */
  as_script_any() {
    const ret = wasm.nativescript_as_script_any(this.ptr);
    return ret === 0 ? undefined : ScriptAny.__wrap(ret);
  }
  /**
   * @returns {ScriptNOfK | undefined}
   */
  as_script_n_of_k() {
    const ret = wasm.nativescript_as_script_n_of_k(this.ptr);
    return ret === 0 ? undefined : ScriptNOfK.__wrap(ret);
  }
  /**
   * @returns {TimelockStart | undefined}
   */
  as_timelock_start() {
    const ret = wasm.nativescript_as_timelock_start(this.ptr);
    return ret === 0 ? undefined : TimelockStart.__wrap(ret);
  }
  /**
   * @returns {TimelockExpiry | undefined}
   */
  as_timelock_expiry() {
    const ret = wasm.nativescript_as_timelock_expiry(this.ptr);
    return ret === 0 ? undefined : TimelockExpiry.__wrap(ret);
  }
  /**
   * Returns an array of unique Ed25519KeyHashes
   * contained within this script recursively on any depth level.
   * The order of the keys in the result is not determined in any way.
   * @returns {Ed25519KeyHashes}
   */
  get_required_signers() {
    const ret = wasm.nativescript_get_required_signers(this.ptr);
    return Ed25519KeyHashes.__wrap(ret);
  }
  /**
   * @param {BigNum | undefined} lower_bound
   * @param {BigNum | undefined} upper_bound
   * @param {Ed25519KeyHashes} key_hashes
   * @returns {boolean}
   */
  verify(lower_bound, upper_bound, key_hashes) {
    let ptr0 = 0;
    if (!isLikeNone(lower_bound)) {
      _assertClass(lower_bound, BigNum);
      ptr0 = lower_bound.__destroy_into_raw();
    }
    let ptr1 = 0;
    if (!isLikeNone(upper_bound)) {
      _assertClass(upper_bound, BigNum);
      ptr1 = upper_bound.__destroy_into_raw();
    }
    _assertClass(key_hashes, Ed25519KeyHashes);
    const ret = wasm.nativescript_verify(this.ptr, ptr0, ptr1, key_hashes.ptr);
    return ret !== 0;
  }
}

const NativeScriptsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_nativescripts_free(ptr)
);
/** */
export class NativeScripts {
  static __wrap(ptr) {
    const obj = Object.create(NativeScripts.prototype);
    obj.ptr = ptr;
    NativeScriptsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    NativeScriptsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_nativescripts_free(ptr);
  }
  /**
   * @returns {NativeScripts}
   */
  static new() {
    const ret = wasm.certificates_new();
    return NativeScripts.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {NativeScript}
   */
  get(index) {
    const ret = wasm.nativescripts_get(this.ptr, index);
    return NativeScript.__wrap(ret);
  }
  /**
   * @param {NativeScript} elem
   */
  add(elem) {
    _assertClass(elem, NativeScript);
    wasm.nativescripts_add(this.ptr, elem.ptr);
  }
}

const NetworkIdFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_networkid_free(ptr)
);
/** */
export class NetworkId {
  static __wrap(ptr) {
    const obj = Object.create(NetworkId.prototype);
    obj.ptr = ptr;
    NetworkIdFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    NetworkIdFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_networkid_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.networkid_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {NetworkId}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.networkid_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return NetworkId.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.networkid_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.networkid_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {NetworkId}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.networkid_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return NetworkId.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {NetworkId}
   */
  static testnet() {
    const ret = wasm.networkid_testnet();
    return NetworkId.__wrap(ret);
  }
  /**
   * @returns {NetworkId}
   */
  static mainnet() {
    const ret = wasm.networkid_mainnet();
    return NetworkId.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.networkid_kind(this.ptr);
    return ret >>> 0;
  }
}

const NetworkInfoFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_networkinfo_free(ptr)
);
/** */
export class NetworkInfo {
  static __wrap(ptr) {
    const obj = Object.create(NetworkInfo.prototype);
    obj.ptr = ptr;
    NetworkInfoFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    NetworkInfoFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_networkinfo_free(ptr);
  }
  /**
   * @param {number} network_id
   * @param {number} protocol_magic
   * @returns {NetworkInfo}
   */
  static new(network_id, protocol_magic) {
    const ret = wasm.networkinfo_new(network_id, protocol_magic);
    return NetworkInfo.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  network_id() {
    const ret = wasm.networkinfo_network_id(this.ptr);
    return ret;
  }
  /**
   * @returns {number}
   */
  protocol_magic() {
    const ret = wasm.networkinfo_protocol_magic(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {NetworkInfo}
   */
  static testnet() {
    const ret = wasm.networkinfo_testnet();
    return NetworkInfo.__wrap(ret);
  }
  /**
   * @returns {NetworkInfo}
   */
  static mainnet() {
    const ret = wasm.networkinfo_mainnet();
    return NetworkInfo.__wrap(ret);
  }
}

const NewCommitteeFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_newcommittee_free(ptr)
);
/** */
export class NewCommittee {
  static __wrap(ptr) {
    const obj = Object.create(NewCommittee.prototype);
    obj.ptr = ptr;
    NewCommitteeFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    NewCommitteeFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_newcommittee_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.newcommittee_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {NewCommittee}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.newcommittee_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return NewCommittee.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.newcommittee_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.newcommittee_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {NewCommittee}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.newcommittee_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return NewCommittee.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Ed25519KeyHashes}
   */
  committee() {
    const ret = wasm.newcommittee_committee(this.ptr);
    return Ed25519KeyHashes.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  rational() {
    const ret = wasm.drepvotingthresholds_motion_no_confidence(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @param {Ed25519KeyHashes} committee
   * @param {UnitInterval} rational
   * @returns {NewCommittee}
   */
  static new(committee, rational) {
    _assertClass(committee, Ed25519KeyHashes);
    _assertClass(rational, UnitInterval);
    const ret = wasm.newcommittee_new(committee.ptr, rational.ptr);
    return NewCommittee.__wrap(ret);
  }
}

const NewConstitutionFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_newconstitution_free(ptr)
);
/** */
export class NewConstitution {
  static __wrap(ptr) {
    const obj = Object.create(NewConstitution.prototype);
    obj.ptr = ptr;
    NewConstitutionFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    NewConstitutionFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_newconstitution_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.newconstitution_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {NewConstitution}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.newconstitution_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return NewConstitution.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.newconstitution_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.newconstitution_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {NewConstitution}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.newconstitution_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return NewConstitution.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {DataHash}
   */
  hash() {
    const ret = wasm.newconstitution_hash(this.ptr);
    return DataHash.__wrap(ret);
  }
  /**
   * @param {DataHash} hash
   * @returns {NewConstitution}
   */
  static new(hash) {
    _assertClass(hash, DataHash);
    const ret = wasm.newconstitution_new(hash.ptr);
    return NewConstitution.__wrap(ret);
  }
}

const NonceFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_nonce_free(ptr)
);
/** */
export class Nonce {
  static __wrap(ptr) {
    const obj = Object.create(Nonce.prototype);
    obj.ptr = ptr;
    NonceFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    NonceFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_nonce_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.nonce_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Nonce}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.nonce_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Nonce.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Nonce}
   */
  static new_identity() {
    const ret = wasm.nonce_new_identity();
    return Nonce.__wrap(ret);
  }
  /**
   * @param {Uint8Array} hash
   * @returns {Nonce}
   */
  static new_from_hash(hash) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(hash, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.nonce_new_from_hash(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Nonce.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array | undefined}
   */
  get_hash() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.nonce_get_hash(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      let v0;
      if (r0 !== 0) {
        v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
      }
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const OperationalCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_operationalcert_free(ptr)
);
/** */
export class OperationalCert {
  static __wrap(ptr) {
    const obj = Object.create(OperationalCert.prototype);
    obj.ptr = ptr;
    OperationalCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    OperationalCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_operationalcert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.operationalcert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {OperationalCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.operationalcert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return OperationalCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.operationalcert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.operationalcert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {OperationalCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.operationalcert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return OperationalCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {KESVKey}
   */
  hot_vkey() {
    const ret = wasm.operationalcert_hot_vkey(this.ptr);
    return KESVKey.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  sequence_number() {
    const ret = wasm.networkinfo_protocol_magic(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {number}
   */
  kes_period() {
    const ret = wasm.operationalcert_kes_period(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {Ed25519Signature}
   */
  sigma() {
    const ret = wasm.operationalcert_sigma(this.ptr);
    return Ed25519Signature.__wrap(ret);
  }
  /**
   * @param {KESVKey} hot_vkey
   * @param {number} sequence_number
   * @param {number} kes_period
   * @param {Ed25519Signature} sigma
   * @returns {OperationalCert}
   */
  static new(hot_vkey, sequence_number, kes_period, sigma) {
    _assertClass(hot_vkey, KESVKey);
    _assertClass(sigma, Ed25519Signature);
    const ret = wasm.operationalcert_new(
      hot_vkey.ptr,
      sequence_number,
      kes_period,
      sigma.ptr,
    );
    return OperationalCert.__wrap(ret);
  }
}

const ParameterChangeActionFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_parameterchangeaction_free(ptr)
);
/** */
export class ParameterChangeAction {
  static __wrap(ptr) {
    const obj = Object.create(ParameterChangeAction.prototype);
    obj.ptr = ptr;
    ParameterChangeActionFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ParameterChangeActionFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_parameterchangeaction_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.parameterchangeaction_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ParameterChangeAction}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.parameterchangeaction_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ParameterChangeAction.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.parameterchangeaction_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.parameterchangeaction_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {ParameterChangeAction}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.parameterchangeaction_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ParameterChangeAction.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {ProtocolParamUpdate}
   */
  protocol_param_update() {
    const ret = wasm.parameterchangeaction_protocol_param_update(this.ptr);
    return ProtocolParamUpdate.__wrap(ret);
  }
  /**
   * @param {ProtocolParamUpdate} protocol_param_update
   * @returns {ParameterChangeAction}
   */
  static new(protocol_param_update) {
    _assertClass(protocol_param_update, ProtocolParamUpdate);
    const ret = wasm.parameterchangeaction_new(protocol_param_update.ptr);
    return ParameterChangeAction.__wrap(ret);
  }
}

const PlutusDataFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_plutusdata_free(ptr)
);
/** */
export class PlutusData {
  static __wrap(ptr) {
    const obj = Object.create(PlutusData.prototype);
    obj.ptr = ptr;
    PlutusDataFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PlutusDataFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_plutusdata_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.plutusdata_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PlutusData}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.plutusdata_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PlutusData.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {ConstrPlutusData} constr_plutus_data
   * @returns {PlutusData}
   */
  static new_constr_plutus_data(constr_plutus_data) {
    _assertClass(constr_plutus_data, ConstrPlutusData);
    const ret = wasm.plutusdata_new_constr_plutus_data(constr_plutus_data.ptr);
    return PlutusData.__wrap(ret);
  }
  /**
   * @param {PlutusMap} map
   * @returns {PlutusData}
   */
  static new_map(map) {
    _assertClass(map, PlutusMap);
    const ret = wasm.plutusdata_new_map(map.ptr);
    return PlutusData.__wrap(ret);
  }
  /**
   * @param {PlutusList} list
   * @returns {PlutusData}
   */
  static new_list(list) {
    _assertClass(list, PlutusList);
    const ret = wasm.plutusdata_new_list(list.ptr);
    return PlutusData.__wrap(ret);
  }
  /**
   * @param {BigInt} integer
   * @returns {PlutusData}
   */
  static new_integer(integer) {
    _assertClass(integer, BigInt);
    const ret = wasm.plutusdata_new_integer(integer.ptr);
    return PlutusData.__wrap(ret);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PlutusData}
   */
  static new_bytes(bytes) {
    const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.plutusdata_new_bytes(ptr0, len0);
    return PlutusData.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.plutusdata_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {ConstrPlutusData | undefined}
   */
  as_constr_plutus_data() {
    const ret = wasm.plutusdata_as_constr_plutus_data(this.ptr);
    return ret === 0 ? undefined : ConstrPlutusData.__wrap(ret);
  }
  /**
   * @returns {PlutusMap | undefined}
   */
  as_map() {
    const ret = wasm.plutusdata_as_map(this.ptr);
    return ret === 0 ? undefined : PlutusMap.__wrap(ret);
  }
  /**
   * @returns {PlutusList | undefined}
   */
  as_list() {
    const ret = wasm.plutusdata_as_list(this.ptr);
    return ret === 0 ? undefined : PlutusList.__wrap(ret);
  }
  /**
   * @returns {BigInt | undefined}
   */
  as_integer() {
    const ret = wasm.plutusdata_as_integer(this.ptr);
    return ret === 0 ? undefined : BigInt.__wrap(ret);
  }
  /**
   * @returns {Uint8Array | undefined}
   */
  as_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.plutusdata_as_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      let v0;
      if (r0 !== 0) {
        v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
      }
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const PlutusListFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_plutuslist_free(ptr)
);
/** */
export class PlutusList {
  static __wrap(ptr) {
    const obj = Object.create(PlutusList.prototype);
    obj.ptr = ptr;
    PlutusListFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PlutusListFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_plutuslist_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.plutuslist_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PlutusList}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.plutuslist_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PlutusList.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {PlutusList}
   */
  static new() {
    const ret = wasm.plutuslist_new();
    return PlutusList.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {PlutusData}
   */
  get(index) {
    const ret = wasm.plutuslist_get(this.ptr, index);
    return PlutusData.__wrap(ret);
  }
  /**
   * @param {PlutusData} elem
   */
  add(elem) {
    _assertClass(elem, PlutusData);
    wasm.plutuslist_add(this.ptr, elem.ptr);
  }
}

const PlutusMapFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_plutusmap_free(ptr)
);
/** */
export class PlutusMap {
  static __wrap(ptr) {
    const obj = Object.create(PlutusMap.prototype);
    obj.ptr = ptr;
    PlutusMapFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PlutusMapFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_plutusmap_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.plutusmap_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PlutusMap}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.plutusmap_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PlutusMap.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {PlutusMap}
   */
  static new() {
    const ret = wasm.certificates_new();
    return PlutusMap.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {PlutusData} key
   * @param {PlutusData} value
   * @returns {PlutusData | undefined}
   */
  insert(key, value) {
    _assertClass(key, PlutusData);
    _assertClass(value, PlutusData);
    const ret = wasm.plutusmap_insert(this.ptr, key.ptr, value.ptr);
    return ret === 0 ? undefined : PlutusData.__wrap(ret);
  }
  /**
   * @param {PlutusData} key
   * @returns {PlutusData | undefined}
   */
  get(key) {
    _assertClass(key, PlutusData);
    const ret = wasm.plutusmap_get(this.ptr, key.ptr);
    return ret === 0 ? undefined : PlutusData.__wrap(ret);
  }
  /**
   * @returns {PlutusList}
   */
  keys() {
    const ret = wasm.plutusmap_keys(this.ptr);
    return PlutusList.__wrap(ret);
  }
}

const PlutusScriptFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_plutusscript_free(ptr)
);
/** */
export class PlutusScript {
  static __wrap(ptr) {
    const obj = Object.create(PlutusScript.prototype);
    obj.ptr = ptr;
    PlutusScriptFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PlutusScriptFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_plutusscript_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.plutusscript_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PlutusScript}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.plutusscript_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PlutusScript.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} namespace
   * @returns {ScriptHash}
   */
  hash(namespace) {
    const ret = wasm.plutusscript_hash(this.ptr, namespace);
    return ScriptHash.__wrap(ret);
  }
  /**
   *     * Creates a new Plutus script from the RAW bytes of the compiled script.
   *     * This does NOT include any CBOR encoding around these bytes (e.g. from "cborBytes" in cardano-cli)
   *     * If you creating this from those you should use PlutusScript::from_bytes() instead.
   *
   * @param {Uint8Array} bytes
   * @returns {PlutusScript}
   */
  static new(bytes) {
    const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.plutusscript_new(ptr0, len0);
    return PlutusScript.__wrap(ret);
  }
  /**
   *     * The raw bytes of this compiled Plutus script.
   *     * If you need "cborBytes" for cardano-cli use PlutusScript::to_bytes() instead.
   *
   * @returns {Uint8Array}
   */
  bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assetname_name(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const PlutusScriptsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_plutusscripts_free(ptr)
);
/** */
export class PlutusScripts {
  static __wrap(ptr) {
    const obj = Object.create(PlutusScripts.prototype);
    obj.ptr = ptr;
    PlutusScriptsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PlutusScriptsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_plutusscripts_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.plutusscripts_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PlutusScripts}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.plutusscripts_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PlutusScripts.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {PlutusScripts}
   */
  static new() {
    const ret = wasm.assetnames_new();
    return PlutusScripts.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {PlutusScript}
   */
  get(index) {
    const ret = wasm.plutusscripts_get(this.ptr, index);
    return PlutusScript.__wrap(ret);
  }
  /**
   * @param {PlutusScript} elem
   */
  add(elem) {
    _assertClass(elem, PlutusScript);
    wasm.assetnames_add(this.ptr, elem.ptr);
  }
}

const PlutusWitnessFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_plutuswitness_free(ptr)
);
/** */
export class PlutusWitness {
  static __wrap(ptr) {
    const obj = Object.create(PlutusWitness.prototype);
    obj.ptr = ptr;
    PlutusWitnessFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PlutusWitnessFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_plutuswitness_free(ptr);
  }
  /**
   * Plutus V1 witness or witness where no script is attached and so version doesn't matter
   * @param {PlutusData} redeemer
   * @param {PlutusData | undefined} plutus_data
   * @param {PlutusScript | undefined} script
   * @returns {PlutusWitness}
   */
  static new(redeemer, plutus_data, script) {
    _assertClass(redeemer, PlutusData);
    let ptr0 = 0;
    if (!isLikeNone(plutus_data)) {
      _assertClass(plutus_data, PlutusData);
      ptr0 = plutus_data.__destroy_into_raw();
    }
    let ptr1 = 0;
    if (!isLikeNone(script)) {
      _assertClass(script, PlutusScript);
      ptr1 = script.__destroy_into_raw();
    }
    const ret = wasm.plutuswitness_new(redeemer.ptr, ptr0, ptr1);
    return PlutusWitness.__wrap(ret);
  }
  /**
   * @param {PlutusData} redeemer
   * @param {PlutusData | undefined} plutus_data
   * @param {PlutusScript | undefined} script
   * @returns {PlutusWitness}
   */
  static new_plutus_v2(redeemer, plutus_data, script) {
    _assertClass(redeemer, PlutusData);
    let ptr0 = 0;
    if (!isLikeNone(plutus_data)) {
      _assertClass(plutus_data, PlutusData);
      ptr0 = plutus_data.__destroy_into_raw();
    }
    let ptr1 = 0;
    if (!isLikeNone(script)) {
      _assertClass(script, PlutusScript);
      ptr1 = script.__destroy_into_raw();
    }
    const ret = wasm.plutuswitness_new_plutus_v2(redeemer.ptr, ptr0, ptr1);
    return PlutusWitness.__wrap(ret);
  }
  /**
   * @returns {PlutusData | undefined}
   */
  plutus_data() {
    const ret = wasm.plutuswitness_plutus_data(this.ptr);
    return ret === 0 ? undefined : PlutusData.__wrap(ret);
  }
  /**
   * @returns {PlutusData}
   */
  redeemer() {
    const ret = wasm.data_get(this.ptr);
    return PlutusData.__wrap(ret);
  }
  /**
   * @returns {PlutusScript | undefined}
   */
  script() {
    const ret = wasm.plutuswitness_script(this.ptr);
    return ret === 0 ? undefined : PlutusScript.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  version() {
    const ret = wasm.plutuswitness_version(this.ptr);
    return ret >>> 0;
  }
}

const PointerFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_pointer_free(ptr)
);
/** */
export class Pointer {
  static __wrap(ptr) {
    const obj = Object.create(Pointer.prototype);
    obj.ptr = ptr;
    PointerFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PointerFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_pointer_free(ptr);
  }
  /**
   * @param {BigNum} slot
   * @param {BigNum} tx_index
   * @param {BigNum} cert_index
   * @returns {Pointer}
   */
  static new(slot, tx_index, cert_index) {
    _assertClass(slot, BigNum);
    _assertClass(tx_index, BigNum);
    _assertClass(cert_index, BigNum);
    const ret = wasm.pointer_new(slot.ptr, tx_index.ptr, cert_index.ptr);
    return Pointer.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  slot() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  tx_index() {
    const ret = wasm.exunits_steps(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  cert_index() {
    const ret = wasm.pointer_cert_index(this.ptr);
    return BigNum.__wrap(ret);
  }
}

const PointerAddressFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_pointeraddress_free(ptr)
);
/** */
export class PointerAddress {
  static __wrap(ptr) {
    const obj = Object.create(PointerAddress.prototype);
    obj.ptr = ptr;
    PointerAddressFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PointerAddressFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_pointeraddress_free(ptr);
  }
  /**
   * @param {number} network
   * @param {StakeCredential} payment
   * @param {Pointer} stake
   * @returns {PointerAddress}
   */
  static new(network, payment, stake) {
    _assertClass(payment, StakeCredential);
    _assertClass(stake, Pointer);
    const ret = wasm.pointeraddress_new(network, payment.ptr, stake.ptr);
    return PointerAddress.__wrap(ret);
  }
  /**
   * @returns {StakeCredential}
   */
  payment_cred() {
    const ret = wasm.pointeraddress_payment_cred(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {Pointer}
   */
  stake_pointer() {
    const ret = wasm.pointeraddress_stake_pointer(this.ptr);
    return Pointer.__wrap(ret);
  }
  /**
   * @returns {Address}
   */
  to_address() {
    const ret = wasm.pointeraddress_to_address(this.ptr);
    return Address.__wrap(ret);
  }
  /**
   * @param {Address} addr
   * @returns {PointerAddress | undefined}
   */
  static from_address(addr) {
    _assertClass(addr, Address);
    const ret = wasm.address_as_pointer(addr.ptr);
    return ret === 0 ? undefined : PointerAddress.__wrap(ret);
  }
}

const PoolMetadataFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_poolmetadata_free(ptr)
);
/** */
export class PoolMetadata {
  static __wrap(ptr) {
    const obj = Object.create(PoolMetadata.prototype);
    obj.ptr = ptr;
    PoolMetadataFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PoolMetadataFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_poolmetadata_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolmetadata_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PoolMetadata}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.poolmetadata_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolMetadata.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolmetadata_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolmetadata_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {PoolMetadata}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.poolmetadata_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolMetadata.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Url}
   */
  url() {
    const ret = wasm.anchor_anchor_url(this.ptr);
    return Url.__wrap(ret);
  }
  /**
   * @returns {PoolMetadataHash}
   */
  pool_metadata_hash() {
    const ret = wasm.anchor_anchor_data_hash(this.ptr);
    return PoolMetadataHash.__wrap(ret);
  }
  /**
   * @param {Url} url
   * @param {PoolMetadataHash} pool_metadata_hash
   * @returns {PoolMetadata}
   */
  static new(url, pool_metadata_hash) {
    _assertClass(url, Url);
    _assertClass(pool_metadata_hash, PoolMetadataHash);
    const ret = wasm.anchor_new(url.ptr, pool_metadata_hash.ptr);
    return PoolMetadata.__wrap(ret);
  }
}

const PoolMetadataHashFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_poolmetadatahash_free(ptr)
);
/** */
export class PoolMetadataHash {
  static __wrap(ptr) {
    const obj = Object.create(PoolMetadataHash.prototype);
    obj.ptr = ptr;
    PoolMetadataHashFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PoolMetadataHashFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_poolmetadatahash_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PoolMetadataHash}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.poolmetadatahash_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolMetadataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        prefix,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydatahash_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {PoolMetadataHash}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.poolmetadatahash_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolMetadataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} hex
   * @returns {PoolMetadataHash}
   */
  static from_hex(hex) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        hex,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.poolmetadatahash_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolMetadataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const PoolParamsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_poolparams_free(ptr)
);
/** */
export class PoolParams {
  static __wrap(ptr) {
    const obj = Object.create(PoolParams.prototype);
    obj.ptr = ptr;
    PoolParamsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PoolParamsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_poolparams_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolparams_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PoolParams}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.poolparams_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolParams.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolparams_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolparams_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {PoolParams}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.poolparams_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolParams.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Ed25519KeyHash}
   */
  operator() {
    const ret = wasm.poolparams_operator(this.ptr);
    return Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @returns {VRFKeyHash}
   */
  vrf_keyhash() {
    const ret = wasm.poolparams_vrf_keyhash(this.ptr);
    return VRFKeyHash.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  pledge() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  cost() {
    const ret = wasm.exunits_steps(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  margin() {
    const ret = wasm.drepvotingthresholds_committee_normal(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {RewardAddress}
   */
  reward_account() {
    const ret = wasm.poolparams_reward_account(this.ptr);
    return RewardAddress.__wrap(ret);
  }
  /**
   * @returns {Ed25519KeyHashes}
   */
  pool_owners() {
    const ret = wasm.poolparams_pool_owners(this.ptr);
    return Ed25519KeyHashes.__wrap(ret);
  }
  /**
   * @returns {Relays}
   */
  relays() {
    const ret = wasm.poolparams_relays(this.ptr);
    return Relays.__wrap(ret);
  }
  /**
   * @returns {PoolMetadata | undefined}
   */
  pool_metadata() {
    const ret = wasm.poolparams_pool_metadata(this.ptr);
    return ret === 0 ? undefined : PoolMetadata.__wrap(ret);
  }
  /**
   * @param {Ed25519KeyHash} operator
   * @param {VRFKeyHash} vrf_keyhash
   * @param {BigNum} pledge
   * @param {BigNum} cost
   * @param {UnitInterval} margin
   * @param {RewardAddress} reward_account
   * @param {Ed25519KeyHashes} pool_owners
   * @param {Relays} relays
   * @param {PoolMetadata | undefined} pool_metadata
   * @returns {PoolParams}
   */
  static new(
    operator,
    vrf_keyhash,
    pledge,
    cost,
    margin,
    reward_account,
    pool_owners,
    relays,
    pool_metadata,
  ) {
    _assertClass(operator, Ed25519KeyHash);
    _assertClass(vrf_keyhash, VRFKeyHash);
    _assertClass(pledge, BigNum);
    _assertClass(cost, BigNum);
    _assertClass(margin, UnitInterval);
    _assertClass(reward_account, RewardAddress);
    _assertClass(pool_owners, Ed25519KeyHashes);
    _assertClass(relays, Relays);
    let ptr0 = 0;
    if (!isLikeNone(pool_metadata)) {
      _assertClass(pool_metadata, PoolMetadata);
      ptr0 = pool_metadata.__destroy_into_raw();
    }
    const ret = wasm.poolparams_new(
      operator.ptr,
      vrf_keyhash.ptr,
      pledge.ptr,
      cost.ptr,
      margin.ptr,
      reward_account.ptr,
      pool_owners.ptr,
      relays.ptr,
      ptr0,
    );
    return PoolParams.__wrap(ret);
  }
}

const PoolRegistrationFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_poolregistration_free(ptr)
);
/** */
export class PoolRegistration {
  static __wrap(ptr) {
    const obj = Object.create(PoolRegistration.prototype);
    obj.ptr = ptr;
    PoolRegistrationFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PoolRegistrationFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_poolregistration_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolregistration_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PoolRegistration}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.poolregistration_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolRegistration.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolregistration_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolregistration_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {PoolRegistration}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.poolregistration_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolRegistration.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {PoolParams}
   */
  pool_params() {
    const ret = wasm.poolregistration_pool_params(this.ptr);
    return PoolParams.__wrap(ret);
  }
  /**
   * @param {PoolParams} pool_params
   * @returns {PoolRegistration}
   */
  static new(pool_params) {
    _assertClass(pool_params, PoolParams);
    const ret = wasm.poolregistration_new(pool_params.ptr);
    return PoolRegistration.__wrap(ret);
  }
  /**
   * @param {boolean} update
   */
  set_is_update(update) {
    wasm.poolregistration_set_is_update(this.ptr, update);
  }
}

const PoolRetirementFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_poolretirement_free(ptr)
);
/** */
export class PoolRetirement {
  static __wrap(ptr) {
    const obj = Object.create(PoolRetirement.prototype);
    obj.ptr = ptr;
    PoolRetirementFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PoolRetirementFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_poolretirement_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolretirement_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PoolRetirement}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.poolretirement_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolRetirement.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolretirement_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolretirement_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {PoolRetirement}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.poolretirement_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolRetirement.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Ed25519KeyHash}
   */
  pool_keyhash() {
    const ret = wasm.poolretirement_pool_keyhash(this.ptr);
    return Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  epoch() {
    const ret = wasm.networkinfo_protocol_magic(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {Ed25519KeyHash} pool_keyhash
   * @param {number} epoch
   * @returns {PoolRetirement}
   */
  static new(pool_keyhash, epoch) {
    _assertClass(pool_keyhash, Ed25519KeyHash);
    const ret = wasm.poolretirement_new(pool_keyhash.ptr, epoch);
    return PoolRetirement.__wrap(ret);
  }
}

const PoolVotingThresholdsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_poolvotingthresholds_free(ptr)
);
/** */
export class PoolVotingThresholds {
  static __wrap(ptr) {
    const obj = Object.create(PoolVotingThresholds.prototype);
    obj.ptr = ptr;
    PoolVotingThresholdsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PoolVotingThresholdsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_poolvotingthresholds_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolvotingthresholds_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PoolVotingThresholds}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.poolvotingthresholds_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolVotingThresholds.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolvotingthresholds_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.poolvotingthresholds_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {PoolVotingThresholds}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.poolvotingthresholds_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PoolVotingThresholds.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {UnitInterval}
   */
  motion_no_confidence() {
    const ret = wasm.drepvotingthresholds_motion_no_confidence(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  committee_normal() {
    const ret = wasm.drepvotingthresholds_committee_normal(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  committee_no_confidence() {
    const ret = wasm.drepvotingthresholds_committee_no_confidence(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @returns {UnitInterval}
   */
  hard_fork_initiation() {
    const ret = wasm.drepvotingthresholds_update_constitution(this.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @param {UnitInterval} motion_no_confidence
   * @param {UnitInterval} committee_normal
   * @param {UnitInterval} committee_no_confidence
   * @param {UnitInterval} hard_fork_initiation
   * @returns {PoolVotingThresholds}
   */
  static new(
    motion_no_confidence,
    committee_normal,
    committee_no_confidence,
    hard_fork_initiation,
  ) {
    _assertClass(motion_no_confidence, UnitInterval);
    _assertClass(committee_normal, UnitInterval);
    _assertClass(committee_no_confidence, UnitInterval);
    _assertClass(hard_fork_initiation, UnitInterval);
    const ret = wasm.poolvotingthresholds_new(
      motion_no_confidence.ptr,
      committee_normal.ptr,
      committee_no_confidence.ptr,
      hard_fork_initiation.ptr,
    );
    return PoolVotingThresholds.__wrap(ret);
  }
}

const PrivateKeyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_privatekey_free(ptr)
);
/** */
export class PrivateKey {
  static __wrap(ptr) {
    const obj = Object.create(PrivateKey.prototype);
    obj.ptr = ptr;
    PrivateKeyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PrivateKeyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_privatekey_free(ptr);
  }
  /**
   * @returns {PublicKey}
   */
  to_public() {
    const ret = wasm.privatekey_to_public(this.ptr);
    return PublicKey.__wrap(ret);
  }
  /**
   * @returns {PrivateKey}
   */
  static generate_ed25519() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.privatekey_generate_ed25519(retptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PrivateKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {PrivateKey}
   */
  static generate_ed25519extended() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.privatekey_generate_ed25519extended(retptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PrivateKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Get private key from its bech32 representation
   * ```javascript
   * PrivateKey.from_bech32(&#39;ed25519_sk1ahfetf02qwwg4dkq7mgp4a25lx5vh9920cr5wnxmpzz9906qvm8qwvlts0&#39;);
   * ```
   * For an extended 25519 key
   * ```javascript
   * PrivateKey.from_bech32(&#39;ed25519e_sk1gqwl4szuwwh6d0yk3nsqcc6xxc3fpvjlevgwvt60df59v8zd8f8prazt8ln3lmz096ux3xvhhvm3ca9wj2yctdh3pnw0szrma07rt5gl748fp&#39;);
   * ```
   * @param {string} bech32_str
   * @returns {PrivateKey}
   */
  static from_bech32(bech32_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech32_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.privatekey_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PrivateKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_bech32() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.privatekey_to_bech32(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  as_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.privatekey_as_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PrivateKey}
   */
  static from_extended_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.privatekey_from_extended_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PrivateKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PrivateKey}
   */
  static from_normal_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.privatekey_from_normal_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PrivateKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} message
   * @returns {Ed25519Signature}
   */
  sign(message) {
    const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.privatekey_sign(this.ptr, ptr0, len0);
    return Ed25519Signature.__wrap(ret);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PrivateKey}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.privatekey_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PrivateKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.privatekey_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const ProposalProcedureFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_proposalprocedure_free(ptr)
);
/** */
export class ProposalProcedure {
  static __wrap(ptr) {
    const obj = Object.create(ProposalProcedure.prototype);
    obj.ptr = ptr;
    ProposalProcedureFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ProposalProcedureFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_proposalprocedure_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.proposalprocedure_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ProposalProcedure}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.proposalprocedure_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ProposalProcedure.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.proposalprocedure_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.proposalprocedure_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {ProposalProcedure}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.proposalprocedure_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ProposalProcedure.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {BigNum}
   */
  deposit() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {ScriptHash}
   */
  hash() {
    const ret = wasm.proposalprocedure_hash(this.ptr);
    return ScriptHash.__wrap(ret);
  }
  /**
   * @returns {GovernanceAction}
   */
  governance_action() {
    const ret = wasm.proposalprocedure_governance_action(this.ptr);
    return GovernanceAction.__wrap(ret);
  }
  /**
   * @returns {Anchor}
   */
  anchor() {
    const ret = wasm.proposalprocedure_anchor(this.ptr);
    return Anchor.__wrap(ret);
  }
  /**
   * @param {BigNum} deposit
   * @param {ScriptHash} hash
   * @param {GovernanceAction} governance_action
   * @param {Anchor} anchor
   * @returns {ProposalProcedure}
   */
  static new(deposit, hash, governance_action, anchor) {
    _assertClass(deposit, BigNum);
    _assertClass(hash, ScriptHash);
    _assertClass(governance_action, GovernanceAction);
    _assertClass(anchor, Anchor);
    const ret = wasm.proposalprocedure_new(
      deposit.ptr,
      hash.ptr,
      governance_action.ptr,
      anchor.ptr,
    );
    return ProposalProcedure.__wrap(ret);
  }
}

const ProposalProceduresFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_proposalprocedures_free(ptr)
);
/** */
export class ProposalProcedures {
  static __wrap(ptr) {
    const obj = Object.create(ProposalProcedures.prototype);
    obj.ptr = ptr;
    ProposalProceduresFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ProposalProceduresFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_proposalprocedures_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.proposalprocedures_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ProposalProcedures}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.proposalprocedures_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ProposalProcedures.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {ProposalProcedures}
   */
  static new() {
    const ret = wasm.certificates_new();
    return ProposalProcedures.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {ProposalProcedure}
   */
  get(index) {
    const ret = wasm.proposalprocedures_get(this.ptr, index);
    return ProposalProcedure.__wrap(ret);
  }
  /**
   * @param {ProposalProcedure} elem
   */
  add(elem) {
    _assertClass(elem, ProposalProcedure);
    wasm.proposalprocedures_add(this.ptr, elem.ptr);
  }
}

const ProposedProtocolParameterUpdatesFinalization = new FinalizationRegistry(
  (ptr) => wasm.__wbg_proposedprotocolparameterupdates_free(ptr)
);
/** */
export class ProposedProtocolParameterUpdates {
  static __wrap(ptr) {
    const obj = Object.create(ProposedProtocolParameterUpdates.prototype);
    obj.ptr = ptr;
    ProposedProtocolParameterUpdatesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ProposedProtocolParameterUpdatesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_proposedprotocolparameterupdates_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.proposedprotocolparameterupdates_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ProposedProtocolParameterUpdates}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.proposedprotocolparameterupdates_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ProposedProtocolParameterUpdates.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.proposedprotocolparameterupdates_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.proposedprotocolparameterupdates_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {ProposedProtocolParameterUpdates}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.proposedprotocolparameterupdates_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ProposedProtocolParameterUpdates.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {ProposedProtocolParameterUpdates}
   */
  static new() {
    const ret = wasm.auxiliarydataset_new();
    return ProposedProtocolParameterUpdates.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.auxiliarydataset_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {GenesisHash} key
   * @param {ProtocolParamUpdate} value
   * @returns {ProtocolParamUpdate | undefined}
   */
  insert(key, value) {
    _assertClass(key, GenesisHash);
    _assertClass(value, ProtocolParamUpdate);
    const ret = wasm.proposedprotocolparameterupdates_insert(
      this.ptr,
      key.ptr,
      value.ptr,
    );
    return ret === 0 ? undefined : ProtocolParamUpdate.__wrap(ret);
  }
  /**
   * @param {GenesisHash} key
   * @returns {ProtocolParamUpdate | undefined}
   */
  get(key) {
    _assertClass(key, GenesisHash);
    const ret = wasm.proposedprotocolparameterupdates_get(this.ptr, key.ptr);
    return ret === 0 ? undefined : ProtocolParamUpdate.__wrap(ret);
  }
  /**
   * @returns {GenesisHashes}
   */
  keys() {
    const ret = wasm.proposedprotocolparameterupdates_keys(this.ptr);
    return GenesisHashes.__wrap(ret);
  }
}

const ProtocolParamUpdateFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_protocolparamupdate_free(ptr)
);
/** */
export class ProtocolParamUpdate {
  static __wrap(ptr) {
    const obj = Object.create(ProtocolParamUpdate.prototype);
    obj.ptr = ptr;
    ProtocolParamUpdateFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ProtocolParamUpdateFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_protocolparamupdate_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolparamupdate_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ProtocolParamUpdate}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.protocolparamupdate_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ProtocolParamUpdate.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolparamupdate_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolparamupdate_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {ProtocolParamUpdate}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.protocolparamupdate_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ProtocolParamUpdate.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {BigNum} minfee_a
   */
  set_minfee_a(minfee_a) {
    _assertClass(minfee_a, BigNum);
    wasm.protocolparamupdate_set_minfee_a(this.ptr, minfee_a.ptr);
  }
  /**
   * @returns {BigNum | undefined}
   */
  minfee_a() {
    const ret = wasm.protocolparamupdate_minfee_a(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} minfee_b
   */
  set_minfee_b(minfee_b) {
    _assertClass(minfee_b, BigNum);
    wasm.protocolparamupdate_set_minfee_b(this.ptr, minfee_b.ptr);
  }
  /**
   * @returns {BigNum | undefined}
   */
  minfee_b() {
    const ret = wasm.protocolparamupdate_minfee_b(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {number} max_block_body_size
   */
  set_max_block_body_size(max_block_body_size) {
    wasm.protocolparamupdate_set_max_block_body_size(
      this.ptr,
      max_block_body_size,
    );
  }
  /**
   * @returns {number | undefined}
   */
  max_block_body_size() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolparamupdate_max_block_body_size(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} max_tx_size
   */
  set_max_tx_size(max_tx_size) {
    wasm.protocolparamupdate_set_max_tx_size(this.ptr, max_tx_size);
  }
  /**
   * @returns {number | undefined}
   */
  max_tx_size() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolparamupdate_max_tx_size(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} max_block_header_size
   */
  set_max_block_header_size(max_block_header_size) {
    wasm.protocolparamupdate_set_max_block_header_size(
      this.ptr,
      max_block_header_size,
    );
  }
  /**
   * @returns {number | undefined}
   */
  max_block_header_size() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolparamupdate_max_block_header_size(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {BigNum} key_deposit
   */
  set_key_deposit(key_deposit) {
    _assertClass(key_deposit, BigNum);
    wasm.protocolparamupdate_set_key_deposit(this.ptr, key_deposit.ptr);
  }
  /**
   * @returns {BigNum | undefined}
   */
  key_deposit() {
    const ret = wasm.protocolparamupdate_key_deposit(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} pool_deposit
   */
  set_pool_deposit(pool_deposit) {
    _assertClass(pool_deposit, BigNum);
    wasm.protocolparamupdate_set_pool_deposit(this.ptr, pool_deposit.ptr);
  }
  /**
   * @returns {BigNum | undefined}
   */
  pool_deposit() {
    const ret = wasm.protocolparamupdate_pool_deposit(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {number} max_epoch
   */
  set_max_epoch(max_epoch) {
    wasm.protocolparamupdate_set_max_epoch(this.ptr, max_epoch);
  }
  /**
   * @returns {number | undefined}
   */
  max_epoch() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolparamupdate_max_epoch(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} n_opt
   */
  set_n_opt(n_opt) {
    wasm.protocolparamupdate_set_n_opt(this.ptr, n_opt);
  }
  /**
   * @returns {number | undefined}
   */
  n_opt() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolparamupdate_n_opt(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {UnitInterval} pool_pledge_influence
   */
  set_pool_pledge_influence(pool_pledge_influence) {
    _assertClass(pool_pledge_influence, UnitInterval);
    wasm.protocolparamupdate_set_pool_pledge_influence(
      this.ptr,
      pool_pledge_influence.ptr,
    );
  }
  /**
   * @returns {UnitInterval | undefined}
   */
  pool_pledge_influence() {
    const ret = wasm.protocolparamupdate_pool_pledge_influence(this.ptr);
    return ret === 0 ? undefined : UnitInterval.__wrap(ret);
  }
  /**
   * @param {UnitInterval} expansion_rate
   */
  set_expansion_rate(expansion_rate) {
    _assertClass(expansion_rate, UnitInterval);
    wasm.protocolparamupdate_set_expansion_rate(this.ptr, expansion_rate.ptr);
  }
  /**
   * @returns {UnitInterval | undefined}
   */
  expansion_rate() {
    const ret = wasm.protocolparamupdate_expansion_rate(this.ptr);
    return ret === 0 ? undefined : UnitInterval.__wrap(ret);
  }
  /**
   * @param {UnitInterval} treasury_growth_rate
   */
  set_treasury_growth_rate(treasury_growth_rate) {
    _assertClass(treasury_growth_rate, UnitInterval);
    wasm.protocolparamupdate_set_treasury_growth_rate(
      this.ptr,
      treasury_growth_rate.ptr,
    );
  }
  /**
   * @returns {UnitInterval | undefined}
   */
  treasury_growth_rate() {
    const ret = wasm.protocolparamupdate_treasury_growth_rate(this.ptr);
    return ret === 0 ? undefined : UnitInterval.__wrap(ret);
  }
  /**
   * @param {UnitInterval} d
   */
  set_d(d) {
    _assertClass(d, UnitInterval);
    wasm.protocolparamupdate_set_d(this.ptr, d.ptr);
  }
  /**
   * @returns {UnitInterval | undefined}
   */
  d() {
    const ret = wasm.protocolparamupdate_d(this.ptr);
    return ret === 0 ? undefined : UnitInterval.__wrap(ret);
  }
  /**
   * @param {Nonce} extra_entropy
   */
  set_extra_entropy(extra_entropy) {
    _assertClass(extra_entropy, Nonce);
    wasm.protocolparamupdate_set_extra_entropy(this.ptr, extra_entropy.ptr);
  }
  /**
   * @returns {Nonce | undefined}
   */
  extra_entropy() {
    const ret = wasm.protocolparamupdate_extra_entropy(this.ptr);
    return ret === 0 ? undefined : Nonce.__wrap(ret);
  }
  /**
   * @param {ProtocolVersion} protocol_version
   */
  set_protocol_version(protocol_version) {
    _assertClass(protocol_version, ProtocolVersion);
    wasm.protocolparamupdate_set_protocol_version(
      this.ptr,
      protocol_version.ptr,
    );
  }
  /**
   * @returns {ProtocolVersion | undefined}
   */
  protocol_version() {
    const ret = wasm.protocolparamupdate_protocol_version(this.ptr);
    return ret === 0 ? undefined : ProtocolVersion.__wrap(ret);
  }
  /**
   * @param {BigNum} min_pool_cost
   */
  set_min_pool_cost(min_pool_cost) {
    _assertClass(min_pool_cost, BigNum);
    wasm.protocolparamupdate_set_min_pool_cost(this.ptr, min_pool_cost.ptr);
  }
  /**
   * @returns {BigNum | undefined}
   */
  min_pool_cost() {
    const ret = wasm.protocolparamupdate_min_pool_cost(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} ada_per_utxo_byte
   */
  set_ada_per_utxo_byte(ada_per_utxo_byte) {
    _assertClass(ada_per_utxo_byte, BigNum);
    wasm.protocolparamupdate_set_ada_per_utxo_byte(
      this.ptr,
      ada_per_utxo_byte.ptr,
    );
  }
  /**
   * @returns {BigNum | undefined}
   */
  ada_per_utxo_byte() {
    const ret = wasm.protocolparamupdate_ada_per_utxo_byte(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {Costmdls} cost_models
   */
  set_cost_models(cost_models) {
    _assertClass(cost_models, Costmdls);
    wasm.protocolparamupdate_set_cost_models(this.ptr, cost_models.ptr);
  }
  /**
   * @returns {Costmdls | undefined}
   */
  cost_models() {
    const ret = wasm.protocolparamupdate_cost_models(this.ptr);
    return ret === 0 ? undefined : Costmdls.__wrap(ret);
  }
  /**
   * @param {ExUnitPrices} execution_costs
   */
  set_execution_costs(execution_costs) {
    _assertClass(execution_costs, ExUnitPrices);
    wasm.protocolparamupdate_set_execution_costs(this.ptr, execution_costs.ptr);
  }
  /**
   * @returns {ExUnitPrices | undefined}
   */
  execution_costs() {
    const ret = wasm.protocolparamupdate_execution_costs(this.ptr);
    return ret === 0 ? undefined : ExUnitPrices.__wrap(ret);
  }
  /**
   * @param {ExUnits} max_tx_ex_units
   */
  set_max_tx_ex_units(max_tx_ex_units) {
    _assertClass(max_tx_ex_units, ExUnits);
    wasm.protocolparamupdate_set_max_tx_ex_units(this.ptr, max_tx_ex_units.ptr);
  }
  /**
   * @returns {ExUnits | undefined}
   */
  max_tx_ex_units() {
    const ret = wasm.protocolparamupdate_max_tx_ex_units(this.ptr);
    return ret === 0 ? undefined : ExUnits.__wrap(ret);
  }
  /**
   * @param {ExUnits} max_block_ex_units
   */
  set_max_block_ex_units(max_block_ex_units) {
    _assertClass(max_block_ex_units, ExUnits);
    wasm.protocolparamupdate_set_max_block_ex_units(
      this.ptr,
      max_block_ex_units.ptr,
    );
  }
  /**
   * @returns {ExUnits | undefined}
   */
  max_block_ex_units() {
    const ret = wasm.protocolparamupdate_max_block_ex_units(this.ptr);
    return ret === 0 ? undefined : ExUnits.__wrap(ret);
  }
  /**
   * @param {number} max_value_size
   */
  set_max_value_size(max_value_size) {
    wasm.protocolparamupdate_set_max_value_size(this.ptr, max_value_size);
  }
  /**
   * @returns {number | undefined}
   */
  max_value_size() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolparamupdate_max_value_size(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} collateral_percentage
   */
  set_collateral_percentage(collateral_percentage) {
    wasm.protocolparamupdate_set_collateral_percentage(
      this.ptr,
      collateral_percentage,
    );
  }
  /**
   * @returns {number | undefined}
   */
  collateral_percentage() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolparamupdate_collateral_percentage(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {number} max_collateral_inputs
   */
  set_max_collateral_inputs(max_collateral_inputs) {
    wasm.protocolparamupdate_set_max_collateral_inputs(
      this.ptr,
      max_collateral_inputs,
    );
  }
  /**
   * @returns {number | undefined}
   */
  max_collateral_inputs() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolparamupdate_max_collateral_inputs(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {PoolVotingThresholds} pool_voting_thresholds
   */
  set_pool_voting_thresholds(pool_voting_thresholds) {
    _assertClass(pool_voting_thresholds, PoolVotingThresholds);
    var ptr0 = pool_voting_thresholds.__destroy_into_raw();
    wasm.protocolparamupdate_set_pool_voting_thresholds(this.ptr, ptr0);
  }
  /**
   * @returns {PoolVotingThresholds | undefined}
   */
  pool_voting_thresholds() {
    const ret = wasm.protocolparamupdate_pool_voting_thresholds(this.ptr);
    return ret === 0 ? undefined : PoolVotingThresholds.__wrap(ret);
  }
  /**
   * @param {DrepVotingThresholds} drep_voting_thresholds
   */
  set_drep_voting_thresholds(drep_voting_thresholds) {
    _assertClass(drep_voting_thresholds, DrepVotingThresholds);
    var ptr0 = drep_voting_thresholds.__destroy_into_raw();
    wasm.protocolparamupdate_set_drep_voting_thresholds(this.ptr, ptr0);
  }
  /**
   * @returns {DrepVotingThresholds | undefined}
   */
  drep_voting_thresholds() {
    const ret = wasm.protocolparamupdate_drep_voting_thresholds(this.ptr);
    return ret === 0 ? undefined : DrepVotingThresholds.__wrap(ret);
  }
  /**
   * @param {BigNum} min_committee_size
   */
  set_min_committee_size(min_committee_size) {
    _assertClass(min_committee_size, BigNum);
    var ptr0 = min_committee_size.__destroy_into_raw();
    wasm.protocolparamupdate_set_min_committee_size(this.ptr, ptr0);
  }
  /**
   * @returns {BigNum | undefined}
   */
  min_committee_size() {
    const ret = wasm.protocolparamupdate_min_committee_size(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} committee_term_limit
   */
  set_committee_term_limit(committee_term_limit) {
    _assertClass(committee_term_limit, BigNum);
    var ptr0 = committee_term_limit.__destroy_into_raw();
    wasm.protocolparamupdate_set_committee_term_limit(this.ptr, ptr0);
  }
  /**
   * @returns {BigNum | undefined}
   */
  committee_term_limit() {
    const ret = wasm.protocolparamupdate_committee_term_limit(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} governance_action_expiration
   */
  set_governance_action_expiration(governance_action_expiration) {
    _assertClass(governance_action_expiration, BigNum);
    var ptr0 = governance_action_expiration.__destroy_into_raw();
    wasm.protocolparamupdate_set_governance_action_expiration(this.ptr, ptr0);
  }
  /**
   * @returns {BigNum | undefined}
   */
  governance_action_expiration() {
    const ret = wasm.protocolparamupdate_governance_action_expiration(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} governance_action_deposit
   */
  set_governance_action_deposit(governance_action_deposit) {
    _assertClass(governance_action_deposit, BigNum);
    var ptr0 = governance_action_deposit.__destroy_into_raw();
    wasm.protocolparamupdate_set_governance_action_deposit(this.ptr, ptr0);
  }
  /**
   * @returns {BigNum | undefined}
   */
  governance_action_deposit() {
    const ret = wasm.protocolparamupdate_governance_action_deposit(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} drep_deposit
   */
  set_drep_deposit(drep_deposit) {
    _assertClass(drep_deposit, BigNum);
    var ptr0 = drep_deposit.__destroy_into_raw();
    wasm.protocolparamupdate_set_drep_deposit(this.ptr, ptr0);
  }
  /**
   * @returns {BigNum | undefined}
   */
  drep_deposit() {
    const ret = wasm.protocolparamupdate_drep_deposit(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {number} drep_inactivity_period
   */
  set_drep_inactivity_period(drep_inactivity_period) {
    wasm.protocolparamupdate_set_drep_inactivity_period(
      this.ptr,
      drep_inactivity_period,
    );
  }
  /**
   * @returns {number | undefined}
   */
  drep_inactivity_period() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolparamupdate_drep_inactivity_period(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {ProtocolParamUpdate}
   */
  static new() {
    const ret = wasm.protocolparamupdate_new();
    return ProtocolParamUpdate.__wrap(ret);
  }
}

const ProtocolVersionFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_protocolversion_free(ptr)
);
/** */
export class ProtocolVersion {
  static __wrap(ptr) {
    const obj = Object.create(ProtocolVersion.prototype);
    obj.ptr = ptr;
    ProtocolVersionFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ProtocolVersionFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_protocolversion_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolversion_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ProtocolVersion}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.protocolversion_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ProtocolVersion.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolversion_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.protocolversion_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {ProtocolVersion}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.protocolversion_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ProtocolVersion.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number}
   */
  major() {
    const ret = wasm.networkinfo_protocol_magic(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {number}
   */
  minor() {
    const ret = wasm.operationalcert_kes_period(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} major
   * @param {number} minor
   * @returns {ProtocolVersion}
   */
  static new(major, minor) {
    const ret = wasm.protocolversion_new(major, minor);
    return ProtocolVersion.__wrap(ret);
  }
}

const PublicKeyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_publickey_free(ptr)
);
/**
 * ED25519 key used as public key
 */
export class PublicKey {
  static __wrap(ptr) {
    const obj = Object.create(PublicKey.prototype);
    obj.ptr = ptr;
    PublicKeyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PublicKeyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_publickey_free(ptr);
  }
  /**
   * Get public key from its bech32 representation
   * Example:
   * ```javascript
   * const pkey = PublicKey.from_bech32(&#39;ed25519_pk1dgaagyh470y66p899txcl3r0jaeaxu6yd7z2dxyk55qcycdml8gszkxze2&#39;);
   * ```
   * @param {string} bech32_str
   * @returns {PublicKey}
   */
  static from_bech32(bech32_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech32_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.publickey_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PublicKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_bech32() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.publickey_to_bech32(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  as_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {PublicKey}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.publickey_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return PublicKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} data
   * @param {Ed25519Signature} signature
   * @returns {boolean}
   */
  verify(data, signature) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(signature, Ed25519Signature);
    const ret = wasm.publickey_verify(this.ptr, ptr0, len0, signature.ptr);
    return ret !== 0;
  }
  /**
   * @returns {Ed25519KeyHash}
   */
  hash() {
    const ret = wasm.publickey_hash(this.ptr);
    return Ed25519KeyHash.__wrap(ret);
  }
}

const PublicKeysFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_publickeys_free(ptr)
);
/** */
export class PublicKeys {
  static __wrap(ptr) {
    const obj = Object.create(PublicKeys.prototype);
    obj.ptr = ptr;
    PublicKeysFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    PublicKeysFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_publickeys_free(ptr);
  }
  /** */
  constructor() {
    const ret = wasm.ed25519keyhashes_new();
    return PublicKeys.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  size() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {PublicKey}
   */
  get(index) {
    const ret = wasm.publickeys_get(this.ptr, index);
    return PublicKey.__wrap(ret);
  }
  /**
   * @param {PublicKey} key
   */
  add(key) {
    _assertClass(key, PublicKey);
    wasm.publickeys_add(this.ptr, key.ptr);
  }
}

const RedeemerFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_redeemer_free(ptr)
);
/** */
export class Redeemer {
  static __wrap(ptr) {
    const obj = Object.create(Redeemer.prototype);
    obj.ptr = ptr;
    RedeemerFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    RedeemerFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_redeemer_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.redeemer_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Redeemer}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.redeemer_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Redeemer.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {RedeemerTag}
   */
  tag() {
    const ret = wasm.redeemer_tag(this.ptr);
    return RedeemerTag.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  index() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {PlutusData}
   */
  data() {
    const ret = wasm.redeemer_data(this.ptr);
    return PlutusData.__wrap(ret);
  }
  /**
   * @returns {ExUnits}
   */
  ex_units() {
    const ret = wasm.drepvotingthresholds_update_constitution(this.ptr);
    return ExUnits.__wrap(ret);
  }
  /**
   * @param {RedeemerTag} tag
   * @param {BigNum} index
   * @param {PlutusData} data
   * @param {ExUnits} ex_units
   * @returns {Redeemer}
   */
  static new(tag, index, data, ex_units) {
    _assertClass(tag, RedeemerTag);
    _assertClass(index, BigNum);
    _assertClass(data, PlutusData);
    _assertClass(ex_units, ExUnits);
    const ret = wasm.redeemer_new(tag.ptr, index.ptr, data.ptr, ex_units.ptr);
    return Redeemer.__wrap(ret);
  }
}

const RedeemerTagFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_redeemertag_free(ptr)
);
/** */
export class RedeemerTag {
  static __wrap(ptr) {
    const obj = Object.create(RedeemerTag.prototype);
    obj.ptr = ptr;
    RedeemerTagFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    RedeemerTagFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_redeemertag_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.redeemertag_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {RedeemerTag}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.redeemertag_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return RedeemerTag.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {RedeemerTag}
   */
  static new_spend() {
    const ret = wasm.language_new_plutus_v1();
    return RedeemerTag.__wrap(ret);
  }
  /**
   * @returns {RedeemerTag}
   */
  static new_mint() {
    const ret = wasm.language_new_plutus_v2();
    return RedeemerTag.__wrap(ret);
  }
  /**
   * @returns {RedeemerTag}
   */
  static new_cert() {
    const ret = wasm.language_new_plutus_v3();
    return RedeemerTag.__wrap(ret);
  }
  /**
   * @returns {RedeemerTag}
   */
  static new_reward() {
    const ret = wasm.redeemertag_new_reward();
    return RedeemerTag.__wrap(ret);
  }
  /**
   * @returns {RedeemerTag}
   */
  static new_drep() {
    const ret = wasm.redeemertag_new_drep();
    return RedeemerTag.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.redeemertag_kind(this.ptr);
    return ret >>> 0;
  }
}

const RedeemerWitnessKeyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_redeemerwitnesskey_free(ptr)
);
/** */
export class RedeemerWitnessKey {
  static __wrap(ptr) {
    const obj = Object.create(RedeemerWitnessKey.prototype);
    obj.ptr = ptr;
    RedeemerWitnessKeyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    RedeemerWitnessKeyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_redeemerwitnesskey_free(ptr);
  }
  /**
   * @returns {RedeemerTag}
   */
  tag() {
    const ret = wasm.redeemerwitnesskey_tag(this.ptr);
    return RedeemerTag.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  index() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {RedeemerTag} tag
   * @param {BigNum} index
   * @returns {RedeemerWitnessKey}
   */
  static new(tag, index) {
    _assertClass(tag, RedeemerTag);
    _assertClass(index, BigNum);
    const ret = wasm.redeemerwitnesskey_new(tag.ptr, index.ptr);
    return RedeemerWitnessKey.__wrap(ret);
  }
}

const RedeemersFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_redeemers_free(ptr)
);
/** */
export class Redeemers {
  static __wrap(ptr) {
    const obj = Object.create(Redeemers.prototype);
    obj.ptr = ptr;
    RedeemersFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    RedeemersFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_redeemers_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.redeemers_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Redeemers}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.redeemers_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Redeemers.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Redeemers}
   */
  static new() {
    const ret = wasm.certificates_new();
    return Redeemers.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {Redeemer}
   */
  get(index) {
    const ret = wasm.redeemers_get(this.ptr, index);
    return Redeemer.__wrap(ret);
  }
  /**
   * @param {Redeemer} elem
   */
  add(elem) {
    _assertClass(elem, Redeemer);
    wasm.redeemers_add(this.ptr, elem.ptr);
  }
}

const RegCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_regcert_free(ptr)
);
/** */
export class RegCert {
  static __wrap(ptr) {
    const obj = Object.create(RegCert.prototype);
    obj.ptr = ptr;
    RegCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    RegCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_regcert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regcert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {RegCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.regcert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return RegCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regcert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regcert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {RegCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.regcert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return RegCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredential}
   */
  stake_credential() {
    const ret = wasm.regcert_stake_credential(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  coin() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {StakeCredential} stake_credential
   * @param {BigNum} coin
   * @returns {RegCert}
   */
  static new(stake_credential, coin) {
    _assertClass(stake_credential, StakeCredential);
    _assertClass(coin, BigNum);
    const ret = wasm.regcert_new(stake_credential.ptr, coin.ptr);
    return RegCert.__wrap(ret);
  }
}

const RegCommitteeHotKeyCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_regcommitteehotkeycert_free(ptr)
);
/** */
export class RegCommitteeHotKeyCert {
  static __wrap(ptr) {
    const obj = Object.create(RegCommitteeHotKeyCert.prototype);
    obj.ptr = ptr;
    RegCommitteeHotKeyCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    RegCommitteeHotKeyCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_regcommitteehotkeycert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regcommitteehotkeycert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {RegCommitteeHotKeyCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.regcommitteehotkeycert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return RegCommitteeHotKeyCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regcommitteehotkeycert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regcommitteehotkeycert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {RegCommitteeHotKeyCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.regcommitteehotkeycert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return RegCommitteeHotKeyCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Ed25519KeyHash}
   */
  committee_cold_keyhash() {
    const ret = wasm.genesiskeydelegation_genesishash(this.ptr);
    return Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @returns {Ed25519KeyHash}
   */
  committee_hot_keyhash() {
    const ret = wasm.genesiskeydelegation_genesis_delegate_hash(this.ptr);
    return Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @param {Ed25519KeyHash} committee_cold_keyhash
   * @param {Ed25519KeyHash} committee_hot_keyhash
   * @returns {RegCommitteeHotKeyCert}
   */
  static new(committee_cold_keyhash, committee_hot_keyhash) {
    _assertClass(committee_cold_keyhash, Ed25519KeyHash);
    _assertClass(committee_hot_keyhash, Ed25519KeyHash);
    const ret = wasm.regcommitteehotkeycert_new(
      committee_cold_keyhash.ptr,
      committee_hot_keyhash.ptr,
    );
    return RegCommitteeHotKeyCert.__wrap(ret);
  }
}

const RegDrepCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_regdrepcert_free(ptr)
);
/** */
export class RegDrepCert {
  static __wrap(ptr) {
    const obj = Object.create(RegDrepCert.prototype);
    obj.ptr = ptr;
    RegDrepCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    RegDrepCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_regdrepcert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regdrepcert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {RegDrepCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.regdrepcert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return RegDrepCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regdrepcert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regdrepcert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {RegDrepCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.regdrepcert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return RegDrepCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredential}
   */
  voting_credential() {
    const ret = wasm.regcert_stake_credential(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  coin() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {StakeCredential} voting_credential
   * @param {BigNum} coin
   * @returns {RegDrepCert}
   */
  static new(voting_credential, coin) {
    _assertClass(voting_credential, StakeCredential);
    _assertClass(coin, BigNum);
    const ret = wasm.regcert_new(voting_credential.ptr, coin.ptr);
    return RegDrepCert.__wrap(ret);
  }
}

const RelayFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_relay_free(ptr)
);
/** */
export class Relay {
  static __wrap(ptr) {
    const obj = Object.create(Relay.prototype);
    obj.ptr = ptr;
    RelayFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    RelayFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_relay_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.relay_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Relay}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.relay_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Relay.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.relay_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.relay_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Relay}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.relay_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Relay.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {SingleHostAddr} single_host_addr
   * @returns {Relay}
   */
  static new_single_host_addr(single_host_addr) {
    _assertClass(single_host_addr, SingleHostAddr);
    const ret = wasm.relay_new_single_host_addr(single_host_addr.ptr);
    return Relay.__wrap(ret);
  }
  /**
   * @param {SingleHostName} single_host_name
   * @returns {Relay}
   */
  static new_single_host_name(single_host_name) {
    _assertClass(single_host_name, SingleHostName);
    const ret = wasm.relay_new_single_host_name(single_host_name.ptr);
    return Relay.__wrap(ret);
  }
  /**
   * @param {MultiHostName} multi_host_name
   * @returns {Relay}
   */
  static new_multi_host_name(multi_host_name) {
    _assertClass(multi_host_name, MultiHostName);
    const ret = wasm.relay_new_multi_host_name(multi_host_name.ptr);
    return Relay.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.relay_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {SingleHostAddr | undefined}
   */
  as_single_host_addr() {
    const ret = wasm.relay_as_single_host_addr(this.ptr);
    return ret === 0 ? undefined : SingleHostAddr.__wrap(ret);
  }
  /**
   * @returns {SingleHostName | undefined}
   */
  as_single_host_name() {
    const ret = wasm.relay_as_single_host_name(this.ptr);
    return ret === 0 ? undefined : SingleHostName.__wrap(ret);
  }
  /**
   * @returns {MultiHostName | undefined}
   */
  as_multi_host_name() {
    const ret = wasm.relay_as_multi_host_name(this.ptr);
    return ret === 0 ? undefined : MultiHostName.__wrap(ret);
  }
}

const RelaysFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_relays_free(ptr)
);
/** */
export class Relays {
  static __wrap(ptr) {
    const obj = Object.create(Relays.prototype);
    obj.ptr = ptr;
    RelaysFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    RelaysFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_relays_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.relays_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Relays}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.relays_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Relays.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.relays_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.relays_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Relays}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.relays_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Relays.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Relays}
   */
  static new() {
    const ret = wasm.assetnames_new();
    return Relays.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {Relay}
   */
  get(index) {
    const ret = wasm.relays_get(this.ptr, index);
    return Relay.__wrap(ret);
  }
  /**
   * @param {Relay} elem
   */
  add(elem) {
    _assertClass(elem, Relay);
    wasm.relays_add(this.ptr, elem.ptr);
  }
}

const RequiredWitnessSetFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_requiredwitnessset_free(ptr)
);
/** */
export class RequiredWitnessSet {
  static __wrap(ptr) {
    const obj = Object.create(RequiredWitnessSet.prototype);
    obj.ptr = ptr;
    RequiredWitnessSetFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    RequiredWitnessSetFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_requiredwitnessset_free(ptr);
  }
  /**
   * @param {Vkeywitness} vkey
   */
  add_vkey(vkey) {
    _assertClass(vkey, Vkeywitness);
    wasm.requiredwitnessset_add_vkey(this.ptr, vkey.ptr);
  }
  /**
   * @param {Vkey} vkey
   */
  add_vkey_key(vkey) {
    _assertClass(vkey, Vkey);
    wasm.requiredwitnessset_add_vkey(this.ptr, vkey.ptr);
  }
  /**
   * @param {Ed25519KeyHash} hash
   */
  add_vkey_key_hash(hash) {
    _assertClass(hash, Ed25519KeyHash);
    wasm.requiredwitnessset_add_vkey_key_hash(this.ptr, hash.ptr);
  }
  /**
   * @param {BootstrapWitness} bootstrap
   */
  add_bootstrap(bootstrap) {
    _assertClass(bootstrap, BootstrapWitness);
    wasm.requiredwitnessset_add_bootstrap(this.ptr, bootstrap.ptr);
  }
  /**
   * @param {Vkey} bootstrap
   */
  add_bootstrap_key(bootstrap) {
    _assertClass(bootstrap, Vkey);
    wasm.requiredwitnessset_add_bootstrap_key(this.ptr, bootstrap.ptr);
  }
  /**
   * @param {Ed25519KeyHash} hash
   */
  add_bootstrap_key_hash(hash) {
    _assertClass(hash, Ed25519KeyHash);
    wasm.requiredwitnessset_add_bootstrap_key_hash(this.ptr, hash.ptr);
  }
  /**
   * @param {NativeScript} native_script
   */
  add_native_script(native_script) {
    _assertClass(native_script, NativeScript);
    wasm.requiredwitnessset_add_native_script(this.ptr, native_script.ptr);
  }
  /**
   * @param {ScriptHash} native_script
   */
  add_native_script_hash(native_script) {
    _assertClass(native_script, ScriptHash);
    wasm.requiredwitnessset_add_native_script_hash(this.ptr, native_script.ptr);
  }
  /**
   * @param {PlutusScript} plutus_script
   */
  add_plutus_script(plutus_script) {
    _assertClass(plutus_script, PlutusScript);
    wasm.requiredwitnessset_add_plutus_script(this.ptr, plutus_script.ptr);
  }
  /**
   * @param {PlutusScript} plutus_script
   */
  add_plutus_v2_script(plutus_script) {
    _assertClass(plutus_script, PlutusScript);
    wasm.requiredwitnessset_add_plutus_v2_script(this.ptr, plutus_script.ptr);
  }
  /**
   * @param {ScriptHash} plutus_script
   */
  add_plutus_hash(plutus_script) {
    _assertClass(plutus_script, ScriptHash);
    wasm.requiredwitnessset_add_plutus_hash(this.ptr, plutus_script.ptr);
  }
  /**
   * @param {PlutusData} plutus_datum
   */
  add_plutus_datum(plutus_datum) {
    _assertClass(plutus_datum, PlutusData);
    wasm.requiredwitnessset_add_plutus_datum(this.ptr, plutus_datum.ptr);
  }
  /**
   * @param {DataHash} plutus_datum
   */
  add_plutus_datum_hash(plutus_datum) {
    _assertClass(plutus_datum, DataHash);
    wasm.requiredwitnessset_add_plutus_datum_hash(this.ptr, plutus_datum.ptr);
  }
  /**
   * @param {Redeemer} redeemer
   */
  add_redeemer(redeemer) {
    _assertClass(redeemer, Redeemer);
    wasm.requiredwitnessset_add_redeemer(this.ptr, redeemer.ptr);
  }
  /**
   * @param {RedeemerWitnessKey} redeemer
   */
  add_redeemer_tag(redeemer) {
    _assertClass(redeemer, RedeemerWitnessKey);
    wasm.requiredwitnessset_add_redeemer_tag(this.ptr, redeemer.ptr);
  }
  /**
   * @param {RequiredWitnessSet} requirements
   */
  add_all(requirements) {
    _assertClass(requirements, RequiredWitnessSet);
    wasm.requiredwitnessset_add_all(this.ptr, requirements.ptr);
  }
  /**
   * @returns {RequiredWitnessSet}
   */
  static new() {
    const ret = wasm.requiredwitnessset_new();
    return RequiredWitnessSet.__wrap(ret);
  }
}

const RewardAddressFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_rewardaddress_free(ptr)
);
/** */
export class RewardAddress {
  static __wrap(ptr) {
    const obj = Object.create(RewardAddress.prototype);
    obj.ptr = ptr;
    RewardAddressFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    RewardAddressFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_rewardaddress_free(ptr);
  }
  /**
   * @param {number} network
   * @param {StakeCredential} payment
   * @returns {RewardAddress}
   */
  static new(network, payment) {
    _assertClass(payment, StakeCredential);
    const ret = wasm.enterpriseaddress_new(network, payment.ptr);
    return RewardAddress.__wrap(ret);
  }
  /**
   * @returns {StakeCredential}
   */
  payment_cred() {
    const ret = wasm.baseaddress_payment_cred(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {Address}
   */
  to_address() {
    const ret = wasm.rewardaddress_to_address(this.ptr);
    return Address.__wrap(ret);
  }
  /**
   * @param {Address} addr
   * @returns {RewardAddress | undefined}
   */
  static from_address(addr) {
    _assertClass(addr, Address);
    const ret = wasm.address_as_reward(addr.ptr);
    return ret === 0 ? undefined : RewardAddress.__wrap(ret);
  }
}

const RewardAddressesFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_rewardaddresses_free(ptr)
);
/** */
export class RewardAddresses {
  static __wrap(ptr) {
    const obj = Object.create(RewardAddresses.prototype);
    obj.ptr = ptr;
    RewardAddressesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    RewardAddressesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_rewardaddresses_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.rewardaddresses_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {RewardAddresses}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.rewardaddresses_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return RewardAddresses.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.rewardaddresses_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.rewardaddresses_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {RewardAddresses}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.rewardaddresses_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return RewardAddresses.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {RewardAddresses}
   */
  static new() {
    const ret = wasm.ed25519keyhashes_new();
    return RewardAddresses.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {RewardAddress}
   */
  get(index) {
    const ret = wasm.rewardaddresses_get(this.ptr, index);
    return RewardAddress.__wrap(ret);
  }
  /**
   * @param {RewardAddress} elem
   */
  add(elem) {
    _assertClass(elem, RewardAddress);
    wasm.rewardaddresses_add(this.ptr, elem.ptr);
  }
}

const ScriptFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_script_free(ptr)
);
/** */
export class Script {
  static __wrap(ptr) {
    const obj = Object.create(Script.prototype);
    obj.ptr = ptr;
    ScriptFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ScriptFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_script_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.script_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Script}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.script_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Script.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.script_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.script_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Script}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.script_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Script.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {NativeScript} native_script
   * @returns {Script}
   */
  static new_native(native_script) {
    _assertClass(native_script, NativeScript);
    const ret = wasm.script_new_native(native_script.ptr);
    return Script.__wrap(ret);
  }
  /**
   * @param {PlutusScript} plutus_script
   * @returns {Script}
   */
  static new_plutus_v1(plutus_script) {
    _assertClass(plutus_script, PlutusScript);
    const ret = wasm.script_new_plutus_v1(plutus_script.ptr);
    return Script.__wrap(ret);
  }
  /**
   * @param {PlutusScript} plutus_script
   * @returns {Script}
   */
  static new_plutus_v2(plutus_script) {
    _assertClass(plutus_script, PlutusScript);
    const ret = wasm.script_new_plutus_v2(plutus_script.ptr);
    return Script.__wrap(ret);
  }
  /**
   * @param {PlutusScript} plutus_script
   * @returns {Script}
   */
  static new_plutus_v3(plutus_script) {
    _assertClass(plutus_script, PlutusScript);
    const ret = wasm.script_new_plutus_v3(plutus_script.ptr);
    return Script.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.script_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {NativeScript | undefined}
   */
  as_native() {
    const ret = wasm.script_as_native(this.ptr);
    return ret === 0 ? undefined : NativeScript.__wrap(ret);
  }
  /**
   * @returns {PlutusScript | undefined}
   */
  as_plutus_v1() {
    const ret = wasm.script_as_plutus_v1(this.ptr);
    return ret === 0 ? undefined : PlutusScript.__wrap(ret);
  }
  /**
   * @returns {PlutusScript | undefined}
   */
  as_plutus_v2() {
    const ret = wasm.script_as_plutus_v2(this.ptr);
    return ret === 0 ? undefined : PlutusScript.__wrap(ret);
  }
  /**
   * @returns {PlutusScript | undefined}
   */
  as_plutus_v3() {
    const ret = wasm.script_as_plutus_v3(this.ptr);
    return ret === 0 ? undefined : PlutusScript.__wrap(ret);
  }
}

const ScriptAllFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_scriptall_free(ptr)
);
/** */
export class ScriptAll {
  static __wrap(ptr) {
    const obj = Object.create(ScriptAll.prototype);
    obj.ptr = ptr;
    ScriptAllFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ScriptAllFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_scriptall_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptall_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ScriptAll}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptall_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptAll.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptall_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptall_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {ScriptAll}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptall_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptAll.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {NativeScripts}
   */
  native_scripts() {
    const ret = wasm.scriptall_native_scripts(this.ptr);
    return NativeScripts.__wrap(ret);
  }
  /**
   * @param {NativeScripts} native_scripts
   * @returns {ScriptAll}
   */
  static new(native_scripts) {
    _assertClass(native_scripts, NativeScripts);
    const ret = wasm.scriptall_new(native_scripts.ptr);
    return ScriptAll.__wrap(ret);
  }
}

const ScriptAnyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_scriptany_free(ptr)
);
/** */
export class ScriptAny {
  static __wrap(ptr) {
    const obj = Object.create(ScriptAny.prototype);
    obj.ptr = ptr;
    ScriptAnyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ScriptAnyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_scriptany_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptany_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ScriptAny}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptany_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptAny.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptall_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptall_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {ScriptAny}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptany_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptAny.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {NativeScripts}
   */
  native_scripts() {
    const ret = wasm.scriptall_native_scripts(this.ptr);
    return NativeScripts.__wrap(ret);
  }
  /**
   * @param {NativeScripts} native_scripts
   * @returns {ScriptAny}
   */
  static new(native_scripts) {
    _assertClass(native_scripts, NativeScripts);
    const ret = wasm.scriptall_new(native_scripts.ptr);
    return ScriptAny.__wrap(ret);
  }
}

const ScriptDataHashFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_scriptdatahash_free(ptr)
);
/** */
export class ScriptDataHash {
  static __wrap(ptr) {
    const obj = Object.create(ScriptDataHash.prototype);
    obj.ptr = ptr;
    ScriptDataHashFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ScriptDataHashFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_scriptdatahash_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ScriptDataHash}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptdatahash_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptDataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        prefix,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydatahash_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {ScriptDataHash}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptdatahash_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptDataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} hex
   * @returns {ScriptDataHash}
   */
  static from_hex(hex) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        hex,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptdatahash_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptDataHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const ScriptHashFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_scripthash_free(ptr)
);
/** */
export class ScriptHash {
  static __wrap(ptr) {
    const obj = Object.create(ScriptHash.prototype);
    obj.ptr = ptr;
    ScriptHashFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ScriptHashFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_scripthash_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ScriptHash}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.scripthash_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        prefix,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.ed25519keyhash_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {ScriptHash}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.scripthash_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhash_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} hex
   * @returns {ScriptHash}
   */
  static from_hex(hex) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        hex,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.scripthash_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const ScriptHashesFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_scripthashes_free(ptr)
);
/** */
export class ScriptHashes {
  static __wrap(ptr) {
    const obj = Object.create(ScriptHashes.prototype);
    obj.ptr = ptr;
    ScriptHashesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ScriptHashesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_scripthashes_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scripthashes_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ScriptHashes}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.scripthashes_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptHashes.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhashes_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.ed25519keyhashes_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {ScriptHashes}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.scripthashes_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptHashes.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {ScriptHashes}
   */
  static new() {
    const ret = wasm.ed25519keyhashes_new();
    return ScriptHashes.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {ScriptHash}
   */
  get(index) {
    const ret = wasm.scripthashes_get(this.ptr, index);
    return ScriptHash.__wrap(ret);
  }
  /**
   * @param {ScriptHash} elem
   */
  add(elem) {
    _assertClass(elem, ScriptHash);
    wasm.ed25519keyhashes_add(this.ptr, elem.ptr);
  }
}

const ScriptNOfKFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_scriptnofk_free(ptr)
);
/** */
export class ScriptNOfK {
  static __wrap(ptr) {
    const obj = Object.create(ScriptNOfK.prototype);
    obj.ptr = ptr;
    ScriptNOfKFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ScriptNOfKFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_scriptnofk_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptnofk_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ScriptNOfK}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptnofk_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptNOfK.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptnofk_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptnofk_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {ScriptNOfK}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptnofk_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptNOfK.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number}
   */
  n() {
    const ret = wasm.networkinfo_protocol_magic(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {NativeScripts}
   */
  native_scripts() {
    const ret = wasm.scriptnofk_native_scripts(this.ptr);
    return NativeScripts.__wrap(ret);
  }
  /**
   * @param {number} n
   * @param {NativeScripts} native_scripts
   * @returns {ScriptNOfK}
   */
  static new(n, native_scripts) {
    _assertClass(native_scripts, NativeScripts);
    const ret = wasm.scriptnofk_new(n, native_scripts.ptr);
    return ScriptNOfK.__wrap(ret);
  }
}

const ScriptPubkeyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_scriptpubkey_free(ptr)
);
/** */
export class ScriptPubkey {
  static __wrap(ptr) {
    const obj = Object.create(ScriptPubkey.prototype);
    obj.ptr = ptr;
    ScriptPubkeyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ScriptPubkeyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_scriptpubkey_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptpubkey_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ScriptPubkey}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptpubkey_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptPubkey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptpubkey_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptpubkey_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {ScriptPubkey}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptpubkey_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptPubkey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Ed25519KeyHash}
   */
  addr_keyhash() {
    const ret = wasm.genesiskeydelegation_genesishash(this.ptr);
    return Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @param {Ed25519KeyHash} addr_keyhash
   * @returns {ScriptPubkey}
   */
  static new(addr_keyhash) {
    _assertClass(addr_keyhash, Ed25519KeyHash);
    const ret = wasm.scriptpubkey_new(addr_keyhash.ptr);
    return ScriptPubkey.__wrap(ret);
  }
}

const ScriptRefFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_scriptref_free(ptr)
);
/** */
export class ScriptRef {
  static __wrap(ptr) {
    const obj = Object.create(ScriptRef.prototype);
    obj.ptr = ptr;
    ScriptRefFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ScriptRefFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_scriptref_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptref_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {ScriptRef}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptref_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptRef.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.script_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.script_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {ScriptRef}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptref_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptRef.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Script} script
   * @returns {ScriptRef}
   */
  static new(script) {
    _assertClass(script, Script);
    const ret = wasm.scriptref_new(script.ptr);
    return ScriptRef.__wrap(ret);
  }
  /**
   * @returns {Script}
   */
  get() {
    const ret = wasm.scriptref_get(this.ptr);
    return Script.__wrap(ret);
  }
}

const ScriptWitnessFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_scriptwitness_free(ptr)
);
/** */
export class ScriptWitness {
  static __wrap(ptr) {
    const obj = Object.create(ScriptWitness.prototype);
    obj.ptr = ptr;
    ScriptWitnessFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ScriptWitnessFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_scriptwitness_free(ptr);
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptwitness_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.scriptwitness_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {ScriptWitness}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.scriptwitness_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return ScriptWitness.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {NativeScript} native_script
   * @returns {ScriptWitness}
   */
  static new_native_witness(native_script) {
    _assertClass(native_script, NativeScript);
    const ret = wasm.scriptwitness_new_native_witness(native_script.ptr);
    return ScriptWitness.__wrap(ret);
  }
  /**
   * @param {PlutusWitness} plutus_witness
   * @returns {ScriptWitness}
   */
  static new_plutus_witness(plutus_witness) {
    _assertClass(plutus_witness, PlutusWitness);
    const ret = wasm.scriptwitness_new_plutus_witness(plutus_witness.ptr);
    return ScriptWitness.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.scriptwitness_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {NativeScript | undefined}
   */
  as_native_witness() {
    const ret = wasm.scriptwitness_as_native_witness(this.ptr);
    return ret === 0 ? undefined : NativeScript.__wrap(ret);
  }
  /**
   * @returns {PlutusWitness | undefined}
   */
  as_plutus_witness() {
    const ret = wasm.scriptwitness_as_plutus_witness(this.ptr);
    return ret === 0 ? undefined : PlutusWitness.__wrap(ret);
  }
}

const SingleHostAddrFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_singlehostaddr_free(ptr)
);
/** */
export class SingleHostAddr {
  static __wrap(ptr) {
    const obj = Object.create(SingleHostAddr.prototype);
    obj.ptr = ptr;
    SingleHostAddrFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    SingleHostAddrFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_singlehostaddr_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.singlehostaddr_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {SingleHostAddr}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.singlehostaddr_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return SingleHostAddr.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.singlehostaddr_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.singlehostaddr_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {SingleHostAddr}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.singlehostaddr_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return SingleHostAddr.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number | undefined}
   */
  port() {
    const ret = wasm.singlehostaddr_port(this.ptr);
    return ret === 0xFFFFFF ? undefined : ret;
  }
  /**
   * @returns {Ipv4 | undefined}
   */
  ipv4() {
    const ret = wasm.singlehostaddr_ipv4(this.ptr);
    return ret === 0 ? undefined : Ipv4.__wrap(ret);
  }
  /**
   * @returns {Ipv6 | undefined}
   */
  ipv6() {
    const ret = wasm.singlehostaddr_ipv6(this.ptr);
    return ret === 0 ? undefined : Ipv6.__wrap(ret);
  }
  /**
   * @param {number | undefined} port
   * @param {Ipv4 | undefined} ipv4
   * @param {Ipv6 | undefined} ipv6
   * @returns {SingleHostAddr}
   */
  static new(port, ipv4, ipv6) {
    let ptr0 = 0;
    if (!isLikeNone(ipv4)) {
      _assertClass(ipv4, Ipv4);
      ptr0 = ipv4.__destroy_into_raw();
    }
    let ptr1 = 0;
    if (!isLikeNone(ipv6)) {
      _assertClass(ipv6, Ipv6);
      ptr1 = ipv6.__destroy_into_raw();
    }
    const ret = wasm.singlehostaddr_new(
      isLikeNone(port) ? 0xFFFFFF : port,
      ptr0,
      ptr1,
    );
    return SingleHostAddr.__wrap(ret);
  }
}

const SingleHostNameFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_singlehostname_free(ptr)
);
/** */
export class SingleHostName {
  static __wrap(ptr) {
    const obj = Object.create(SingleHostName.prototype);
    obj.ptr = ptr;
    SingleHostNameFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    SingleHostNameFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_singlehostname_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.singlehostname_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {SingleHostName}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.singlehostname_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return SingleHostName.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.singlehostname_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.singlehostname_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {SingleHostName}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.singlehostname_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return SingleHostName.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number | undefined}
   */
  port() {
    const ret = wasm.singlehostname_port(this.ptr);
    return ret === 0xFFFFFF ? undefined : ret;
  }
  /**
   * @returns {DNSRecordAorAAAA}
   */
  dns_name() {
    const ret = wasm.anchor_anchor_url(this.ptr);
    return DNSRecordAorAAAA.__wrap(ret);
  }
  /**
   * @param {number | undefined} port
   * @param {DNSRecordAorAAAA} dns_name
   * @returns {SingleHostName}
   */
  static new(port, dns_name) {
    _assertClass(dns_name, DNSRecordAorAAAA);
    const ret = wasm.singlehostname_new(
      isLikeNone(port) ? 0xFFFFFF : port,
      dns_name.ptr,
    );
    return SingleHostName.__wrap(ret);
  }
}

const StakeCredentialFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_stakecredential_free(ptr)
);
/** */
export class StakeCredential {
  static __wrap(ptr) {
    const obj = Object.create(StakeCredential.prototype);
    obj.ptr = ptr;
    StakeCredentialFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    StakeCredentialFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_stakecredential_free(ptr);
  }
  /**
   * @param {Ed25519KeyHash} hash
   * @returns {StakeCredential}
   */
  static from_keyhash(hash) {
    _assertClass(hash, Ed25519KeyHash);
    const ret = wasm.drep_new_keyhash(hash.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @param {ScriptHash} hash
   * @returns {StakeCredential}
   */
  static from_scripthash(hash) {
    _assertClass(hash, ScriptHash);
    const ret = wasm.drep_new_scripthash(hash.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {Ed25519KeyHash | undefined}
   */
  to_keyhash() {
    const ret = wasm.stakecredential_to_keyhash(this.ptr);
    return ret === 0 ? undefined : Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @returns {ScriptHash | undefined}
   */
  to_scripthash() {
    const ret = wasm.stakecredential_to_scripthash(this.ptr);
    return ret === 0 ? undefined : ScriptHash.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.networkid_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakecredential_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {StakeCredential}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.stakecredential_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeCredential.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakecredential_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakecredential_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {StakeCredential}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.stakecredential_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeCredential.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const StakeCredentialsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_stakecredentials_free(ptr)
);
/** */
export class StakeCredentials {
  static __wrap(ptr) {
    const obj = Object.create(StakeCredentials.prototype);
    obj.ptr = ptr;
    StakeCredentialsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    StakeCredentialsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_stakecredentials_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakecredentials_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {StakeCredentials}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.stakecredentials_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeCredentials.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakecredentials_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakecredentials_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {StakeCredentials}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.stakecredentials_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeCredentials.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredentials}
   */
  static new() {
    const ret = wasm.ed25519keyhashes_new();
    return StakeCredentials.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {StakeCredential}
   */
  get(index) {
    const ret = wasm.stakecredentials_get(this.ptr, index);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @param {StakeCredential} elem
   */
  add(elem) {
    _assertClass(elem, StakeCredential);
    wasm.stakecredentials_add(this.ptr, elem.ptr);
  }
}

const StakeDelegationFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_stakedelegation_free(ptr)
);
/** */
export class StakeDelegation {
  static __wrap(ptr) {
    const obj = Object.create(StakeDelegation.prototype);
    obj.ptr = ptr;
    StakeDelegationFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    StakeDelegationFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_stakedelegation_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakedelegation_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {StakeDelegation}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.stakedelegation_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeDelegation.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakedelegation_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakedelegation_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {StakeDelegation}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.stakedelegation_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeDelegation.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredential}
   */
  stake_credential() {
    const ret = wasm.stakedelegation_stake_credential(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {Ed25519KeyHash}
   */
  pool_keyhash() {
    const ret = wasm.stakedelegation_pool_keyhash(this.ptr);
    return Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @param {StakeCredential} stake_credential
   * @param {Ed25519KeyHash} pool_keyhash
   * @returns {StakeDelegation}
   */
  static new(stake_credential, pool_keyhash) {
    _assertClass(stake_credential, StakeCredential);
    _assertClass(pool_keyhash, Ed25519KeyHash);
    const ret = wasm.stakedelegation_new(
      stake_credential.ptr,
      pool_keyhash.ptr,
    );
    return StakeDelegation.__wrap(ret);
  }
}

const StakeDeregistrationFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_stakederegistration_free(ptr)
);
/** */
export class StakeDeregistration {
  static __wrap(ptr) {
    const obj = Object.create(StakeDeregistration.prototype);
    obj.ptr = ptr;
    StakeDeregistrationFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    StakeDeregistrationFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_stakederegistration_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakederegistration_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {StakeDeregistration}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.stakederegistration_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeDeregistration.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakederegistration_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakederegistration_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {StakeDeregistration}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.stakederegistration_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeDeregistration.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredential}
   */
  stake_credential() {
    const ret = wasm.stakedelegation_stake_credential(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @param {StakeCredential} stake_credential
   * @returns {StakeDeregistration}
   */
  static new(stake_credential) {
    _assertClass(stake_credential, StakeCredential);
    const ret = wasm.stakederegistration_new(stake_credential.ptr);
    return StakeDeregistration.__wrap(ret);
  }
}

const StakeRegDelegCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_stakeregdelegcert_free(ptr)
);
/** */
export class StakeRegDelegCert {
  static __wrap(ptr) {
    const obj = Object.create(StakeRegDelegCert.prototype);
    obj.ptr = ptr;
    StakeRegDelegCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    StakeRegDelegCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_stakeregdelegcert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakeregdelegcert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {StakeRegDelegCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.stakeregdelegcert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeRegDelegCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakeregdelegcert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakeregdelegcert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {StakeRegDelegCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.stakeregdelegcert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeRegDelegCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredential}
   */
  stake_credential() {
    const ret = wasm.regcert_stake_credential(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {Ed25519KeyHash}
   */
  pool_keyhash() {
    const ret = wasm.stakeregdelegcert_pool_keyhash(this.ptr);
    return Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  coin() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {StakeCredential} stake_credential
   * @param {Ed25519KeyHash} pool_keyhash
   * @param {BigNum} coin
   * @returns {StakeRegDelegCert}
   */
  static new(stake_credential, pool_keyhash, coin) {
    _assertClass(stake_credential, StakeCredential);
    _assertClass(pool_keyhash, Ed25519KeyHash);
    _assertClass(coin, BigNum);
    const ret = wasm.stakeregdelegcert_new(
      stake_credential.ptr,
      pool_keyhash.ptr,
      coin.ptr,
    );
    return StakeRegDelegCert.__wrap(ret);
  }
}

const StakeRegistrationFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_stakeregistration_free(ptr)
);
/** */
export class StakeRegistration {
  static __wrap(ptr) {
    const obj = Object.create(StakeRegistration.prototype);
    obj.ptr = ptr;
    StakeRegistrationFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    StakeRegistrationFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_stakeregistration_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakeregistration_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {StakeRegistration}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.stakeregistration_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeRegistration.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakederegistration_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakederegistration_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {StakeRegistration}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.stakeregistration_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeRegistration.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredential}
   */
  stake_credential() {
    const ret = wasm.stakedelegation_stake_credential(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @param {StakeCredential} stake_credential
   * @returns {StakeRegistration}
   */
  static new(stake_credential) {
    _assertClass(stake_credential, StakeCredential);
    const ret = wasm.stakederegistration_new(stake_credential.ptr);
    return StakeRegistration.__wrap(ret);
  }
}

const StakeVoteDelegCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_stakevotedelegcert_free(ptr)
);
/** */
export class StakeVoteDelegCert {
  static __wrap(ptr) {
    const obj = Object.create(StakeVoteDelegCert.prototype);
    obj.ptr = ptr;
    StakeVoteDelegCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    StakeVoteDelegCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_stakevotedelegcert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakevotedelegcert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {StakeVoteDelegCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.stakevotedelegcert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeVoteDelegCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakevotedelegcert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakevotedelegcert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {StakeVoteDelegCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.stakevotedelegcert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeVoteDelegCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredential}
   */
  stake_credential() {
    const ret = wasm.stakedelegation_stake_credential(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {Ed25519KeyHash}
   */
  pool_keyhash() {
    const ret = wasm.stakedelegation_pool_keyhash(this.ptr);
    return Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @returns {Drep}
   */
  drep() {
    const ret = wasm.stakevotedelegcert_drep(this.ptr);
    return Drep.__wrap(ret);
  }
  /**
   * @param {StakeCredential} stake_credential
   * @param {Ed25519KeyHash} pool_keyhash
   * @param {Drep} drep
   * @returns {StakeVoteDelegCert}
   */
  static new(stake_credential, pool_keyhash, drep) {
    _assertClass(stake_credential, StakeCredential);
    _assertClass(pool_keyhash, Ed25519KeyHash);
    _assertClass(drep, Drep);
    const ret = wasm.stakevotedelegcert_new(
      stake_credential.ptr,
      pool_keyhash.ptr,
      drep.ptr,
    );
    return StakeVoteDelegCert.__wrap(ret);
  }
}

const StakeVoteRegDelegCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_stakevoteregdelegcert_free(ptr)
);
/** */
export class StakeVoteRegDelegCert {
  static __wrap(ptr) {
    const obj = Object.create(StakeVoteRegDelegCert.prototype);
    obj.ptr = ptr;
    StakeVoteRegDelegCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    StakeVoteRegDelegCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_stakevoteregdelegcert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakevoteregdelegcert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {StakeVoteRegDelegCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.stakevoteregdelegcert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeVoteRegDelegCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakevoteregdelegcert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.stakevoteregdelegcert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {StakeVoteRegDelegCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.stakevoteregdelegcert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return StakeVoteRegDelegCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredential}
   */
  stake_credential() {
    const ret = wasm.regcert_stake_credential(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {Ed25519KeyHash}
   */
  pool_keyhash() {
    const ret = wasm.stakeregdelegcert_pool_keyhash(this.ptr);
    return Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @returns {Drep}
   */
  drep() {
    const ret = wasm.stakevoteregdelegcert_drep(this.ptr);
    return Drep.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  coin() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {StakeCredential} stake_credential
   * @param {Ed25519KeyHash} pool_keyhash
   * @param {Drep} drep
   * @param {BigNum} coin
   * @returns {StakeVoteRegDelegCert}
   */
  static new(stake_credential, pool_keyhash, drep, coin) {
    _assertClass(stake_credential, StakeCredential);
    _assertClass(pool_keyhash, Ed25519KeyHash);
    _assertClass(drep, Drep);
    _assertClass(coin, BigNum);
    const ret = wasm.stakevoteregdelegcert_new(
      stake_credential.ptr,
      pool_keyhash.ptr,
      drep.ptr,
      coin.ptr,
    );
    return StakeVoteRegDelegCert.__wrap(ret);
  }
}

const StringsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_strings_free(ptr)
);
/** */
export class Strings {
  static __wrap(ptr) {
    const obj = Object.create(Strings.prototype);
    obj.ptr = ptr;
    StringsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    StringsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_strings_free(ptr);
  }
  /**
   * @returns {Strings}
   */
  static new() {
    const ret = wasm.assetnames_new();
    return Strings.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {string}
   */
  get(index) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.strings_get(retptr, this.ptr, index);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} elem
   */
  add(elem) {
    const ptr0 = passStringToWasm0(
      elem,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len0 = WASM_VECTOR_LEN;
    wasm.strings_add(this.ptr, ptr0, len0);
  }
}

const TimelockExpiryFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_timelockexpiry_free(ptr)
);
/** */
export class TimelockExpiry {
  static __wrap(ptr) {
    const obj = Object.create(TimelockExpiry.prototype);
    obj.ptr = ptr;
    TimelockExpiryFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TimelockExpiryFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_timelockexpiry_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.timelockexpiry_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TimelockExpiry}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.timelockexpiry_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TimelockExpiry.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.timelockexpiry_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.timelockexpiry_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {TimelockExpiry}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.timelockexpiry_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TimelockExpiry.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {BigNum}
   */
  slot() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} slot
   * @returns {TimelockExpiry}
   */
  static new(slot) {
    _assertClass(slot, BigNum);
    const ret = wasm.constrplutusdata_alternative(slot.ptr);
    return TimelockExpiry.__wrap(ret);
  }
}

const TimelockStartFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_timelockstart_free(ptr)
);
/** */
export class TimelockStart {
  static __wrap(ptr) {
    const obj = Object.create(TimelockStart.prototype);
    obj.ptr = ptr;
    TimelockStartFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TimelockStartFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_timelockstart_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.timelockstart_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TimelockStart}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.timelockstart_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TimelockStart.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.timelockexpiry_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.timelockexpiry_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {TimelockStart}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.timelockstart_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TimelockStart.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {BigNum}
   */
  slot() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} slot
   * @returns {TimelockStart}
   */
  static new(slot) {
    _assertClass(slot, BigNum);
    const ret = wasm.constrplutusdata_alternative(slot.ptr);
    return TimelockStart.__wrap(ret);
  }
}

const TransactionFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transaction_free(ptr)
);
/** */
export class Transaction {
  static __wrap(ptr) {
    const obj = Object.create(Transaction.prototype);
    obj.ptr = ptr;
    TransactionFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transaction_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transaction_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Transaction}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transaction_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Transaction.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transaction_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transaction_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Transaction}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transaction_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Transaction.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionBody}
   */
  body() {
    const ret = wasm.transaction_body(this.ptr);
    return TransactionBody.__wrap(ret);
  }
  /**
   * @returns {TransactionWitnessSet}
   */
  witness_set() {
    const ret = wasm.transaction_witness_set(this.ptr);
    return TransactionWitnessSet.__wrap(ret);
  }
  /**
   * @returns {boolean}
   */
  is_valid() {
    const ret = wasm.transaction_is_valid(this.ptr);
    return ret !== 0;
  }
  /**
   * @returns {AuxiliaryData | undefined}
   */
  auxiliary_data() {
    const ret = wasm.transaction_auxiliary_data(this.ptr);
    return ret === 0 ? undefined : AuxiliaryData.__wrap(ret);
  }
  /**
   * @param {boolean} valid
   */
  set_is_valid(valid) {
    wasm.transaction_set_is_valid(this.ptr, valid);
  }
  /**
   * @param {TransactionBody} body
   * @param {TransactionWitnessSet} witness_set
   * @param {AuxiliaryData | undefined} auxiliary_data
   * @returns {Transaction}
   */
  static new(body, witness_set, auxiliary_data) {
    _assertClass(body, TransactionBody);
    _assertClass(witness_set, TransactionWitnessSet);
    let ptr0 = 0;
    if (!isLikeNone(auxiliary_data)) {
      _assertClass(auxiliary_data, AuxiliaryData);
      ptr0 = auxiliary_data.__destroy_into_raw();
    }
    const ret = wasm.transaction_new(body.ptr, witness_set.ptr, ptr0);
    return Transaction.__wrap(ret);
  }
}

const TransactionBodiesFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionbodies_free(ptr)
);
/** */
export class TransactionBodies {
  static __wrap(ptr) {
    const obj = Object.create(TransactionBodies.prototype);
    obj.ptr = ptr;
    TransactionBodiesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionBodiesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionbodies_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbodies_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionBodies}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionbodies_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionBodies.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbodies_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbodies_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {TransactionBodies}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionbodies_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionBodies.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionBodies}
   */
  static new() {
    const ret = wasm.certificates_new();
    return TransactionBodies.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {TransactionBody}
   */
  get(index) {
    const ret = wasm.transactionbodies_get(this.ptr, index);
    return TransactionBody.__wrap(ret);
  }
  /**
   * @param {TransactionBody} elem
   */
  add(elem) {
    _assertClass(elem, TransactionBody);
    wasm.transactionbodies_add(this.ptr, elem.ptr);
  }
}

const TransactionBodyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionbody_free(ptr)
);
/** */
export class TransactionBody {
  static __wrap(ptr) {
    const obj = Object.create(TransactionBody.prototype);
    obj.ptr = ptr;
    TransactionBodyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionBodyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionbody_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbody_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionBody}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionbody_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionBody.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbody_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbody_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {TransactionBody}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionbody_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionBody.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionInputs}
   */
  inputs() {
    const ret = wasm.transactionbody_inputs(this.ptr);
    return TransactionInputs.__wrap(ret);
  }
  /**
   * @returns {TransactionOutputs}
   */
  outputs() {
    const ret = wasm.transactionbody_outputs(this.ptr);
    return TransactionOutputs.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  fee() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {BigNum | undefined}
   */
  ttl() {
    const ret = wasm.transactionbody_ttl(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {Certificates} certs
   */
  set_certs(certs) {
    _assertClass(certs, Certificates);
    wasm.transactionbody_set_certs(this.ptr, certs.ptr);
  }
  /**
   * @returns {Certificates | undefined}
   */
  certs() {
    const ret = wasm.transactionbody_certs(this.ptr);
    return ret === 0 ? undefined : Certificates.__wrap(ret);
  }
  /**
   * @param {Withdrawals} withdrawals
   */
  set_withdrawals(withdrawals) {
    _assertClass(withdrawals, Withdrawals);
    wasm.transactionbody_set_withdrawals(this.ptr, withdrawals.ptr);
  }
  /**
   * @returns {Withdrawals | undefined}
   */
  withdrawals() {
    const ret = wasm.transactionbody_withdrawals(this.ptr);
    return ret === 0 ? undefined : Withdrawals.__wrap(ret);
  }
  /**
   * @param {Update} update
   */
  set_update(update) {
    _assertClass(update, Update);
    wasm.transactionbody_set_update(this.ptr, update.ptr);
  }
  /**
   * @returns {Update | undefined}
   */
  update() {
    const ret = wasm.transactionbody_update(this.ptr);
    return ret === 0 ? undefined : Update.__wrap(ret);
  }
  /**
   * @returns {VotingProcedures | undefined}
   */
  voting_procedures() {
    const ret = wasm.transactionbody_voting_procedures(this.ptr);
    return ret === 0 ? undefined : VotingProcedures.__wrap(ret);
  }
  /**
   * @returns {ProposalProcedures | undefined}
   */
  proposal_procedures() {
    const ret = wasm.transactionbody_proposal_procedures(this.ptr);
    return ret === 0 ? undefined : ProposalProcedures.__wrap(ret);
  }
  /**
   * @param {AuxiliaryDataHash} auxiliary_data_hash
   */
  set_auxiliary_data_hash(auxiliary_data_hash) {
    _assertClass(auxiliary_data_hash, AuxiliaryDataHash);
    wasm.transactionbody_set_auxiliary_data_hash(
      this.ptr,
      auxiliary_data_hash.ptr,
    );
  }
  /**
   * @returns {AuxiliaryDataHash | undefined}
   */
  auxiliary_data_hash() {
    const ret = wasm.transactionbody_auxiliary_data_hash(this.ptr);
    return ret === 0 ? undefined : AuxiliaryDataHash.__wrap(ret);
  }
  /**
   * @param {BigNum} validity_start_interval
   */
  set_validity_start_interval(validity_start_interval) {
    _assertClass(validity_start_interval, BigNum);
    wasm.transactionbody_set_validity_start_interval(
      this.ptr,
      validity_start_interval.ptr,
    );
  }
  /**
   * @returns {BigNum | undefined}
   */
  validity_start_interval() {
    const ret = wasm.transactionbody_validity_start_interval(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {Mint} mint
   */
  set_mint(mint) {
    _assertClass(mint, Mint);
    wasm.transactionbody_set_mint(this.ptr, mint.ptr);
  }
  /**
   * @returns {Mint | undefined}
   */
  mint() {
    const ret = wasm.transactionbody_mint(this.ptr);
    return ret === 0 ? undefined : Mint.__wrap(ret);
  }
  /**
   * @param {ScriptDataHash} script_data_hash
   */
  set_script_data_hash(script_data_hash) {
    _assertClass(script_data_hash, ScriptDataHash);
    wasm.transactionbody_set_script_data_hash(this.ptr, script_data_hash.ptr);
  }
  /**
   * @returns {ScriptDataHash | undefined}
   */
  script_data_hash() {
    const ret = wasm.transactionbody_script_data_hash(this.ptr);
    return ret === 0 ? undefined : ScriptDataHash.__wrap(ret);
  }
  /**
   * @param {TransactionInputs} collateral
   */
  set_collateral(collateral) {
    _assertClass(collateral, TransactionInputs);
    wasm.transactionbody_set_collateral(this.ptr, collateral.ptr);
  }
  /**
   * @returns {TransactionInputs | undefined}
   */
  collateral() {
    const ret = wasm.transactionbody_collateral(this.ptr);
    return ret === 0 ? undefined : TransactionInputs.__wrap(ret);
  }
  /**
   * @param {Ed25519KeyHashes} required_signers
   */
  set_required_signers(required_signers) {
    _assertClass(required_signers, Ed25519KeyHashes);
    wasm.transactionbody_set_required_signers(this.ptr, required_signers.ptr);
  }
  /**
   * @returns {Ed25519KeyHashes | undefined}
   */
  required_signers() {
    const ret = wasm.transactionbody_required_signers(this.ptr);
    return ret === 0 ? undefined : Ed25519KeyHashes.__wrap(ret);
  }
  /**
   * @param {NetworkId} network_id
   */
  set_network_id(network_id) {
    _assertClass(network_id, NetworkId);
    wasm.transactionbody_set_network_id(this.ptr, network_id.ptr);
  }
  /**
   * @returns {NetworkId | undefined}
   */
  network_id() {
    const ret = wasm.transactionbody_network_id(this.ptr);
    return ret === 0 ? undefined : NetworkId.__wrap(ret);
  }
  /**
   * @param {TransactionOutput} collateral_return
   */
  set_collateral_return(collateral_return) {
    _assertClass(collateral_return, TransactionOutput);
    wasm.transactionbody_set_collateral_return(this.ptr, collateral_return.ptr);
  }
  /**
   * @returns {TransactionOutput | undefined}
   */
  collateral_return() {
    const ret = wasm.transactionbody_collateral_return(this.ptr);
    return ret === 0 ? undefined : TransactionOutput.__wrap(ret);
  }
  /**
   * @param {BigNum} total_collateral
   */
  set_total_collateral(total_collateral) {
    _assertClass(total_collateral, BigNum);
    wasm.transactionbody_set_total_collateral(this.ptr, total_collateral.ptr);
  }
  /**
   * @returns {BigNum | undefined}
   */
  total_collateral() {
    const ret = wasm.transactionbody_total_collateral(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {TransactionInputs} reference_inputs
   */
  set_reference_inputs(reference_inputs) {
    _assertClass(reference_inputs, TransactionInputs);
    wasm.transactionbody_set_reference_inputs(this.ptr, reference_inputs.ptr);
  }
  /**
   * @returns {TransactionInputs | undefined}
   */
  reference_inputs() {
    const ret = wasm.transactionbody_reference_inputs(this.ptr);
    return ret === 0 ? undefined : TransactionInputs.__wrap(ret);
  }
  /**
   * @param {VotingProcedures} voting_procedures
   */
  set_voting_procedures(voting_procedures) {
    _assertClass(voting_procedures, VotingProcedures);
    wasm.transactionbody_set_voting_procedures(this.ptr, voting_procedures.ptr);
  }
  /**
   * @param {ProposalProcedures} proposal_procedures
   */
  set_proposal_procedures(proposal_procedures) {
    _assertClass(proposal_procedures, ProposalProcedures);
    wasm.transactionbody_set_proposal_procedures(
      this.ptr,
      proposal_procedures.ptr,
    );
  }
  /**
   * @param {TransactionInputs} inputs
   * @param {TransactionOutputs} outputs
   * @param {BigNum} fee
   * @param {BigNum | undefined} ttl
   * @returns {TransactionBody}
   */
  static new(inputs, outputs, fee, ttl) {
    _assertClass(inputs, TransactionInputs);
    _assertClass(outputs, TransactionOutputs);
    _assertClass(fee, BigNum);
    let ptr0 = 0;
    if (!isLikeNone(ttl)) {
      _assertClass(ttl, BigNum);
      ptr0 = ttl.__destroy_into_raw();
    }
    const ret = wasm.transactionbody_new(
      inputs.ptr,
      outputs.ptr,
      fee.ptr,
      ptr0,
    );
    return TransactionBody.__wrap(ret);
  }
  /**
   * @returns {Uint8Array | undefined}
   */
  raw() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbody_raw(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      let v0;
      if (r0 !== 0) {
        v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
      }
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const TransactionBuilderFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionbuilder_free(ptr)
);
/** */
export class TransactionBuilder {
  static __wrap(ptr) {
    const obj = Object.create(TransactionBuilder.prototype);
    obj.ptr = ptr;
    TransactionBuilderFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionBuilderFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionbuilder_free(ptr);
  }
  /**
   * This automatically selects and adds inputs from {inputs} consisting of just enough to cover
   * the outputs that have already been added.
   * This should be called after adding all certs/outputs/etc and will be an error otherwise.
   * Adding a change output must be called after via TransactionBuilder::balance()
   * inputs to cover the minimum fees. This does not, however, set the txbuilder's fee.
   *
   * change_address is required here in order to determine the min ada requirement precisely
   * @param {TransactionUnspentOutputs} inputs
   * @param {Address} change_address
   * @param {Uint32Array} weights
   */
  add_inputs_from(inputs, change_address, weights) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(inputs, TransactionUnspentOutputs);
      _assertClass(change_address, Address);
      const ptr0 = passArray32ToWasm0(weights, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionbuilder_add_inputs_from(
        retptr,
        this.ptr,
        inputs.ptr,
        change_address.ptr,
        ptr0,
        len0,
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      if (r1) {
        throw takeObject(r0);
      }
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {TransactionUnspentOutput} utxo
   * @param {ScriptWitness | undefined} script_witness
   */
  add_input(utxo, script_witness) {
    _assertClass(utxo, TransactionUnspentOutput);
    let ptr0 = 0;
    if (!isLikeNone(script_witness)) {
      _assertClass(script_witness, ScriptWitness);
      ptr0 = script_witness.__destroy_into_raw();
    }
    wasm.transactionbuilder_add_input(this.ptr, utxo.ptr, ptr0);
  }
  /**
   * @param {TransactionUnspentOutput} utxo
   */
  add_reference_input(utxo) {
    _assertClass(utxo, TransactionUnspentOutput);
    wasm.transactionbuilder_add_reference_input(this.ptr, utxo.ptr);
  }
  /**
   * calculates how much the fee would increase if you added a given output
   * @param {Address} address
   * @param {TransactionInput} input
   * @param {Value} amount
   * @returns {BigNum}
   */
  fee_for_input(address, input, amount) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(address, Address);
      _assertClass(input, TransactionInput);
      _assertClass(amount, Value);
      wasm.transactionbuilder_fee_for_input(
        retptr,
        this.ptr,
        address.ptr,
        input.ptr,
        amount.ptr,
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Add explicit output via a TransactionOutput object
   * @param {TransactionOutput} output
   */
  add_output(output) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(output, TransactionOutput);
      wasm.transactionbuilder_add_output(retptr, this.ptr, output.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      if (r1) {
        throw takeObject(r0);
      }
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Add plutus scripts via a PlutusScripts object
   * @param {PlutusScript} plutus_script
   */
  add_plutus_script(plutus_script) {
    _assertClass(plutus_script, PlutusScript);
    wasm.transactionbuilder_add_plutus_script(this.ptr, plutus_script.ptr);
  }
  /**
   * Add plutus v2 scripts via a PlutusScripts object
   * @param {PlutusScript} plutus_script
   */
  add_plutus_v2_script(plutus_script) {
    _assertClass(plutus_script, PlutusScript);
    wasm.transactionbuilder_add_plutus_v2_script(this.ptr, plutus_script.ptr);
  }
  /**
   * Add plutus data via a PlutusData object
   * @param {PlutusData} plutus_data
   */
  add_plutus_data(plutus_data) {
    _assertClass(plutus_data, PlutusData);
    wasm.transactionbuilder_add_plutus_data(this.ptr, plutus_data.ptr);
  }
  /**
   * Add native scripts via a NativeScripts object
   * @param {NativeScript} native_script
   */
  add_native_script(native_script) {
    _assertClass(native_script, NativeScript);
    wasm.transactionbuilder_add_native_script(this.ptr, native_script.ptr);
  }
  /**
   * Add certificate via a Certificates object
   * @param {Certificate} certificate
   * @param {ScriptWitness | undefined} script_witness
   */
  add_certificate(certificate, script_witness) {
    _assertClass(certificate, Certificate);
    let ptr0 = 0;
    if (!isLikeNone(script_witness)) {
      _assertClass(script_witness, ScriptWitness);
      ptr0 = script_witness.__destroy_into_raw();
    }
    wasm.transactionbuilder_add_certificate(this.ptr, certificate.ptr, ptr0);
  }
  /**
   * calculates how much the fee would increase if you added a given output
   * @param {TransactionOutput} output
   * @returns {BigNum}
   */
  fee_for_output(output) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(output, TransactionOutput);
      wasm.transactionbuilder_fee_for_output(retptr, this.ptr, output.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {BigNum} ttl
   */
  set_ttl(ttl) {
    _assertClass(ttl, BigNum);
    wasm.transactionbuilder_set_ttl(this.ptr, ttl.ptr);
  }
  /**
   * @param {BigNum} validity_start_interval
   */
  set_validity_start_interval(validity_start_interval) {
    _assertClass(validity_start_interval, BigNum);
    wasm.transactionbuilder_set_validity_start_interval(
      this.ptr,
      validity_start_interval.ptr,
    );
  }
  /**
   * @param {RewardAddress} reward_address
   * @param {BigNum} coin
   * @param {ScriptWitness | undefined} script_witness
   */
  add_withdrawal(reward_address, coin, script_witness) {
    _assertClass(reward_address, RewardAddress);
    _assertClass(coin, BigNum);
    let ptr0 = 0;
    if (!isLikeNone(script_witness)) {
      _assertClass(script_witness, ScriptWitness);
      ptr0 = script_witness.__destroy_into_raw();
    }
    wasm.transactionbuilder_add_withdrawal(
      this.ptr,
      reward_address.ptr,
      coin.ptr,
      ptr0,
    );
  }
  /**
   * @returns {AuxiliaryData | undefined}
   */
  auxiliary_data() {
    const ret = wasm.transactionbuilder_auxiliary_data(this.ptr);
    return ret === 0 ? undefined : AuxiliaryData.__wrap(ret);
  }
  /**
   * Set explicit auxiliary data via an AuxiliaryData object
   * It might contain some metadata plus native or Plutus scripts
   * @param {AuxiliaryData} auxiliary_data
   */
  set_auxiliary_data(auxiliary_data) {
    _assertClass(auxiliary_data, AuxiliaryData);
    wasm.transactionbuilder_set_auxiliary_data(this.ptr, auxiliary_data.ptr);
  }
  /**
   * Set metadata using a GeneralTransactionMetadata object
   * It will be set to the existing or new auxiliary data in this builder
   * @param {GeneralTransactionMetadata} metadata
   */
  set_metadata(metadata) {
    _assertClass(metadata, GeneralTransactionMetadata);
    wasm.transactionbuilder_set_metadata(this.ptr, metadata.ptr);
  }
  /**
   * Add a single metadatum using TransactionMetadatumLabel and TransactionMetadatum objects
   * It will be securely added to existing or new metadata in this builder
   * @param {BigNum} key
   * @param {TransactionMetadatum} val
   */
  add_metadatum(key, val) {
    _assertClass(key, BigNum);
    _assertClass(val, TransactionMetadatum);
    wasm.transactionbuilder_add_metadatum(this.ptr, key.ptr, val.ptr);
  }
  /**
   * Add a single JSON metadatum using a TransactionMetadatumLabel and a String
   * It will be securely added to existing or new metadata in this builder
   * @param {BigNum} key
   * @param {string} val
   */
  add_json_metadatum(key, val) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(key, BigNum);
      const ptr0 = passStringToWasm0(
        val,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionbuilder_add_json_metadatum(
        retptr,
        this.ptr,
        key.ptr,
        ptr0,
        len0,
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      if (r1) {
        throw takeObject(r0);
      }
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Add a single JSON metadatum using a TransactionMetadatumLabel, a String, and a MetadataJsonSchema object
   * It will be securely added to existing or new metadata in this builder
   * @param {BigNum} key
   * @param {string} val
   * @param {number} schema
   */
  add_json_metadatum_with_schema(key, val, schema) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(key, BigNum);
      const ptr0 = passStringToWasm0(
        val,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionbuilder_add_json_metadatum_with_schema(
        retptr,
        this.ptr,
        key.ptr,
        ptr0,
        len0,
        schema,
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      if (r1) {
        throw takeObject(r0);
      }
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Returns a copy of the current mint state in the builder
   * @returns {Mint | undefined}
   */
  mint() {
    const ret = wasm.transactionbuilder_mint(this.ptr);
    return ret === 0 ? undefined : Mint.__wrap(ret);
  }
  /**
   * @returns {Certificates | undefined}
   */
  certificates() {
    const ret = wasm.transactionbuilder_certificates(this.ptr);
    return ret === 0 ? undefined : Certificates.__wrap(ret);
  }
  /**
   * @returns {Withdrawals | undefined}
   */
  withdrawals() {
    const ret = wasm.transactionbuilder_withdrawals(this.ptr);
    return ret === 0 ? undefined : Withdrawals.__wrap(ret);
  }
  /**
   * Returns a copy of the current witness native scripts in the builder
   * @returns {NativeScripts | undefined}
   */
  native_scripts() {
    const ret = wasm.transactionbuilder_native_scripts(this.ptr);
    return ret === 0 ? undefined : NativeScripts.__wrap(ret);
  }
  /**
   * Add a mint entry to this builder using a PolicyID and MintAssets object
   * It will be securely added to existing or new Mint in this builder
   * It will securely add assets to an existing PolicyID
   * But it will replace/overwrite any existing mint assets with the same PolicyID
   * first redeemer applied to a PolicyID is taken for all further assets added to the same PolicyID
   * @param {ScriptHash} policy_id
   * @param {MintAssets} mint_assets
   * @param {ScriptWitness | undefined} script_witness
   */
  add_mint(policy_id, mint_assets, script_witness) {
    _assertClass(policy_id, ScriptHash);
    _assertClass(mint_assets, MintAssets);
    let ptr0 = 0;
    if (!isLikeNone(script_witness)) {
      _assertClass(script_witness, ScriptWitness);
      ptr0 = script_witness.__destroy_into_raw();
    }
    wasm.transactionbuilder_add_mint(
      this.ptr,
      policy_id.ptr,
      mint_assets.ptr,
      ptr0,
    );
  }
  /**
   * @param {TransactionBuilderConfig} cfg
   * @returns {TransactionBuilder}
   */
  static new(cfg) {
    _assertClass(cfg, TransactionBuilderConfig);
    const ret = wasm.transactionbuilder_new(cfg.ptr);
    return TransactionBuilder.__wrap(ret);
  }
  /**
   * @returns {ScriptDataHash | undefined}
   */
  script_data_hash() {
    const ret = wasm.transactionbuilder_script_data_hash(this.ptr);
    return ret === 0 ? undefined : ScriptDataHash.__wrap(ret);
  }
  /**
   * @param {TransactionUnspentOutput} utxo
   */
  add_collateral(utxo) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(utxo, TransactionUnspentOutput);
      wasm.transactionbuilder_add_collateral(retptr, this.ptr, utxo.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      if (r1) {
        throw takeObject(r0);
      }
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionInputs | undefined}
   */
  get_collateral() {
    const ret = wasm.transactionbuilder_get_collateral(this.ptr);
    return ret === 0 ? undefined : TransactionInputs.__wrap(ret);
  }
  /**
   * @param {Ed25519KeyHash} required_signer
   */
  add_required_signer(required_signer) {
    _assertClass(required_signer, Ed25519KeyHash);
    wasm.transactionbuilder_add_required_signer(this.ptr, required_signer.ptr);
  }
  /**
   * @returns {Ed25519KeyHashes | undefined}
   */
  required_signers() {
    const ret = wasm.transactionbuilder_required_signers(this.ptr);
    return ret === 0 ? undefined : Ed25519KeyHashes.__wrap(ret);
  }
  /**
   * @param {NetworkId} network_id
   */
  set_network_id(network_id) {
    _assertClass(network_id, NetworkId);
    var ptr0 = network_id.__destroy_into_raw();
    wasm.transactionbuilder_set_network_id(this.ptr, ptr0);
  }
  /**
   * @returns {NetworkId | undefined}
   */
  network_id() {
    const ret = wasm.transactionbuilder_network_id(this.ptr);
    return ret === 0 ? undefined : NetworkId.__wrap(ret);
  }
  /**
   * @returns {Redeemers | undefined}
   */
  redeemers() {
    const ret = wasm.transactionbuilder_redeemers(this.ptr);
    return ret === 0 ? undefined : Redeemers.__wrap(ret);
  }
  /**
   * does not include refunds or withdrawals
   * @returns {Value}
   */
  get_explicit_input() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbuilder_get_explicit_input(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Value.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * withdrawals and refunds
   * @returns {Value}
   */
  get_implicit_input() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbuilder_get_implicit_input(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Value.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Return explicit input plus implicit input plus mint
   * @returns {Value}
   */
  get_total_input() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbuilder_get_total_input(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Value.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Return explicit output plus implicit output plus burn (does not consider fee directly)
   * @returns {Value}
   */
  get_total_output() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbuilder_get_total_output(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Value.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * does not include fee
   * @returns {Value}
   */
  get_explicit_output() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbuilder_get_explicit_output(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Value.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {BigNum}
   */
  get_deposit() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbuilder_get_deposit(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {BigNum | undefined}
   */
  get_fee_if_set() {
    const ret = wasm.transactionbuilder_get_fee_if_set(this.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * Warning: this function will mutate the /fee/ field
   * Make sure to call this function last after setting all other tx-body properties
   * Editing inputs, outputs, mint, etc. after change been calculated
   * might cause a mismatch in calculated fee versus the required fee
   * @param {Address} change_address
   * @param {Datum | undefined} datum
   */
  balance(change_address, datum) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(change_address, Address);
      let ptr0 = 0;
      if (!isLikeNone(datum)) {
        _assertClass(datum, Datum);
        ptr0 = datum.__destroy_into_raw();
      }
      wasm.transactionbuilder_balance(
        retptr,
        this.ptr,
        change_address.ptr,
        ptr0,
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      if (r1) {
        throw takeObject(r0);
      }
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Returns the TransactionBody.
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbuilder_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      if (r3) {
        throw takeObject(r2);
      }
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number}
   */
  full_size() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbuilder_full_size(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return r0 >>> 0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint32Array}
   */
  output_sizes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbuilder_output_sizes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU32FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 4);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionOutputs}
   */
  outputs() {
    const ret = wasm.transactionbuilder_outputs(this.ptr);
    return TransactionOutputs.__wrap(ret);
  }
  /**
   * Returns full Transaction object with the body and the auxiliary data
   *
   * NOTE: witness_set will contain all mint_scripts if any been added or set
   *
   * takes fetched ex units into consideration
   *
   * add collateral utxos and collateral change receiver in case you redeem from plutus script utxos
   *
   * async call
   *
   * NOTE: is_valid set to true
   * @param {TransactionUnspentOutputs | undefined} collateral_utxos
   * @param {Address | undefined} collateral_change_address
   * @param {boolean | undefined} native_uplc
   * @returns {Promise<Transaction>}
   */
  construct(collateral_utxos, collateral_change_address, native_uplc) {
    const ptr = this.__destroy_into_raw();
    let ptr0 = 0;
    if (!isLikeNone(collateral_utxos)) {
      _assertClass(collateral_utxos, TransactionUnspentOutputs);
      ptr0 = collateral_utxos.__destroy_into_raw();
    }
    let ptr1 = 0;
    if (!isLikeNone(collateral_change_address)) {
      _assertClass(collateral_change_address, Address);
      ptr1 = collateral_change_address.__destroy_into_raw();
    }
    const ret = wasm.transactionbuilder_construct(
      ptr,
      ptr0,
      ptr1,
      isLikeNone(native_uplc) ? 0xFFFFFF : native_uplc ? 1 : 0,
    );
    return takeObject(ret);
  }
  /**
   * Returns full Transaction object with the body and the auxiliary data
   * NOTE: witness_set will contain all mint_scripts if any been added or set
   * NOTE: is_valid set to true
   * @returns {Transaction}
   */
  build_tx() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbuilder_build_tx(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Transaction.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * warning: sum of all parts of a transaction must equal 0. You cannot just set the fee to the min value and forget about it
   * warning: min_fee may be slightly larger than the actual minimum fee (ex: a few lovelaces)
   * this is done to simplify the library code, but can be fixed later
   * @returns {BigNum}
   */
  min_fee() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbuilder_min_fee(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return BigNum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const TransactionBuilderConfigFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionbuilderconfig_free(ptr)
);
/** */
export class TransactionBuilderConfig {
  static __wrap(ptr) {
    const obj = Object.create(TransactionBuilderConfig.prototype);
    obj.ptr = ptr;
    TransactionBuilderConfigFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionBuilderConfigFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionbuilderconfig_free(ptr);
  }
}

const TransactionBuilderConfigBuilderFinalization = new FinalizationRegistry(
  (ptr) => wasm.__wbg_transactionbuilderconfigbuilder_free(ptr)
);
/** */
export class TransactionBuilderConfigBuilder {
  static __wrap(ptr) {
    const obj = Object.create(TransactionBuilderConfigBuilder.prototype);
    obj.ptr = ptr;
    TransactionBuilderConfigBuilderFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionBuilderConfigBuilderFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionbuilderconfigbuilder_free(ptr);
  }
  /**
   * @returns {TransactionBuilderConfigBuilder}
   */
  static new() {
    const ret = wasm.transactionbuilderconfigbuilder_new();
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {LinearFee} fee_algo
   * @returns {TransactionBuilderConfigBuilder}
   */
  fee_algo(fee_algo) {
    _assertClass(fee_algo, LinearFee);
    const ret = wasm.transactionbuilderconfigbuilder_fee_algo(
      this.ptr,
      fee_algo.ptr,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {BigNum} coins_per_utxo_byte
   * @returns {TransactionBuilderConfigBuilder}
   */
  coins_per_utxo_byte(coins_per_utxo_byte) {
    _assertClass(coins_per_utxo_byte, BigNum);
    const ret = wasm.transactionbuilderconfigbuilder_coins_per_utxo_byte(
      this.ptr,
      coins_per_utxo_byte.ptr,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {BigNum} pool_deposit
   * @returns {TransactionBuilderConfigBuilder}
   */
  pool_deposit(pool_deposit) {
    _assertClass(pool_deposit, BigNum);
    const ret = wasm.transactionbuilderconfigbuilder_pool_deposit(
      this.ptr,
      pool_deposit.ptr,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {BigNum} key_deposit
   * @returns {TransactionBuilderConfigBuilder}
   */
  key_deposit(key_deposit) {
    _assertClass(key_deposit, BigNum);
    const ret = wasm.transactionbuilderconfigbuilder_key_deposit(
      this.ptr,
      key_deposit.ptr,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {number} max_value_size
   * @returns {TransactionBuilderConfigBuilder}
   */
  max_value_size(max_value_size) {
    const ret = wasm.transactionbuilderconfigbuilder_max_value_size(
      this.ptr,
      max_value_size,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {number} max_tx_size
   * @returns {TransactionBuilderConfigBuilder}
   */
  max_tx_size(max_tx_size) {
    const ret = wasm.transactionbuilderconfigbuilder_max_tx_size(
      this.ptr,
      max_tx_size,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {ExUnitPrices} ex_unit_prices
   * @returns {TransactionBuilderConfigBuilder}
   */
  ex_unit_prices(ex_unit_prices) {
    _assertClass(ex_unit_prices, ExUnitPrices);
    const ret = wasm.transactionbuilderconfigbuilder_ex_unit_prices(
      this.ptr,
      ex_unit_prices.ptr,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {ExUnits} max_tx_ex_units
   * @returns {TransactionBuilderConfigBuilder}
   */
  max_tx_ex_units(max_tx_ex_units) {
    _assertClass(max_tx_ex_units, ExUnits);
    const ret = wasm.transactionbuilderconfigbuilder_max_tx_ex_units(
      this.ptr,
      max_tx_ex_units.ptr,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {Costmdls} costmdls
   * @returns {TransactionBuilderConfigBuilder}
   */
  costmdls(costmdls) {
    _assertClass(costmdls, Costmdls);
    const ret = wasm.transactionbuilderconfigbuilder_costmdls(
      this.ptr,
      costmdls.ptr,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {number} collateral_percentage
   * @returns {TransactionBuilderConfigBuilder}
   */
  collateral_percentage(collateral_percentage) {
    const ret = wasm.transactionbuilderconfigbuilder_collateral_percentage(
      this.ptr,
      collateral_percentage,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {number} max_collateral_inputs
   * @returns {TransactionBuilderConfigBuilder}
   */
  max_collateral_inputs(max_collateral_inputs) {
    const ret = wasm.transactionbuilderconfigbuilder_max_collateral_inputs(
      this.ptr,
      max_collateral_inputs,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {BigNum} zero_time
   * @param {BigNum} zero_slot
   * @param {number} slot_length
   * @returns {TransactionBuilderConfigBuilder}
   */
  slot_config(zero_time, zero_slot, slot_length) {
    _assertClass(zero_time, BigNum);
    _assertClass(zero_slot, BigNum);
    const ret = wasm.transactionbuilderconfigbuilder_slot_config(
      this.ptr,
      zero_time.ptr,
      zero_slot.ptr,
      slot_length,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @param {Blockfrost} blockfrost
   * @returns {TransactionBuilderConfigBuilder}
   */
  blockfrost(blockfrost) {
    _assertClass(blockfrost, Blockfrost);
    const ret = wasm.transactionbuilderconfigbuilder_blockfrost(
      this.ptr,
      blockfrost.ptr,
    );
    return TransactionBuilderConfigBuilder.__wrap(ret);
  }
  /**
   * @returns {TransactionBuilderConfig}
   */
  build() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionbuilderconfigbuilder_build(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionBuilderConfig.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const TransactionHashFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionhash_free(ptr)
);
/** */
export class TransactionHash {
  static __wrap(ptr) {
    const obj = Object.create(TransactionHash.prototype);
    obj.ptr = ptr;
    TransactionHashFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionHashFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionhash_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionHash}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionhash_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        prefix,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydatahash_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {TransactionHash}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionhash_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} hex
   * @returns {TransactionHash}
   */
  static from_hex(hex) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        hex,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionhash_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const TransactionIndexesFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionindexes_free(ptr)
);
/** */
export class TransactionIndexes {
  static __wrap(ptr) {
    const obj = Object.create(TransactionIndexes.prototype);
    obj.ptr = ptr;
    TransactionIndexesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionIndexesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionindexes_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionindexes_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionIndexes}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionindexes_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionIndexes.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionIndexes}
   */
  static new() {
    const ret = wasm.certificates_new();
    return TransactionIndexes.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {BigNum}
   */
  get(index) {
    const ret = wasm.transactionindexes_get(this.ptr, index);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} elem
   */
  add(elem) {
    _assertClass(elem, BigNum);
    wasm.transactionindexes_add(this.ptr, elem.ptr);
  }
}

const TransactionInputFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactioninput_free(ptr)
);
/** */
export class TransactionInput {
  static __wrap(ptr) {
    const obj = Object.create(TransactionInput.prototype);
    obj.ptr = ptr;
    TransactionInputFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionInputFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactioninput_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactioninput_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionInput}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactioninput_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionInput.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactioninput_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactioninput_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {TransactionInput}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactioninput_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionInput.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionHash}
   */
  transaction_id() {
    const ret = wasm.governanceactionid_transaction_id(this.ptr);
    return TransactionHash.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  index() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {TransactionHash} transaction_id
   * @param {BigNum} index
   * @returns {TransactionInput}
   */
  static new(transaction_id, index) {
    _assertClass(transaction_id, TransactionHash);
    _assertClass(index, BigNum);
    const ret = wasm.governanceactionid_new(transaction_id.ptr, index.ptr);
    return TransactionInput.__wrap(ret);
  }
}

const TransactionInputsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactioninputs_free(ptr)
);
/** */
export class TransactionInputs {
  static __wrap(ptr) {
    const obj = Object.create(TransactionInputs.prototype);
    obj.ptr = ptr;
    TransactionInputsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionInputsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactioninputs_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactioninputs_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionInputs}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactioninputs_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionInputs.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactioninputs_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactioninputs_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {TransactionInputs}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactioninputs_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionInputs.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionInputs}
   */
  static new() {
    const ret = wasm.certificates_new();
    return TransactionInputs.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {TransactionInput}
   */
  get(index) {
    const ret = wasm.transactioninputs_get(this.ptr, index);
    return TransactionInput.__wrap(ret);
  }
  /**
   * @param {TransactionInput} elem
   */
  add(elem) {
    _assertClass(elem, TransactionInput);
    wasm.transactioninputs_add(this.ptr, elem.ptr);
  }
  /** */
  sort() {
    wasm.transactioninputs_sort(this.ptr);
  }
}

const TransactionMetadatumFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionmetadatum_free(ptr)
);
/** */
export class TransactionMetadatum {
  static __wrap(ptr) {
    const obj = Object.create(TransactionMetadatum.prototype);
    obj.ptr = ptr;
    TransactionMetadatumFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionMetadatumFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionmetadatum_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionmetadatum_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionMetadatum}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionmetadatum_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionMetadatum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {MetadataMap} map
   * @returns {TransactionMetadatum}
   */
  static new_map(map) {
    _assertClass(map, MetadataMap);
    const ret = wasm.transactionmetadatum_new_map(map.ptr);
    return TransactionMetadatum.__wrap(ret);
  }
  /**
   * @param {MetadataList} list
   * @returns {TransactionMetadatum}
   */
  static new_list(list) {
    _assertClass(list, MetadataList);
    const ret = wasm.transactionmetadatum_new_list(list.ptr);
    return TransactionMetadatum.__wrap(ret);
  }
  /**
   * @param {Int} int
   * @returns {TransactionMetadatum}
   */
  static new_int(int) {
    _assertClass(int, Int);
    const ret = wasm.transactionmetadatum_new_int(int.ptr);
    return TransactionMetadatum.__wrap(ret);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionMetadatum}
   */
  static new_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionmetadatum_new_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionMetadatum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} text
   * @returns {TransactionMetadatum}
   */
  static new_text(text) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        text,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionmetadatum_new_text(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionMetadatum.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.transactionmetadatum_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {MetadataMap}
   */
  as_map() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionmetadatum_as_map(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MetadataMap.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {MetadataList}
   */
  as_list() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionmetadatum_as_list(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return MetadataList.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Int}
   */
  as_int() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionmetadatum_as_int(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Int.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  as_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionmetadatum_as_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      if (r3) {
        throw takeObject(r2);
      }
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  as_text() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionmetadatum_as_text(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
}

const TransactionMetadatumLabelsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionmetadatumlabels_free(ptr)
);
/** */
export class TransactionMetadatumLabels {
  static __wrap(ptr) {
    const obj = Object.create(TransactionMetadatumLabels.prototype);
    obj.ptr = ptr;
    TransactionMetadatumLabelsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionMetadatumLabelsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionmetadatumlabels_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionmetadatumlabels_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionMetadatumLabels}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionmetadatumlabels_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionMetadatumLabels.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionMetadatumLabels}
   */
  static new() {
    const ret = wasm.certificates_new();
    return TransactionMetadatumLabels.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {BigNum}
   */
  get(index) {
    const ret = wasm.transactionmetadatumlabels_get(this.ptr, index);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} elem
   */
  add(elem) {
    _assertClass(elem, BigNum);
    wasm.transactionindexes_add(this.ptr, elem.ptr);
  }
}

const TransactionOutputFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionoutput_free(ptr)
);
/** */
export class TransactionOutput {
  static __wrap(ptr) {
    const obj = Object.create(TransactionOutput.prototype);
    obj.ptr = ptr;
    TransactionOutputFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionOutputFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionoutput_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionoutput_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionOutput}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionoutput_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionOutput.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionoutput_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionoutput_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {TransactionOutput}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionoutput_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionOutput.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Address}
   */
  address() {
    const ret = wasm.transactionoutput_address(this.ptr);
    return Address.__wrap(ret);
  }
  /**
   * @returns {Value}
   */
  amount() {
    const ret = wasm.transactionoutput_amount(this.ptr);
    return Value.__wrap(ret);
  }
  /**
   * @returns {Datum | undefined}
   */
  datum() {
    const ret = wasm.transactionoutput_datum(this.ptr);
    return ret === 0 ? undefined : Datum.__wrap(ret);
  }
  /**
   * @returns {ScriptRef | undefined}
   */
  script_ref() {
    const ret = wasm.transactionoutput_script_ref(this.ptr);
    return ret === 0 ? undefined : ScriptRef.__wrap(ret);
  }
  /**
   * @param {Datum} datum
   */
  set_datum(datum) {
    _assertClass(datum, Datum);
    wasm.transactionoutput_set_datum(this.ptr, datum.ptr);
  }
  /**
   * @param {ScriptRef} script_ref
   */
  set_script_ref(script_ref) {
    _assertClass(script_ref, ScriptRef);
    wasm.transactionoutput_set_script_ref(this.ptr, script_ref.ptr);
  }
  /**
   * @param {Address} address
   * @param {Value} amount
   * @returns {TransactionOutput}
   */
  static new(address, amount) {
    _assertClass(address, Address);
    _assertClass(amount, Value);
    const ret = wasm.transactionoutput_new(address.ptr, amount.ptr);
    return TransactionOutput.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  format() {
    const ret = wasm.transactionoutput_format(this.ptr);
    return ret;
  }
  /**
   * legacy support: serialize output as array array
   *
   * does not support inline datum and script_ref!
   * @returns {Uint8Array}
   */
  to_legacy_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionoutput_to_legacy_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const TransactionOutputAmountBuilderFinalization = new FinalizationRegistry(
  (ptr) => wasm.__wbg_transactionoutputamountbuilder_free(ptr)
);
/** */
export class TransactionOutputAmountBuilder {
  static __wrap(ptr) {
    const obj = Object.create(TransactionOutputAmountBuilder.prototype);
    obj.ptr = ptr;
    TransactionOutputAmountBuilderFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionOutputAmountBuilderFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionoutputamountbuilder_free(ptr);
  }
  /**
   * @param {Value} amount
   * @returns {TransactionOutputAmountBuilder}
   */
  with_value(amount) {
    _assertClass(amount, Value);
    const ret = wasm.transactionoutputamountbuilder_with_value(
      this.ptr,
      amount.ptr,
    );
    return TransactionOutputAmountBuilder.__wrap(ret);
  }
  /**
   * @param {BigNum} coin
   * @returns {TransactionOutputAmountBuilder}
   */
  with_coin(coin) {
    _assertClass(coin, BigNum);
    const ret = wasm.transactionoutputamountbuilder_with_coin(
      this.ptr,
      coin.ptr,
    );
    return TransactionOutputAmountBuilder.__wrap(ret);
  }
  /**
   * @param {BigNum} coin
   * @param {MultiAsset} multiasset
   * @returns {TransactionOutputAmountBuilder}
   */
  with_coin_and_asset(coin, multiasset) {
    _assertClass(coin, BigNum);
    _assertClass(multiasset, MultiAsset);
    const ret = wasm.transactionoutputamountbuilder_with_coin_and_asset(
      this.ptr,
      coin.ptr,
      multiasset.ptr,
    );
    return TransactionOutputAmountBuilder.__wrap(ret);
  }
  /**
   * @param {MultiAsset} multiasset
   * @param {BigNum} coins_per_utxo_word
   * @returns {TransactionOutputAmountBuilder}
   */
  with_asset_and_min_required_coin(multiasset, coins_per_utxo_word) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(multiasset, MultiAsset);
      _assertClass(coins_per_utxo_word, BigNum);
      wasm.transactionoutputamountbuilder_with_asset_and_min_required_coin(
        retptr,
        this.ptr,
        multiasset.ptr,
        coins_per_utxo_word.ptr,
      );
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionOutputAmountBuilder.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionOutput}
   */
  build() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionoutputamountbuilder_build(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionOutput.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const TransactionOutputBuilderFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionoutputbuilder_free(ptr)
);
/**
 * We introduce a builder-pattern format for creating transaction outputs
 * This is because:
 * 1. Some fields (i.e. data hash) are optional, and we can't easily expose Option<> in WASM
 * 2. Some fields like amounts have many ways it could be set (some depending on other field values being known)
 * 3. Easier to adapt as the output format gets more complicated in future Cardano releases
 */
export class TransactionOutputBuilder {
  static __wrap(ptr) {
    const obj = Object.create(TransactionOutputBuilder.prototype);
    obj.ptr = ptr;
    TransactionOutputBuilderFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionOutputBuilderFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionoutputbuilder_free(ptr);
  }
  /**
   * @returns {TransactionOutputBuilder}
   */
  static new() {
    const ret = wasm.transactionoutputbuilder_new();
    return TransactionOutputBuilder.__wrap(ret);
  }
  /**
   * @param {Address} address
   * @returns {TransactionOutputBuilder}
   */
  with_address(address) {
    _assertClass(address, Address);
    const ret = wasm.transactionoutputbuilder_with_address(
      this.ptr,
      address.ptr,
    );
    return TransactionOutputBuilder.__wrap(ret);
  }
  /**
   * @param {Datum} data_hash
   * @returns {TransactionOutputBuilder}
   */
  with_datum(data_hash) {
    _assertClass(data_hash, Datum);
    const ret = wasm.transactionoutputbuilder_with_datum(
      this.ptr,
      data_hash.ptr,
    );
    return TransactionOutputBuilder.__wrap(ret);
  }
  /**
   * @returns {TransactionOutputAmountBuilder}
   */
  next() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionoutputbuilder_next(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionOutputAmountBuilder.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const TransactionOutputsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionoutputs_free(ptr)
);
/** */
export class TransactionOutputs {
  static __wrap(ptr) {
    const obj = Object.create(TransactionOutputs.prototype);
    obj.ptr = ptr;
    TransactionOutputsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionOutputsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionoutputs_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionoutputs_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionOutputs}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionoutputs_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionOutputs.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionoutputs_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionoutputs_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {TransactionOutputs}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionoutputs_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionOutputs.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionOutputs}
   */
  static new() {
    const ret = wasm.certificates_new();
    return TransactionOutputs.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {TransactionOutput}
   */
  get(index) {
    const ret = wasm.transactionoutputs_get(this.ptr, index);
    return TransactionOutput.__wrap(ret);
  }
  /**
   * @param {TransactionOutput} elem
   */
  add(elem) {
    _assertClass(elem, TransactionOutput);
    wasm.transactionoutputs_add(this.ptr, elem.ptr);
  }
}

const TransactionUnspentOutputFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionunspentoutput_free(ptr)
);
/** */
export class TransactionUnspentOutput {
  static __wrap(ptr) {
    const obj = Object.create(TransactionUnspentOutput.prototype);
    obj.ptr = ptr;
    TransactionUnspentOutputFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionUnspentOutputFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionunspentoutput_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionunspentoutput_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionUnspentOutput}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionunspentoutput_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionUnspentOutput.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {TransactionInput} input
   * @param {TransactionOutput} output
   * @returns {TransactionUnspentOutput}
   */
  static new(input, output) {
    _assertClass(input, TransactionInput);
    _assertClass(output, TransactionOutput);
    const ret = wasm.transactionunspentoutput_new(input.ptr, output.ptr);
    return TransactionUnspentOutput.__wrap(ret);
  }
  /**
   * @returns {TransactionInput}
   */
  input() {
    const ret = wasm.transactionunspentoutput_input(this.ptr);
    return TransactionInput.__wrap(ret);
  }
  /**
   * @returns {TransactionOutput}
   */
  output() {
    const ret = wasm.transactionunspentoutput_output(this.ptr);
    return TransactionOutput.__wrap(ret);
  }
  /**
   * @returns {Uint8Array}
   */
  to_legacy_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionunspentoutput_to_legacy_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const TransactionUnspentOutputsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionunspentoutputs_free(ptr)
);
/** */
export class TransactionUnspentOutputs {
  static __wrap(ptr) {
    const obj = Object.create(TransactionUnspentOutputs.prototype);
    obj.ptr = ptr;
    TransactionUnspentOutputsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionUnspentOutputsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionunspentoutputs_free(ptr);
  }
  /**
   * @returns {TransactionUnspentOutputs}
   */
  static new() {
    const ret = wasm.certificates_new();
    return TransactionUnspentOutputs.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {TransactionUnspentOutput}
   */
  get(index) {
    const ret = wasm.transactionunspentoutputs_get(this.ptr, index);
    return TransactionUnspentOutput.__wrap(ret);
  }
  /**
   * @param {TransactionUnspentOutput} elem
   */
  add(elem) {
    _assertClass(elem, TransactionUnspentOutput);
    wasm.transactionunspentoutputs_add(this.ptr, elem.ptr);
  }
}

const TransactionWitnessSetFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionwitnessset_free(ptr)
);
/** */
export class TransactionWitnessSet {
  static __wrap(ptr) {
    const obj = Object.create(TransactionWitnessSet.prototype);
    obj.ptr = ptr;
    TransactionWitnessSetFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionWitnessSetFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionwitnessset_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionwitnessset_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionWitnessSet}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionwitnessset_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionWitnessSet.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionwitnessset_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionwitnessset_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {TransactionWitnessSet}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionwitnessset_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionWitnessSet.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Vkeywitnesses} vkeys
   */
  set_vkeys(vkeys) {
    _assertClass(vkeys, Vkeywitnesses);
    wasm.transactionwitnessset_set_vkeys(this.ptr, vkeys.ptr);
  }
  /**
   * @returns {Vkeywitnesses | undefined}
   */
  vkeys() {
    const ret = wasm.transactionwitnessset_vkeys(this.ptr);
    return ret === 0 ? undefined : Vkeywitnesses.__wrap(ret);
  }
  /**
   * @param {NativeScripts} native_scripts
   */
  set_native_scripts(native_scripts) {
    _assertClass(native_scripts, NativeScripts);
    wasm.transactionwitnessset_set_native_scripts(this.ptr, native_scripts.ptr);
  }
  /**
   * @returns {NativeScripts | undefined}
   */
  native_scripts() {
    const ret = wasm.transactionwitnessset_native_scripts(this.ptr);
    return ret === 0 ? undefined : NativeScripts.__wrap(ret);
  }
  /**
   * @param {BootstrapWitnesses} bootstraps
   */
  set_bootstraps(bootstraps) {
    _assertClass(bootstraps, BootstrapWitnesses);
    wasm.transactionwitnessset_set_bootstraps(this.ptr, bootstraps.ptr);
  }
  /**
   * @returns {BootstrapWitnesses | undefined}
   */
  bootstraps() {
    const ret = wasm.transactionwitnessset_bootstraps(this.ptr);
    return ret === 0 ? undefined : BootstrapWitnesses.__wrap(ret);
  }
  /**
   * @param {PlutusScripts} plutus_scripts
   */
  set_plutus_scripts(plutus_scripts) {
    _assertClass(plutus_scripts, PlutusScripts);
    wasm.transactionwitnessset_set_plutus_scripts(this.ptr, plutus_scripts.ptr);
  }
  /**
   * @returns {PlutusScripts | undefined}
   */
  plutus_scripts() {
    const ret = wasm.transactionwitnessset_plutus_scripts(this.ptr);
    return ret === 0 ? undefined : PlutusScripts.__wrap(ret);
  }
  /**
   * @param {PlutusList} plutus_data
   */
  set_plutus_data(plutus_data) {
    _assertClass(plutus_data, PlutusList);
    wasm.transactionwitnessset_set_plutus_data(this.ptr, plutus_data.ptr);
  }
  /**
   * @returns {PlutusList | undefined}
   */
  plutus_data() {
    const ret = wasm.transactionwitnessset_plutus_data(this.ptr);
    return ret === 0 ? undefined : PlutusList.__wrap(ret);
  }
  /**
   * @param {Redeemers} redeemers
   */
  set_redeemers(redeemers) {
    _assertClass(redeemers, Redeemers);
    wasm.transactionwitnessset_set_redeemers(this.ptr, redeemers.ptr);
  }
  /**
   * @param {PlutusScripts} plutus_scripts
   */
  set_plutus_v2_scripts(plutus_scripts) {
    _assertClass(plutus_scripts, PlutusScripts);
    wasm.transactionwitnessset_set_plutus_v2_scripts(
      this.ptr,
      plutus_scripts.ptr,
    );
  }
  /**
   * @param {PlutusScripts} plutus_scripts
   */
  set_plutus_v3_scripts(plutus_scripts) {
    _assertClass(plutus_scripts, PlutusScripts);
    wasm.transactionwitnessset_set_plutus_v3_scripts(
      this.ptr,
      plutus_scripts.ptr,
    );
  }
  /**
   * @returns {Redeemers | undefined}
   */
  redeemers() {
    const ret = wasm.transactionwitnessset_redeemers(this.ptr);
    return ret === 0 ? undefined : Redeemers.__wrap(ret);
  }
  /**
   * @returns {PlutusScripts | undefined}
   */
  plutus_v2_scripts() {
    const ret = wasm.transactionwitnessset_plutus_v2_scripts(this.ptr);
    return ret === 0 ? undefined : PlutusScripts.__wrap(ret);
  }
  /**
   * @returns {PlutusScripts | undefined}
   */
  plutus_v3_scripts() {
    const ret = wasm.transactionwitnessset_plutus_v3_scripts(this.ptr);
    return ret === 0 ? undefined : PlutusScripts.__wrap(ret);
  }
  /**
   * @returns {TransactionWitnessSet}
   */
  static new() {
    const ret = wasm.transactionwitnessset_new();
    return TransactionWitnessSet.__wrap(ret);
  }
}

const TransactionWitnessSetBuilderFinalization = new FinalizationRegistry(
  (ptr) => wasm.__wbg_transactionwitnesssetbuilder_free(ptr)
);
/**
 * Builder de-duplicates witnesses as they are added
 */
export class TransactionWitnessSetBuilder {
  static __wrap(ptr) {
    const obj = Object.create(TransactionWitnessSetBuilder.prototype);
    obj.ptr = ptr;
    TransactionWitnessSetBuilderFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionWitnessSetBuilderFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionwitnesssetbuilder_free(ptr);
  }
  /**
   * @param {Vkeywitness} vkey
   */
  add_vkey(vkey) {
    _assertClass(vkey, Vkeywitness);
    wasm.transactionwitnesssetbuilder_add_vkey(this.ptr, vkey.ptr);
  }
  /**
   * @param {BootstrapWitness} bootstrap
   */
  add_bootstrap(bootstrap) {
    _assertClass(bootstrap, BootstrapWitness);
    wasm.transactionwitnesssetbuilder_add_bootstrap(this.ptr, bootstrap.ptr);
  }
  /**
   * @param {NativeScript} native_script
   */
  add_native_script(native_script) {
    _assertClass(native_script, NativeScript);
    wasm.transactionwitnesssetbuilder_add_native_script(
      this.ptr,
      native_script.ptr,
    );
  }
  /**
   * @param {PlutusScript} plutus_script
   */
  add_plutus_script(plutus_script) {
    _assertClass(plutus_script, PlutusScript);
    wasm.transactionwitnesssetbuilder_add_plutus_script(
      this.ptr,
      plutus_script.ptr,
    );
  }
  /**
   * @param {PlutusScript} plutus_script
   */
  add_plutus_v2_script(plutus_script) {
    _assertClass(plutus_script, PlutusScript);
    wasm.transactionwitnesssetbuilder_add_plutus_v2_script(
      this.ptr,
      plutus_script.ptr,
    );
  }
  /**
   * @param {PlutusData} plutus_datum
   */
  add_plutus_datum(plutus_datum) {
    _assertClass(plutus_datum, PlutusData);
    wasm.transactionwitnesssetbuilder_add_plutus_datum(
      this.ptr,
      plutus_datum.ptr,
    );
  }
  /**
   * @param {Redeemer} redeemer
   */
  add_redeemer(redeemer) {
    _assertClass(redeemer, Redeemer);
    wasm.transactionwitnesssetbuilder_add_redeemer(this.ptr, redeemer.ptr);
  }
  /**
   * @param {RequiredWitnessSet} required_wits
   */
  add_required_wits(required_wits) {
    _assertClass(required_wits, RequiredWitnessSet);
    wasm.transactionwitnesssetbuilder_add_required_wits(
      this.ptr,
      required_wits.ptr,
    );
  }
  /**
   * @returns {TransactionWitnessSetBuilder}
   */
  static new() {
    const ret = wasm.transactionwitnesssetbuilder_new();
    return TransactionWitnessSetBuilder.__wrap(ret);
  }
  /**
   * @param {TransactionWitnessSet} wit_set
   */
  add_existing(wit_set) {
    _assertClass(wit_set, TransactionWitnessSet);
    wasm.transactionwitnesssetbuilder_add_existing(this.ptr, wit_set.ptr);
  }
  /**
   * @returns {TransactionWitnessSet}
   */
  build() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionwitnesssetbuilder_build(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionWitnessSet.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const TransactionWitnessSetsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_transactionwitnesssets_free(ptr)
);
/** */
export class TransactionWitnessSets {
  static __wrap(ptr) {
    const obj = Object.create(TransactionWitnessSets.prototype);
    obj.ptr = ptr;
    TransactionWitnessSetsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TransactionWitnessSetsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_transactionwitnesssets_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionwitnesssets_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TransactionWitnessSets}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionwitnesssets_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionWitnessSets.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionwitnesssets_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.transactionwitnesssets_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {TransactionWitnessSets}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.transactionwitnesssets_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TransactionWitnessSets.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TransactionWitnessSets}
   */
  static new() {
    const ret = wasm.assetnames_new();
    return TransactionWitnessSets.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {TransactionWitnessSet}
   */
  get(index) {
    const ret = wasm.transactionwitnesssets_get(this.ptr, index);
    return TransactionWitnessSet.__wrap(ret);
  }
  /**
   * @param {TransactionWitnessSet} elem
   */
  add(elem) {
    _assertClass(elem, TransactionWitnessSet);
    wasm.transactionwitnesssets_add(this.ptr, elem.ptr);
  }
}

const TreasuryWithdrawalsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_treasurywithdrawals_free(ptr)
);
/** */
export class TreasuryWithdrawals {
  static __wrap(ptr) {
    const obj = Object.create(TreasuryWithdrawals.prototype);
    obj.ptr = ptr;
    TreasuryWithdrawalsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TreasuryWithdrawalsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_treasurywithdrawals_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.treasurywithdrawals_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TreasuryWithdrawals}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.treasurywithdrawals_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TreasuryWithdrawals.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.treasurywithdrawals_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.treasurywithdrawals_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {TreasuryWithdrawals}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.treasurywithdrawals_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TreasuryWithdrawals.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TreasuryWithdrawals}
   */
  static new() {
    const ret = wasm.assets_new();
    return TreasuryWithdrawals.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {Ed25519KeyHash} key
   * @param {BigNum} value
   * @returns {BigNum | undefined}
   */
  insert(key, value) {
    _assertClass(key, Ed25519KeyHash);
    _assertClass(value, BigNum);
    const ret = wasm.treasurywithdrawals_insert(this.ptr, key.ptr, value.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {Ed25519KeyHash} key
   * @returns {BigNum | undefined}
   */
  get(key) {
    _assertClass(key, Ed25519KeyHash);
    const ret = wasm.treasurywithdrawals_get(this.ptr, key.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @returns {Ed25519KeyHashes}
   */
  keys() {
    const ret = wasm.treasurywithdrawals_keys(this.ptr);
    return Ed25519KeyHashes.__wrap(ret);
  }
}

const TreasuryWithdrawalsActionFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_treasurywithdrawalsaction_free(ptr)
);
/** */
export class TreasuryWithdrawalsAction {
  static __wrap(ptr) {
    const obj = Object.create(TreasuryWithdrawalsAction.prototype);
    obj.ptr = ptr;
    TreasuryWithdrawalsActionFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    TreasuryWithdrawalsActionFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_treasurywithdrawalsaction_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.treasurywithdrawalsaction_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {TreasuryWithdrawalsAction}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.treasurywithdrawalsaction_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TreasuryWithdrawalsAction.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.treasurywithdrawalsaction_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.treasurywithdrawalsaction_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {TreasuryWithdrawalsAction}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.treasurywithdrawalsaction_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return TreasuryWithdrawalsAction.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {TreasuryWithdrawals}
   */
  withdrawals() {
    const ret = wasm.treasurywithdrawalsaction_withdrawals(this.ptr);
    return TreasuryWithdrawals.__wrap(ret);
  }
  /**
   * @param {TreasuryWithdrawals} withdrawals
   * @returns {TreasuryWithdrawalsAction}
   */
  static new(withdrawals) {
    _assertClass(withdrawals, TreasuryWithdrawals);
    const ret = wasm.treasurywithdrawalsaction_new(withdrawals.ptr);
    return TreasuryWithdrawalsAction.__wrap(ret);
  }
}

const UnitIntervalFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_unitinterval_free(ptr)
);
/** */
export class UnitInterval {
  static __wrap(ptr) {
    const obj = Object.create(UnitInterval.prototype);
    obj.ptr = ptr;
    UnitIntervalFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    UnitIntervalFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_unitinterval_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.unitinterval_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {UnitInterval}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.unitinterval_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return UnitInterval.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.unitinterval_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.unitinterval_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {UnitInterval}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.unitinterval_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return UnitInterval.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {BigNum}
   */
  numerator() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  denominator() {
    const ret = wasm.exunits_steps(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} numerator
   * @param {BigNum} denominator
   * @returns {UnitInterval}
   */
  static new(numerator, denominator) {
    _assertClass(numerator, BigNum);
    _assertClass(denominator, BigNum);
    const ret = wasm.exunits_new(numerator.ptr, denominator.ptr);
    return UnitInterval.__wrap(ret);
  }
  /**
   * @param {number} float_number
   * @returns {UnitInterval}
   */
  static from_float(float_number) {
    const ret = wasm.unitinterval_from_float(float_number);
    return UnitInterval.__wrap(ret);
  }
}

const UnregCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_unregcert_free(ptr)
);
/** */
export class UnregCert {
  static __wrap(ptr) {
    const obj = Object.create(UnregCert.prototype);
    obj.ptr = ptr;
    UnregCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    UnregCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_unregcert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.unregcert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {UnregCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.unregcert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return UnregCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regcert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regcert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {UnregCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.unregcert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return UnregCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredential}
   */
  stake_credential() {
    const ret = wasm.regcert_stake_credential(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  coin() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {StakeCredential} stake_credential
   * @param {BigNum} coin
   * @returns {UnregCert}
   */
  static new(stake_credential, coin) {
    _assertClass(stake_credential, StakeCredential);
    _assertClass(coin, BigNum);
    const ret = wasm.regcert_new(stake_credential.ptr, coin.ptr);
    return UnregCert.__wrap(ret);
  }
}

const UnregCommitteeHotKeyCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_unregcommitteehotkeycert_free(ptr)
);
/** */
export class UnregCommitteeHotKeyCert {
  static __wrap(ptr) {
    const obj = Object.create(UnregCommitteeHotKeyCert.prototype);
    obj.ptr = ptr;
    UnregCommitteeHotKeyCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    UnregCommitteeHotKeyCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_unregcommitteehotkeycert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.unregcommitteehotkeycert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {UnregCommitteeHotKeyCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.unregcommitteehotkeycert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return UnregCommitteeHotKeyCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.unregcommitteehotkeycert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.unregcommitteehotkeycert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {UnregCommitteeHotKeyCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.unregcommitteehotkeycert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return UnregCommitteeHotKeyCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Ed25519KeyHash}
   */
  committee_cold_keyhash() {
    const ret = wasm.genesiskeydelegation_genesishash(this.ptr);
    return Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @param {Ed25519KeyHash} committee_cold_keyhash
   * @returns {UnregCommitteeHotKeyCert}
   */
  static new(committee_cold_keyhash) {
    _assertClass(committee_cold_keyhash, Ed25519KeyHash);
    const ret = wasm.scriptpubkey_new(committee_cold_keyhash.ptr);
    return UnregCommitteeHotKeyCert.__wrap(ret);
  }
}

const UnregDrepCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_unregdrepcert_free(ptr)
);
/** */
export class UnregDrepCert {
  static __wrap(ptr) {
    const obj = Object.create(UnregDrepCert.prototype);
    obj.ptr = ptr;
    UnregDrepCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    UnregDrepCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_unregdrepcert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.unregdrepcert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {UnregDrepCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.unregdrepcert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return UnregDrepCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regdrepcert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.regdrepcert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {UnregDrepCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.unregdrepcert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return UnregDrepCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredential}
   */
  voting_credential() {
    const ret = wasm.regcert_stake_credential(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  coin() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {StakeCredential} voting_credential
   * @param {BigNum} coin
   * @returns {UnregDrepCert}
   */
  static new(voting_credential, coin) {
    _assertClass(voting_credential, StakeCredential);
    _assertClass(coin, BigNum);
    const ret = wasm.regcert_new(voting_credential.ptr, coin.ptr);
    return UnregDrepCert.__wrap(ret);
  }
}

const UpdateFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_update_free(ptr)
);
/** */
export class Update {
  static __wrap(ptr) {
    const obj = Object.create(Update.prototype);
    obj.ptr = ptr;
    UpdateFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    UpdateFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_update_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.update_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Update}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.update_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Update.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.update_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.update_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Update}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.update_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Update.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {ProposedProtocolParameterUpdates}
   */
  proposed_protocol_parameter_updates() {
    const ret = wasm.update_proposed_protocol_parameter_updates(this.ptr);
    return ProposedProtocolParameterUpdates.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  epoch() {
    const ret = wasm.update_epoch(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {ProposedProtocolParameterUpdates} proposed_protocol_parameter_updates
   * @param {number} epoch
   * @returns {Update}
   */
  static new(proposed_protocol_parameter_updates, epoch) {
    _assertClass(
      proposed_protocol_parameter_updates,
      ProposedProtocolParameterUpdates,
    );
    const ret = wasm.update_new(proposed_protocol_parameter_updates.ptr, epoch);
    return Update.__wrap(ret);
  }
}

const UrlFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_url_free(ptr)
);
/** */
export class Url {
  static __wrap(ptr) {
    const obj = Object.create(Url.prototype);
    obj.ptr = ptr;
    UrlFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    UrlFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_url_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.url_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Url}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.url_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Url.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} url
   * @returns {Url}
   */
  static new(url) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        url,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.url_new(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Url.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  url() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.blockfrost_url(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
}

const VRFCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_vrfcert_free(ptr)
);
/** */
export class VRFCert {
  static __wrap(ptr) {
    const obj = Object.create(VRFCert.prototype);
    obj.ptr = ptr;
    VRFCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VRFCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_vrfcert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vrfcert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {VRFCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.vrfcert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VRFCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vrfcert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vrfcert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {VRFCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.vrfcert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VRFCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  output() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assetname_name(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  proof() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.bootstrapwitness_attributes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} output
   * @param {Uint8Array} proof
   * @returns {VRFCert}
   */
  static new(output, proof) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(output, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      const ptr1 = passArray8ToWasm0(proof, wasm.__wbindgen_malloc);
      const len1 = WASM_VECTOR_LEN;
      wasm.vrfcert_new(retptr, ptr0, len0, ptr1, len1);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VRFCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const VRFKeyHashFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_vrfkeyhash_free(ptr)
);
/** */
export class VRFKeyHash {
  static __wrap(ptr) {
    const obj = Object.create(VRFKeyHash.prototype);
    obj.ptr = ptr;
    VRFKeyHashFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VRFKeyHashFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_vrfkeyhash_free(ptr);
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {VRFKeyHash}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.vrfkeyhash_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VRFKeyHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} prefix
   * @returns {string}
   */
  to_bech32(prefix) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        prefix,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.auxiliarydatahash_to_bech32(retptr, this.ptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr1 = r0;
      var len1 = r1;
      if (r3) {
        ptr1 = 0;
        len1 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr1, len1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr1, len1);
    }
  }
  /**
   * @param {string} bech_str
   * @returns {VRFKeyHash}
   */
  static from_bech32(bech_str) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        bech_str,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.vrfkeyhash_from_bech32(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VRFKeyHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_hex() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.auxiliarydatahash_to_hex(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
   * @param {string} hex
   * @returns {VRFKeyHash}
   */
  static from_hex(hex) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        hex,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.vrfkeyhash_from_hex(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VRFKeyHash.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const VRFVKeyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_vrfvkey_free(ptr)
);
/** */
export class VRFVKey {
  static __wrap(ptr) {
    const obj = Object.create(VRFVKey.prototype);
    obj.ptr = ptr;
    VRFVKeyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VRFVKeyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_vrfvkey_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vrfvkey_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {VRFVKey}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.plutusscript_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VRFVKey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {VRFKeyHash}
   */
  hash() {
    const ret = wasm.vrfvkey_hash(this.ptr);
    return VRFKeyHash.__wrap(ret);
  }
  /**
   * @returns {Uint8Array}
   */
  to_raw_key() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.assetname_name(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
}

const ValueFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_value_free(ptr)
);
/** */
export class Value {
  static __wrap(ptr) {
    const obj = Object.create(Value.prototype);
    obj.ptr = ptr;
    ValueFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    ValueFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_value_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.value_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Value}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.value_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Value.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.value_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.value_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Value}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.value_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Value.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {BigNum} coin
   * @returns {Value}
   */
  static new(coin) {
    _assertClass(coin, BigNum);
    const ret = wasm.value_new(coin.ptr);
    return Value.__wrap(ret);
  }
  /**
   * @param {MultiAsset} multiasset
   * @returns {Value}
   */
  static new_from_assets(multiasset) {
    _assertClass(multiasset, MultiAsset);
    const ret = wasm.value_new_from_assets(multiasset.ptr);
    return Value.__wrap(ret);
  }
  /**
   * @returns {Value}
   */
  static zero() {
    const ret = wasm.value_zero();
    return Value.__wrap(ret);
  }
  /**
   * @returns {boolean}
   */
  is_zero() {
    const ret = wasm.value_is_zero(this.ptr);
    return ret !== 0;
  }
  /**
   * @returns {BigNum}
   */
  coin() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {BigNum} coin
   */
  set_coin(coin) {
    _assertClass(coin, BigNum);
    wasm.value_set_coin(this.ptr, coin.ptr);
  }
  /**
   * @returns {MultiAsset | undefined}
   */
  multiasset() {
    const ret = wasm.value_multiasset(this.ptr);
    return ret === 0 ? undefined : MultiAsset.__wrap(ret);
  }
  /**
   * @param {MultiAsset} multiasset
   */
  set_multiasset(multiasset) {
    _assertClass(multiasset, MultiAsset);
    wasm.value_set_multiasset(this.ptr, multiasset.ptr);
  }
  /**
   * @param {Value} rhs
   * @returns {Value}
   */
  checked_add(rhs) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(rhs, Value);
      wasm.value_checked_add(retptr, this.ptr, rhs.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Value.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Value} rhs_value
   * @returns {Value}
   */
  checked_sub(rhs_value) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      _assertClass(rhs_value, Value);
      wasm.value_checked_sub(retptr, this.ptr, rhs_value.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Value.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Value} rhs_value
   * @returns {Value}
   */
  clamped_sub(rhs_value) {
    _assertClass(rhs_value, Value);
    const ret = wasm.value_clamped_sub(this.ptr, rhs_value.ptr);
    return Value.__wrap(ret);
  }
  /**
   * note: values are only partially comparable
   * @param {Value} rhs_value
   * @returns {number | undefined}
   */
  compare(rhs_value) {
    _assertClass(rhs_value, Value);
    const ret = wasm.value_compare(this.ptr, rhs_value.ptr);
    return ret === 0xFFFFFF ? undefined : ret;
  }
}

const VkeyFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_vkey_free(ptr)
);
/** */
export class Vkey {
  static __wrap(ptr) {
    const obj = Object.create(Vkey.prototype);
    obj.ptr = ptr;
    VkeyFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VkeyFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_vkey_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vkey_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Vkey}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.vkey_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Vkey.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {PublicKey} pk
   * @returns {Vkey}
   */
  static new(pk) {
    _assertClass(pk, PublicKey);
    const ret = wasm.vkey_new(pk.ptr);
    return Vkey.__wrap(ret);
  }
  /**
   * @returns {PublicKey}
   */
  public_key() {
    const ret = wasm.vkey_public_key(this.ptr);
    return PublicKey.__wrap(ret);
  }
}

const VkeysFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_vkeys_free(ptr)
);
/** */
export class Vkeys {
  static __wrap(ptr) {
    const obj = Object.create(Vkeys.prototype);
    obj.ptr = ptr;
    VkeysFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VkeysFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_vkeys_free(ptr);
  }
  /**
   * @returns {Vkeys}
   */
  static new() {
    const ret = wasm.ed25519keyhashes_new();
    return Vkeys.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {Vkey}
   */
  get(index) {
    const ret = wasm.vkeys_get(this.ptr, index);
    return Vkey.__wrap(ret);
  }
  /**
   * @param {Vkey} elem
   */
  add(elem) {
    _assertClass(elem, Vkey);
    wasm.vkeys_add(this.ptr, elem.ptr);
  }
}

const VkeywitnessFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_vkeywitness_free(ptr)
);
/** */
export class Vkeywitness {
  static __wrap(ptr) {
    const obj = Object.create(Vkeywitness.prototype);
    obj.ptr = ptr;
    VkeywitnessFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VkeywitnessFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_vkeywitness_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vkeywitness_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Vkeywitness}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.vkeywitness_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Vkeywitness.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vkeywitness_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vkeywitness_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Vkeywitness}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.vkeywitness_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Vkeywitness.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Vkey} vkey
   * @param {Ed25519Signature} signature
   * @returns {Vkeywitness}
   */
  static new(vkey, signature) {
    _assertClass(vkey, Vkey);
    _assertClass(signature, Ed25519Signature);
    const ret = wasm.vkeywitness_new(vkey.ptr, signature.ptr);
    return Vkeywitness.__wrap(ret);
  }
  /**
   * @returns {Vkey}
   */
  vkey() {
    const ret = wasm.vkey_new(this.ptr);
    return Vkey.__wrap(ret);
  }
  /**
   * @returns {Ed25519Signature}
   */
  signature() {
    const ret = wasm.vkeywitness_signature(this.ptr);
    return Ed25519Signature.__wrap(ret);
  }
}

const VkeywitnessesFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_vkeywitnesses_free(ptr)
);
/** */
export class Vkeywitnesses {
  static __wrap(ptr) {
    const obj = Object.create(Vkeywitnesses.prototype);
    obj.ptr = ptr;
    VkeywitnessesFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VkeywitnessesFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_vkeywitnesses_free(ptr);
  }
  /**
   * @returns {Vkeywitnesses}
   */
  static new() {
    const ret = wasm.ed25519keyhashes_new();
    return Vkeywitnesses.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {Vkeywitness}
   */
  get(index) {
    const ret = wasm.vkeywitnesses_get(this.ptr, index);
    return Vkeywitness.__wrap(ret);
  }
  /**
   * @param {Vkeywitness} elem
   */
  add(elem) {
    _assertClass(elem, Vkeywitness);
    wasm.vkeywitnesses_add(this.ptr, elem.ptr);
  }
}

const VoteFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_vote_free(ptr)
);
/** */
export class Vote {
  static __wrap(ptr) {
    const obj = Object.create(Vote.prototype);
    obj.ptr = ptr;
    VoteFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VoteFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_vote_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vote_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Vote}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.vote_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Vote.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vote_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vote_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Vote}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.vote_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Vote.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Vote}
   */
  static new_no() {
    const ret = wasm.language_new_plutus_v1();
    return Vote.__wrap(ret);
  }
  /**
   * @returns {Vote}
   */
  static new_yes() {
    const ret = wasm.language_new_plutus_v2();
    return Vote.__wrap(ret);
  }
  /**
   * @returns {Vote}
   */
  static new_abstain() {
    const ret = wasm.language_new_plutus_v3();
    return Vote.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.vote_kind(this.ptr);
    return ret >>> 0;
  }
}

const VoteDelegCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_votedelegcert_free(ptr)
);
/** */
export class VoteDelegCert {
  static __wrap(ptr) {
    const obj = Object.create(VoteDelegCert.prototype);
    obj.ptr = ptr;
    VoteDelegCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VoteDelegCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_votedelegcert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.votedelegcert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {VoteDelegCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.votedelegcert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VoteDelegCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.votedelegcert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.votedelegcert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {VoteDelegCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.votedelegcert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VoteDelegCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredential}
   */
  stake_credential() {
    const ret = wasm.stakedelegation_stake_credential(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {Drep}
   */
  drep() {
    const ret = wasm.votedelegcert_drep(this.ptr);
    return Drep.__wrap(ret);
  }
  /**
   * @param {StakeCredential} stake_credential
   * @param {Drep} drep
   * @returns {VoteDelegCert}
   */
  static new(stake_credential, drep) {
    _assertClass(stake_credential, StakeCredential);
    _assertClass(drep, Drep);
    const ret = wasm.votedelegcert_new(stake_credential.ptr, drep.ptr);
    return VoteDelegCert.__wrap(ret);
  }
}

const VoteRegDelegCertFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_voteregdelegcert_free(ptr)
);
/** */
export class VoteRegDelegCert {
  static __wrap(ptr) {
    const obj = Object.create(VoteRegDelegCert.prototype);
    obj.ptr = ptr;
    VoteRegDelegCertFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VoteRegDelegCertFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_voteregdelegcert_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.voteregdelegcert_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {VoteRegDelegCert}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.voteregdelegcert_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VoteRegDelegCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.voteregdelegcert_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.voteregdelegcert_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {VoteRegDelegCert}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.voteregdelegcert_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VoteRegDelegCert.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {StakeCredential}
   */
  stake_credential() {
    const ret = wasm.regcert_stake_credential(this.ptr);
    return StakeCredential.__wrap(ret);
  }
  /**
   * @returns {Drep}
   */
  drep() {
    const ret = wasm.voteregdelegcert_drep(this.ptr);
    return Drep.__wrap(ret);
  }
  /**
   * @returns {BigNum}
   */
  coin() {
    const ret = wasm.constrplutusdata_alternative(this.ptr);
    return BigNum.__wrap(ret);
  }
  /**
   * @param {StakeCredential} stake_credential
   * @param {Drep} drep
   * @param {BigNum} coin
   * @returns {VoteRegDelegCert}
   */
  static new(stake_credential, drep, coin) {
    _assertClass(stake_credential, StakeCredential);
    _assertClass(drep, Drep);
    _assertClass(coin, BigNum);
    const ret = wasm.voteregdelegcert_new(
      stake_credential.ptr,
      drep.ptr,
      coin.ptr,
    );
    return VoteRegDelegCert.__wrap(ret);
  }
}

const VoterFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_voter_free(ptr)
);
/** */
export class Voter {
  static __wrap(ptr) {
    const obj = Object.create(Voter.prototype);
    obj.ptr = ptr;
    VoterFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VoterFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_voter_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.voter_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Voter}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.voter_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Voter.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.voter_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.voter_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Voter}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.voter_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Voter.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Ed25519KeyHash} keyhash
   * @returns {Voter}
   */
  static new_committee_hot_keyhash(keyhash) {
    _assertClass(keyhash, Ed25519KeyHash);
    const ret = wasm.drep_new_keyhash(keyhash.ptr);
    return Voter.__wrap(ret);
  }
  /**
   * @param {ScriptHash} scripthash
   * @returns {Voter}
   */
  static new_committee_hot_scripthash(scripthash) {
    _assertClass(scripthash, ScriptHash);
    const ret = wasm.drep_new_scripthash(scripthash.ptr);
    return Voter.__wrap(ret);
  }
  /**
   * @param {Ed25519KeyHash} keyhash
   * @returns {Voter}
   */
  static new_drep_keyhash(keyhash) {
    _assertClass(keyhash, Ed25519KeyHash);
    const ret = wasm.voter_new_drep_keyhash(keyhash.ptr);
    return Voter.__wrap(ret);
  }
  /**
   * @param {ScriptHash} scripthash
   * @returns {Voter}
   */
  static new_drep_scripthash(scripthash) {
    _assertClass(scripthash, ScriptHash);
    const ret = wasm.voter_new_drep_scripthash(scripthash.ptr);
    return Voter.__wrap(ret);
  }
  /**
   * @param {Ed25519KeyHash} keyhash
   * @returns {Voter}
   */
  static new_staking_pool_keyhash(keyhash) {
    _assertClass(keyhash, Ed25519KeyHash);
    const ret = wasm.voter_new_staking_pool_keyhash(keyhash.ptr);
    return Voter.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  kind() {
    const ret = wasm.voter_kind(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {Ed25519KeyHash | undefined}
   */
  as_committee_hot_keyhash() {
    const ret = wasm.voter_as_committee_hot_keyhash(this.ptr);
    return ret === 0 ? undefined : Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @returns {ScriptHash | undefined}
   */
  as_committee_hot_scripthash() {
    const ret = wasm.voter_as_committee_hot_scripthash(this.ptr);
    return ret === 0 ? undefined : ScriptHash.__wrap(ret);
  }
  /**
   * @returns {Ed25519KeyHash | undefined}
   */
  as_drep_keyhash() {
    const ret = wasm.voter_as_drep_keyhash(this.ptr);
    return ret === 0 ? undefined : Ed25519KeyHash.__wrap(ret);
  }
  /**
   * @returns {ScriptHash | undefined}
   */
  as_drep_scripthash() {
    const ret = wasm.voter_as_drep_scripthash(this.ptr);
    return ret === 0 ? undefined : ScriptHash.__wrap(ret);
  }
  /**
   * @returns {Ed25519KeyHash | undefined}
   */
  as_staking_pool_keyhash() {
    const ret = wasm.voter_as_staking_pool_keyhash(this.ptr);
    return ret === 0 ? undefined : Ed25519KeyHash.__wrap(ret);
  }
}

const VotingProcedureFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_votingprocedure_free(ptr)
);
/** */
export class VotingProcedure {
  static __wrap(ptr) {
    const obj = Object.create(VotingProcedure.prototype);
    obj.ptr = ptr;
    VotingProcedureFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VotingProcedureFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_votingprocedure_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.votingprocedure_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {VotingProcedure}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.votingprocedure_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VotingProcedure.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.votingprocedure_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.votingprocedure_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {VotingProcedure}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.votingprocedure_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VotingProcedure.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {GovernanceActionId}
   */
  governance_action_id() {
    const ret = wasm.transactionunspentoutput_input(this.ptr);
    return GovernanceActionId.__wrap(ret);
  }
  /**
   * @returns {Voter}
   */
  voter() {
    const ret = wasm.votingprocedure_voter(this.ptr);
    return Voter.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  vote() {
    const ret = wasm.votingprocedure_vote(this.ptr);
    return ret >>> 0;
  }
  /**
   * @returns {Anchor}
   */
  anchor() {
    const ret = wasm.votingprocedure_anchor(this.ptr);
    return Anchor.__wrap(ret);
  }
  /**
   * @param {GovernanceActionId} governance_action_id
   * @param {Voter} voter
   * @param {Vote} vote
   * @param {Anchor} anchor
   * @returns {VotingProcedure}
   */
  static new(governance_action_id, voter, vote, anchor) {
    _assertClass(governance_action_id, GovernanceActionId);
    _assertClass(voter, Voter);
    _assertClass(vote, Vote);
    _assertClass(anchor, Anchor);
    const ret = wasm.votingprocedure_new(
      governance_action_id.ptr,
      voter.ptr,
      vote.ptr,
      anchor.ptr,
    );
    return VotingProcedure.__wrap(ret);
  }
}

const VotingProceduresFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_votingprocedures_free(ptr)
);
/** */
export class VotingProcedures {
  static __wrap(ptr) {
    const obj = Object.create(VotingProcedures.prototype);
    obj.ptr = ptr;
    VotingProceduresFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    VotingProceduresFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_votingprocedures_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.votingprocedures_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {VotingProcedures}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.votingprocedures_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return VotingProcedures.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {VotingProcedures}
   */
  static new() {
    const ret = wasm.certificates_new();
    return VotingProcedures.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {number} index
   * @returns {VotingProcedure}
   */
  get(index) {
    const ret = wasm.votingprocedures_get(this.ptr, index);
    return VotingProcedure.__wrap(ret);
  }
  /**
   * @param {VotingProcedure} elem
   */
  add(elem) {
    _assertClass(elem, VotingProcedure);
    wasm.votingprocedures_add(this.ptr, elem.ptr);
  }
}

const WithdrawalsFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_withdrawals_free(ptr)
);
/** */
export class Withdrawals {
  static __wrap(ptr) {
    const obj = Object.create(Withdrawals.prototype);
    obj.ptr = ptr;
    WithdrawalsFinalization.register(obj, obj.ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    WithdrawalsFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_withdrawals_free(ptr);
  }
  /**
   * @returns {Uint8Array}
   */
  to_bytes() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.withdrawals_to_bytes(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU8FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 1);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {Uint8Array} bytes
   * @returns {Withdrawals}
   */
  static from_bytes(bytes) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
      const len0 = WASM_VECTOR_LEN;
      wasm.withdrawals_from_bytes(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Withdrawals.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  to_json() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.withdrawals_to_json(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      var r3 = getInt32Memory0()[retptr / 4 + 3];
      var ptr0 = r0;
      var len0 = r1;
      if (r3) {
        ptr0 = 0;
        len0 = 0;
        throw takeObject(r2);
      }
      return getStringFromWasm0(ptr0, len0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(ptr0, len0);
    }
  }
  /**
   * @returns {any}
   */
  to_js_value() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.withdrawals_to_js_value(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return takeObject(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @param {string} json
   * @returns {Withdrawals}
   */
  static from_json(json) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      const ptr0 = passStringToWasm0(
        json,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      wasm.withdrawals_from_json(retptr, ptr0, len0);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var r2 = getInt32Memory0()[retptr / 4 + 2];
      if (r2) {
        throw takeObject(r1);
      }
      return Withdrawals.__wrap(r0);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {Withdrawals}
   */
  static new() {
    const ret = wasm.assets_new();
    return Withdrawals.__wrap(ret);
  }
  /**
   * @returns {number}
   */
  len() {
    const ret = wasm.assetnames_len(this.ptr);
    return ret >>> 0;
  }
  /**
   * @param {RewardAddress} key
   * @param {BigNum} value
   * @returns {BigNum | undefined}
   */
  insert(key, value) {
    _assertClass(key, RewardAddress);
    _assertClass(value, BigNum);
    const ret = wasm.withdrawals_insert(this.ptr, key.ptr, value.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @param {RewardAddress} key
   * @returns {BigNum | undefined}
   */
  get(key) {
    _assertClass(key, RewardAddress);
    const ret = wasm.withdrawals_get(this.ptr, key.ptr);
    return ret === 0 ? undefined : BigNum.__wrap(ret);
  }
  /**
   * @returns {RewardAddresses}
   */
  keys() {
    const ret = wasm.withdrawals_keys(this.ptr);
    return RewardAddresses.__wrap(ret);
  }
}

const imports = {
  __wbindgen_placeholder__: {
    __wbindgen_string_new: function (arg0, arg1) {
      const ret = getStringFromWasm0(arg0, arg1);
      return addHeapObject(ret);
    },
    __wbindgen_object_drop_ref: function (arg0) {
      takeObject(arg0);
    },
    __wbindgen_json_parse: function (arg0, arg1) {
      const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbindgen_json_serialize: function (arg0, arg1) {
      const obj = getObject(arg1);
      const ret = JSON.stringify(obj === undefined ? null : obj);
      const ptr0 = passStringToWasm0(
        ret,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len0;
      getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    },
    __wbg_transaction_new: function (arg0) {
      const ret = Transaction.__wrap(arg0);
      return addHeapObject(ret);
    },
    __wbg_fetch_16f5dddfc5a913a4: function (arg0, arg1) {
      const ret = getObject(arg0).fetch(getObject(arg1));
      return addHeapObject(ret);
    },
    __wbindgen_string_get: function (arg0, arg1) {
      const obj = getObject(arg1);
      const ret = typeof (obj) === "string" ? obj : undefined;
      var ptr0 = isLikeNone(ret)
        ? 0
        : passStringToWasm0(
          ret,
          wasm.__wbindgen_malloc,
          wasm.__wbindgen_realloc,
        );
      var len0 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len0;
      getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    },
    __wbindgen_object_clone_ref: function (arg0) {
      const ret = getObject(arg0);
      return addHeapObject(ret);
    },
    __wbg_set_a5d34c36a1a4ebd1: function () {
      return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).set(
          getStringFromWasm0(arg1, arg2),
          getStringFromWasm0(arg3, arg4),
        );
      }, arguments);
    },
    __wbg_headers_ab5251d2727ac41e: function (arg0) {
      const ret = getObject(arg0).headers;
      return addHeapObject(ret);
    },
    __wbg_newwithstrandinit_c45f0dc6da26fd03: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(
          getStringFromWasm0(arg0, arg1),
          getObject(arg2),
        );
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_instanceof_Response_fb3a4df648c1859b: function (arg0) {
      let result;
      try {
        result = getObject(arg0) instanceof Response;
      } catch {
        result = false;
      }
      const ret = result;
      return ret;
    },
    __wbg_json_b9414eb18cb751d0: function () {
      return handleError(function (arg0) {
        const ret = getObject(arg0).json();
        return addHeapObject(ret);
      }, arguments);
    },
    __wbindgen_cb_drop: function (arg0) {
      const obj = takeObject(arg0).original;
      if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
      }
      const ret = false;
      return ret;
    },
    __wbg_randomFillSync_2f6909f8132a175d: function () {
      return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
      }, arguments);
    },
    __wbg_getRandomValues_11a236fbf9914290: function () {
      return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
      }, arguments);
    },
    __wbg_process_5615a087a47ba544: function (arg0) {
      const ret = getObject(arg0).process;
      return addHeapObject(ret);
    },
    __wbindgen_is_object: function (arg0) {
      const val = getObject(arg0);
      const ret = typeof (val) === "object" && val !== null;
      return ret;
    },
    __wbg_versions_8404a8b21b9337ae: function (arg0) {
      const ret = getObject(arg0).versions;
      return addHeapObject(ret);
    },
    __wbg_node_8b504e170b6380b9: function (arg0) {
      const ret = getObject(arg0).node;
      return addHeapObject(ret);
    },
    __wbindgen_is_string: function (arg0) {
      const ret = typeof (getObject(arg0)) === "string";
      return ret;
    },
    __wbg_require_0430b68b38d1a77e: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_crypto_ca5197b41df5e2bd: function (arg0) {
      const ret = getObject(arg0).crypto;
      return addHeapObject(ret);
    },
    __wbg_msCrypto_1088c21440b2d7e4: function (arg0) {
      const ret = getObject(arg0).msCrypto;
      return addHeapObject(ret);
    },
    __wbg_static_accessor_NODE_MODULE_06b864c18e8ae506: function () {
      const ret = module;
      return addHeapObject(ret);
    },
    __wbg_self_e7c1f827057f6584: function () {
      return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_window_a09ec664e14b1b81: function () {
      return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_globalThis_87cbb8506fecf3a9: function () {
      return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_global_c85a9259e621f3db: function () {
      return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
      }, arguments);
    },
    __wbindgen_is_undefined: function (arg0) {
      const ret = getObject(arg0) === undefined;
      return ret;
    },
    __wbg_newnoargs_2b8b6bd7753c76ba: function (arg0, arg1) {
      const ret = new Function(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbg_call_95d1ea488d03e4e8: function () {
      return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_new_f9876326328f45ed: function () {
      const ret = new Object();
      return addHeapObject(ret);
    },
    __wbg_call_9495de66fdbe016b: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
      }, arguments);
    },
    __wbg_set_6aa458a4ebdb65cb: function () {
      return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(
          getObject(arg0),
          getObject(arg1),
          getObject(arg2),
        );
        return ret;
      }, arguments);
    },
    __wbg_buffer_cf65c07de34b9a08: function (arg0) {
      const ret = getObject(arg0).buffer;
      return addHeapObject(ret);
    },
    __wbg_new_9d3a9ce4282a18a8: function (arg0, arg1) {
      try {
        var state0 = { a: arg0, b: arg1 };
        var cb0 = (arg0, arg1) => {
          const a = state0.a;
          state0.a = 0;
          try {
            return __wbg_adapter_1680(a, state0.b, arg0, arg1);
          } finally {
            state0.a = a;
          }
        };
        const ret = new Promise(cb0);
        return addHeapObject(ret);
      } finally {
        state0.a = state0.b = 0;
      }
    },
    __wbg_resolve_fd40f858d9db1a04: function (arg0) {
      const ret = Promise.resolve(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_then_ec5db6d509eb475f: function (arg0, arg1) {
      const ret = getObject(arg0).then(getObject(arg1));
      return addHeapObject(ret);
    },
    __wbg_then_f753623316e2873a: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
      return addHeapObject(ret);
    },
    __wbg_new_537b7341ce90bb31: function (arg0) {
      const ret = new Uint8Array(getObject(arg0));
      return addHeapObject(ret);
    },
    __wbg_set_17499e8aa4003ebd: function (arg0, arg1, arg2) {
      getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    },
    __wbg_length_27a2afe8ab42b09f: function (arg0) {
      const ret = getObject(arg0).length;
      return ret;
    },
    __wbg_newwithlength_b56c882b57805732: function (arg0) {
      const ret = new Uint8Array(arg0 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_subarray_7526649b91a252a6: function (arg0, arg1, arg2) {
      const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
      return addHeapObject(ret);
    },
    __wbg_new_d87f272aec784ec0: function (arg0, arg1) {
      const ret = new Function(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbg_call_eae29933372a39be: function (arg0, arg1) {
      const ret = getObject(arg0).call(getObject(arg1));
      return addHeapObject(ret);
    },
    __wbindgen_jsval_eq: function (arg0, arg1) {
      const ret = getObject(arg0) === getObject(arg1);
      return ret;
    },
    __wbg_self_e0b3266d2d9eba1a: function (arg0) {
      const ret = getObject(arg0).self;
      return addHeapObject(ret);
    },
    __wbg_crypto_e95a6e54c5c2e37f: function (arg0) {
      const ret = getObject(arg0).crypto;
      return addHeapObject(ret);
    },
    __wbg_getRandomValues_dc67302a7bd1aec5: function (arg0) {
      const ret = getObject(arg0).getRandomValues;
      return addHeapObject(ret);
    },
    __wbg_require_0993fe224bf8e202: function (arg0, arg1) {
      const ret = require(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbg_randomFillSync_dd2297de5917c74e: function (arg0, arg1, arg2) {
      getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    },
    __wbg_getRandomValues_02639197c8166a96: function (arg0, arg1, arg2) {
      getObject(arg0).getRandomValues(getArrayU8FromWasm0(arg1, arg2));
    },
    __wbindgen_debug_string: function (arg0, arg1) {
      const ret = debugString(getObject(arg1));
      const ptr0 = passStringToWasm0(
        ret,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len0;
      getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    },
    __wbindgen_throw: function (arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbindgen_memory: function () {
      const ret = wasm.memory;
      return addHeapObject(ret);
    },
    __wbindgen_closure_wrapper7018: function (arg0, arg1, arg2) {
      const ret = makeMutClosure(arg0, arg1, 216, __wbg_adapter_30);
      return addHeapObject(ret);
    },
  },
};

/**
 * Decompression callback
 *
 * @callback DecompressCallback
 * @param {Uint8Array} compressed
 * @return {Uint8Array} decompressed
 */

/**
 * Options for instantiating a Wasm instance.
 * @typedef {Object} InstantiateOptions
 * @property {URL=} url - Optional url to the Wasm file to instantiate.
 * @property {DecompressCallback=} decompress - Callback to decompress the
 * raw Wasm file bytes before instantiating.
 */

/** Instantiates an instance of the Wasm module returning its functions.
 * @remarks It is safe to call this multiple times and once successfully
 * loaded it will always return a reference to the same object.
 * @param {InstantiateOptions=} opts
 */
export async function instantiate(opts) {
  return (await instantiateWithInstance(opts)).exports;
}

let instanceWithExports;
let lastLoadPromise;

/** Instantiates an instance of the Wasm module along with its exports.
 * @remarks It is safe to call this multiple times and once successfully
 * loaded it will always return a reference to the same object.
 * @param {InstantiateOptions=} opts
 * @returns {Promise<{
 *   instance: WebAssembly.Instance;
 *   exports: { encrypt_with_password: typeof encrypt_with_password; decrypt_with_password: typeof decrypt_with_password; min_fee: typeof min_fee; encode_arbitrary_bytes_as_metadatum: typeof encode_arbitrary_bytes_as_metadatum; decode_arbitrary_bytes_from_metadatum: typeof decode_arbitrary_bytes_from_metadatum; encode_json_str_to_metadatum: typeof encode_json_str_to_metadatum; decode_metadatum_to_json_str: typeof decode_metadatum_to_json_str; encode_json_str_to_plutus_datum: typeof encode_json_str_to_plutus_datum; decode_plutus_datum_to_json_str: typeof decode_plutus_datum_to_json_str; make_daedalus_bootstrap_witness: typeof make_daedalus_bootstrap_witness; make_icarus_bootstrap_witness: typeof make_icarus_bootstrap_witness; make_vkey_witness: typeof make_vkey_witness; hash_auxiliary_data: typeof hash_auxiliary_data; hash_transaction: typeof hash_transaction; hash_plutus_data: typeof hash_plutus_data; hash_blake2b256: typeof hash_blake2b256; hash_blake2b224: typeof hash_blake2b224; hash_script_data: typeof hash_script_data; get_implicit_input: typeof get_implicit_input; get_deposit: typeof get_deposit; min_ada_required: typeof min_ada_required; encode_json_str_to_native_script: typeof encode_json_str_to_native_script; apply_params_to_plutus_script: typeof apply_params_to_plutus_script; Address : typeof Address ; Anchor : typeof Anchor ; AssetName : typeof AssetName ; AssetNames : typeof AssetNames ; Assets : typeof Assets ; AuxiliaryData : typeof AuxiliaryData ; AuxiliaryDataHash : typeof AuxiliaryDataHash ; AuxiliaryDataSet : typeof AuxiliaryDataSet ; BaseAddress : typeof BaseAddress ; BigInt : typeof BigInt ; BigNum : typeof BigNum ; Bip32PrivateKey : typeof Bip32PrivateKey ; Bip32PublicKey : typeof Bip32PublicKey ; Block : typeof Block ; BlockHash : typeof BlockHash ; Blockfrost : typeof Blockfrost ; BootstrapWitness : typeof BootstrapWitness ; BootstrapWitnesses : typeof BootstrapWitnesses ; ByronAddress : typeof ByronAddress ; Certificate : typeof Certificate ; Certificates : typeof Certificates ; ConstrPlutusData : typeof ConstrPlutusData ; CostModel : typeof CostModel ; Costmdls : typeof Costmdls ; DNSRecordAorAAAA : typeof DNSRecordAorAAAA ; DNSRecordSRV : typeof DNSRecordSRV ; Data : typeof Data ; DataHash : typeof DataHash ; Datum : typeof Datum ; Drep : typeof Drep ; DrepVotingThresholds : typeof DrepVotingThresholds ; Ed25519KeyHash : typeof Ed25519KeyHash ; Ed25519KeyHashes : typeof Ed25519KeyHashes ; Ed25519Signature : typeof Ed25519Signature ; EnterpriseAddress : typeof EnterpriseAddress ; ExUnitPrices : typeof ExUnitPrices ; ExUnits : typeof ExUnits ; GeneralTransactionMetadata : typeof GeneralTransactionMetadata ; GenesisDelegateHash : typeof GenesisDelegateHash ; GenesisHash : typeof GenesisHash ; GenesisHashes : typeof GenesisHashes ; GenesisKeyDelegation : typeof GenesisKeyDelegation ; GovernanceAction : typeof GovernanceAction ; GovernanceActionId : typeof GovernanceActionId ; HardForkInitiationAction : typeof HardForkInitiationAction ; Header : typeof Header ; HeaderBody : typeof HeaderBody ; Int : typeof Int ; Ipv4 : typeof Ipv4 ; Ipv6 : typeof Ipv6 ; KESSignature : typeof KESSignature ; KESVKey : typeof KESVKey ; Language : typeof Language ; Languages : typeof Languages ; LegacyDaedalusPrivateKey : typeof LegacyDaedalusPrivateKey ; LinearFee : typeof LinearFee ; MIRToStakeCredentials : typeof MIRToStakeCredentials ; MetadataList : typeof MetadataList ; MetadataMap : typeof MetadataMap ; Mint : typeof Mint ; MintAssets : typeof MintAssets ; MoveInstantaneousReward : typeof MoveInstantaneousReward ; MoveInstantaneousRewardsCert : typeof MoveInstantaneousRewardsCert ; MultiAsset : typeof MultiAsset ; MultiHostName : typeof MultiHostName ; NativeScript : typeof NativeScript ; NativeScripts : typeof NativeScripts ; NetworkId : typeof NetworkId ; NetworkInfo : typeof NetworkInfo ; NewCommittee : typeof NewCommittee ; NewConstitution : typeof NewConstitution ; Nonce : typeof Nonce ; OperationalCert : typeof OperationalCert ; ParameterChangeAction : typeof ParameterChangeAction ; PlutusData : typeof PlutusData ; PlutusList : typeof PlutusList ; PlutusMap : typeof PlutusMap ; PlutusScript : typeof PlutusScript ; PlutusScripts : typeof PlutusScripts ; PlutusWitness : typeof PlutusWitness ; Pointer : typeof Pointer ; PointerAddress : typeof PointerAddress ; PoolMetadata : typeof PoolMetadata ; PoolMetadataHash : typeof PoolMetadataHash ; PoolParams : typeof PoolParams ; PoolRegistration : typeof PoolRegistration ; PoolRetirement : typeof PoolRetirement ; PoolVotingThresholds : typeof PoolVotingThresholds ; PrivateKey : typeof PrivateKey ; ProposalProcedure : typeof ProposalProcedure ; ProposalProcedures : typeof ProposalProcedures ; ProposedProtocolParameterUpdates : typeof ProposedProtocolParameterUpdates ; ProtocolParamUpdate : typeof ProtocolParamUpdate ; ProtocolVersion : typeof ProtocolVersion ; PublicKey : typeof PublicKey ; PublicKeys : typeof PublicKeys ; Redeemer : typeof Redeemer ; RedeemerTag : typeof RedeemerTag ; RedeemerWitnessKey : typeof RedeemerWitnessKey ; Redeemers : typeof Redeemers ; RegCert : typeof RegCert ; RegCommitteeHotKeyCert : typeof RegCommitteeHotKeyCert ; RegDrepCert : typeof RegDrepCert ; Relay : typeof Relay ; Relays : typeof Relays ; RequiredWitnessSet : typeof RequiredWitnessSet ; RewardAddress : typeof RewardAddress ; RewardAddresses : typeof RewardAddresses ; Script : typeof Script ; ScriptAll : typeof ScriptAll ; ScriptAny : typeof ScriptAny ; ScriptDataHash : typeof ScriptDataHash ; ScriptHash : typeof ScriptHash ; ScriptHashes : typeof ScriptHashes ; ScriptNOfK : typeof ScriptNOfK ; ScriptPubkey : typeof ScriptPubkey ; ScriptRef : typeof ScriptRef ; ScriptWitness : typeof ScriptWitness ; SingleHostAddr : typeof SingleHostAddr ; SingleHostName : typeof SingleHostName ; StakeCredential : typeof StakeCredential ; StakeCredentials : typeof StakeCredentials ; StakeDelegation : typeof StakeDelegation ; StakeDeregistration : typeof StakeDeregistration ; StakeRegDelegCert : typeof StakeRegDelegCert ; StakeRegistration : typeof StakeRegistration ; StakeVoteDelegCert : typeof StakeVoteDelegCert ; StakeVoteRegDelegCert : typeof StakeVoteRegDelegCert ; Strings : typeof Strings ; TimelockExpiry : typeof TimelockExpiry ; TimelockStart : typeof TimelockStart ; Transaction : typeof Transaction ; TransactionBodies : typeof TransactionBodies ; TransactionBody : typeof TransactionBody ; TransactionBuilder : typeof TransactionBuilder ; TransactionBuilderConfig : typeof TransactionBuilderConfig ; TransactionBuilderConfigBuilder : typeof TransactionBuilderConfigBuilder ; TransactionHash : typeof TransactionHash ; TransactionIndexes : typeof TransactionIndexes ; TransactionInput : typeof TransactionInput ; TransactionInputs : typeof TransactionInputs ; TransactionMetadatum : typeof TransactionMetadatum ; TransactionMetadatumLabels : typeof TransactionMetadatumLabels ; TransactionOutput : typeof TransactionOutput ; TransactionOutputAmountBuilder : typeof TransactionOutputAmountBuilder ; TransactionOutputBuilder : typeof TransactionOutputBuilder ; TransactionOutputs : typeof TransactionOutputs ; TransactionUnspentOutput : typeof TransactionUnspentOutput ; TransactionUnspentOutputs : typeof TransactionUnspentOutputs ; TransactionWitnessSet : typeof TransactionWitnessSet ; TransactionWitnessSetBuilder : typeof TransactionWitnessSetBuilder ; TransactionWitnessSets : typeof TransactionWitnessSets ; TreasuryWithdrawals : typeof TreasuryWithdrawals ; TreasuryWithdrawalsAction : typeof TreasuryWithdrawalsAction ; UnitInterval : typeof UnitInterval ; UnregCert : typeof UnregCert ; UnregCommitteeHotKeyCert : typeof UnregCommitteeHotKeyCert ; UnregDrepCert : typeof UnregDrepCert ; Update : typeof Update ; Url : typeof Url ; VRFCert : typeof VRFCert ; VRFKeyHash : typeof VRFKeyHash ; VRFVKey : typeof VRFVKey ; Value : typeof Value ; Vkey : typeof Vkey ; Vkeys : typeof Vkeys ; Vkeywitness : typeof Vkeywitness ; Vkeywitnesses : typeof Vkeywitnesses ; Vote : typeof Vote ; VoteDelegCert : typeof VoteDelegCert ; VoteRegDelegCert : typeof VoteRegDelegCert ; Voter : typeof Voter ; VotingProcedure : typeof VotingProcedure ; VotingProcedures : typeof VotingProcedures ; Withdrawals : typeof Withdrawals  }
 * }>}
 */
export function instantiateWithInstance(opts) {
  if (instanceWithExports != null) {
    return Promise.resolve(instanceWithExports);
  }
  if (lastLoadPromise == null) {
    lastLoadPromise = (async () => {
      try {
        const instance = (await instantiateModule(opts ?? {})).instance;
        wasm = instance.exports;
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        instanceWithExports = {
          instance,
          exports: getWasmInstanceExports(),
        };
        return instanceWithExports;
      } finally {
        lastLoadPromise = null;
      }
    })();
  }
  return lastLoadPromise;
}

function getWasmInstanceExports() {
  return {
    encrypt_with_password,
    decrypt_with_password,
    min_fee,
    encode_arbitrary_bytes_as_metadatum,
    decode_arbitrary_bytes_from_metadatum,
    encode_json_str_to_metadatum,
    decode_metadatum_to_json_str,
    encode_json_str_to_plutus_datum,
    decode_plutus_datum_to_json_str,
    make_daedalus_bootstrap_witness,
    make_icarus_bootstrap_witness,
    make_vkey_witness,
    hash_auxiliary_data,
    hash_transaction,
    hash_plutus_data,
    hash_blake2b256,
    hash_blake2b224,
    hash_script_data,
    get_implicit_input,
    get_deposit,
    min_ada_required,
    encode_json_str_to_native_script,
    apply_params_to_plutus_script,
    Address,
    Anchor,
    AssetName,
    AssetNames,
    Assets,
    AuxiliaryData,
    AuxiliaryDataHash,
    AuxiliaryDataSet,
    BaseAddress,
    BigInt,
    BigNum,
    Bip32PrivateKey,
    Bip32PublicKey,
    Block,
    BlockHash,
    Blockfrost,
    BootstrapWitness,
    BootstrapWitnesses,
    ByronAddress,
    Certificate,
    Certificates,
    ConstrPlutusData,
    CostModel,
    Costmdls,
    DNSRecordAorAAAA,
    DNSRecordSRV,
    Data,
    DataHash,
    Datum,
    Drep,
    DrepVotingThresholds,
    Ed25519KeyHash,
    Ed25519KeyHashes,
    Ed25519Signature,
    EnterpriseAddress,
    ExUnitPrices,
    ExUnits,
    GeneralTransactionMetadata,
    GenesisDelegateHash,
    GenesisHash,
    GenesisHashes,
    GenesisKeyDelegation,
    GovernanceAction,
    GovernanceActionId,
    HardForkInitiationAction,
    Header,
    HeaderBody,
    Int,
    Ipv4,
    Ipv6,
    KESSignature,
    KESVKey,
    Language,
    Languages,
    LegacyDaedalusPrivateKey,
    LinearFee,
    MIRToStakeCredentials,
    MetadataList,
    MetadataMap,
    Mint,
    MintAssets,
    MoveInstantaneousReward,
    MoveInstantaneousRewardsCert,
    MultiAsset,
    MultiHostName,
    NativeScript,
    NativeScripts,
    NetworkId,
    NetworkInfo,
    NewCommittee,
    NewConstitution,
    Nonce,
    OperationalCert,
    ParameterChangeAction,
    PlutusData,
    PlutusList,
    PlutusMap,
    PlutusScript,
    PlutusScripts,
    PlutusWitness,
    Pointer,
    PointerAddress,
    PoolMetadata,
    PoolMetadataHash,
    PoolParams,
    PoolRegistration,
    PoolRetirement,
    PoolVotingThresholds,
    PrivateKey,
    ProposalProcedure,
    ProposalProcedures,
    ProposedProtocolParameterUpdates,
    ProtocolParamUpdate,
    ProtocolVersion,
    PublicKey,
    PublicKeys,
    Redeemer,
    RedeemerTag,
    RedeemerWitnessKey,
    Redeemers,
    RegCert,
    RegCommitteeHotKeyCert,
    RegDrepCert,
    Relay,
    Relays,
    RequiredWitnessSet,
    RewardAddress,
    RewardAddresses,
    Script,
    ScriptAll,
    ScriptAny,
    ScriptDataHash,
    ScriptHash,
    ScriptHashes,
    ScriptNOfK,
    ScriptPubkey,
    ScriptRef,
    ScriptWitness,
    SingleHostAddr,
    SingleHostName,
    StakeCredential,
    StakeCredentials,
    StakeDelegation,
    StakeDeregistration,
    StakeRegDelegCert,
    StakeRegistration,
    StakeVoteDelegCert,
    StakeVoteRegDelegCert,
    Strings,
    TimelockExpiry,
    TimelockStart,
    Transaction,
    TransactionBodies,
    TransactionBody,
    TransactionBuilder,
    TransactionBuilderConfig,
    TransactionBuilderConfigBuilder,
    TransactionHash,
    TransactionIndexes,
    TransactionInput,
    TransactionInputs,
    TransactionMetadatum,
    TransactionMetadatumLabels,
    TransactionOutput,
    TransactionOutputAmountBuilder,
    TransactionOutputBuilder,
    TransactionOutputs,
    TransactionUnspentOutput,
    TransactionUnspentOutputs,
    TransactionWitnessSet,
    TransactionWitnessSetBuilder,
    TransactionWitnessSets,
    TreasuryWithdrawals,
    TreasuryWithdrawalsAction,
    UnitInterval,
    UnregCert,
    UnregCommitteeHotKeyCert,
    UnregDrepCert,
    Update,
    Url,
    VRFCert,
    VRFKeyHash,
    VRFVKey,
    Value,
    Vkey,
    Vkeys,
    Vkeywitness,
    Vkeywitnesses,
    Vote,
    VoteDelegCert,
    VoteRegDelegCert,
    Voter,
    VotingProcedure,
    VotingProcedures,
    Withdrawals,
  };
}

/** Gets if the Wasm module has been instantiated. */
export function isInstantiated() {
  return instanceWithExports != null;
}

/**
 * @param {InstantiateOptions} opts
 */
async function instantiateModule(opts) {
  const wasmResponse = await fetch(opts.url);
  return WebAssembly.instantiate(
    await wasmResponse.arrayBuffer(),
    imports,
  );
}
