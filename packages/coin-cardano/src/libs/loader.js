// The MIT License (MIT)
//
// Copyright (c) 2019 Michael Xieyang Liu
// Copyright (c) 2021 Alessandro Konrad

import * as wasm from './cardano_multiplatform_lib/cardano_multiplatform_lib.generated';
import * as wasm2 from './cardano_message_signing/cardano_message_signing.generated';

/**
 * Loads the WASM modules
 */

class Loader {
  async load() {
    if (this._wasm && this._wasm2) return;
    try {
      await wasm.instantiate({ url: this._url });
      await wasm2.instantiate({ url: this._url2 });
    } catch (_e) {
      // Only happens when running with Jest (Node.js)
    }
    /**
     * @private
     */
    this._wasm = wasm;
    /**
     * @private
     */
    this._wasm2 = wasm2;
  }

  get Cardano() {
    return this._wasm;
  }

  get Message() {
    return this._wasm2;
  }

  setCardanoUrl(url) {
    this._url = url;
  }

  setMessageUrl(url) {
    this._url2 = url;
  }
}

export default new Loader();
