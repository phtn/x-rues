import { NextResponse } from "next/server";
import { encrypt } from "lib/ffi";

export const POST = async (request: Request) => {
  try {
    const { publicKey, data } = await request.json();
    if (!publicKey || !data) {
      return NextResponse.json(
        { error: "publicKey and data are required." },
        { status: 400 },
      );
    }
    const encryptedData = await encrypt(publicKey, data);
    return NextResponse.json({ encryptedData });
  } catch (e) {
    console.error("[API /rues/encrypt] Error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to encrypt data." },
      { status: 500 },
    );
  }
};
