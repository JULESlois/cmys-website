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
import { GachaPage } from "./pages/GachaPage";
import { LifePage } from "./pages/LifePage";

const STORAGE_DATE_KEY = "esu_fortune_date";
const STORAGE_KEY = "esu_fortune_daily";

function getTodayDate(): string {
  // 返回中国标准时间 (CST, UTC+8) 的日期字符串 (YYYY-MM-DD)
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

function AppContent({
  onOpenFortune,
  dailyFortune,
  isFortuneOpen,
  onCloseFortune,
  onDailyFortuneSet
}: {
  onOpenFortune: () => void,
  dailyFortune: Fortune | null,
  isFortuneOpen: boolean,
  onCloseFortune: () => void,
  onDailyFortuneSet: (f: Fortune | null) => void
}) {
  const location = useLocation();
  const showFooter = location.pathname === "/";
  const showDecorativeScrollbar = location.pathname !== "/life";

  return (
    <div className="relative">
      {showDecorativeScrollbar && <DecorativeScrollbar />}
      <Header />
      <main className="relative z-20 min-h-screen bg-canvas text-primary font-sans selection:bg-primary selection:text-canvas">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/gacha"
            element={
              <GachaPage
                onOpenFortune={onOpenFortune}
                dailyFortune={dailyFortune}
              />
            }
          />
          <Route path="/life" element={<LifePage />} />
        </Routes>
      </main>
      {showFooter && <Footer />}

      <FortuneSystem 
        isOpen={isFortuneOpen} 
        onClose={onCloseFortune} 
        onDailyFortuneSet={onDailyFortuneSet}
      />
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

  const handleOpenFortune = () => {
    setIsFortuneOpen(true);
  };

  return (
    <BrowserRouter>
      <AppContent 
        onOpenFortune={handleOpenFortune}
        dailyFortune={dailyFortune}
        isFortuneOpen={isFortuneOpen}
        onCloseFortune={() => setIsFortuneOpen(false)}
        onDailyFortuneSet={setDailyFortune}
      />
    </BrowserRouter>
  );
}

