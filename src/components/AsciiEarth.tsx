import { useEffect, useRef, useState, useMemo } from "react";
import { parseGIF, decompressFrames } from "gifuct-js";

const ASCII_CHARS = " .:-=+*#%@";
const CHAR_WIDTH = 2;
const SAMPLE_STEP = 2;

function pixelToASCII(r: number, g: number, b: number, a: number): string {
  if (a < 128) return " ";
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const index = Math.floor(brightness * (ASCII_CHARS.length - 1));
  return ASCII_CHARS[index];
}

function frameToASCII(imageData: ImageData, width: number, height: number): string {
  const aspectRatio = CHAR_WIDTH * height / width;
  const newHeight = Math.round(height / aspectRatio / SAMPLE_STEP);
  const newWidth = Math.round(width / SAMPLE_STEP);
  
  let result = "";
  for (let y = 0; y < newHeight; y++) {
    const srcY = y * SAMPLE_STEP * Math.floor(height / newHeight / SAMPLE_STEP);
    for (let x = 0; x < newWidth; x++) {
      const srcX = x * SAMPLE_STEP;
      const idx = (srcY * imageData.width + srcX) * 4;
      result += pixelToASCII(
        imageData.data[idx],
        imageData.data[idx + 1],
        imageData.data[idx + 2],
        imageData.data[idx + 3]
      );
    }
    result += "\n";
  }
  return result;
}

interface GifFrame {
  pixels: number[];
  dims: { top: number; left: number; width: number; height: number };
  delay: number;
  disposalType: number;
  colorTable: number[];
  transparentIndex?: number;
  patch: number[] | Uint8ClampedArray;
}

interface DecodedGIF {
  frames: GifFrame[];
  delays: number[];
}

function decodeGIFAsync(gifData: ArrayBuffer): Promise<DecodedGIF> {
  return new Promise((resolve, reject) => {
    try {
      const gif = parseGIF(gifData);
      const frames = decompressFrames(gif, true) as unknown as GifFrame[];
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      
      const asciiFrames: string[] = [];
      const delays: number[] = [];
      let width = 0;
      let height = 0;
      
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        canvas.width = frame.dims.width;
        canvas.height = frame.dims.height;
        
        const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
        imageData.data.set(frame.patch);
        
        width = Math.max(width, frame.dims.width);
        height = Math.max(height, frame.dims.height);
        
        asciiFrames.push(frameToASCII(imageData, frame.dims.width, frame.dims.height));
        delays.push(frame.delay ?? 100);
      }
      
      resolve({ frames: frames as unknown as GifFrame[], delays });
    } catch (error) {
      reject(error);
    }
  });
}

export function AsciiEarth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameIndexRef = useRef(0);
  const animationRef = useRef<number>(0);
  const lastUpdateRef = useRef(0);
  
  const [frames, setFrames] = useState<string[]>([]);
  const [delays, setDelays] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    
    const loadGIF = async () => {
      try {
        const response = await fetch("/earth.gif");
        if (!response.ok) throw new Error("Failed to fetch GIF");
        const arrayBuffer = await response.arrayBuffer();
        
        if (cancelled) return;
        
        const gif = parseGIF(arrayBuffer);
        const decompressedFrames = decompressFrames(gif, true) as unknown as GifFrame[];
        
        if (cancelled) return;
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        
        const asciiFrames: string[] = [];
        const frameDelays: number[] = [];
        
        for (let i = 0; i < decompressedFrames.length; i++) {
          const frame = decompressedFrames[i];
          canvas.width = frame.dims.width;
          canvas.height = frame.dims.height;
          
          const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
          imageData.data.set(frame.patch);
          
          asciiFrames.push(frameToASCII(imageData, frame.dims.width, frame.dims.height));
          frameDelays.push(frame.delay ?? 100);
        }
        
        if (cancelled) return;
        
        setFrames(asciiFrames);
        setDelays(frameDelays);
        setLoaded(true);
      } catch (error) {
        if (!cancelled) console.error("Failed to load GIF:", error);
      }
    };
    
    loadGIF();
    
    return () => {
      cancelled = true;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!loaded || frames.length === 0 || !containerRef.current) return;
    
    containerRef.current.textContent = frames[0];
    
    const animate = (timestamp: number) => {
      if (!containerRef.current || delays.length === 0) return;
      
      if (timestamp - lastUpdateRef.current >= delays[frameIndexRef.current]) {
        frameIndexRef.current = (frameIndexRef.current + 1) % frames.length;
        containerRef.current.textContent = frames[frameIndexRef.current];
        lastUpdateRef.current = timestamp;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [loaded, frames, delays]);

  if (!loaded) {
    return (
      <div className="font-mono text-[6px] leading-none text-primary/60 animate-pulse">
        LOADING ASCII EARTH...
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex h-full w-full items-center justify-center whitespace-pre font-mono text-[5px] leading-none text-white/70 will-change-contents sm:text-[6px] xl:text-[7px]"
      style={{ fontFamily: "monospace" }}
    />
  );
}
