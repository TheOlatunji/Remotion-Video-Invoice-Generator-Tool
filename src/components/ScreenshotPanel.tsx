import React from "react";
import { Img, staticFile } from "remotion";
import { colors } from "../theme";

/**
 * A screenshot framed as a clean, hairline-bordered card. Optionally
 * extends the card below the image with plain fill (matching the
 * screenshot's own background) so overlays can reference space the
 * source screenshot itself doesn't show.
 */
export const ScreenshotPanel: React.FC<{
  src: string;
  width: number;
  height: number;
  extensionHeight?: number;
  opacity: number;
  children?: React.ReactNode;
}> = ({ src, width, height, extensionHeight = 0, opacity, children }) => {
  return (
    <div
      style={{
        position: "relative",
        width,
        height: height + extensionHeight,
        borderRadius: 16,
        overflow: "hidden",
        border: `1.5px solid ${colors.hairline}`,
        backgroundColor: "#ffffff",
        opacity,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{ width, height, display: "block" }}
      />
      {children}
    </div>
  );
};
