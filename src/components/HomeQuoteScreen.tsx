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
      return { id: "empty", before: "", linkText: "进入", after: "", href: "/" as any };
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
      <motion.div
        style={{ opacity: shouldReduceMotion ? 1 : opacity }}
        className={`w-full max-w-[760px] ${alignRight ? "md:ml-auto md:mr-[10%]" : "md:ml-[10%] md:mr-auto"}`}
      >
        <Heading className="text-primary font-cinematic-serif font-medium text-left leading-[1.45] md:leading-[1.35] tracking-[-0.025em] text-[clamp(1.8rem,8vw,2.75rem)] md:text-[clamp(2rem,4.2vw,4.25rem)]">
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
    </div>
  );
}
