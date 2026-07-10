import type { CSSProperties } from "react";
import { interpolate } from "remotion";
import { easeOut } from "../theme";

// Shared blur-to-focus reveal used for the Strynder mark in Scene 1 and
// reprised identically in the closing scene.
export const REVEAL_BLUR_PX = 22;

export const revealStyle = (
  frame: number,
  start: number,
  end: number,
): CSSProperties => {
  const progress = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const blur = interpolate(progress, [0, 1], [REVEAL_BLUR_PX, 0]);

  return {
    opacity: progress,
    filter: `blur(${blur}px)`,
  };
};
