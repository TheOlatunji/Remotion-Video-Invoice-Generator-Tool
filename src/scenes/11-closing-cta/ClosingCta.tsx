import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { colors, easeOut, fonts } from "../../theme";
import { revealStyle } from "../../utils/blurReveal";

export const CLOSING_CTA_DURATION = 240; // 8s @ 30fps

// "Try the Strynder Invoice Generator today. Because great businesses
// aren't built on talent alone. They're built on systems. Build yours
// with Strynder."
//
// A bookend of Scene 1: return to black, reveal the icon and wordmark
// on the exact same timing/style, then — once the mark has fully
// settled — fade in the tagline, then the URL. Nothing moves once the
// CTA appears; the scene closes on a hold and a fade to black.
const ICON_REVEAL_START = 45;
const ICON_REVEAL_END = 80;

const WORDMARK_REVEAL_START = 100;
const WORDMARK_REVEAL_END = 135;

const TAGLINE_START = 145;
const TAGLINE_END = 167;

const URL_START = 177;
const URL_END = 195;

const FADE_TO_BLACK_START = 220;
const FADE_TO_BLACK_END = 240;

export const ClosingCta: React.FC = () => {
  const frame = useCurrentFrame();

  const iconStyle = revealStyle(frame, ICON_REVEAL_START, ICON_REVEAL_END);
  const wordmarkStyle = revealStyle(frame, WORDMARK_REVEAL_START, WORDMARK_REVEAL_END);

  const taglineOpacity = interpolate(frame, [TAGLINE_START, TAGLINE_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const urlOpacity = interpolate(frame, [URL_START, URL_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const blackOutOpacity = interpolate(
    frame,
    [FADE_TO_BLACK_START, FADE_TO_BLACK_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
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

        {/* Space is reserved for these from frame 0 (rendered at
            opacity 0) so the logo/wordmark never shift position when
            the tagline and URL fade in above them. */}
        <div
          style={{
            marginTop: 56,
            fontFamily: fonts.family,
            fontWeight: 500,
            fontSize: 34,
            color: colors.inkMuted,
            opacity: taglineOpacity,
          }}
        >
          Build yours with Strynder.
        </div>

        <div
          style={{
            marginTop: 24,
            fontFamily: fonts.family,
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: "0.02em",
            color: colors.violetLight,
            opacity: urlOpacity,
          }}
        >
          strynder.com
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ backgroundColor: colors.pureBlack, opacity: blackOutOpacity }} />
    </AbsoluteFill>
  );
};
