import { callFfi } from "lib/ffi-server";

// --- Exported FFI wrapper functions ---

export interface Keypair {
  privateKey: string;
  publicKey: string;
}

export async function generateKeypair(): Promise<Keypair> {
  return await callFfi<Keypair>("genkeyp");
}

export async function encrypt(
  publicKey: string,
  data: string,
): Promise<string> {
  return await callFfi<string>("encrypt", publicKey, data);
}

export async function decrypt(
  privateKey: string,
  encryptedData: string,
): Promise<string> {
  return await callFfi<string>("decrypt", privateKey, encryptedData);
}

export interface SharedSecret {
  shared_secret: string;
}

export async function deriveSharedSecret(
  privateKey: string,
  publicKey: string,
): Promise<SharedSecret> {
  return await callFfi<SharedSecret>("dssecrt", privateKey, publicKey);
}
