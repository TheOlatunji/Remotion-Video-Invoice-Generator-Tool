import { Easing } from "remotion";
import { FONT_FAMILY } from "./load-fonts";

export const colors = {
  pureBlack: "#000000",
  background: "#07060a",
  backgroundElevated: "#0c0a12",
  ink: "#ffffff",
  inkMuted: "rgba(255, 255, 255, 0.62)",
  inkFaint: "rgba(255, 255, 255, 0.38)",
  hairline: "rgba(255, 255, 255, 0.1)",
  violetDeep: "#5a09fa",
  violet: "#7617f3",
  violetLight: "#9728ea",
} as const;

export const fonts = {
  family: FONT_FAMILY,
} as const;

// Slow, editorial ease-out used for entrances. Never overshoots.
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// Balanced ease for holds/cross-fades.
export const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

// Critically damped spring config: damping = 2 * sqrt(stiffness * mass).
// Settles smoothly into place with zero bounce or overshoot.
export const criticalSpringConfig = {
  damping: 20,
  stiffness: 100,
  mass: 1,
  overshootClamping: true,
};
