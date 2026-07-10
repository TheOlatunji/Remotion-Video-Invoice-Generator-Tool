import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  INVOICE_HEIGHT,
  INVOICE_WIDTH,
  InvoiceOutline,
} from "../../components/InvoiceOutline";
import { colors, easeInOut, easeOut, fonts } from "../../theme";

export const INVOICE_REVEAL_DURATION = 180; // 6s @ 30fps

// "That's why we've built the Strynder Invoice Generator."

// Continuity hold: the same hero card Scene 2 ended on, untouched.
const TRANSFORM_START = 10;
// The card grows and cross-dissolves from outline to screenshot.
const TRANSFORM_END = 70;
// A settled beat before the camera moves.
const CAMERA_START = 85;
// One extremely slow push-in. Nothing else moves while this happens.
const CAMERA_END = 145;
// Headline only fades in once the camera has fully stopped.
const HEADLINE_START = 150;
const HEADLINE_END = 168;
// Accent line resolves last, once the headline is in place.
const ACCENT_START = 168;
const ACCENT_END = INVOICE_REVEAL_DURATION;

const CENTER_X = 1920 / 2;
const SMALL_CENTER_Y = 1080 / 2; // matches the Scene 2 hero position exactly.

const SCREENSHOT_ASPECT = 2262 / 1541;
const LARGE_WIDTH = 1120;
const LARGE_HEIGHT = Math.round(LARGE_WIDTH / SCREENSHOT_ASPECT);
const LARGE_CENTER_Y = 430;

const CAMERA_SCALE_END = 1.045;

const ACCENT_WIDTH = 220;

export const InvoiceReveal: React.FC = () => {
  const frame = useCurrentFrame();

  const transformProgress = interpolate(
    frame,
    [TRANSFORM_START, TRANSFORM_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  const width = interpolate(
    transformProgress,
    [0, 1],
    [INVOICE_WIDTH, LARGE_WIDTH],
  );
  const height = interpolate(
    transformProgress,
    [0, 1],
    [INVOICE_HEIGHT, LARGE_HEIGHT],
  );
  const centerY = interpolate(
    transformProgress,
    [0, 1],
    [SMALL_CENTER_Y, LARGE_CENTER_Y],
  );

  // Cross-dissolve: the outline fades out across the first 60% of the
  // transform, the screenshot (and its frame) fades in across the last 60%.
  const outlineOpacity = interpolate(transformProgress, [0, 0.6], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const screenshotOpacity = interpolate(transformProgress, [0.4, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cameraProgress = interpolate(frame, [CAMERA_START, CAMERA_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const cameraScale = interpolate(cameraProgress, [0, 1], [1, CAMERA_SCALE_END]);

  const headlineOpacity = interpolate(
    frame,
    [HEADLINE_START, HEADLINE_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  const accentProgress = interpolate(
    frame,
    [ACCENT_START, ACCENT_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  const captionTop = LARGE_CENTER_Y + LARGE_HEIGHT / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.pureBlack }}>
      {/* The "photographed" layer: everything the slow push-in affects. */}
      <AbsoluteFill style={{ scale: cameraScale }}>
        <div
          style={{
            position: "absolute",
            left: CENTER_X - width / 2,
            top: centerY - height / 2,
            width,
            height,
            borderRadius: 16,
            overflow: "hidden",
            border: `1.5px solid rgba(255, 255, 255, ${0.1 * screenshotOpacity})`,
            backgroundColor: `rgba(255, 255, 255, ${0.03 * screenshotOpacity})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: outlineOpacity,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InvoiceOutline />
          </div>

          <div style={{ position: "absolute", inset: 0, opacity: screenshotOpacity }}>
            <Img
              src={staticFile("screenshots/invoice-preview.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* Overlay layer: never touched by the camera push. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: captionTop,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
        }}
      >
        <div
          style={{
            opacity: headlineOpacity,
            fontFamily: fonts.family,
            fontWeight: 700,
            fontSize: 56,
            letterSpacing: "-0.01em",
            color: colors.ink,
          }}
        >
          Strynder Invoice Generator
        </div>

        <div
          style={{
            width: ACCENT_WIDTH,
            height: 3,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${colors.violetDeep}, ${colors.violetLight})`,
            scale: `${accentProgress} 1`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
