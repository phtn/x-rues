import { NextResponse } from "next/server";
import { decrypt } from "lib/ffi";

export async function POST(request: Request) {
  try {
    const { privateKey, encryptedData } = await request.json();
    if (!privateKey || !encryptedData) {
      return NextResponse.json(
        { error: "privateKey and encryptedData are required." },
        { status: 400 },
      );
    }
    const decryptedData = await decrypt(privateKey, encryptedData);
    return NextResponse.json({ decryptedData });
  } catch (error) {
    console.error("[API /rues/decrypt] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to decrypt data.",
      },
      { status: 500 },
    );
  }
}
