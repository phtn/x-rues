import { dlopen, FFIType, suffix, CString } from "bun:ffi";
import path from "path";

const libName = `librues_lib.${suffix}`;
const libPath = path.join(process.cwd(), "lib", libName);

interface RuesSymbols {
  genkeyp: () => CString;
  encrypt: (publicKey: Buffer, data: Buffer) => CString;
  decrypt: (privateKey: Buffer, encryptedData: Buffer) => CString;
  dssecrt: (privateKey: Buffer, publicKey: Buffer) => CString;
}

let symbols: RuesSymbols | null = null;

function getFfiSymbols(): RuesSymbols {
  if (symbols) {
    return symbols;
  }

  if (typeof Bun === "undefined") {
    throw new Error("Bun runtime is required for FFI operations.");
  }

  const { symbols: loadedSymbols } = dlopen(libPath, {
    genkeyp: {
      args: [],
      returns: FFIType.cstring,
    },
    encrypt: {
      args: [FFIType.cstring, FFIType.cstring],
      returns: FFIType.cstring,
    },
    decrypt: {
      args: [FFIType.cstring, FFIType.cstring],
      returns: FFIType.cstring,
    },
    dssecrt: {
      args: [FFIType.cstring, FFIType.cstring],
      returns: FFIType.cstring,
    },
  });

  symbols = loadedSymbols as RuesSymbols;
  return symbols;
}

export function callFfi<T>(
  ffi_func_name: keyof RuesSymbols,
  ...args: string[]
): T {
  const ffi_symbols = getFfiSymbols();
  const ffi_func = ffi_symbols[ffi_func_name] as (...args: Buffer[]) => CString;

  const cstr_args = args.map((arg) => Buffer.from(`${arg}\0`));
  const response_cstr = ffi_func(...cstr_args);
  const response_str = response_cstr.toString();

  const response = JSON.parse(response_str);

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
}
