import { BackgroundMusic } from "../components/BackgroundMusic";
import { HomeQuoteScreen } from "../components/HomeQuoteScreen";
import { fortuneQuotes, lifeQuotes } from "../data/homeQuotes";

export function HomePage() {
  return (
    <>
      <BackgroundMusic enableExternalMusicControl />
      <HomeQuoteScreen quotes={fortuneQuotes} />
      <HomeQuoteScreen quotes={lifeQuotes} alignRight />
    </>
  );
}
