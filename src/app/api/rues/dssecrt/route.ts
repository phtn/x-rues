import { NextResponse } from "next/server";
import { deriveSharedSecret } from "lib/ffi";

export async function POST(request: Request) {
  try {
    const { privateKey, publicKey } = await request.json();
    if (!privateKey || !publicKey) {
      return NextResponse.json(
        { error: "privateKey and publicKey are required." },
        { status: 400 },
      );
    }
    const sharedSecret = await deriveSharedSecret(privateKey, publicKey);
    return NextResponse.json({ sharedSecret });
  } catch (e) {
    console.error("[API /rues/dssecrt] Error:", e);
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Failed to derive shared secret.",
      },
      { status: 500 },
    );
  }
}
