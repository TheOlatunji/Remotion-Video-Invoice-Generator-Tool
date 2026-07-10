import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ToggleSwitch } from "../../components/ToggleSwitch";
import { colors, easeOut } from "../../theme";

export const VAT_TOGGLE_DURATION = 240; // 8s @ 30fps

// "Need VAT? Turn it on in one click and let the system calculate
// everything for you."

// Strict sequence, one movement at a time: card settles -> hold -> toggle
// flips on -> hold -> VAT line fades in -> hold -> grand total updates ->
// final hold. Card, subtotal and layout never move again once settled.
const CARD_FADE_START = 0;
const CARD_FADE_END = 20;

const TOGGLE_START = 56;
const TOGGLE_END = 80;

const VAT_FADE_START = 110;
const VAT_FADE_END = 140;

const GRAND_TOTAL_START = 166;
const GRAND_TOTAL_END = 190;

const SUBTOTAL_VALUE = "$400.00";
const VAT_VALUE = "$30.00";
const GRAND_TOTAL_BEFORE = "$400.00";
const GRAND_TOTAL_AFTER = "$430.00";

const CARD_WIDTH = 560;

const Row: React.FC<{
  label: string;
  children: React.ReactNode;
  opacity?: number;
  bold?: boolean;
}> = ({ label, children, opacity = 1, bold = false }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      opacity,
      padding: "22px 0",
    }}
  >
    <span
      style={{
        fontSize: 24,
        fontWeight: bold ? 600 : 400,
        color: bold ? colors.ink : colors.inkMuted,
        letterSpacing: -0.2,
      }}
    >
      {label}
    </span>
    {children}
  </div>
);

const Value: React.FC<{ text: string; bold?: boolean }> = ({ text, bold }) => (
  <span
    style={{
      fontSize: bold ? 30 : 24,
      fontWeight: bold ? 700 : 500,
      color: colors.ink,
      letterSpacing: -0.2,
    }}
  >
    {text}
  </span>
);

const Divider: React.FC = () => (
  <div style={{ height: 1, backgroundColor: colors.hairline }} />
);

export const VatToggle: React.FC = () => {
  const frame = useCurrentFrame();

  const cardOpacity = interpolate(
    frame,
    [CARD_FADE_START, CARD_FADE_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  const toggleProgress = interpolate(
    frame,
    [TOGGLE_START, TOGGLE_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  const vatOpacity = interpolate(
    frame,
    [VAT_FADE_START, VAT_FADE_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  const grandBeforeOpacity = interpolate(
    frame,
    [GRAND_TOTAL_START, GRAND_TOTAL_END],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );
  const grandAfterOpacity = interpolate(
    frame,
    [GRAND_TOTAL_START, GRAND_TOTAL_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.pureBlack,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: CARD_WIDTH,
          opacity: cardOpacity,
          backgroundColor: colors.backgroundElevated,
          border: `1px solid ${colors.hairline}`,
          borderRadius: 20,
          padding: "8px 36px",
        }}
      >
        <Row label="VAT" bold>
          <ToggleSwitch progress={toggleProgress} />
        </Row>

        <Divider />

        <Row label="Subtotal">
          <Value text={SUBTOTAL_VALUE} />
        </Row>

        <Row label="VAT (7.5%)" opacity={vatOpacity}>
          <Value text={VAT_VALUE} />
        </Row>

        <Divider />

        <Row label="Grand Total" bold>
          <div style={{ position: "relative", height: 36 }}>
            <span
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                opacity: grandBeforeOpacity,
              }}
            >
              <Value text={GRAND_TOTAL_BEFORE} bold />
            </span>
            <span
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                opacity: grandAfterOpacity,
              }}
            >
              <Value text={GRAND_TOTAL_AFTER} bold />
            </span>
          </div>
        </Row>
      </div>
    </AbsoluteFill>
  );
};
