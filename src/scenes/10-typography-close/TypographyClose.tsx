import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { easeInOut, fonts } from "../../theme";

export const TYPOGRAPHY_CLOSE_DURATION = 300; // 10s @ 30fps

// "Simple. Professional. Built for the way African businesses work."
//
// Pure white, nothing but type. Each line fades in, holds, fades fully
// out before the next begins — never overlapping, never moving. The
// third line gets the longest hold of the film, closing on it.
const INK = "#0a0a0a";

const LINE_1_IN = [0, 20] as const;
const LINE_1_OUT = [50, 70] as const;

const LINE_2_IN = [85, 105] as const;
const LINE_2_OUT = [135, 155] as const;

const LINE_3_IN = [170, 195] as const;
// Line 3 holds from 195 all the way to the end of the scene (300) — the
// longest hold, by a wide margin.

const Line: React.FC<{
  text: string;
  opacity: number;
  fontSize: number;
  fontWeight: number;
}> = ({ text, opacity, fontSize, fontWeight }) => {
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          opacity,
          fontSize,
          fontWeight,
          color: INK,
          letterSpacing: -1,
          fontFamily: fonts.family,
          textAlign: "center",
          maxWidth: 1700,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const TypographyClose: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeWindow = (frame: number, [start, end]: readonly [number, number]) =>
    interpolate(frame, [start, end], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeInOut,
    });

  const line1Opacity =
    fadeWindow(frame, LINE_1_IN) * (1 - fadeWindow(frame, LINE_1_OUT));
  const line2Opacity =
    fadeWindow(frame, LINE_2_IN) * (1 - fadeWindow(frame, LINE_2_OUT));
  const line3Opacity = fadeWindow(frame, LINE_3_IN);

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <Line text="Simple." opacity={line1Opacity} fontSize={140} fontWeight={700} />
      <Line text="Professional." opacity={line2Opacity} fontSize={140} fontWeight={700} />
      <Line
        text="Built for the way African businesses work."
        opacity={line3Opacity}
        fontSize={64}
        fontWeight={600}
      />
    </AbsoluteFill>
  );
};
