/**
 * Flashcard Component
 * Interactive vocabulary card with spaced repetition and audio
 */

import { useState, useEffect } from "react";
import { RecallRating } from "../types";
import { HskWord } from "../services/dataService";
import { AudioService } from "../services/audioService";

interface FlashcardProps {
  word: HskWord;
  onRate: (rating: RecallRating) => void;
  showAnswer?: boolean;
}

export default function Flashcard({
  word,
  onRate,
  showAnswer: initialShow = false,
}: FlashcardProps) {
  const [showAnswer, setShowAnswer] = useState(initialShow);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const primaryForm = word.forms[0];

  useEffect(() => {
    // Preload audio when card is shown
    if (primaryForm) {
      AudioService.preloadWordAudio(primaryForm.transcriptions.numeric);
    }
  }, [primaryForm]);

  const playAudio = async () => {
    if (!primaryForm || isPlayingAudio) return;

    setIsPlayingAudio(true);
    try {
      await AudioService.playWord(primaryForm.transcriptions.numeric, 250);
    } catch (error) {
      console.warn("Audio playback failed:", error);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const getToneClass = (pinyin: string): string => {
    if (pinyin.includes("1") || pinyin.includes("ā") || pinyin.includes("ē"))
      return "tone-1";
    if (pinyin.includes("2") || pinyin.includes("á") || pinyin.includes("é"))
      return "tone-2";
    if (pinyin.includes("3") || pinyin.includes("ǎ") || pinyin.includes("ě"))
      return "tone-3";
    if (pinyin.includes("4") || pinyin.includes("à") || pinyin.includes("è"))
      return "tone-4";
    return "tone-5";
  };

  const getHSKBadgeColor = (level: string): string => {
    const levelNum = parseInt(level.replace(/\D/g, ""));
    if (levelNum <= 2) return "bg-green-500";
    if (levelNum <= 4) return "bg-blue-500";
    if (levelNum <= 6) return "bg-orange-500";
    // Level 7 includes HSK 7-9
    if (levelNum >= 7) return "bg-red-500";
    return "bg-gray-500";
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8 min-h-[400px] flex flex-col justify-between shadow-elevated hover:shadow-2xl transition-shadow duration-300">
        {/* Front - Chinese Character */}
        <div className="text-center flex-1 flex flex-col justify-center">
          <button
            onClick={playAudio}
            disabled={isPlayingAudio}
            className="chinese-char text-7xl mb-6 cursor-pointer hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-chinese-red-300 rounded-lg"
            aria-label="Play pronunciation"
          >
            {word.simplified}
          </button>

          {showAnswer && primaryForm && (
            <div className="space-y-4 animate-fadeIn">
              <div
                className={`pinyin text-2xl font-semibold ${getToneClass(
                  primaryForm.transcriptions.pinyin
                )}`}
              >
                {primaryForm.transcriptions.pinyin}
              </div>

              <div className="text-ink-800 text-lg font-medium leading-relaxed">
                {primaryForm.meanings.slice(0, 3).join(" • ")}
              </div>

              {primaryForm.classifiers.length > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-ink-600 bg-ink-50 rounded-lg p-2">
                  <span className="font-semibold">Measure word:</span>
                  <span className="font-chinese text-base">
                    {primaryForm.classifiers.join(", ")}
                  </span>
                </div>
              )}

              {word.pos.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {word.pos.map((pos) => (
                    <span
                      key={pos}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                    >
                      {pos}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 justify-center">
                {word.level.slice(0, 3).map((level) => (
                  <span
                    key={level}
                    className={`px-3 py-1 ${getHSKBadgeColor(
                      level
                    )} text-white rounded-full text-xs font-bold`}
                  >
                    {level.replace("new-", "HSK ").replace("old-", "Old ")}
                  </span>
                ))}
              </div>

              <button
                onClick={playAudio}
                disabled={isPlayingAudio}
                className="mt-4 px-4 py-2 bg-jade-500 hover:bg-jade-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlayingAudio ? " Playing..." : " Play Audio"}
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-6 space-y-3">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full btn-primary text-lg py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Show Answer
            </button>
          ) : (
            <div className="space-y-2">
              <div className="text-center text-sm font-medium text-ink-600 mb-3">
                How well did you know this?
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onRate("again")}
                  className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all transform hover:scale-105 font-semibold shadow-md"
                >
                  Again
                </button>
                <button
                  onClick={() => onRate("hard")}
                  className="px-4 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-all transform hover:scale-105 font-semibold shadow-md"
                >
                  Hard
                </button>
                <button
                  onClick={() => onRate("good")}
                  className="px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all transform hover:scale-105 font-semibold shadow-md"
                >
                  Good
                </button>
                <button
                  onClick={() => onRate("easy")}
                  className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all transform hover:scale-105 font-semibold shadow-md"
                >
                  Easy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
