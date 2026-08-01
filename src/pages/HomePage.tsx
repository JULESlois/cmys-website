import { useLayoutEffect } from "react";
import { BackgroundMusic } from "../components/BackgroundMusic";
import { HomeQuoteScreen } from "../components/HomeQuoteScreen";
import { fortuneQuotes, lifeQuotes } from "../data/homeQuotes";

export function HomePage() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    const previousScrollSnapType = root.style.scrollSnapType;
    root.style.scrollBehavior = "auto";
    root.style.scrollSnapType = "none";
    root.scrollTop = 0;
    document.body.scrollTop = 0;

    let restoreFrame = 0;
    const resetFrame = window.requestAnimationFrame(() => {
      root.scrollTop = 0;
      restoreFrame = window.requestAnimationFrame(() => {
        root.scrollTop = 0;
        root.style.scrollBehavior = previousScrollBehavior;
        root.style.scrollSnapType = previousScrollSnapType;
      });
    });

    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.cancelAnimationFrame(restoreFrame);
      root.style.scrollBehavior = previousScrollBehavior;
      root.style.scrollSnapType = previousScrollSnapType;
    };
  }, []);

  return (
    <>
      <BackgroundMusic enableExternalMusicControl />
      <HomeQuoteScreen quotes={fortuneQuotes} headingLevel="h1" />
      <HomeQuoteScreen quotes={lifeQuotes} headingLevel="h2" alignRight />
    </>
  );
}
