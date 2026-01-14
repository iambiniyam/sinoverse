/**
 * Stroke Animation Component
 * Animated character stroke order visualization
 */

import { useState, useEffect, useRef } from "react";
import { DataService, CharacterStrokes } from "../services/dataService";

interface StrokeAnimatorProps {
  character: string;
  size?: number;
  onComplete?: () => void;
}

export default function StrokeAnimator({
  character,
  size = 200,
  onComplete,
}: StrokeAnimatorProps) {
  const [strokeData, setStrokeData] = useState<CharacterStrokes | null>(null);
  const [currentStroke, setCurrentStroke] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    loadStrokeData();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [character]);

  const loadStrokeData = async () => {
    setIsLoading(true);
    setCurrentStroke(0);
    const data = await DataService.getCharacterStrokes(character);
    setStrokeData(data);
    setIsLoading(false);
  };

  const playAnimation = () => {
    if (!strokeData || isPlaying) return;

    setIsPlaying(true);
    setCurrentStroke(0);

    let strokeIndex = 0;
    const animateNext = () => {
      if (strokeIndex < strokeData.strokes.length) {
        setCurrentStroke(strokeIndex + 1);
        strokeIndex++;
        animationRef.current = window.setTimeout(
          animateNext,
          600
        ) as unknown as number;
      } else {
        setIsPlaying(false);
        onComplete?.();
      }
    };

    animateNext();
  };

  const reset = () => {
    setCurrentStroke(0);
    setIsPlaying(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const stepForward = () => {
    if (strokeData && currentStroke < strokeData.strokes.length) {
      setCurrentStroke((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStroke > 0) {
      setCurrentStroke((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center bg-ink-50 rounded-lg"
        style={{ width: size, height: size }}
      >
        <div className="text-ink-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!strokeData) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-ink-50 rounded-lg"
        style={{ width: size, height: size }}
      >
        <div className="text-6xl font-chinese mb-2">{character}</div>
        <div className="text-ink-400 text-xs">Stroke data unavailable</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG Canvas */}
      <div
        className="relative bg-white rounded-lg border-2 border-ink-200 overflow-hidden"
        style={{ width: size, height: size }}
      >
        {/* Grid lines */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 1024 1024"
          width={size}
          height={size}
        >
          <line
            x1="512"
            y1="0"
            x2="512"
            y2="1024"
            stroke="#e5e7eb"
            strokeWidth="2"
            strokeDasharray="10,10"
          />
          <line
            x1="0"
            y1="512"
            x2="1024"
            y2="512"
            stroke="#e5e7eb"
            strokeWidth="2"
            strokeDasharray="10,10"
          />
          <line
            x1="0"
            y1="0"
            x2="1024"
            y2="1024"
            stroke="#f3f4f6"
            strokeWidth="1"
            strokeDasharray="10,10"
          />
          <line
            x1="1024"
            y1="0"
            x2="0"
            y2="1024"
            stroke="#f3f4f6"
            strokeWidth="1"
            strokeDasharray="10,10"
          />
        </svg>

        {/* Strokes */}
        <svg
          viewBox="0 0 1024 1024"
          width={size}
          height={size}
          className="absolute inset-0"
          style={{ transform: "scale(1, -1)" }}
        >
          {strokeData.strokes.map((stroke, idx) => (
            <path
              key={idx}
              d={stroke}
              fill={idx < currentStroke ? "#1a1a1a" : "#e5e7eb"}
              className="transition-all duration-300"
              style={{
                opacity: idx < currentStroke ? 1 : 0.3,
              }}
            />
          ))}

          {/* Current stroke highlight */}
          {currentStroke > 0 && currentStroke <= strokeData.strokes.length && (
            <path
              d={strokeData.strokes[currentStroke - 1]}
              fill="none"
              stroke="#dc2626"
              strokeWidth="8"
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={reset}
          className="p-2 rounded-lg bg-ink-100 hover:bg-ink-200 transition-colors"
          title="Reset"
        >
          ⏮
        </button>
        <button
          onClick={stepBackward}
          disabled={currentStroke === 0}
          className="p-2 rounded-lg bg-ink-100 hover:bg-ink-200 transition-colors disabled:opacity-50"
          title="Previous stroke"
        >
          ◀
        </button>
        <button
          onClick={playAnimation}
          disabled={isPlaying}
          className="px-4 py-2 rounded-lg bg-chinese-red-500 text-white hover:bg-chinese-red-600 transition-colors disabled:opacity-50"
        >
          {isPlaying ? "Playing..." : "▶ Play"}
        </button>
        <button
          onClick={stepForward}
          disabled={currentStroke >= strokeData.strokes.length}
          className="p-2 rounded-lg bg-ink-100 hover:bg-ink-200 transition-colors disabled:opacity-50"
          title="Next stroke"
        >
          ▶
        </button>
      </div>

      {/* Progress */}
      <div className="text-sm text-ink-600">
        Stroke {currentStroke} of {strokeData.strokes.length}
      </div>
    </div>
  );
}
