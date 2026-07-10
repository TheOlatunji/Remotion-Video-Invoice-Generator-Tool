import React from "react";
import { AbsoluteFill } from "remotion";
import { colors } from "../theme";

/**
 * Shared cinematic backdrop: near-black base, a faint violet glow held
 * behind the focal point, and a soft vignette. Static by design — motion
 * belongs to the foreground element, not the background.
 */
export const Backdrop: React.FC<{ glowOpacity?: number }> = ({
  glowOpacity = 0.5,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(closest-side, rgba(118, 23, 243, ${glowOpacity * 0.22}) 0%, rgba(118, 23, 243, 0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
