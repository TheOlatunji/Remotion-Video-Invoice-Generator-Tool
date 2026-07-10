import React from "react";
import { colors } from "../theme";

export const INVOICE_WIDTH = 128;
export const INVOICE_HEIGHT = 168;

const Bar: React.FC<{ width: string; height?: number; opacity?: number }> = ({
  width,
  height = 8,
  opacity = 0.3,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: height / 2,
      backgroundColor: colors.ink,
      opacity,
    }}
  />
);

/**
 * Abstract, textless stand-in for an invoice: a hairline-bordered card
 * with a title bar, a few body lines, and a bolded total line. Used to
 * represent "an invoice" as a silhouette, never as a literal document.
 */
export const InvoiceOutline: React.FC = () => {
  return (
    <div
      style={{
        width: INVOICE_WIDTH,
        height: INVOICE_HEIGHT,
        boxSizing: "border-box",
        borderRadius: 10,
        border: `1.5px solid ${colors.hairline}`,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        padding: "18px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Bar width="46%" height={9} opacity={0.5} />
        <Bar width="72%" />
        <Bar width="58%" />
        <Bar width="65%" />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Bar width="34%" height={10} opacity={0.45} />
      </div>
    </div>
  );
};
