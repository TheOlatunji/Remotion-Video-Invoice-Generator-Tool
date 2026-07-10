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
- No bounce, no overshoot, no flashy transitions, no motion blur.
- White space is part of the design; the film should feel expensive.
- Reusable components/utilities over one-off code.
- `interpolate()` with `Easing.bezier` preferred; springs only when
  explicitly asked for, always critically damped (no bounce).

**The film is now feature-complete: all 11 scenes exist, scripted end to
end.** Work since has been targeted revisions to specific scenes (Scene 2
was shortened/re-paced) and infrastructure fixes (a font-loading bug), not
new-scene work. Treat any future "create Scene N" request as building
*past* 11 (a new addition), and any scene-number request ≤11 as a revision
to existing work — always confirm scope before touching anything, and
never modify a scene the user didn't name.

## 2. Tech stack

- React 19 + TypeScript, Remotion `4.0.487` (`@remotion/cli`,
  `@remotion/media` for `<Audio trimBefore>`, `@remotion/fonts` for local
  font loading).
- Composition `StrynderFilm`: **1920×1080, 30fps**, registered in
  `src/Root.tsx`, duration = `FILM_DURATION` from `src/Composition.tsx`
  (every scene's `..._DURATION` constant is summed there in order — change
  one scene's duration and every later scene's start frame recomputes
  automatically; never hand-edit the offsets).
- Font: Plus Jakarta Sans (local variable TTF). Loaded in
  `src/load-fonts.ts` **not** via `@remotion/fonts`'s `loadFont()` anymore
  — the font bytes are embedded as base64 (`src/fonts/plusJakartaSansBase64.ts`)
  and decoded straight into a `FontFace`, with an explicit 120s
  `delayRender` timeout. See §4 for why (three-iteration debugging story).
  Exposed as `fonts.family` in `src/theme.ts`.
- `src/theme.ts` is the shared design system: `colors` (brand violet
  `#5a09fa`→`#7617f3`→`#9728ea`, `pureBlack` for flat scene backgrounds,
  `hairline` for subtle borders), `easeOut`/`easeInOut` bezier curves,
  `criticalSpringConfig`.
- `src/utils/blurReveal.ts` — shared blur-to-focus reveal helper
  (`revealStyle(frame, start, end)`), extracted from Scene 1 so Scene 11
  could reprise the *exact* same animation without duplicating it.
- `src/utils/currencyTiming.ts` (`getCrossfadeStepOpacity`) and
  `src/utils/fieldTiming.ts` (`getFieldOpacities`) — generic N-step
  sequential-crossfade timing helpers, reused across several scenes.
- Assets live in `public/` (fonts, logos as SVG, cropped screenshots as
  PNG, `audio/score.mp3`). Source screenshots are in `ASSETS/SCREENSHOTS/`
  (full-res, uncropped) — scenes crop tightly from these via `ffmpeg` into
  `public/screenshots/` as needed, never using a full raw screenshot
  as-is.
- `ffmpeg` is installed via Homebrew locally (needed for silence-detection
  on the score, cropping screenshots, and testing CSS `hue-rotate()`
  values via ffmpeg's `hue=h=` filter before committing them to scene code).
- Lint/typecheck after every change: `npx tsc` and `npx eslint src` (both
  must be clean). Verification method throughout: render checkpoint
  stills with `npx remotion still StrynderFilm --frame=<n> <out.png>` at
  key frames of each scene and visually inspect them — this is how every
  bug so far has actually been caught.
- **Known local-environment quirk (unrelated to any scene code):** actual
  `npx remotion render` (not `still`) crashes at the audio-merge step with
  `SIGABRT` / `Symbol not found: _AVCaptureDeviceTypeContinuityCamera` —
  the bundled compositor binary requires macOS 15 (Sequoia), and this
  machine runs an older Darwin version. Frame rendering itself completes
  fine; only the final ffmpeg audio-merge inside `renderMedia()` fails.
  This is a pre-existing machine limitation, not a bug to fix in project
  code.

## 3. Scenes (all 11 scripted; durations reflect the Scene 2 revision)

Film is a running `Sequence` timeline in `src/Composition.tsx`. Current
cumulative frame offsets (after Scene 2 was shortened): Scene1 ends at
150, Scene2 at 300, Scene3 at 480, Scene4 at 780, Scene5 at 1080, Scene6 at
1320, Scene7 at 1680, Scene8 at 1980, Scene9 at 2280, Scene10 at 2580,
Scene11 at 2820 = current `FILM_DURATION` (2820 frames / 94s @ 30fps).

**Scene 1 — Logo Reveal** (`scenes/01-logo-reveal/LogoReveal.tsx`, 150f/5s)
Pure black. 1.5s hold, then the Strynder icon (public/logos/strynder-icon.svg)
blur-to-focus reveals (frames 45–80), then the "Strynder" wordmark
blur-to-focus reveals (frames 100–135) — via the shared `revealStyle()`
helper in `utils/blurReveal.ts`. No gradients/glow/bounce/camera movement.
Music cue: `<Audio src="audio/score.mp3">` starts at `PIANO_CUE_FRAME`
(=icon reveal start), `trimBefore` set to skip the file's real ~1.65s of
leading silence.

**Scene 2 — Invoice Clutter** (`scenes/02-invoice-clutter/InvoiceClutter.tsx`,
**150f/5s — revised down from the original 330f/11s**, see below) Reusable
`InvoiceOutline` component (abstract line-art invoice card, no real text).
One "hero" invoice card at dead center, present the whole scene, never
moves. 12 more scattered around it (tighter radius than the original, for
density) via deterministic `random()` seeds, arriving fast (all within
~1.7s) with an ease-out staggered cadence; then all 12 dissolve back into
the hero over the *majority* of the scene, each one's convergence
distance-staggered (farther invoices start gliding home earlier so they
all arrive together) — no bounce, no blur, translate+opacity only. No
camera move.

*Revision history:* the original version used 28 scattered invoices
building up over ~7.7s before a rushed ~2.4s merge at the very end — the
user found it too long/repetitive with a weak merge payoff. Revised to: 5s
total, 12 invoices, full clutter legible within 2s, and the merge
re-balanced to be the scene's actual visual highlight (~61% of the runtime
vs. ~22% before), with the distance-staggered convergence added for
elegance. Only this one file was touched; every later scene's start frame
shifted automatically via the `Composition.tsx` duration arithmetic.

**Scene 3 — Invoice Reveal** (`scenes/03-invoice-reveal/InvoiceReveal.tsx`,
180f/6s) Continuity: starts on the exact same hero invoice card Scene 2
ends on. It grows + cross-dissolves into a real screenshot
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
(source highlights → dest highlights → both fade out) chained back-to-back
with zero overlap. Reusable: `utils/fieldTiming.ts` (`getFieldOpacities`),
`components/FieldHighlight.tsx`, `components/ScreenshotPanel.tsx`. Known
compromise (flagged to user): the Profile screenshot doesn't show a Bank
field, so the Profile panel has extra plain-white filler height below the
real screenshot and the Bank highlight sits there — seamless since the
background matches.

**Scene 5 — Currency Switch** (`scenes/05-currency-switch/CurrencySwitch.tsx`,
300f/10s) Two real UI fragments cropped from `CREATING AN INVOICE.png`:
the Currency dropdown (`currency-selector.png`) and the Total row
(`total-row.png`), stacked, static composite. One slow camera zoom in
(scale 1→2.0) → hold → currency crossfades **₦ → $ → £** in the dropdown
with the Total value crossfading in sync → slow zoom back out. Reusable:
`utils/currencyTiming.ts` (`getCrossfadeStepOpacity`),
`components/CrossfadeText.tsx`. **Bug fixed here (lesson applied since):**
occlusion boxes sized to measured text bounds let right-aligned glyphs
overflow slightly — invisible at rest, visible at 2x zoom. Fix: size
occlusion/text boxes with generous margin, anchored on the alignment edge,
and always spot-check at max camera zoom.

**Scene 6 — VAT Toggle** (`scenes/06-vat-toggle/VatToggle.tsx`, 240f/8s)
Custom minimal centered card (not a screenshot — brief asked for exactly 4
elements only): VAT toggle row, Subtotal, VAT, Grand Total. Reusable
`components/ToggleSwitch.tsx` (progress-driven, track color crossfades
between two overlaid pills rather than tweening a color string). Sequence:
toggle flips on → hold → VAT line fades in (space reserved from frame 0 so
nothing reflows) → hold → Grand Total crossfades $400.00→$430.00 (plain
opacity swap, no rolling numbers) → final hold.

**Scene 7 — Brand Color Reveal** (`scenes/07-brand-color-reveal/BrandColorReveal.tsx`,
360f/12s) The film's emotional high point. Split screen cropped from the
real "Creating an Invoice" screenshot: `editor-panel.png` (Invoice details
card + the 8 real header-color swatches) left, `live-preview-panel.png`
(full invoice preview) right. The baked-in orange selection ring is
patched out (white eraser circle + flat-color redraw) and the navy preset
is repainted Strynder-violet, so a custom `SelectionRing` overlay can move
freely between presets. **Key technique:** the invoice preview recolors
via CSS `filter: hue-rotate()` crossfaded across stacked `<Img>` layers —
reuses `getCrossfadeStepOpacity` from Scene 5 — so one screenshot produces
convincing blue/green/purple/orange states with no extra assets. Sequence
(5 steps: orange[default]→blue→green→orange→purple) is two tracks phase-
offset by a fixed gap: the swatch selection ring moves first, then — after
a pause — the preview recolors, repeating per color. Ends with the preview
scaling up (uniform CSS `scale`, no distortion) to fill the frame while the
editor fades away, landing full-bleed on Strynder purple.

**Scene 8 — PDF Ready** (`scenes/08-pdf-ready/PdfReady.tsx`, 300f/10s)
Continuity with Scene 7: same invoice, still purple (same `hue-rotate`
trick, reusing `live-preview-panel.png`), now a single floating "PDF" card
on black. Sequence: soft blurred shadow fades in beneath the card (the
"becomes floating" moment) → a small violet checkmark badge scales in
(critically damped spring, no bounce) at the card's corner → the check
mark itself draws via animated SVG `stroke-dashoffset` → "Ready to Send"
headline fades in → long hold. No camera movement.

**Scene 9 — Invoice History** (`scenes/09-invoice-history/InvoiceHistory.tsx`,
300f/10s) Real Invoices/history screenshot (`history-panel.png`, cropped
from `HISTORY.png`), static and centered, no camera move. **Note:** the
brief asked for both a "Dashboard" and an "Invoice History" screenshot,
but only one real asset exists on disk for this (`HISTORY.png`) — used it
for both rather than fabricating a dashboard UI; flagged to the user.
The 3 real saved invoice rows each start hidden behind a plain white
cover and reveal one at a time via pure opacity fade (never a slide, never
a bounce) — order calmly replacing Scene 2's chaos.

**Scene 10 — Typography Close** (`scenes/10-typography-close/TypographyClose.tsx`,
300f/10s) The film's only white-background scene, pure typography, no
graphics. Three lines ("Simple." / "Professional." / "Built for the way
African businesses work.") each fade in, hold, and fade **fully out**
before the next begins (a clean gap, not an overlapping crossfade) — the
third line holds far longer than the first two (105 of 300 frames).

**Scene 11 — Closing CTA** (`scenes/11-closing-cta/ClosingCta.tsx`, 240f/8s)
Bookend of Scene 1, reusing the shared `utils/blurReveal.ts` helper so the
icon (frames 45–80) and wordmark (100–135) reveal on *exactly* the same
timing/style as Scene 1. Then "Build yours with Strynder." fades in, then
"strynder.com" below it — both reserved in the layout from frame 0 (opacity
0) so the logo/wordmark never shift when they appear. Holds, then fades the
whole frame to black — the film's final frame. **Known compromise:**
the brief asked for a literal "hold for two seconds" on the final CTA, but
fitting the exact Scene-1 timing + a real fade-to-black inside the stated
8-second scene duration only left room for a ~0.7s hold; the numeric
8-second duration was prioritized over the literal "two seconds" phrase.

## 4. Infrastructure fixes (not scene content)

**Font-loading production bug (fixed — took three iterations to fully
resolve):** `src/load-fonts.ts` originally wrapped `@remotion/fonts`'s
`loadFont()` in a redundant manual `delayRender()`/`continueRender()`
pair (loadFont() already manages that lifecycle internally — neither this
project's Remotion skill docs nor the library itself expect a manual
wrapper). Removing that redundancy was a real bug fix but **did not fully
solve it**: a genuine full-length `npx remotion render` (2820 frames,
default concurrency 8x) still hung on font loading mid-render (first at
frame 810, via `loadFont()`'s own internal delayRender this time).
Switched to a manual `fetch()` + `AbortController` + retry wrapper — still
hung (at frame 1326), and the very first fetch attempt never even
triggered the abort/retry logic, proving a stalled request can't be
relied upon to honor cancellation in this environment. Eliminated the
network dependency entirely by embedding the font as a base64 string
directly in the JS bundle (`src/fonts/plusJakartaSansBase64.ts`, generated
from `public/fonts/PlusJakartaSans-Variable.ttf` via
`base64 -i ... | tr -d '\n'`) and decoding it synchronously to an
`ArrayBuffer` for `FontFace` — **still hung, at almost the same frame
(798)**, which is what actually proved the root cause: this machine
renders at concurrency 8 on an 8-physical-core CPU (i9-9980HK), so 8 tabs
simultaneously rendering frames + rasterizing fonts + JPEG-encoding leaves
no CPU scheduling headroom at their synchronized page-recycle points —
the font decode itself is fast, it just occasionally isn't *scheduled* in
time to beat Remotion's default 30s `delayRender` timeout. Final fix:
kept the base64 embedding (removes the network variable entirely, good
practice regardless) **and** explicitly set `timeoutInMilliseconds: 120000`
on the `delayRender()` call in `load-fonts.ts` to give real headroom for
scheduling delays under CPU contention. **Verified with a genuine full
`npx remotion render` of all 2820 frames at default concurrency — 0
`delayRender` errors, "Rendered 2820/2820" in 99.5s.** (The render then
hits the unrelated pre-existing macOS-15 compositor/audio-merge SIGABRT
from §2 — that part is a machine limitation, not a code bug, and rendering
completed before it.)

**Lesson for the future:** don't trust a fix for a `delayRender` timeout
until it's verified against a real, full-length, full-concurrency
`npx remotion render` — a quick still or a short frame range can pass while
the actual bug (CPU contention across many concurrent tabs) only surfaces
deep into a long render. Also: never wrap `loadFont()` (from either
`@remotion/fonts` or `@remotion/google-fonts`) in a manual delayRender
pair — both self-manage that lifecycle.

**Producing the final MP4 on this machine (the render workflow):** a normal
`npx remotion render StrynderFilm out/x.mp4` renders all 2820 frames fine
but then **always** dies at the audio-merge/stitch step with the macOS-15
compositor SIGABRT (`_AVCaptureDeviceTypeContinuityCamera`, see §2) —
because Remotion's *bundled* ffmpeg (in `@remotion/compositor-darwin-x64`)
requires macOS 15 and this machine is older. The system Homebrew ffmpeg
(`/usr/local/bin/ffmpeg`, v8.1.2) works fine, so the working pipeline is a
two-step **image-sequence + manual stitch** that never invokes the broken
binary:

1. Render frames as a PNG sequence (this path does NOT call the bundled
   ffmpeg for stitching, so it completes cleanly):
   `npx remotion render StrynderFilm --sequence --image-format=png out/frames`
   → produces `out/frames/element-0000.png` … `element-2819.png`
   (zero-padded to 4 digits because there are 2820 frames; a short test
   render pads to fewer digits — always check the actual width).
2. Stitch + mux the score with the system ffmpeg. Audio math: video is
   2820f/30fps = 94.0s; score enters at frame 45 = 1.5s (`adelay=1500`),
   playing `public/audio/score.mp3` from a 49-frame = 1.6333s offset
   (`atrim=start=1.633333`), hard-cut at 94s to match how Remotion cuts the
   audio Sequence at composition end:
   ```
   ffmpeg -y -framerate 30 -start_number 0 -i "out/frames/element-%04d.png" \
     -i public/audio/score.mp3 \
     -filter_complex "[1:a]atrim=start=1.633333,asetpts=PTS-STARTPTS,adelay=1500:all=1[a]" \
     -map 0:v -map "[a]" \
     -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p \
     -c:a aac -b:a 320k -t 94 -movflags +faststart \
     out/StrynderFilm.mp4
   ```
   Verified output: 1920×1080, 30fps, h264+aac stereo, exactly 94.0s, audio
   silent until 1.5s then full signal (volumedetect: -91dB → -11.9dB),
   frame order/content/font all correct. Final file ~7.5MB.

`out/frames/` (~288MB of intermediate PNGs) is safe to delete after
stitching. The real fix for doing plain one-command `remotion render` is
to render on a macOS-15+ machine or CI — nothing in the project code can
work around a binary that won't run on this OS.

## 5. Current state / what's next

All 11 scenes exist and are wired into `Composition.tsx`
(`FILM_DURATION` = 2820 frames / 94s). Scene 2 has been revised once per
user feedback (shortened + re-paced). The font-loading production bug is
fixed and verified against a genuine full-length render. **Nothing is
broken or mid-fix right now.**

No outstanding TODOs, no known bugs in project code (the macOS-15
compositor/audio-merge limitation in §2 is a machine constraint, not a
code bug). Next action when resumed: wait for the user's direction —
could be a revision to any existing scene (confirm which one, touch only
that one, per the established "only modify what's named" pattern), a
request to render/export the film, or a new Scene 12+ brief. Do not
invent scene content or assume the film needs more scenes — 11 was the
originally scoped full film.
