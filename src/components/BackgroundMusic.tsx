import { useEffect, useRef, useState, MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "../lib/utils";

export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  path: string;
  volume?: number;
  loop?: boolean;
}

const DEFAULT_SONGS: MusicTrack[] = [
  { id: "1", title: "Luv(sic.) Part 3", artist: "MC赵小六", path: "/musics/Luv(sic.) Part 3 (feat. MC赵小六).mp3" },
  { id: "2", title: "The Great Gig in the Sky", artist: "Pink Floyd", path: "/musics/The Great Gig in the Sky.mp4" },
];

const SHUTTLE_HEIGHT = 56;
const DEFAULT_VOLUME = 0.55;

interface BackgroundMusicProps {
  disableScrollAutoplay?: boolean;
  songs?: MusicTrack[];
  currentTrackId?: string;
  hideSkipControls?: boolean;
  lockTrackSelection?: boolean;
  volume?: number;
  enableInteractionAutoplay?: boolean;
  titleDisplayMs?: number;
  fadeOutMs?: number;
  fadeInMs?: number;
}

export function BackgroundMusic({
  disableScrollAutoplay = false,
  songs = DEFAULT_SONGS,
  currentTrackId,
  hideSkipControls = false,
  lockTrackSelection = false,
  volume,
  enableInteractionAutoplay = false,
  titleDisplayMs = 3000,
  fadeOutMs = 500,
  fadeInMs = 700,
}: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlayingStatus, setShowPlayingStatus] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const fadeTokenRef = useRef(0);
  const sourceRef = useRef<string | null>(null);
  const shuttleRef = useRef<HTMLDivElement>(null);

  const playlist = songs.length > 0 ? songs : DEFAULT_SONGS;
  const controlledIndex = currentTrackId
    ? playlist.findIndex((song) => song.id === currentTrackId)
    : -1;
  const normalizedIndex = Math.min(currentSongIndex, playlist.length - 1);
  const currentSong = playlist[controlledIndex >= 0 ? controlledIndex : normalizedIndex];
  const currentVolume = volume ?? currentSong.volume ?? DEFAULT_VOLUME;

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    setCurrentSongIndex((prev) => Math.min(prev, playlist.length - 1));
  }, [playlist.length]);

  useEffect(() => {
    if (!currentTrackId) return;
    const nextIndex = playlist.findIndex((song) => song.id === currentTrackId);
    if (nextIndex >= 0) setCurrentSongIndex(nextIndex);
  }, [currentTrackId, playlist]);

  const clearDisplayTimers = () => {
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
      statusTimerRef.current = null;
    }
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  };

  const showCurrentTitle = (durationMs = titleDisplayMs, collapseAfter = true) => {
    clearDisplayTimers();
    setIsExpanded(true);
    setShowPlayingStatus(true);
    statusTimerRef.current = setTimeout(() => {
      setShowPlayingStatus(false);
      statusTimerRef.current = null;
      if (collapseAfter) {
        autoCloseTimerRef.current = setTimeout(() => {
          setIsExpanded(false);
          autoCloseTimerRef.current = null;
        }, 1000);
      }
    }, durationMs);
  };

  const cancelFade = () => {
    fadeTokenRef.current += 1;
    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
  };

  const setAudioVolume = (audio: HTMLAudioElement, value: number) => {
    audio.volume = Math.max(0, Math.min(1, value));
  };

  const fadeVolume = (audio: HTMLAudioElement, to: number, durationMs: number) => {
    cancelFade();
    const token = fadeTokenRef.current;
    const from = audio.volume;
    const target = Math.max(0, Math.min(1, to));

    if (durationMs <= 0 || Math.abs(from - target) < 0.01) {
      setAudioVolume(audio, target);
      return Promise.resolve(true);
    }

    return new Promise<boolean>((resolve) => {
      const startedAt = performance.now();
      const tick = (now: number) => {
        if (fadeTokenRef.current !== token) {
          resolve(false);
          return;
        }
        const progress = Math.min(1, (now - startedAt) / durationMs);
        const eased = 1 - Math.pow(1 - progress, 2);
        setAudioVolume(audio, from + (target - from) * eased);

        if (progress >= 1) {
          fadeFrameRef.current = null;
          resolve(true);
          return;
        }

        fadeFrameRef.current = requestAnimationFrame(tick);
      };

      fadeFrameRef.current = requestAnimationFrame(tick);
    });
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let hasStarted = false;

    const startPlayback = () => {
      if (hasStarted) return;
      clearStartListeners();

      audio.play().then(() => {
        hasStarted = true;
        setIsPlaying(true);
        showCurrentTitle();

        window.removeEventListener("wheel", handleScroll);
        window.removeEventListener("scroll", handleScroll);
      }).catch(() => {
        console.log("Autoplay blocked, waiting for interaction...");
      });
    };

    const handleCanPlay = () => {
      if (!hasStarted) startPlayback();
    };

    const clearStartListeners = () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };

    const handleScroll = () => {
      if (hasStarted) return;
      clearStartListeners();
      startPlayback();
    };

    const handleInteraction = (event: Event) => {
      if (hasStarted) return;
      if (shuttleRef.current && event.target instanceof Node && shuttleRef.current.contains(event.target)) {
        return;
      }
      startPlayback();
    };

    // 只有在允许滚动自动播放时才添加这些自动触发逻辑
    if (!disableScrollAutoplay) {
      if (audio.readyState >= 3) {
        handleCanPlay();
      } else {
        audio.addEventListener("canplay", handleCanPlay, { once: true });
      }

      window.addEventListener("wheel", handleScroll);
      window.addEventListener("scroll", handleScroll);
    }

    if (enableInteractionAutoplay) {
      window.addEventListener("pointerdown", handleInteraction);
      window.addEventListener("keydown", handleInteraction);
    }

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      clearStartListeners();
    };
  }, [disableScrollAutoplay, enableInteractionAutoplay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;
    const previousSource = sourceRef.current;
    const nextSource = currentSong.path;
    const isFirstSource = previousSource === null;
    const shouldAttemptPlay = isPlaying && !audio.paused;

    const switchSource = async () => {
      audio.loop = currentSong.loop ?? true;

      if (!isFirstSource && previousSource !== nextSource && shouldAttemptPlay) {
        await fadeVolume(audio, 0, fadeOutMs);
        if (cancelled) return;
        audio.src = nextSource;
        sourceRef.current = nextSource;
        audio.load();
        setAudioVolume(audio, 0);
        await audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
        if (cancelled) return;
        await fadeVolume(audio, currentVolume, fadeInMs);
        return;
      }

      audio.src = nextSource;
      sourceRef.current = nextSource;
      setAudioVolume(audio, currentVolume);
      if (isPlaying) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
    };

    void switchSource();
    showCurrentTitle();

    return () => {
      cancelled = true;
      clearDisplayTimers();
    };
  }, [currentSong.id, currentSong.path]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && fadeFrameRef.current === null) {
      setAudioVolume(audio, currentVolume);
    }
  }, [currentVolume]);

  useEffect(() => {
    if (isTouchDevice && isExpanded && !showPlayingStatus) {
      autoCloseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
        autoCloseTimerRef.current = null;
      }, 2000);
    }

    return () => {
      if (autoCloseTimerRef.current && !showPlayingStatus) {
        clearTimeout(autoCloseTimerRef.current);
        autoCloseTimerRef.current = null;
      }
    };
  }, [isExpanded, isTouchDevice, showPlayingStatus]);

  useEffect(() => {
    return () => cancelFade();
  }, []);

  useEffect(() => {
    if (!isTouchDevice) return;

    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (isExpanded && shuttleRef.current && !shuttleRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isExpanded, isTouchDevice]);

  const toggleExpand = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    setIsExpanded(!isExpanded);
  };

  const togglePlay = (e: ReactMouseEvent) => {
    e.stopPropagation();
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setShowPlayingStatus(true);
          statusTimerRef.current = setTimeout(() => setShowPlayingStatus(false), titleDisplayMs);
        }).catch(() => {});
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
    if (isTouchDevice) {
      autoCloseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 2000);
    }
  };

  const togglePrev = (e: ReactMouseEvent) => {
    e.stopPropagation();
    if (lockTrackSelection) return;
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    showCurrentTitle();
    if (isTouchDevice) {
      autoCloseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 2000);
    }
  };

  const toggleNext = (e: ReactMouseEvent) => {
    e.stopPropagation();
    if (lockTrackSelection) return;
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
    showCurrentTitle();
    if (isTouchDevice) {
      autoCloseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 2000);
    }
  };

  const expandedWidth = hideSkipControls ? 220 : 260;

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSong.path}
        loop={currentSong.loop ?? true}
        preload="auto"
        style={{ display: "none" }}
      />

      {/* Music Player Shuttle */}
      <motion.div
        ref={shuttleRef}
        initial={false}
        onClick={toggleExpand}
        onMouseEnter={() => !isTouchDevice && setIsExpanded(true)}
        onMouseLeave={() => {
          if (!isTouchDevice) {
            setTimeout(() => setIsExpanded(false), 100);
          }
        }}
        animate={{
          width: isExpanded ? expandedWidth : SHUTTLE_HEIGHT,
          height: SHUTTLE_HEIGHT,
          clipPath: isExpanded
            ? `polygon(${SHUTTLE_HEIGHT / 2}px 0%, calc(100% - ${SHUTTLE_HEIGHT / 2}px) 0%, 100% 50%, calc(100% - ${SHUTTLE_HEIGHT / 2}px) 100%, ${SHUTTLE_HEIGHT / 2}px 100%, 0% 50%)`
            : `polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)`
        }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className={cn(
          "fixed bottom-8 left-8 z-[100] glass-panel border border-primary/10 text-black shadow-[0_12px_32px_rgba(0,0,0,0.16)] flex items-center overflow-hidden cursor-pointer"
        )}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="flex items-center gap-1.5 h-6">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isPlaying
                        ? (i === 2 ? [8, 20, 12, 18, 8] : [4, 12, 8, 10, 4])
                        : (i === 2 ? 8 : 4),
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5 + i * 0.1,
                      ease: "easeInOut",
                    }}
                    className="w-1 bg-black rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-5 px-10 w-full"
            >
              <div className="flex-initial overflow-hidden text-center">
                {showPlayingStatus ? (
                  <motion.div
                    key="P2-status"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-black/40">Playing:</span>
                    <h4 className="font-mono text-[10px] font-bold truncate tracking-tight uppercase">
                      {currentSong.title}
                    </h4>
                  </motion.div>
                ) : (
                  <motion.div
                    key="P1-controls"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <h4 className="font-mono text-[10px] font-bold truncate tracking-tight uppercase mb-1">
                      {currentSong.title}
                    </h4>
                    <div className="flex items-center justify-center gap-4">
                      {!hideSkipControls && (
                        <button onClick={togglePrev} className="hover:opacity-50 transition-opacity">
                          <SkipBack size={14} fill="black" />
                        </button>
                      )}
                      <button onClick={togglePlay} className="hover:opacity-50 transition-opacity">
                        {isPlaying ? (
                          <Pause size={16} fill="black" />
                        ) : (
                          <Play size={16} fill="black" />
                        )}
                      </button>
                      {!hideSkipControls && (
                        <button onClick={toggleNext} className="hover:opacity-50 transition-opacity">
                          <SkipForward size={14} fill="black" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
