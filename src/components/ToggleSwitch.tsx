import React from "react";
import { interpolate } from "remotion";
import { colors } from "../theme";

/**
 * A binary switch driven entirely by an external `progress` value (0 = off,
 * 1 = on). No internal timing — the parent scene owns when/how fast it
 * flips. Track color is a crossfade of two overlaid pills (interpolate()
 * can't tween color strings), thumb position is a translate.
 */
export const ToggleSwitch: React.FC<{
  progress: number;
  width?: number;
  height?: number;
}> = ({ progress, width = 56, height = 32 }) => {
  const thumbSize = height - 6;
  const thumbX = interpolate(progress, [0, 1], [3, width - thumbSize - 3]);

  return (
    <div style={{ position: "relative", width, height }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: height / 2,
          backgroundColor: colors.hairline,
          opacity: 1 - progress,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: height / 2,
          backgroundColor: colors.violet,
          opacity: progress,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 3,
          left: 0,
          translate: `${thumbX}px 0`,
          width: thumbSize,
          height: thumbSize,
          borderRadius: "50%",
          backgroundColor: colors.ink,
        }}
      />
    </div>
  );
};
