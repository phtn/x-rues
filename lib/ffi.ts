import { callFfi } from "lib/ffi-server";

export interface Keypair {
  privateKey: string;
  publicKey: string;
}

export async function generateKeypair(): Promise<Keypair> {
  return callFfi<Keypair>("genkeyp");
}

export async function encrypt(
  publicKey: string,
  data: string,
): Promise<string> {
  return callFfi<string>("encrypt", publicKey, data);
}

export async function decrypt(
  privateKey: string,
  encryptedData: string,
): Promise<string> {
  return callFfi<string>("decrypt", privateKey, encryptedData);
}

export interface SharedSecret {
  shared_secret: string;
}

export async function deriveSharedSecret(
  privateKey: string,
  publicKey: string,
): Promise<SharedSecret> {
  return callFfi<SharedSecret>("dssecrt", privateKey, publicKey);
}
