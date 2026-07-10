import { interpolate } from "remotion";
import { easeOut } from "../theme";

/**
 * Opacity for one step in a sequential crossfade chain (step 0 fully
 * visible at rest, fades to step 1, which fades to step 2, ...). The
 * first step needs no fade-in (it's the resting state); the last step
 * needs no fade-out (it's the state the sequence ends on).
 */
export const getCrossfadeStepOpacity = (
  frame: number,
  stepIndex: number,
  stepCount: number,
  sequenceStart: number,
  hold: number,
  transitionFrames: number,
): number => {
  const stepLength = hold + transitionFrames;
  const stepStart = sequenceStart + stepIndex * stepLength;
  const holdEnd = stepStart + hold;
  const fadeOutEnd = holdEnd + transitionFrames;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === stepCount - 1;

  const fadeIn = isFirst
    ? 1
    : interpolate(frame, [stepStart - transitionFrames, stepStart], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeOut,
      });

  const fadeOut = isLast
    ? 1
    : interpolate(frame, [holdEnd, fadeOutEnd], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: easeOut,
      });

  return Math.min(fadeIn, fadeOut);
};
