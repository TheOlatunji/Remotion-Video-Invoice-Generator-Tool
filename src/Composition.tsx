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

// Scenes are appended here one at a time, each approved before the next
// is added. The film's total duration is simply the sum of its scenes.
const SCENE_1_START = 0;
const SCENE_2_START = SCENE_1_START + LOGO_REVEAL_DURATION;
const SCENE_3_START = SCENE_2_START + INVOICE_CLUTTER_DURATION;
const SCENE_4_START = SCENE_3_START + INVOICE_REVEAL_DURATION;
const SCENE_5_START = SCENE_4_START + PROFILE_SYNC_DURATION;

export const FILM_DURATION = SCENE_5_START + CURRENCY_SWITCH_DURATION;

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
