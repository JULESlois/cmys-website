import { motion, useScroll, useTransform } from "motion/react";
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
  
  const height = useTransform(scrollYProgress, [0, 0.2], ["15vh", "8vh"]);
  const logoScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);
  const isGachaPage = location.pathname === "/gacha";
  const isLifePage = location.pathname === "/life";
  const showNavLinks = location.pathname === "/" || location.pathname === "/about";
  const headerY = useTransform(scrollYProgress, [0.85, 0.9], [isGachaPage ? "0%" : "0%", isGachaPage ? "0%" : "-100%"]);
  const headerOpacity = useTransform(scrollYProgress, [0.85, 0.9], [1, isGachaPage ? 1 : 0]);

  const navLinks: NavLinkItem[] = [
    { name: "纯墨韵声", path: "/about" },
    { name: "驰鸣羽势", path: "/about#roots" },
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
          element.scrollIntoView({ behavior: "smooth", block: "start" });
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
      style={{ height, y: headerY, opacity: headerOpacity }}
      className={`fixed top-0 left-0 w-full z-50 flex items-center border-b border-primary/10 px-4 md:px-6 overflow-hidden transition-all duration-300 ${
        isLifePage ? "hidden" : ""
      }`}
    >
      <div className="w-full flex flex-col md:grid md:grid-cols-3 items-center justify-center h-full pt-1 md:pt-0">
        {/* Left Nav */}
        <nav className="hidden md:flex gap-8 items-center h-full">
          {!isGachaPage && showNavLinks && navLinks.slice(0, 2).map((link) => (
            <NavLink
              key={link.name}
              name={link.name}
              onClick={() => handleNavClick(link)}
              isActive={isActiveLink(link)}
            />
          ))}
        </nav>

        {/* Center Logo */}
        <motion.div
          style={{ scale: logoScale }}
          className={`flex justify-center items-center mt-1 md:mt-0 ${isLifePage ? "md:opacity-0 pointer-events-none" : ""}`}
        >
          <button 
            onClick={() => {
              if (location.pathname !== "/") {
                navigate("/");
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="font-serif text-[28px] sm:text-4xl md:text-5xl tracking-tighter text-primary group overflow-hidden cursor-pointer"
          >
            <motion.span 
              className="inline-block"
              style={{ 
                letterSpacing: useTransform(scrollYProgress, [0, 0.2], ["-0.05em", "0.2em"]),
                fontWeight: useTransform(scrollYProgress, [0, 0.2], ["700", "400"])
              }}
              transition={{ duration: 0.5 }}
            >
              CMYS
            </motion.span>
          </button>
        </motion.div>
        
        {/* Mobile Nav */}
        {!isGachaPage && showNavLinks && (
          <nav className="flex md:hidden gap-3 sm:gap-5 w-full justify-center items-center mt-auto pb-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                name={link.name}
                onClick={() => handleNavClick(link)}
                isActive={isActiveLink(link)}
                isMobile
              />
            ))}
          </nav>
        )}

        {/* Right Nav */}
        <nav className="hidden md:flex gap-8 items-center justify-end h-full">
          {!isGachaPage && showNavLinks && navLinks.slice(2).map((link) => (
            <NavLink
              key={link.name}
              name={link.name}
              onClick={() => handleNavClick(link)}
              isActive={isActiveLink(link)}
            />
          ))}
        </nav>
      </div>
      
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-secondary"
        style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
      />
    </motion.header>
  );
}

function NavLink({ 
  name, 
  onClick, 
  isActive,
  isMobile
}: { 
  name: string; 
  onClick: () => void; 
  isActive?: boolean;
  isMobile?: boolean;
  key?: string;
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative font-mono tracking-[0.1em] md:tracking-[0.2em] transition-colors cursor-pointer",
        isMobile ? "py-1 text-[11px] sm:text-xs" : "py-2 text-xs",
        isActive ? "text-primary" : "text-secondary"
      )}
    >
      {name}
      <motion.span 
        className="absolute bottom-0 md:bottom-1 left-0 h-[1px] bg-primary"
        initial={{ width: isActive ? "100%" : 0 }}
        animate={{ width: isActive ? "100%" : 0 }}
        transition={{ duration: 0.4, ease: "circOut" }}
      />
    </button>
  );
}
