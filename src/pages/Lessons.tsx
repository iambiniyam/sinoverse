/**
 * Chinese Learning Platform - Comprehensive HSK 1-9 Lessons
 * Uses actual vocabulary data from hsk-complete.json with audio support
 */

import { useState, useEffect } from "react";
import { DataService, HskWord } from "../services/dataService";
import { AudioService } from "../services/audioService";
import Quiz from "../components/Quiz";
import { useProgressStore } from "../stores/progressStore";

const HSK_LEVELS = [
  {
    level: 1,
    name: "Beginner",
    words: 300,
    description: "Basic daily communication",
  },
  {
    level: 2,
    name: "Elementary",
    words: 300,
    description: "Simple conversations",
  },
  {
    level: 3,
    name: "Intermediate",
    words: 300,
    description: "Discuss familiar topics",
  },
  {
    level: 4,
    name: "Upper Intermediate",
    words: 600,
    description: "Express opinions fluently",
  },
  {
    level: 5,
    name: "Advanced",
    words: 1300,
    description: "Read newspapers and magazines",
  },
  {
    level: 6,
    name: "Superior",
    words: 2500,
    description: "Understand complex topics",
  },
  {
    level: 7,
    name: "Advanced Professional (7-9)",
    words: 5609,
    description: "Professional communication and native-level proficiency",
  },
];

type LessonMode = "overview" | "vocabulary" | "quiz";

export default function Lessons() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [mode, setMode] = useState<LessonMode>("overview");
  const [levelWords, setLevelWords] = useState<HskWord[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { addXP, recordWordLearned } = useProgressStore();

  const WORDS_PER_PAGE = 20;

  useEffect(() => {
    if (selectedLevel) {
      const words = DataService.getWordsByHskLevel(selectedLevel);
      setLevelWords(words);
      setCurrentPage(0);
    }
  }, [selectedLevel]);

  const handleQuizComplete = (score: number, total: number) => {
    const xp = score * 10;
    addXP(xp);

    if (score === total) {
      for (let i = 0; i < score; i++) {
        recordWordLearned();
      }
    }
  };

  const playAudio = (word: HskWord) => {
    const form = word.forms[0];
    if (!form) return;

    const numeric = form.transcriptions.numeric.split(" ")[0];
    if (!numeric) return;

    const audioUrl = `/audio/syllabs/cmn-${numeric}.mp3`;
    AudioService.play(audioUrl).catch(() => {
      console.warn(`Audio not available for ${word.simplified}`);
    });
  };

  const paginatedWords = levelWords.slice(
    currentPage * WORDS_PER_PAGE,
    (currentPage + 1) * WORDS_PER_PAGE
  );

  const totalPages = Math.ceil(levelWords.length / WORDS_PER_PAGE);

  if (selectedLevel) {
    const levelInfo = HSK_LEVELS.find((l) => l.level === selectedLevel);
    if (!levelInfo) return null;

    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            setSelectedLevel(null);
            setMode("overview");
          }}
          className="flex items-center gap-2 text-ink-600 hover:text-chinese-red-600 mb-6 transition-colors"
        >
          ← Back to Levels
        </button>

        <div className="card mb-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="hsk-badge mb-2 inline-block">
                HSK {selectedLevel}
              </span>
              <h1 className="text-2xl font-bold text-ink-900">
                {levelInfo.name}
              </h1>
              <p className="text-ink-600 mt-2">{levelInfo.description}</p>
              <p className="text-sm text-ink-500 mt-1">
                {levelWords.length} words loaded from database
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setMode("overview")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === "overview"
                  ? "bg-chinese-red-500 text-white"
                  : "bg-ink-100 hover:bg-ink-200"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setMode("vocabulary")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === "vocabulary"
                  ? "bg-chinese-red-500 text-white"
                  : "bg-ink-100 hover:bg-ink-200"
              }`}
            >
              Vocabulary
            </button>
            <button
              onClick={() => setMode("quiz")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === "quiz"
                  ? "bg-chinese-red-500 text-white"
                  : "bg-ink-100 hover:bg-ink-200"
              }`}
            >
              Quiz
            </button>
          </div>
        </div>

        {mode === "overview" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="card">
              <h3 className="text-lg font-semibold text-ink-800 mb-4">
                Level Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-ink-600">Total Words:</span>
                  <span className="font-bold">{levelWords.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600">Target Vocabulary:</span>
                  <span className="font-bold">{levelInfo.words} words</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-600">Level:</span>
                  <span className="font-bold">{levelInfo.name}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setMode("vocabulary")}
                className="btn-primary text-lg px-8 py-3"
              >
                Start Learning
              </button>
            </div>
          </div>
        )}

        {mode === "vocabulary" && (
          <div className="space-y-4 animate-fadeIn">
            {paginatedWords.map((word) => {
              const form = word.forms[0];
              if (!form) return null;

              return (
                <div
                  key={word.simplified}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-5xl font-chinese min-w-[80px] text-center">
                      {word.simplified}
                    </div>
                    <div className="flex-1">
                      <div className="text-xl text-jade-600 mb-1">
                        {form.transcriptions.pinyin}
                      </div>
                      <div className="text-ink-600">
                        {form.meanings.slice(0, 3).join("; ")}
                      </div>
                      {form.classifiers.length > 0 && (
                        <div className="text-sm text-ink-500 mt-1">
                          Measure: {form.classifiers.join(", ")}
                        </div>
                      )}
                    </div>
                    <button
                      className="p-3 hover:bg-ink-100 rounded-lg transition-colors text-2xl"
                      onClick={() => playAudio(word)}
                      title="Play pronunciation"
                    ></button>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 rounded-lg bg-ink-100 hover:bg-ink-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-ink-600">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 rounded-lg bg-ink-100 hover:bg-ink-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            <div className="text-center mt-8">
              <button
                onClick={() => setMode("quiz")}
                className="btn-primary text-lg px-8 py-3"
              >
                Test Your Knowledge
              </button>
            </div>
          </div>
        )}

        {mode === "quiz" && (
          <div className="animate-fadeIn">
            <Quiz
              hskLevel={selectedLevel}
              questionCount={20}
              onComplete={handleQuizComplete}
            />
          </div>
        )}
      </div>
    );
  }

  // Level selection view
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-ink-900 mb-2">HSK Lessons</h1>
      <p className="text-ink-600 mb-8">
        Master Chinese through the official HSK curriculum. Choose your level
        and start learning with authentic vocabulary from the HSK word lists.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {HSK_LEVELS.map((level) => {
          const wordCount = DataService.getWordsByHskLevel(level.level).length;

          return (
            <div
              key={level.level}
              onClick={() => setSelectedLevel(level.level)}
              className="card cursor-pointer hover:shadow-lg hover:border-chinese-red-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="hsk-badge">HSK {level.level}</span>
                <span className="text-2xl">→</span>
              </div>
              <h3 className="font-bold text-ink-900 text-lg mb-1">
                {level.name}
              </h3>
              <p className="text-sm text-ink-600 mb-3">{level.description}</p>
              <div className="text-sm text-ink-500">
                {wordCount} words available
              </div>
            </div>
          );
        })}
      </div>

      <div className="card bg-jade-50 mt-8">
        <h3 className="font-bold text-ink-800 mb-2">About HSK 3.0</h3>
        <p className="text-sm text-ink-600">
          The new HSK 3.0 standard (2021) expanded to 9 levels, providing a more
          comprehensive framework for Chinese language proficiency. Our platform
          uses authentic vocabulary from official HSK word lists with full audio
          support.
        </p>
      </div>
    </div>
  );
}
