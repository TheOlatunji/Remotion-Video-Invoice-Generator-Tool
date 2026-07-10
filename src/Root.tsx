import "./index.css";
import "./load-fonts";
import { Composition } from "remotion";
import { FILM_DURATION, MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StrynderFilm"
        component={MyComposition}
        durationInFrames={FILM_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
