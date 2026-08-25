import { Hero } from "../components/Hero";
import { Timeline } from "../components/Timeline";
import { BackgroundMusic } from "../components/BackgroundMusic";

export function AboutPage() {
  return (
    <>
      <BackgroundMusic enableExternalMusicControl />
      <Hero />
      <Timeline />
    </>
  );
}
