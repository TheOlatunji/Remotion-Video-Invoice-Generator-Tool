import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import {
  INVOICE_HEIGHT,
  INVOICE_WIDTH,
  InvoiceOutline,
} from "../../components/InvoiceOutline";
import { colors, easeInOut, easeOut } from "../../theme";

export const INVOICE_CLUTTER_DURATION = 330; // 11s @ 30fps

// "Whether you're a freelancer, a creative, a growing business, or a solo
// founder, your time is better spent serving clients, building products,
// and growing your business — not recreating invoices from scratch."

const SCATTERED_COUNT = 28;
const FADE_IN_DURATION = 12;

// All entrances (hero + scattered) resolve by this frame.
const ENTRANCE_END = 230;
// The cluttered screen is held, untouched, before it resolves.
const HOLD_END = 258;
// Everything but the hero dissolves toward center over the remaining time.
const DISSOLVE_END = INVOICE_CLUTTER_DURATION;

const CENTER_X = 1920 / 2;
const CENTER_Y = 1080 / 2;

type Layout = {
  offsetX: number;
  offsetY: number;
  rotation: number;
  scale: number;
  startFrame: number;
};

// Deterministic scatter + accelerating stagger, computed once at module
// scope so it never changes between frames or re-renders.
const layouts: Layout[] = Array.from({ length: SCATTERED_COUNT }, (_, i) => {
  const seed = `invoice-${i}`;
  const angle = random(`${seed}-angle`) * Math.PI * 2;
  const radius = 160 + random(`${seed}-radius`) * 520;
  const offsetX = Math.cos(angle) * radius;
  const offsetY = Math.sin(angle) * radius * 0.55;
  const rotation = (random(`${seed}-rotation`) - 0.5) * 14;
  const scale = 0.8 + random(`${seed}-scale`) * 0.4;

  // Ease-out pacing: wide gaps between the first few arrivals (each one
  // reads as its own beat), tightening as the pile accelerates.
  const t = (i + 1) / SCATTERED_COUNT;
  const eased = Easing.out(Easing.quad)(t);
  const span = ENTRANCE_END - FADE_IN_DURATION;
  const startFrame = Math.round(eased * span);

  return { offsetX, offsetY, rotation, scale, startFrame };
});

export const InvoiceClutter: React.FC = () => {
  const frame = useCurrentFrame();

  const heroOpacity = interpolate(frame, [0, FADE_IN_DURATION], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.pureBlack }}>
      {/* The hero invoice: present from the first frame, never moves or
          fades again — it is the one that remains at the end. */}
      <div
        style={{
          position: "absolute",
          left: CENTER_X - INVOICE_WIDTH / 2,
          top: CENTER_Y - INVOICE_HEIGHT / 2,
          opacity: heroOpacity,
        }}
      >
        <InvoiceOutline />
      </div>

      {layouts.map((layout, i) => {
        const fadeIn = interpolate(
          frame,
          [layout.startFrame, layout.startFrame + FADE_IN_DURATION],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
        );

        const dissolve = interpolate(frame, [HOLD_END, DISSOLVE_END], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: easeInOut,
        });

        const opacity = fadeIn * (1 - dissolve);
        const x = interpolate(dissolve, [0, 1], [layout.offsetX, 0]);
        const y = interpolate(dissolve, [0, 1], [layout.offsetY, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: CENTER_X - INVOICE_WIDTH / 2,
              top: CENTER_Y - INVOICE_HEIGHT / 2,
              opacity,
              translate: `${x}px ${y}px`,
              rotate: `${layout.rotation}deg`,
              scale: layout.scale,
            }}
          >
            <InvoiceOutline />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
