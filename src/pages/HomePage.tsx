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
      <div className="relative bg-canvas">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />
        <div className="relative z-10">
          <HomeQuoteScreen quotes={fortuneQuotes} headingLevel="h1" />
          <HomeQuoteScreen quotes={lifeQuotes} headingLevel="h2" alignRight />
        </div>
      </div>
    </>
  );
}
