import { NextResponse } from "next/server";
import { generateKeypair } from "lib/ffi";

export const GET = async () => {
  try {
    const keypair = await generateKeypair();
    return NextResponse.json({ keypair });
  } catch (e) {
    console.error("[API /rues/genkeyp] Error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to generate keypair." },
      { status: 500 },
    );
  }
};
