import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { colors, easeOut } from "../../theme";

export const INVOICE_HISTORY_DURATION = 300; // 10s @ 30fps

// "And because every invoice is securely saved to your account, you can
// always come back to view, manage, or download previous invoices
// whenever you need them."
//
// The real Invoices (history) screenshot, held static and centered — no
// camera movement. The three saved invoices reveal one row at a time,
// each a plain opacity fade (never a slide, never a bounce), calmly
// settling into the organized grid. Order replacing the chaos of
// Scene 2's invoice clutter.
const HISTORY_NATIVE_WIDTH = 2980;
const HISTORY_NATIVE_HEIGHT = 420;
const HISTORY_DISPLAY_WIDTH = 1760;
const HISTORY_SCALE = HISTORY_DISPLAY_WIDTH / HISTORY_NATIVE_WIDTH;
const HISTORY_DISPLAY_HEIGHT = HISTORY_NATIVE_HEIGHT * HISTORY_SCALE;
const HISTORY_LEFT = (1920 - HISTORY_DISPLAY_WIDTH) / 2;
const HISTORY_TOP = (1080 - HISTORY_DISPLAY_HEIGHT) / 2;

// Native pixel bands of each row (measured against history-panel.png),
// used to position a white cover that fades away to reveal the row.
const ROW_HEIGHT = 110;
const ROWS_Y = [63, 173, 283];

const SCENE_FADE_END = 24;
const ROW_FADE_DURATION = 30;
const ROW_GAP = 30;
const ROWS_START = 50;

export const InvoiceHistory: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [0, SCENE_FADE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.pureBlack, opacity: sceneOpacity }}>
      <div
        style={{
          position: "absolute",
          left: HISTORY_LEFT,
          top: HISTORY_TOP,
          width: HISTORY_DISPLAY_WIDTH,
          height: HISTORY_DISPLAY_HEIGHT,
          borderRadius: 10,
          overflow: "hidden",
          border: `1px solid ${colors.hairline}`,
        }}
      >
        <Img
          src={staticFile("screenshots/history-panel.png")}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        {ROWS_Y.map((y, i) => {
          const start = ROWS_START + i * (ROW_FADE_DURATION + ROW_GAP);
          const coverOpacity = interpolate(
            frame,
            [start, start + ROW_FADE_DURATION],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
          );
          if (coverOpacity <= 0) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 6 * HISTORY_SCALE,
                top: y * HISTORY_SCALE,
                width: HISTORY_DISPLAY_WIDTH - 12 * HISTORY_SCALE,
                height: ROW_HEIGHT * HISTORY_SCALE,
                backgroundColor: "#ffffff",
                opacity: coverOpacity,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
