/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DecorativeScrollbar } from "./components/DecorativeScrollbar";
import { FortuneSystem } from "./components/FortuneSystem";
import { Fortune } from "./constants/fortunes";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { GachaPage } from "./pages/GachaPage";
import { LifePage } from "./pages/LifePage";
import { LabPage } from "./pages/LabPage";
import { FragmentsPage } from "./pages/FragmentsPage";
import { SignalPage } from "./pages/SignalPage";
import { MinutePage } from "./pages/MinutePage";
import { MazePage } from "./pages/MazePage";
import { MemoryPage } from "./pages/MemoryPage";
import { ConstellationPage } from "./pages/ConstellationPage";
import { RedactPage } from "./pages/RedactPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const STORAGE_DATE_KEY = "esu_fortune_date";
const STORAGE_KEY = "esu_fortune_daily";

const ROUTE_METADATA: Record<string, { title: string; description: string }> = {
  "/": { title: "CMYS — 聪明一世", description: "聪明一世，草木一生。CMYS 的个人网站与兴趣实验入口。" },
  "/about": { title: "CMYS — 草木一生", description: "草木一生。关于 CMYS、时间，以及一路留下的片段。" },
  "/gacha": { title: "CMYS — 揣摩运势", description: "揣摩运势。一次关于概率、仪式感与每日偶然的 CMYS 实验。" },
  "/life": { title: "CMYS — 沉默一生", description: "沉默一生。用选择、属性与偶然走完一段人生的 CMYS 实验。" },
  "/lab": { title: "CMYS — Curiosity Makes You Stray", description: "Curiosity Makes You Stray. An index of CMYS experiments and wandering ideas." },
  "/fragments": { title: "CMYS — Certain Memories Yield Slowly", description: "Certain Memories Yield Slowly. A small archive of phrases that happen to become CMYS." },
  "/signal": { title: "CMYS — SIGNAL", description: "一个在噪声中寻找隐藏短句的 CMYS 调频实验。" },
  "/minute": { title: "CMYS — 一分钟一生", description: "六十秒，十二次人生节点。来不及完美，只能选择。" },
  "/maze": { title: "CMYS — 迷径", description: "没有地图的文字迷宫。凭方向、线索与记忆寻找出口。" },
  "/memory": { title: "CMYS — 错梦已生", description: "八秒记忆实验。辨认真正出现过的片段，以及后来混进来的伪记忆。" },
  "/constellation": { title: "CMYS — 辰芒映宿", description: "Connect Moments, Yield Stars. 点击空白，自行连出一幅只属于此刻的星图。" },
  "/redact": { title: "CMYS — 裁墨隐书", description: "裁墨隐书。用浏览器自己的选中手势删去字句，让剩下的文字重新说话。" },
};

const NOT_FOUND_METADATA = { title: "CMYS — 此门已失", description: "此门已失。这里没有对应的路径。" };

function getTodayDate(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find(p => p.type === "year")?.value;
  const month = parts.find(p => p.type === "month")?.value;
  const day = parts.find(p => p.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function getStoredDailyFortune(fortunes: Fortune[]): Fortune | null {
  try {
    const storedDate = localStorage.getItem(STORAGE_DATE_KEY);
    const today = getTodayDate();
    if (storedDate === today) {
      const storedId = localStorage.getItem(STORAGE_KEY);
      return fortunes.find((f) => f.id === storedId) || null;
    }
    return null;
  } catch {
    return null;
  }
}

function RouteMetadata() {
  const location = useLocation();

  useEffect(() => {
    const metadata = ROUTE_METADATA[location.pathname] ?? NOT_FOUND_METADATA;
    document.title = metadata.title;
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = metadata.description;
  }, [location.pathname]);

  return null;
}

function RouteScrollReset() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }
    const targetId = decodeURIComponent(location.hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
      else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return null;
}

function AppContent({ onOpenFortune, dailyFortune, isFortuneOpen, onCloseFortune, onDailyFortuneSet }: {
  onOpenFortune: () => void,
  dailyFortune: Fortune | null,
  isFortuneOpen: boolean,
  onCloseFortune: () => void,
  onDailyFortuneSet: (f: Fortune | null) => void
}) {
  const location = useLocation();
  const isMainSite = location.pathname === "/" || location.pathname === "/about";

  // Only the narrative pages opt into scroll snapping; lab experiments scroll normally.
  useEffect(() => {
    const root = document.documentElement;
    if (isMainSite) root.dataset.snap = "true";
    else delete root.dataset.snap;
    return () => {
      delete root.dataset.snap;
    };
  }, [isMainSite]);

  return (
    <div className="relative">
      <RouteMetadata />
      <RouteScrollReset />
      <a href="#main-content" className="skip-link">
        跳到主要内容
      </a>
      {isMainSite && <DecorativeScrollbar />}
      <Header />
      <main id="main-content" className="relative z-20 min-h-screen bg-canvas text-primary font-sans selection:bg-primary selection:text-canvas">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gacha" element={<GachaPage onOpenFortune={onOpenFortune} dailyFortune={dailyFortune} />} />
          <Route path="/life" element={<LifePage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/fragments" element={<FragmentsPage />} />
          <Route path="/signal" element={<SignalPage />} />
          <Route path="/minute" element={<MinutePage />} />
          <Route path="/maze" element={<MazePage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/constellation" element={<ConstellationPage />} />
          <Route path="/redact" element={<RedactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {isMainSite && <Footer />}
      <FortuneSystem isOpen={isFortuneOpen} onClose={onCloseFortune} onDailyFortuneSet={onDailyFortuneSet} />
    </div>
  );
}

export default function App() {
  const [isFortuneOpen, setIsFortuneOpen] = useState(false);
  const [dailyFortune, setDailyFortune] = useState<Fortune | null>(null);
  const [fortunes, setFortunes] = useState<Fortune[]>([]);

  useEffect(() => {
    const loadFortunes = async () => {
      const { FORTUNES } = await import("./constants/fortunes");
      setFortunes(FORTUNES);
      setDailyFortune(getStoredDailyFortune(FORTUNES));
    };
    loadFortunes();
  }, []);

  return (
    <BrowserRouter>
      <AppContent
        onOpenFortune={() => setIsFortuneOpen(true)}
        dailyFortune={dailyFortune}
        isFortuneOpen={isFortuneOpen}
        onCloseFortune={() => setIsFortuneOpen(false)}
        onDailyFortuneSet={setDailyFortune}
      />
    </BrowserRouter>
  );
}
