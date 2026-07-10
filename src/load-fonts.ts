import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

export const FONT_FAMILY = "Plus Jakarta Sans";

const handle = delayRender("Loading Plus Jakarta Sans");

loadFont({
  family: FONT_FAMILY,
  url: staticFile("fonts/PlusJakartaSans-Variable.ttf"),
  weight: "200 800",
})
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error("Failed to load font", err);
    continueRender(handle);
  });
