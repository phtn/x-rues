import { Device } from "@/app/types";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export async function getDeviceProfile(ref: HTMLCanvasElement | null) {
  const userAgent = navigator.userAgent;
  const cores = navigator.hardwareConcurrency;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const pixelRatio = window.devicePixelRatio || 1;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const canvasFingerprint = getFingerprint(ref);
  console.log(canvasFingerprint.length);

  const fp = await FingerprintJS.load();
  const result = await fp.get();

  const results = {
    userAgent,
    cores,
    screen: {
      width: screenWidth,
      height: screenHeight,
      pixelRatio,
    },
    hasTouch,
    timezone,
    fingerprintId: result.visitorId,
  } as Device;

  return results;
}

function getFingerprint(canvasRef: HTMLCanvasElement | null) {
  if (!canvasRef) return "not-supported";
  try {
    const ctx = canvasRef.getContext("2d") as CanvasRenderingContext2D;
    ctx.textBaseline = "top";
    ctx.font = "5px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069522";
    return canvasRef.toDataURL();
  } catch (err) {
    console.error(err);
    return "not-supported";
  }
}
