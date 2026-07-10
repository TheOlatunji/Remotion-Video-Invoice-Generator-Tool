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

export const INVOICE_CLUTTER_DURATION = 150; // 5s @ 30fps

// "Whether you're a freelancer, a creative, a growing business, or a solo
// founder, your time is better spent serving clients, building products,
// and growing your business — not recreating invoices from scratch."

const SCATTERED_COUNT = 12;
const FADE_IN_DURATION = 8;

// All entrances (hero + scattered) resolve by this frame — comfortably
// inside the first 2 seconds (60 frames), so the "repetitive admin"
// idea reads immediately.
const ENTRANCE_END = 50;
// The cluttered screen is held only briefly before it resolves — the
// merge, not the clutter, is this scene's visual highlight.
const HOLD_END = 58;
// Everything but the hero dissolves toward center over the remaining
// (majority of the) scene.
const DISSOLVE_END = INVOICE_CLUTTER_DURATION;

// Farther invoices begin converging slightly earlier than nearer ones,
// so despite starting at different times they all arrive at the center
// together — one continuous, intentional gesture instead of a single
// synchronized snap.
const MERGE_STAGGER_SPAN = 20;
const MIN_RADIUS = 120;
const MAX_RADIUS = 420;

const CENTER_X = 1920 / 2;
const CENTER_Y = 1080 / 2;

type Layout = {
  offsetX: number;
  offsetY: number;
  rotation: number;
  scale: number;
  startFrame: number;
  mergeStart: number;
};

// Deterministic scatter + accelerating stagger, computed once at module
// scope so it never changes between frames or re-renders.
const layouts: Layout[] = Array.from({ length: SCATTERED_COUNT }, (_, i) => {
  const seed = `invoice-${i}`;
  const angle = random(`${seed}-angle`) * Math.PI * 2;
  const radius = MIN_RADIUS + random(`${seed}-radius`) * (MAX_RADIUS - MIN_RADIUS);
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

  const normalizedRadius = (radius - MIN_RADIUS) / (MAX_RADIUS - MIN_RADIUS);
  const mergeStart = Math.round(HOLD_END + (1 - normalizedRadius) * MERGE_STAGGER_SPAN);

  return { offsetX, offsetY, rotation, scale, startFrame, mergeStart };
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

        const dissolve = interpolate(
          frame,
          [layout.mergeStart, DISSOLVE_END],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut },
        );

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
