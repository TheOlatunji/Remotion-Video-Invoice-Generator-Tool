import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CrossfadeText } from "../../components/CrossfadeText";
import { colors, easeInOut } from "../../theme";

export const CURRENCY_SWITCH_DURATION = 300; // 10s @ 30fps

// "Need to invoice a client in Nigeria? Generate invoices in Naira.
// Working with international clients? Switch effortlessly to Dollars
// or Pounds."

// Camera: establish -> slow push into the currency selector -> hold ->
// slow pull back out. One movement, isolated from the currency fades.
const ZOOM_IN_START = 30;
const ZOOM_IN_END = 100;
const ZOOM_OUT_START = 256;
const ZOOM_OUT_END = 296;
const MAX_ZOOM = 2.0;

// Currency crossfade: Naira (resting) -> Dollars -> Pounds. Each symbol
// and its matching total hold long enough to read before the next fades in.
const CURRENCY_SEQUENCE_START = 115;
const CURRENCY_HOLD = 34;
const CURRENCY_TRANSITION = 12;
const SYMBOL_STEPS = ["₦", "$", "£"];
const TOTAL_STEPS = ["₦0.00", "$0.00", "£0.00"];

// Rendered at native crop resolution (no CSS up/downscaling) to avoid
// image-resampling artifacts once the camera zooms in on the raster text.
const SELECTOR_WIDTH = 530;
const SELECTOR_HEIGHT = 125;
const TOTAL_WIDTH = 700;
const TOTAL_HEIGHT = 90;
const PANEL_GAP = 28;
const COMPOSITE_HEIGHT = SELECTOR_HEIGHT + PANEL_GAP + TOTAL_HEIGHT;

// Zoom is anchored near the selector's own center, so it grows into
// prominence while the total row (below it) stays in frame beneath it.
const ZOOM_ORIGIN = `50% ${((SELECTOR_HEIGHT / 2 / COMPOSITE_HEIGHT) * 100).toFixed(1)}%`;

export const CurrencySwitch: React.FC = () => {
  const frame = useCurrentFrame();

  const cameraScale = interpolate(
    frame,
    [ZOOM_IN_START, ZOOM_IN_END, ZOOM_OUT_START, ZOOM_OUT_END],
    [1, MAX_ZOOM, MAX_ZOOM, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.pureBlack }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ scale: cameraScale, transformOrigin: ZOOM_ORIGIN }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: PANEL_GAP,
            }}
          >
            <div
              style={{
                position: "relative",
                width: SELECTOR_WIDTH,
                height: SELECTOR_HEIGHT,
                borderRadius: 12,
                overflow: "hidden",
                border: `1.5px solid ${colors.hairline}`,
              }}
            >
              <Img
                src={staticFile("screenshots/currency-selector.png")}
                style={{
                  width: SELECTOR_WIDTH,
                  height: SELECTOR_HEIGHT,
                  display: "block",
                }}
              />
              {/* Right edge fixed at 125 (roughly where "NGN" ended); box
                  widened leftward so the glyph never overflows its bounds. */}
              <CrossfadeText
                frame={frame}
                steps={SYMBOL_STEPS}
                sequenceStart={CURRENCY_SEQUENCE_START}
                hold={CURRENCY_HOLD}
                transitionFrames={CURRENCY_TRANSITION}
                containerStyle={{ left: 20, top: 55, width: 160, height: 48 }}
                textStyle={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#171717",
                  justifyContent: "flex-start",
                  paddingLeft: 6,
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                }}
              />
            </div>

            <div
              style={{
                position: "relative",
                width: TOTAL_WIDTH,
                height: TOTAL_HEIGHT,
                borderRadius: 12,
                overflow: "hidden",
                border: `1.5px solid ${colors.hairline}`,
              }}
            >
              <Img
                src={staticFile("screenshots/total-row.png")}
                style={{
                  width: TOTAL_WIDTH,
                  height: TOTAL_HEIGHT,
                  display: "block",
                }}
              />
              {/* Right edge fixed at 676 (the original value's right edge);
                  box widened leftward so "£0.00" etc. never overflows. */}
              <CrossfadeText
                frame={frame}
                steps={TOTAL_STEPS}
                sequenceStart={CURRENCY_SEQUENCE_START}
                hold={CURRENCY_HOLD}
                transitionFrames={CURRENCY_TRANSITION}
                containerStyle={{ left: 476, top: 18, width: 200, height: 46 }}
                textStyle={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#b5651d",
                  justifyContent: "flex-end",
                  paddingRight: 4,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
