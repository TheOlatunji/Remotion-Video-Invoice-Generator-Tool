import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { colors, fonts } from "../../theme";
import { revealStyle } from "../../utils/blurReveal";

export const LOGO_REVEAL_DURATION = 150;

// "At Strynder, we believe talented people shouldn't have to struggle
// with everyday business tasks." — voice over plays under this scene.

// 1.5s of held black before anything reveals.
const ICON_REVEAL_START = 45;
const ICON_REVEAL_END = 80;

const WORDMARK_REVEAL_START = 100;
const WORDMARK_REVEAL_END = 135;

// Music cue: the first piano note enters here, exactly as the mark
// starts to resolve out of the dark.
export const PIANO_CUE_FRAME = ICON_REVEAL_START;

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();

  const iconStyle = revealStyle(frame, ICON_REVEAL_START, ICON_REVEAL_END);
  const wordmarkStyle = revealStyle(
    frame,
    WORDMARK_REVEAL_START,
    WORDMARK_REVEAL_END,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.pureBlack }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", ...iconStyle }}>
          <Img
            src={staticFile("logos/strynder-icon.svg")}
            style={{ height: 168, width: "auto" }}
          />
        </div>

        <div
          style={{
            marginTop: 40,
            fontFamily: fonts.family,
            fontWeight: 700,
            fontSize: 76,
            letterSpacing: "-0.02em",
            color: colors.ink,
            ...wordmarkStyle,
          }}
        >
          Strynder
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
