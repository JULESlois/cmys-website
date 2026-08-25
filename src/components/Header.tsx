import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "../lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

type NavLinkItem = {
  name: string;
  path: string;
};

export function Header() {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  
  const height = useTransform(scrollYProgress, [0, 0.2], ["15vh", "8vh"]);
  const logoScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);
  const logoLetterSpacing = useTransform(scrollYProgress, [0, 0.2], ["-0.05em", "0.2em"]);
  const logoFontWeight = useTransform(scrollYProgress, [0, 0.2], ["700", "400"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const isGachaPage = location.pathname === "/gacha";
  const isLifePage = location.pathname === "/life";
  const showNavLinks = location.pathname === "/" || location.pathname === "/about";
  const headerY = useTransform(scrollYProgress, [0.85, 0.9], ["0%", isGachaPage ? "0%" : "-100%"]);
  const headerOpacity = useTransform(scrollYProgress, [0.85, 0.9], [1, isGachaPage ? 1 : 0]);
  const scrollBehavior: ScrollBehavior = shouldReduceMotion ? "auto" : "smooth";

  const navLinks: NavLinkItem[] = [
    { name: "纯墨韵声", path: "/about#roots" },
    { name: "驰鸣羽势", path: "/about#growth" },
    { name: "聪明一世", path: "/gacha" },
    { name: "沉默一生", path: "/life" },
  ];

  const handleNavClick = (link: NavLinkItem) => {
    if (link.path.includes("#")) {
      const [pathname, hash] = link.path.split("#");
      if (location.pathname !== pathname) {
        navigate(link.path);
      } else {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: scrollBehavior, block: "start" });
        }
      }
    } else {
      navigate(link.path);
    }
  };

  const isActiveLink = (link: NavLinkItem) => {
    if (link.path === "/gacha" || link.path === "/life") {
      return location.pathname === link.path;
    }
    return false;
  };

  return (
    <motion.header
      style={
        shouldReduceMotion
          ? { height: "8vh", y: "0%", opacity: 1 }
          : { height, y: headerY, opacity: headerOpacity }
      }
      className={`header-hover-reveal fixed top-0 left-0 w-full z-50 flex items-center border-b border-primary/10 px-6 overflow-hidden transition-all duration-300 ${
        isLifePage ? "hidden" : ""
      }`}
    >
      <div className="w-full grid grid-cols-3 items-center h-full">
        {/* Left Nav */}
        <nav className="desktop-hover-nav gap-8 items-center h-full transition-opacity duration-300">
          {!isGachaPage && showNavLinks && navLinks.slice(0, 2).map((link) => (
            <NavLink
              key={link.name}
              name={link.name}
              onClick={() => handleNavClick(link)}
              isActive={isActiveLink(link)}
            />
          ))}
        </nav>
        <div className="md:hidden" />

        {/* Center Logo */}
        <motion.div
          style={shouldReduceMotion ? undefined : { scale: logoScale }}
          className={`flex justify-center items-center ${isLifePage ? "md:opacity-0 pointer-events-none" : ""}`}
        >
          <button 
            onClick={() => {
              if (location.pathname !== "/") {
                navigate("/");
              } else {
                window.scrollTo({ top: 0, behavior: scrollBehavior });
              }
            }}
            className="font-serif text-4xl sm:text-5xl tracking-tighter text-primary group overflow-hidden cursor-pointer"
          >
            <motion.span 
              className="inline-block"
              style={
                shouldReduceMotion
                  ? { letterSpacing: "0.2em", fontWeight: 400 }
                  : { letterSpacing: logoLetterSpacing, fontWeight: logoFontWeight }
              }
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
            >
              CMYS
            </motion.span>
          </button>
        </motion.div>

        {/* Right Nav */}
        <nav className="desktop-hover-nav gap-8 items-center justify-end h-full transition-opacity duration-300">
          {!isGachaPage && showNavLinks && navLinks.slice(2).map((link) => (
            <NavLink
              key={link.name}
              name={link.name}
              onClick={() => handleNavClick(link)}
              isActive={isActiveLink(link)}
            />
          ))}
        </nav>
        <div className="md:hidden" />
      </div>
      
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-secondary"
        style={{ width: shouldReduceMotion ? "100%" : progressWidth }}
      />
    </motion.header>
  );
}

function NavLink({ 
  name, 
  onClick, 
  isActive
}: { 
  name: string; 
  onClick: () => void; 
  isActive?: boolean;
  key?: string;
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative py-2 font-mono text-xs tracking-[0.2em] transition-colors cursor-pointer",
        isActive ? "text-primary" : "text-secondary"
      )}
    >
      {name}
      <motion.span 
        className="absolute bottom-1 left-0 h-[1px] bg-primary"
        initial={{ width: isActive ? "100%" : 0 }}
        animate={{ width: isActive ? "100%" : 0 }}
        transition={{ duration: 0.4, ease: "circOut" }}
      />
    </button>
  );
}
