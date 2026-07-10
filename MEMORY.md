# Project Memory — Strynder Invoice Generator Launch Film

Last updated: 2026-07-10. This file exists purely to survive context
compaction/loss — re-read this before resuming work on the film.

## 1. What this project is

A premium, cinematic launch/promo video for the **Strynder Invoice
Generator** (a real invoicing web app). Visual bar: Stripe / Apple / Arc /
Linear / Framer / Vercel. Built scene-by-scene in Remotion, with the user
approving each scene before the next is started. Global rules that apply
to every scene unless a scene's own brief overrides them:

- One movement at a time — never animate two unrelated things
  simultaneously.
- Camera movement (when present) is extremely slow.
- Typography never moves while the camera moves.
- No bounce, no overshoot, no flashy transitions.
- White space is part of the design; the film should feel expensive.
- Reusable components/utilities over one-off code.
- `interpolate()` with `Easing.bezier` preferred; springs only when
  explicitly asked for, always critically damped (no bounce).

## 2. Tech stack

- React 19 + TypeScript, Remotion `4.0.487` (`@remotion/cli`,
  `@remotion/media` for `<Audio trimBefore>`, `@remotion/fonts` for local
  font loading).
- Composition `StrynderFilm`: **1920×1080, 30fps**, registered in
  `src/Root.tsx`, duration = `FILM_DURATION` from `src/Composition.tsx`
  (scenes are summed there in order).
- Font: Plus Jakarta Sans (local variable TTF), loaded in
  `src/load-fonts.ts` via `@remotion/fonts` `loadFont()` +
  `delayRender`/`continueRender`. Exposed as `fonts.family` in
  `src/theme.ts`.
- `src/theme.ts` is the shared design system: `colors` (brand violet
  `#5a09fa`→`#7617f3`→`#9728ea`, `pureBlack` for flat scene backgrounds,
  `hairline` for subtle borders), `easeOut`/`easeInOut` bezier curves,
  `criticalSpringConfig`.
- Assets live in `public/` (fonts, logos as SVG, cropped screenshots as
  PNG, `audio/score.mp3`). Source screenshots are in `ASSETS/SCREENSHOTS/`
  (full-res, uncropped) — scenes crop tightly from these via `ffmpeg` into
  `public/screenshots/` as needed, never using a full raw screenshot
  as-is.
- `ffmpeg` is installed via Homebrew locally (was needed for
  silence-detection on the score and for cropping screenshots).
- Lint/typecheck after every change: `npx tsc` and `npx eslint src` (both
  must be clean). Verification method throughout: render checkpoint
  stills with `npx remotion still StrynderFilm --frame=<n> <out.png>` at
  key frames of each scene and visually inspect them — this is how every
  bug so far (including the Scene 5 one below) was actually caught.

## 3. Scenes completed so far (all approved except where noted)

Film is a running `Sequence` timeline in `src/Composition.tsx`; each
scene exports its own `..._DURATION` constant and component. Cumulative
frame offsets so far: Scene1 ends at 150, Scene2 at 480, Scene3 at 660,
Scene4 at 960, Scene5 at 1260 (current `FILM_DURATION`).

**Scene 1 — Logo Reveal** (`scenes/01-logo-reveal/LogoReveal.tsx`, 150f/5s)
Pure black. 1.5s hold, then the Strynder icon (public/logos/strynder-icon.svg)
blur-to-focus reveals, then the "Strynder" wordmark blur-to-focus reveals.
No gradients/glow/bounce/camera movement — spec was very literal about this.
Music cue: `<Audio src="audio/score.mp3">` starts at `PIANO_CUE_FRAME`
(=icon reveal start), `trimBefore` set to skip the file's real ~1.65s of
leading silence (confirmed via `ffmpeg -af silencedetect`, documented in
`Composition.tsx`).

**Scene 2 — Invoice Clutter** (`scenes/02-invoice-clutter/InvoiceClutter.tsx`,
330f/11s) Reusable `InvoiceOutline` component (abstract line-art invoice
card, no real text). One "hero" invoice card at dead center, present the
whole scene, never moves. 28 more scattered around it via deterministic
`random()` seeds, fading in one at a time with accelerating cadence
(ease-out pacing curve), building visual clutter; then all 28 collectively
dissolve + translate back into the hero, leaving only it. No camera move.

**Scene 3 — Invoice Reveal** (`scenes/03-invoice-reveal/InvoiceReveal.tsx`,
180f/6s) Continuity: starts on the exact same hero invoice card Scene 2
ended on. It grows + cross-dissolves into a real screenshot
(`public/screenshots/invoice-preview.png`, cropped from `PREVIEW.png`).
Then one slow camera push-in (scale 1→1.045). Once camera fully stops,
headline "Strynder Invoice Generator" fades in (opacity only), then a
violet gradient accent line grows in beneath it.

**Scene 4 — Profile Sync** (`scenes/04-profile-sync/ProfileSync.tsx`,
300f/10s) Two screenshot panels side by side, static, no camera move:
Profile page (`profile-fields.png`, cropped from `PROFILE.png`) and the
New Invoice live-preview (`invoice-live-preview.png`, cropped from
`CREATING AN INVOICE.png`). 7 fields — **Business Name, Owner, Logo,
Email, Phone, Bank, Address** — each get their own 38-frame cycle
(source highlights → dest highlights → both fade out) chained
back-to-back with zero overlap. Reusable: `utils/fieldTiming.ts`
(`getFieldOpacities`), `components/FieldHighlight.tsx`,
`components/ScreenshotPanel.tsx`. Known compromise (flagged to user):
the Profile screenshot doesn't show a Bank field (page wasn't captured
that far down), so the Profile panel is rendered with extra plain-white
filler height below the real screenshot and the Bank highlight sits
there — seamless since the background matches.

**Scene 5 — Currency Switch** (`scenes/05-currency-switch/CurrencySwitch.tsx`,
300f/10s) Two real UI fragments cropped from `CREATING AN INVOICE.png`:
the actual Currency dropdown (`currency-selector.png`) and the Total row
(`total-row.png`), stacked, static composite. One slow camera zoom in
(scale 1→2.0, anchored near the selector) → hold → currency crossfades
**₦ → $ → £** in the dropdown with the Total value crossfading in sync
(`₦0.00`→`$0.00`→`£0.00`), each held ~1.1s with ~0.4s crossfades → slow
zoom back out. Reusable: `utils/currencyTiming.ts`
(`getCrossfadeStepOpacity`, generic N-step sequential crossfade),
`components/CrossfadeText.tsx`.

**Bug fixed in Scene 5 (worth remembering the lesson):** overlay boxes
that occlude the original screenshot text ("NGN", "₦0.00") and draw our
own crossfading text on top were sized to the *measured* text bounds.
The actual rendered glyphs (right-aligned via `justifyContent:'flex-end'`)
overflowed those bounds slightly. This was invisible at rest but showed
as small stray marks once the camera zoomed 2x. Root cause found by
methodically bisecting (removed panels one at a time, temporarily set
occlusion background to bright red to see exact box edges, disabled zoom
to prove it wasn't scale-dependent, checked raw source crops at high
zoom to rule out the screenshot itself). Fix: widen the occlusion/text
container boxes generously with their *right* edge anchored (since text
is right-aligned) instead of trying to tightly fit the measured bounds.
General lesson for future scenes: when overlaying replacement text on a
cropped screenshot fragment, size the occlusion box with generous margin,
not tight-fitted — and always spot-check at the *maximum* camera zoom
level used in that scene, not just at rest scale.

## 4. Current state / what's next

Scene 5 is complete, verified (tsc/eslint clean, checkpoint stills
confirmed clean across all three currency states and both zoom extremes),
and was reported to the user as done. **Nothing is broken or mid-fix
right now.** Per the standing instruction ("stop after completing a
scene, wait for approval"), we are paused waiting for the user to review
Scene 5 and either request changes or say "Create Scene 6" (with its own
brief, not yet given).

No outstanding TODOs, no known bugs, no uncommitted risky state. Next
action when resumed: wait for the user's Scene 6 brief (duration, voice
over, visual description) — do not invent scene content proactively.
