import { BackgroundMusic } from "../components/BackgroundMusic";
import { HomeQuoteScreen } from "../components/HomeQuoteScreen";
import { fortuneQuotes, lifeQuotes } from "../data/homeQuotes";

export function HomePage() {
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
