import React from "react";
import { colors } from "../theme";

export type Rect = { left: number; top: number; width: number; height: number };

const PADDING = 6;

/**
 * A single reusable "this field" callout: a soft violet-bordered rounded
 * rect, faded in/out entirely via opacity. Used twice per field (once on
 * the source panel, once on the destination panel).
 */
export const FieldHighlight: React.FC<{ rect: Rect; opacity: number }> = ({
  rect,
  opacity,
}) => {
  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: rect.left - PADDING,
        top: rect.top - PADDING,
        width: rect.width + PADDING * 2,
        height: rect.height + PADDING * 2,
        borderRadius: 6,
        border: `2px solid ${colors.violetLight}`,
        backgroundColor: "rgba(151, 40, 234, 0.14)",
        opacity,
      }}
    />
  );
};
