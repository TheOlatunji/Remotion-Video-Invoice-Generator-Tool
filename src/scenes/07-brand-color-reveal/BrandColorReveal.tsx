import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { getCrossfadeStepOpacity } from "../../utils/currencyTiming";
import { colors, easeInOut, easeOut } from "../../theme";

export const BRAND_COLOR_REVEAL_DURATION = 360; // 12s @ 30fps

// "As you build your invoice, a live preview lets you see exactly what
// your client will receive. Choose a colour that reflects your brand.
// Add your products or services. Review everything in real time."
//
// Split screen: editor (real "New invoice" screenshot) left, live
// preview (real invoice screenshot) right. A sequence of header-color
// selections plays out — the resting screenshot default (orange) is
// itself the first state, then blue, green, back to orange, and finally
// Strynder's own brand purple — each a "select" beat on the swatch row
// followed by an "invoice updates" beat on the preview. Then the preview
// alone expands to fill the screen as the editor quietly fades away.

// --- Native pixel geometry, measured directly against the cropped
// screenshots in public/screenshots/ (see ffmpeg crop commands used to
// produce them). Keeping these as native measurements and scaling in
// code (rather than hand-computing final on-screen pixels) keeps the
// numbers traceable back to the source asset.
const EDITOR_NATIVE_WIDTH = 1145;
const EDITOR_NATIVE_HEIGHT = 950;
const PREVIEW_NATIVE_WIDTH = 1120;
const PREVIEW_NATIVE_HEIGHT = 1835;

// Header-color swatch row (8 real presets baked into the screenshot).
// Swatch 1 (originally navy) is repainted Strynder violet for this
// scene's purposes; swatch 7 (orange) already ships pre-selected in the
// screenshot, ring and checkmark baked in.
const SWATCH_Y = 580;
const SWATCH_RADIUS = 45;
const RING_OUTER_RADIUS = 63; // covers the baked-in ring around swatch 7
const ORANGE_FILL = "#a85823";
const SWATCH_X = {
  purple: 82,
  blue: 612,
  green: 294,
  orange: 718,
};

// --- Split-screen layout (absolute, within the 1920x1080 frame).
const EDITOR_DISPLAY_WIDTH = 844;
const EDITOR_SCALE = EDITOR_DISPLAY_WIDTH / EDITOR_NATIVE_WIDTH;
const EDITOR_DISPLAY_HEIGHT = EDITOR_NATIVE_HEIGHT * EDITOR_SCALE;
const EDITOR_LEFT = 160;
const EDITOR_TOP = (1080 - EDITOR_DISPLAY_HEIGHT) / 2;

const PREVIEW_SPLIT_HEIGHT = 980;
const PREVIEW_SPLIT_SCALE = PREVIEW_SPLIT_HEIGHT / PREVIEW_NATIVE_HEIGHT;
const PREVIEW_SPLIT_LEFT = 1160;
const PREVIEW_SPLIT_TOP = (1080 - PREVIEW_SPLIT_HEIGHT) / 2;
const PREVIEW_FULL_SCALE = 1080 / PREVIEW_NATIVE_HEIGHT;
const PREVIEW_FULL_WIDTH = PREVIEW_NATIVE_WIDTH * PREVIEW_FULL_SCALE;
const PREVIEW_FULL_LEFT = (1920 - PREVIEW_FULL_WIDTH) / 2;

// --- Color sequence timing. Orange is the resting default (the
// screenshot's own baked-in selection), so it is step 0 with no
// transition-in. Each subsequent step is a "select" beat (the ring
// moves) followed — after a short gap — by an "invoice updates" beat
// (the preview crossfades to the new hue). Both tracks share the same
// step period so the gap between them stays constant every cycle.
const COLOR_STEPS = ["orange", "blue", "green", "orange", "purple"] as const;
const HUE_ROTATE: Record<(typeof COLOR_STEPS)[number], number> = {
  orange: 0,
  blue: 193,
  green: 123,
  purple: 244,
};

const RING_SEQUENCE_START = 40;
const RING_HOLD = 34;
const RING_TRANSITION = 14; // period = 48

const INVOICE_GAP = 20; // preview lags the swatch selection by this much
const INVOICE_SEQUENCE_START = RING_SEQUENCE_START + INVOICE_GAP;
const INVOICE_HOLD = RING_HOLD;
const INVOICE_TRANSITION = RING_TRANSITION;

const PANEL_FADE_END = 24;
const OUTRO_START = 270;
const OUTRO_END = 340;

const SwatchRepaint: React.FC<{ x: number; fill: string }> = ({ x, fill }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: x * EDITOR_SCALE - RING_OUTER_RADIUS * EDITOR_SCALE,
        top: SWATCH_Y * EDITOR_SCALE - RING_OUTER_RADIUS * EDITOR_SCALE,
        width: RING_OUTER_RADIUS * 2 * EDITOR_SCALE,
        height: RING_OUTER_RADIUS * 2 * EDITOR_SCALE,
        borderRadius: "50%",
        backgroundColor: "#ffffff",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: x * EDITOR_SCALE - SWATCH_RADIUS * EDITOR_SCALE,
        top: SWATCH_Y * EDITOR_SCALE - SWATCH_RADIUS * EDITOR_SCALE,
        width: SWATCH_RADIUS * 2 * EDITOR_SCALE,
        height: SWATCH_RADIUS * 2 * EDITOR_SCALE,
        borderRadius: "50%",
        backgroundColor: fill,
      }}
    />
  </>
);

const SelectionRing: React.FC<{ x: number; opacity: number }> = ({ x, opacity }) => {
  if (opacity <= 0) return null;
  const d = RING_OUTER_RADIUS * 2 * EDITOR_SCALE;
  return (
    <div
      style={{
        position: "absolute",
        left: x * EDITOR_SCALE - d / 2,
        top: SWATCH_Y * EDITOR_SCALE - d / 2,
        width: d,
        height: d,
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `${8 * EDITOR_SCALE}px solid #14120f`,
        }}
      />
      <svg
        viewBox="0 0 24 24"
        width={d * 0.4}
        height={d * 0.4}
        style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%" }}
      >
        <path
          d="M4 12.5l5 5L20 6"
          fill="none"
          stroke="#ffffff"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const BrandColorReveal: React.FC = () => {
  const frame = useCurrentFrame();

  const introFade = interpolate(frame, [0, PANEL_FADE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const outroEditorFade = interpolate(frame, [OUTRO_START, OUTRO_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const editorOpacity = introFade * outroEditorFade;

  const expand = interpolate(frame, [OUTRO_START, OUTRO_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  const previewLeft = interpolate(expand, [0, 1], [PREVIEW_SPLIT_LEFT, PREVIEW_FULL_LEFT]);
  const previewTop = interpolate(expand, [0, 1], [PREVIEW_SPLIT_TOP, 0]);
  const previewScale = interpolate(expand, [0, 1], [PREVIEW_SPLIT_SCALE, PREVIEW_FULL_SCALE]);
  const previewRadius = interpolate(expand, [0, 1], [30, 0]);
  const previewBorderOpacity = interpolate(expand, [0, 1], [1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.pureBlack }}>
      {/* Editor panel: real "New invoice" screenshot, swatch row patched
          so selection state is fully controlled by SelectionRing. */}
      <div
        style={{
          position: "absolute",
          left: EDITOR_LEFT,
          top: EDITOR_TOP,
          width: EDITOR_DISPLAY_WIDTH,
          height: EDITOR_DISPLAY_HEIGHT,
          opacity: editorOpacity * introFade,
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${colors.hairline}`,
        }}
      >
        <Img
          src={staticFile("screenshots/editor-panel.png")}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        <SwatchRepaint x={SWATCH_X.orange} fill={ORANGE_FILL} />
        <SwatchRepaint x={SWATCH_X.purple} fill={colors.violet} />
        {COLOR_STEPS.map((color, i) => {
          const opacity = getCrossfadeStepOpacity(
            frame,
            i,
            COLOR_STEPS.length,
            RING_SEQUENCE_START,
            RING_HOLD,
            RING_TRANSITION,
          );
          return <SelectionRing key={i} x={SWATCH_X[color]} opacity={opacity} />;
        })}
      </div>

      {/* Live preview panel: real invoice screenshot, recolored via
          hue-rotate crossfades, then expanded to fill the frame. */}
      <div
        style={{
          position: "absolute",
          left: previewLeft,
          top: previewTop,
          width: PREVIEW_NATIVE_WIDTH,
          height: PREVIEW_NATIVE_HEIGHT,
          scale: previewScale,
          transformOrigin: "0 0",
          opacity: introFade,
          borderRadius: previewRadius,
          overflow: "hidden",
          border: `1px solid rgba(255, 255, 255, ${0.1 * previewBorderOpacity})`,
        }}
      >
        {COLOR_STEPS.map((color, i) => {
          const opacity = getCrossfadeStepOpacity(
            frame,
            i,
            COLOR_STEPS.length,
            INVOICE_SEQUENCE_START,
            INVOICE_HOLD,
            INVOICE_TRANSITION,
          );
          if (opacity <= 0) return null;
          return (
            <Img
              key={color + i}
              src={staticFile("screenshots/live-preview-panel.png")}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity,
                filter: `hue-rotate(${HUE_ROTATE[color]}deg)`,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
