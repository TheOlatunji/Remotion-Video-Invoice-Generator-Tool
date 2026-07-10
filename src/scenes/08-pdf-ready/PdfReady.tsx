import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, criticalSpringConfig, easeOut, fonts } from "../../theme";

export const PDF_READY_DURATION = 300; // 10s @ 30fps

// "Then download a polished PDF that's ready to send."
//
// Continuity with Scene 7: the same invoice, still Strynder-purple, now
// presented as a single floating document. Strict sequence, nothing
// simultaneous, no camera movement: scene fades in -> soft shadow
// appears beneath the card -> a small checkmark badge draws itself onto
// its corner -> headline fades in. Then a long final hold.
const SCENE_FADE_END = 24;

const SHADOW_START = 50;
const SHADOW_END = 90;

const BADGE_START = 115;
const BADGE_END = 128;
const CHECK_DRAW_START = 128;
const CHECK_DRAW_END = 158;

const HEADLINE_START = 190;
const HEADLINE_END = 230;

// Reuses the Scene 7 preview asset (native 1120x1835) at native aspect,
// recolored to the same Strynder purple it ended on.
const CARD_NATIVE_WIDTH = 1120;
const CARD_NATIVE_HEIGHT = 1835;
const CARD_DISPLAY_HEIGHT = 720;
const CARD_SCALE = CARD_DISPLAY_HEIGHT / CARD_NATIVE_HEIGHT;
const CARD_DISPLAY_WIDTH = CARD_NATIVE_WIDTH * CARD_SCALE;
const CARD_LEFT = (1920 - CARD_DISPLAY_WIDTH) / 2;
const CARD_TOP = 90;
const PURPLE_HUE_ROTATE = 244;

const BADGE_DIAMETER = 90;
const BADGE_CENTER_X = CARD_LEFT + CARD_DISPLAY_WIDTH - 8;
const BADGE_CENTER_Y = CARD_TOP + CARD_DISPLAY_HEIGHT - 8;

export const PdfReady: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneOpacity = interpolate(frame, [0, SCENE_FADE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const shadowOpacity = interpolate(frame, [SHADOW_START, SHADOW_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const badgeProgress = spring({
    frame: frame - BADGE_START,
    fps,
    config: criticalSpringConfig,
    durationInFrames: BADGE_END - BADGE_START,
  });
  const badgeOpacity = interpolate(frame, [BADGE_START, BADGE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.7, 1]);

  const checkDraw = interpolate(frame, [CHECK_DRAW_START, CHECK_DRAW_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const headlineOpacity = interpolate(frame, [HEADLINE_START, HEADLINE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.pureBlack, opacity: sceneOpacity }}>
      {/* Soft shadow beneath the card — the thing that makes it read as
          a floating document rather than a flat panel. */}
      <div
        style={{
          position: "absolute",
          left: CARD_LEFT + CARD_DISPLAY_WIDTH * 0.07,
          top: CARD_TOP + CARD_DISPLAY_HEIGHT - 60,
          width: CARD_DISPLAY_WIDTH * 0.86,
          height: CARD_DISPLAY_HEIGHT * 0.35,
          borderRadius: "50%",
          backgroundColor: "#000000",
          filter: "blur(50px)",
          opacity: shadowOpacity * 0.6,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: CARD_LEFT,
          top: CARD_TOP,
          width: CARD_DISPLAY_WIDTH,
          height: CARD_DISPLAY_HEIGHT,
          borderRadius: 10,
          overflow: "hidden",
          border: `1px solid ${colors.hairline}`,
        }}
      >
        <Img
          src={staticFile("screenshots/live-preview-panel.png")}
          style={{
            width: "100%",
            height: "100%",
            filter: `hue-rotate(${PURPLE_HUE_ROTATE}deg)`,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: BADGE_CENTER_X - (BADGE_DIAMETER / 2) * badgeScale,
          top: BADGE_CENTER_Y - (BADGE_DIAMETER / 2) * badgeScale,
          width: BADGE_DIAMETER * badgeScale,
          height: BADGE_DIAMETER * badgeScale,
          opacity: badgeOpacity,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            backgroundColor: colors.violet,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.45)",
          }}
        />
        <svg viewBox="0 0 24 24" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <path
            d="M6 12.5l4 4 8-9"
            fill="none"
            stroke="#ffffff"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={24}
            strokeDashoffset={24 * checkDraw}
          />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CARD_TOP + CARD_DISPLAY_HEIGHT + 60,
          textAlign: "center",
          opacity: headlineOpacity,
          fontSize: 56,
          fontWeight: 600,
          letterSpacing: -0.5,
          color: colors.ink,
          fontFamily: fonts.family,
        }}
      >
        Ready to Send
      </div>
    </AbsoluteFill>
  );
};
