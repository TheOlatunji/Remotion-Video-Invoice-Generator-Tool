import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ScreenshotPanel } from "../../components/ScreenshotPanel";
import { FieldHighlight, Rect } from "../../components/FieldHighlight";
import {
  FIELD_CYCLE_LENGTH,
  getFieldOpacities,
} from "../../utils/fieldTiming";
import { colors, easeOut } from "../../theme";

export const PROFILE_SYNC_DURATION = 300; // 10s @ 30fps

// "Simply save your business information once, and it automatically
// appears every time you create a new invoice."

const PANELS_IN_END = 18;
const FIELDS_START = 26;

const PANEL_HEIGHT = 860;

// Profile screenshot has no visible "Bank" section (the page was captured
// only down to Email) — the panel is extended with plain white fill below
// the real screenshot so the Bank field still has somewhere to live.
const PROFILE_IMAGE_WIDTH = 614;
const PROFILE_IMAGE_HEIGHT = 741;
const PROFILE_EXTENSION_HEIGHT = PANEL_HEIGHT - PROFILE_IMAGE_HEIGHT;

const DEST_IMAGE_WIDTH = 617;
const DEST_IMAGE_HEIGHT = 860;

const GAP = 100;
const TOTAL_WIDTH = PROFILE_IMAGE_WIDTH + GAP + DEST_IMAGE_WIDTH;
const LEFT_X = 1920 / 2 - TOTAL_WIDTH / 2;
const RIGHT_X = LEFT_X + PROFILE_IMAGE_WIDTH + GAP;
const PANEL_TOP = 1080 / 2 - PANEL_HEIGHT / 2;

type FieldDef = { label: string; source: Rect; dest: Rect };

// Rects measured directly against the cropped assets at the display
// sizes above (profile-fields.png at 614x741, invoice-live-preview.png
// at 617x860).
const FIELDS: FieldDef[] = [
  {
    label: "Business Name",
    source: { left: 318, top: 199, width: 278, height: 24 },
    dest: { left: 117, top: 31, width: 116, height: 27 },
  },
  {
    label: "Owner",
    source: { left: 21, top: 199, width: 278, height: 24 },
    dest: { left: 117, top: 98, width: 63, height: 16 },
  },
  {
    label: "Logo",
    source: { left: 21, top: 331, width: 71, height: 69 },
    dest: { left: 36, top: 36, width: 63, height: 63 },
  },
  {
    label: "Email",
    source: { left: 318, top: 683, width: 278, height: 24 },
    dest: { left: 36, top: 234, width: 176, height: 16 },
  },
  {
    label: "Phone",
    source: { left: 21, top: 683, width: 278, height: 24 },
    dest: { left: 36, top: 207, width: 122, height: 16 },
  },
  {
    label: "Bank",
    source: { left: 21, top: 785, width: 575, height: 30 },
    dest: { left: 36, top: 663, width: 532, height: 142 },
  },
  {
    label: "Address",
    source: { left: 21, top: 603, width: 575, height: 55 },
    dest: { left: 36, top: 181, width: 89, height: 16 },
  },
];

export const ProfileSync: React.FC = () => {
  const frame = useCurrentFrame();

  const panelsOpacity = interpolate(frame, [0, PANELS_IN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.pureBlack }}>
      <div style={{ position: "absolute", left: LEFT_X, top: PANEL_TOP }}>
        <ScreenshotPanel
          src="screenshots/profile-fields.png"
          width={PROFILE_IMAGE_WIDTH}
          height={PROFILE_IMAGE_HEIGHT}
          extensionHeight={PROFILE_EXTENSION_HEIGHT}
          opacity={panelsOpacity}
        >
          {FIELDS.map((field, i) => {
            const { source } = getFieldOpacities(
              frame,
              FIELDS_START + i * FIELD_CYCLE_LENGTH,
            );
            return (
              <FieldHighlight
                key={field.label}
                rect={field.source}
                opacity={source}
              />
            );
          })}
        </ScreenshotPanel>
      </div>

      <div style={{ position: "absolute", left: RIGHT_X, top: PANEL_TOP }}>
        <ScreenshotPanel
          src="screenshots/invoice-live-preview.png"
          width={DEST_IMAGE_WIDTH}
          height={DEST_IMAGE_HEIGHT}
          opacity={panelsOpacity}
        >
          {FIELDS.map((field, i) => {
            const { dest } = getFieldOpacities(
              frame,
              FIELDS_START + i * FIELD_CYCLE_LENGTH,
            );
            return (
              <FieldHighlight
                key={field.label}
                rect={field.dest}
                opacity={dest}
              />
            );
          })}
        </ScreenshotPanel>
      </div>
    </AbsoluteFill>
  );
};
