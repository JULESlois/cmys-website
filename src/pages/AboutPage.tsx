import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "../components/Hero";
import { Timeline } from "../components/Timeline";
import { BackgroundMusic } from "../components/BackgroundMusic";

export function AboutPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.hash]);

  return (
    <>
      <BackgroundMusic enableExternalMusicControl />
      <Hero />
      <Timeline />
    </>
  );
}
