import { cancelRender, continueRender, delayRender } from "remotion";
import { PLUS_JAKARTA_SANS_BASE64 } from "./fonts/plusJakartaSansBase64";

export const FONT_FAMILY = "Plus Jakarta Sans";

const FONT_WEIGHT_RANGE = "200 800";

// Both @remotion/fonts' loadFont() and a manual fetch() of the font file
// route through the browser's network stack to load the url() — and
// under a long, concurrent (8x) production render, that request can
// stall on one page instance and simply hang forever rather than
// reject. This was confirmed twice: once via loadFont() itself timing
// out mid-render, and again via a manual fetch() + AbortController +
// retry wrapper, where the very first fetch attempt hung for the full
// timeout without the abort/retry logic ever getting a chance to run —
// i.e. an in-flight stalled request cannot be relied upon to honor
// cancellation in this environment.
//
// Removing the network request entirely (the font bytes are embedded as
// a base64 string directly in the JS bundle — see
// fonts/plusJakartaSansBase64.ts, generated from
// public/fonts/PlusJakartaSans-Variable.ttf — decoded synchronously, and
// handed to FontFace as an ArrayBuffer) still wasn't enough on its own:
// the render then failed at almost the same frame again. The actual
// remaining cause is CPU contention, not I/O — this machine renders at
// concurrency 8 on an 8-core CPU (see `Concurrency = 8x` in the render
// log), so 8 tabs simultaneously rendering frames, rasterizing fonts and
// JPEG-encoding leaves the main thread no scheduling headroom at their
// synchronized page-recycle points. The decode + FontFace.load() work
// itself is fast; it just occasionally doesn't get scheduled in time to
// beat Remotion's default 30s delayRender timeout. So: give it real
// headroom explicitly rather than relying on the default.
const FONT_LOAD_TIMEOUT_MS = 120000;

const decodeBase64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const handle = delayRender("Loading Plus Jakarta Sans", {
  timeoutInMilliseconds: FONT_LOAD_TIMEOUT_MS,
});

(async () => {
  try {
    const fontData = decodeBase64ToArrayBuffer(PLUS_JAKARTA_SANS_BASE64);
    const font = new FontFace(FONT_FAMILY, fontData, { weight: FONT_WEIGHT_RANGE });
    await font.load();
    document.fonts.add(font);
    continueRender(handle);
  } catch (err) {
    cancelRender(err);
  }
})();
