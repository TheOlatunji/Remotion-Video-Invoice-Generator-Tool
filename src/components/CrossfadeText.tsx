import React from "react";
import { getCrossfadeStepOpacity } from "../utils/currencyTiming";

/**
 * A stack of text steps occupying the same rect, crossfading from one to
 * the next in strict sequence (never two mid-transition at once outside
 * their shared handoff window). Reused for both the currency symbol and
 * the invoice total, each with its own steps/styling.
 */
export const CrossfadeText: React.FC<{
  frame: number;
  steps: string[];
  sequenceStart: number;
  hold: number;
  transitionFrames: number;
  containerStyle: React.CSSProperties;
  textStyle: React.CSSProperties;
}> = ({
  frame,
  steps,
  sequenceStart,
  hold,
  transitionFrames,
  containerStyle,
  textStyle,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "#ffffff",
        ...containerStyle,
      }}
    >
      {steps.map((step, i) => {
        const opacity = getCrossfadeStepOpacity(
          frame,
          i,
          steps.length,
          sequenceStart,
          hold,
          transitionFrames,
        );

        if (opacity <= 0) return null;

        return (
          <div
            key={step}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              opacity,
              ...textStyle,
            }}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
};
