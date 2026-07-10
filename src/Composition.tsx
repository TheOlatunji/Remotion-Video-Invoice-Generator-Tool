import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  LOGO_REVEAL_DURATION,
  LogoReveal,
  PIANO_CUE_FRAME,
} from "./scenes/01-logo-reveal/LogoReveal";
import {
  INVOICE_CLUTTER_DURATION,
  InvoiceClutter,
} from "./scenes/02-invoice-clutter/InvoiceClutter";
import {
  INVOICE_REVEAL_DURATION,
  InvoiceReveal,
} from "./scenes/03-invoice-reveal/InvoiceReveal";
import {
  PROFILE_SYNC_DURATION,
  ProfileSync,
} from "./scenes/04-profile-sync/ProfileSync";
import {
  CURRENCY_SWITCH_DURATION,
  CurrencySwitch,
} from "./scenes/05-currency-switch/CurrencySwitch";
import {
  VAT_TOGGLE_DURATION,
  VatToggle,
} from "./scenes/06-vat-toggle/VatToggle";
import {
  BRAND_COLOR_REVEAL_DURATION,
  BrandColorReveal,
} from "./scenes/07-brand-color-reveal/BrandColorReveal";
import { PDF_READY_DURATION, PdfReady } from "./scenes/08-pdf-ready/PdfReady";
import {
  INVOICE_HISTORY_DURATION,
  InvoiceHistory,
} from "./scenes/09-invoice-history/InvoiceHistory";
import {
  TYPOGRAPHY_CLOSE_DURATION,
  TypographyClose,
} from "./scenes/10-typography-close/TypographyClose";
import { CLOSING_CTA_DURATION, ClosingCta } from "./scenes/11-closing-cta/ClosingCta";

// Scenes are appended here one at a time, each approved before the next
// is added. The film's total duration is simply the sum of its scenes.
const SCENE_1_START = 0;
const SCENE_2_START = SCENE_1_START + LOGO_REVEAL_DURATION;
const SCENE_3_START = SCENE_2_START + INVOICE_CLUTTER_DURATION;
const SCENE_4_START = SCENE_3_START + INVOICE_REVEAL_DURATION;
const SCENE_5_START = SCENE_4_START + PROFILE_SYNC_DURATION;
const SCENE_6_START = SCENE_5_START + CURRENCY_SWITCH_DURATION;
const SCENE_7_START = SCENE_6_START + VAT_TOGGLE_DURATION;
const SCENE_8_START = SCENE_7_START + BRAND_COLOR_REVEAL_DURATION;
const SCENE_9_START = SCENE_8_START + PDF_READY_DURATION;
const SCENE_10_START = SCENE_9_START + INVOICE_HISTORY_DURATION;
const SCENE_11_START = SCENE_10_START + TYPOGRAPHY_CLOSE_DURATION;

export const FILM_DURATION = SCENE_11_START + CLOSING_CTA_DURATION;

// score.mp3 has ~1.65s of near-silence before its first audible note
// (confirmed via `ffmpeg -af silencedetect`, threshold from loudnorm:
// silence_start 0 -> silence_end 1.653787s). Trim it off so the audible
// note lands exactly on PIANO_CUE_FRAME instead of ~1.65s late.
const SCORE_LEAD_SILENCE_SECONDS = 1.653787;
const SCORE_FPS = 30;
const SCORE_TRIM_BEFORE = Math.floor(SCORE_LEAD_SILENCE_SECONDS * SCORE_FPS);

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={LOGO_REVEAL_DURATION}>
        <LogoReveal />
      </Sequence>

      <Sequence from={SCENE_2_START} durationInFrames={INVOICE_CLUTTER_DURATION}>
        <InvoiceClutter />
      </Sequence>

      <Sequence from={SCENE_3_START} durationInFrames={INVOICE_REVEAL_DURATION}>
        <InvoiceReveal />
      </Sequence>

      <Sequence from={SCENE_4_START} durationInFrames={PROFILE_SYNC_DURATION}>
        <ProfileSync />
      </Sequence>

      <Sequence from={SCENE_5_START} durationInFrames={CURRENCY_SWITCH_DURATION}>
        <CurrencySwitch />
      </Sequence>

      <Sequence from={SCENE_6_START} durationInFrames={VAT_TOGGLE_DURATION}>
        <VatToggle />
      </Sequence>

      <Sequence from={SCENE_7_START} durationInFrames={BRAND_COLOR_REVEAL_DURATION}>
        <BrandColorReveal />
      </Sequence>

      <Sequence from={SCENE_8_START} durationInFrames={PDF_READY_DURATION}>
        <PdfReady />
      </Sequence>

      <Sequence from={SCENE_9_START} durationInFrames={INVOICE_HISTORY_DURATION}>
        <InvoiceHistory />
      </Sequence>

      <Sequence from={SCENE_10_START} durationInFrames={TYPOGRAPHY_CLOSE_DURATION}>
        <TypographyClose />
      </Sequence>

      <Sequence from={SCENE_11_START} durationInFrames={CLOSING_CTA_DURATION}>
        <ClosingCta />
      </Sequence>

      {/*
        Score enters on the first piano note, timed to land exactly as the
        mark starts to resolve out of the dark. The file's leading silence
        is trimmed off so the audible note — not the start of the file —
        lands on PIANO_CUE_FRAME.
      */}
      <Sequence from={PIANO_CUE_FRAME}>
        <Audio
          src={staticFile("audio/score.mp3")}
          trimBefore={SCORE_TRIM_BEFORE}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
