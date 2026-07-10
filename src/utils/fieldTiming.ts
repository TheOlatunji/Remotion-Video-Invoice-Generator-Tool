import { interpolate } from "remotion";
import { easeOut } from "../theme";

export const FIELD_CYCLE_LENGTH = 38;

export type FieldOpacities = { source: number; dest: number };

/**
 * One field's entire copy animation, self-contained within a fixed-length
 * cycle: the source highlights, holds, the destination value fades in
 * while the source keeps holding, both hold together, then both fade out.
 * Reused for every field so cycles can be chained back-to-back with zero
 * gap and zero overlap between fields.
 */
export const getFieldOpacities = (
  frame: number,
  cycleStart: number,
): FieldOpacities => {
  const t = frame - cycleStart;

  const source = interpolate(t, [0, 8, 30, 38], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  const dest = interpolate(t, [16, 26, 30, 38], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return { source, dest };
};
