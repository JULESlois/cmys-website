import { Hero } from "../components/Hero";
import { Timeline } from "../components/Timeline";
import { BackgroundMusic } from "../components/BackgroundMusic";

export function HomePage() {
  return (
    <>
      <BackgroundMusic enableExternalMusicControl />
      <Hero />
      <Timeline />
    </>
  );
}
