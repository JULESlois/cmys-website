import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { HomeQuote } from "../data/homeQuotes";

type HomeQuoteScreenProps = {
  quotes: HomeQuote[];
  headingLevel: "h1" | "h2";
  alignRight?: boolean;
};

export function HomeQuoteScreen({ quotes, headingLevel, alignRight = false }: HomeQuoteScreenProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [quote] = useState(() => {
    if (!quotes || quotes.length === 0) {
      return null;
    }
    return quotes[Math.floor(Math.random() * quotes.length)];
  });
  const Heading = headingLevel;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.72, 1],
    [0, 1, 1, 0],
  );
  const opacity = useSpring(rawOpacity, {
    stiffness: 90,
    damping: 28,
    mass: 0.45,
  });

  return (
    <div
      ref={sectionRef}
      className="min-h-[100svh] snap-always snap-start flex flex-col justify-center px-6 md:px-12"
    >
      {quote && (
        <motion.div
          style={{ opacity: shouldReduceMotion ? 1 : opacity }}
          className={`mx-auto w-full max-w-[1040px] ${
            alignRight ? "md:translate-x-[3vw]" : "md:-translate-x-[3vw]"
          }`}
        >
          <Heading
            className={`text-primary font-cinematic-serif font-normal text-balance leading-[1.42] md:leading-[1.26] tracking-[-0.025em] text-[clamp(1.9rem,8.4vw,3rem)] md:text-[clamp(2.4rem,4.8vw,5.25rem)] ${
              alignRight ? "text-left md:text-right" : "text-left"
            }`}
          >
            {quote.before}
            <Link
              to={quote.href}
              className="home-quote-link transition-colors duration-300 hover:text-secondary focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-4"
            >
              「{quote.linkText}」
            </Link>
            {quote.after}
          </Heading>
        </motion.div>
      )}
    </div>
  );
}
