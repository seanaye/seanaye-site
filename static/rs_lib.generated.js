// @generated file from wasmbuild -- do not edit
// deno-lint-ignore-file
// deno-fmt-ignore-file
// source-hash: 5d50924886ad18f053e10a38d36417ba906cccae
let wasm;
let cachedInt32Memory0;

const cachedTextDecoder = typeof TextDecoder !== "undefined"
  ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true })
  : {
    decode: () => {
      throw Error("TextDecoder not available");
    },
  };

if (typeof TextDecoder !== "undefined") cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
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
/**
 * @returns {any}
 */
export function get_memory() {
  const ret = wasm.get_memory();
  return takeObject(ret);
}

function notDefined(what) {
  return () => {
    throw new Error(`${what} is not defined`);
  };
}
/** */
export const Cell = Object.freeze({
  Dead: 0,
  "0": "Dead",
  Alive: 1,
  "1": "Alive",
});

const DxUniverseFinalization = new FinalizationRegistry((ptr) =>
  wasm.__wbg_dxuniverse_free(ptr >>> 0)
);
/** */
export class DxUniverse {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(DxUniverse.prototype);
    obj.__wbg_ptr = ptr;
    DxUniverseFinalization.register(obj, obj.__wbg_ptr, obj);
    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    DxUniverseFinalization.unregister(this);
    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_dxuniverse_free(ptr);
  }
  /**
   * @param {number} width
   * @param {number} height
   * @returns {DxUniverse}
   */
  static new(width, height) {
    const ret = wasm.dxuniverse_new(width, height);
    return DxUniverse.__wrap(ret);
  }
  /** */
  tick() {
    wasm.dxuniverse_tick(this.__wbg_ptr);
  }
  /**
   * @returns {number}
   */
  cells() {
    const ret = wasm.dxuniverse_cells(this.__wbg_ptr);
    return ret;
  }
  /**
   * @param {number} row
   * @param {number} col
   * @param {number} state
   */
  set_cell(row, col, state) {
    wasm.dxuniverse_set_cell(this.__wbg_ptr, row, col, state);
  }
  /**
   * @param {number} width
   * @param {number} height
   */
  set_size(width, height) {
    wasm.dxuniverse_set_size(this.__wbg_ptr, width, height);
  }
}

const imports = {
  __wbindgen_placeholder__: {
    __wbg_random_5f61cd0d6777a993: typeof Math.random == "function"
      ? Math.random
      : notDefined("Math.random"),
    __wbindgen_throw: function (arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
    __wbindgen_memory: function () {
      const ret = wasm.memory;
      return addHeapObject(ret);
    },
  },
};

import { Loader } from "https://deno.land/x/wasmbuild@0.15.0/loader.ts";
import { cacheToLocalDir } from "https://deno.land/x/wasmbuild@0.15.0/cache.ts";

const loader = new Loader({
  imports,
  cache: cacheToLocalDir,
});
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

/** Instantiates an instance of the Wasm module along with its exports.
 * @remarks It is safe to call this multiple times and once successfully
 * loaded it will always return a reference to the same object.
 * @param {InstantiateOptions=} opts
 * @returns {Promise<{
 *   instance: WebAssembly.Instance;
 *   exports: { get_memory: typeof get_memory; DxUniverse : typeof DxUniverse  }
 * }>}
 */
export async function instantiateWithInstance(opts) {
  const { instance } = await loader.load(
    opts?.url ?? new URL("rs_lib_bg.wasm", import.meta.url),
    opts?.decompress,
  );
  wasm = wasm ?? instance.exports;
  cachedInt32Memory0 = cachedInt32Memory0 ?? new Int32Array(wasm.memory.buffer);
  cachedUint8Memory0 = cachedUint8Memory0 ?? new Uint8Array(wasm.memory.buffer);
  return {
    instance,
    exports: getWasmInstanceExports(),
  };
}

function getWasmInstanceExports() {
  return { get_memory, DxUniverse };
}

/** Gets if the Wasm module has been instantiated. */
export function isInstantiated() {
  return loader.instance != null;
}
