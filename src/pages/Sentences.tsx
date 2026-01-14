/**
 * Sentences Page
 * 13,000+ sentence pairs with listening, reading speed, and comprehension practice
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { DataService, SentencePair } from "../services/dataService";
import { AudioService } from "../services/audioService";

type PracticeMode = "browse" | "practice" | "listening" | "speed";

export default function Sentences() {
  const [sentences, setSentences] = useState<SentencePair[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [mode, setMode] = useState<PracticeMode>("browse");

  // Listening mode state
  const [userGuess, setUserGuess] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Speed reading state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [sentencesRead, setSentencesRead] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    loadSentences();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadSentences = () => {
    const items = DataService.getRandomSentences(50);
    setSentences(items);
    setCurrentIndex(0);
    resetPractice();
  };

  const resetPractice = () => {
    setShowTranslation(false);
    setUserGuess("");
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
    setSentencesRead(0);
    setElapsedTime(0);
    setWpm(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = DataService.searchSentences(query);
      setSentences(results);
    } else {
      loadSentences();
    }
    setCurrentIndex(0);
  };

  const nextSentence = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % sentences.length);
    setShowTranslation(false);
    setUserGuess("");
    setShowAnswer(false);
  }, [sentences.length]);

  const prevSentence = () => {
    setCurrentIndex((prev) => (prev - 1 + sentences.length) % sentences.length);
    setShowTranslation(false);
    setUserGuess("");
    setShowAnswer(false);
  };

  // Helper to play character audio
  const playCharacter = (char: string) => {
    const audioUrl = `/audio/syllabs/cmn-${char.charCodeAt(0)}.mp3`;
    AudioService.play(audioUrl).catch(() => {
      // Silently fail if audio not available
    });
  };

  // Listening mode: play audio
  const playCurrentSentence = () => {
    const sentence = sentences[currentIndex];
    if (sentence) {
      // Play each character's audio in sequence
      const chars = sentence.chinese.split("").filter((c) => c.trim());
      chars.forEach((char, i) => {
        setTimeout(() => {
          playCharacter(char);
        }, i * 400);
      });
    }
  };

  // Listening mode: check answer
  const checkListeningAnswer = () => {
    const sentence = sentences[currentIndex];
    if (!sentence) return;

    const isCorrect =
      userGuess.trim().replace(/\s/g, "") ===
      sentence.chinese.replace(/\s/g, "");
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    setShowAnswer(true);
  };

  // Speed reading: start timer
  const startSpeedReading = () => {
    setIsTimerRunning(true);
    setSentencesRead(0);
    setElapsedTime(0);
    timerRef.current = window.setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
  };

  // Speed reading: mark as read
  const markAsRead = () => {
    const newCount = sentencesRead + 1;
    setSentencesRead(newCount);

    // Calculate WPM (average 4 characters per word for Chinese)
    const sentence = sentences[currentIndex];
    if (sentence && elapsedTime > 0) {
      const totalChars = sentence.chinese.length * newCount;
      const wordsRead = totalChars / 4;
      const minutes = elapsedTime / 60;
      setWpm(Math.round(wordsRead / minutes));
    }

    nextSentence();
  };

  // Speed reading: stop
  const stopSpeedReading = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const currentSentence = sentences[currentIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-ink-900 mb-1">
          Sentences Practice
        </h1>
        <p className="text-ink-600 text-sm mb-4">
          13,023 sentence pairs with listening and speed reading modes
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 px-3 py-2 text-sm border border-ink-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent"
          />
          <button
            onClick={loadSentences}
            className="px-3 py-2 rounded-lg bg-ink-100 hover:bg-ink-200 transition-colors"
            title="Random sentences"
          >
            🔀
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex flex-wrap gap-2">
          {(["browse", "practice", "listening", "speed"] as PracticeMode[]).map(
            (m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  resetPractice();
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                  mode === m
                    ? "bg-chinese-red-500 text-white shadow-sm"
                    : "bg-white border border-ink-200 hover:border-ink-300 text-ink-700"
                }`}
              >
                {m === "speed" ? "Speed" : m === "listening" ? "Listen" : m}
              </button>
            )
          )}
        </div>
      </div>

      {/* Listening Mode - Dictation practice */}
      {mode === "listening" && currentSentence && (
        <div className="card">
          <div className="text-center">
            <div className="flex justify-between items-center mb-6 text-sm">
              <span className="text-ink-500">
                {currentIndex + 1} / {sentences.length}
              </span>
              <span className="font-medium text-jade-600">
                {score.correct}/{score.total}
              </span>
            </div>

            <div className="mb-6">
              <button
                onClick={playCurrentSentence}
                className="w-20 h-20 rounded-full bg-chinese-red-500 hover:bg-chinese-red-600 text-white text-3xl transition-all hover:scale-105 shadow-lg"
              ></button>
              <p className="text-xs text-ink-500 mt-3">
                Listen and type what you hear
              </p>
            </div>

            {!showAnswer ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="输入中文..."
                  className="w-full text-lg px-4 py-3 border border-ink-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent text-center"
                  onKeyDown={(e) => e.key === "Enter" && checkListeningAnswer()}
                  autoFocus
                />
                <button
                  onClick={checkListeningAnswer}
                  className="btn-primary w-full"
                >
                  Check
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-lg ${
                    userGuess.trim().replace(/\s/g, "") ===
                    currentSentence.chinese.replace(/\s/g, "")
                      ? "bg-jade-50 border border-jade-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <p
                    className={`font-bold text-sm mb-2 ${
                      userGuess.trim().replace(/\s/g, "") ===
                      currentSentence.chinese.replace(/\s/g, "")
                        ? "text-jade-700"
                        : "text-red-700"
                    }`}
                  >
                    {userGuess.trim().replace(/\s/g, "") ===
                    currentSentence.chinese.replace(/\s/g, "")
                      ? "✓ Correct"
                      : "✗ Try again"}
                  </p>
                  <p className="text-xl mb-1">{currentSentence.chinese}</p>
                  <p className="text-sm text-ink-600">
                    {currentSentence.english}
                  </p>
                </div>
                <button onClick={nextSentence} className="btn-primary w-full">
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Speed Reading Mode */}
      {mode === "speed" && currentSentence && (
        <div className="card">
          <div className="text-center">
            {/* Stats Bar */}
            <div className="flex justify-around items-center mb-6 p-3 bg-ink-50 rounded-lg">
              <div>
                <p className="text-xl font-bold text-chinese-red-600">
                  {formatTime(elapsedTime)}
                </p>
                <p className="text-xs text-ink-500">Time</p>
              </div>
              <div>
                <p className="text-xl font-bold text-jade-600">
                  {sentencesRead}
                </p>
                <p className="text-xs text-ink-500">Read</p>
              </div>
              <div>
                <p className="text-xl font-bold text-chinese-gold-600">{wpm}</p>
                <p className="text-xs text-ink-500">WPM</p>
              </div>
            </div>

            {!isTimerRunning ? (
              <button
                onClick={startSpeedReading}
                className="btn-primary text-lg px-8 py-4"
              >
                Start Speed Reading
              </button>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-ink-900 mb-4 leading-relaxed">
                  {currentSentence.chinese}
                </h2>

                {showTranslation && (
                  <p className="text-lg text-jade-600 mb-4">
                    {currentSentence.english}
                  </p>
                )}

                <div className="flex gap-3 justify-center mb-4">
                  <button
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="px-4 py-2 rounded-lg bg-ink-100 hover:bg-ink-200 transition-colors"
                  >
                    {showTranslation ? "Hide" : "Hint"}
                  </button>
                  <button onClick={markAsRead} className="btn-primary">
                    Got it! Next →
                  </button>
                </div>

                <button
                  onClick={stopSpeedReading}
                  className="text-sm text-ink-500 hover:text-ink-700"
                >
                  Stop Practice
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Practice Mode */}
      {mode === "practice" && currentSentence && (
        <div className="card p-8">
          <div className="text-center mb-6">
            <p className="text-sm text-ink-600 mb-4">
              {currentIndex + 1} / {sentences.length}
            </p>
            <h2 className="text-4xl font-bold text-ink-900 mb-6 leading-relaxed">
              {currentSentence.chinese}
            </h2>

            {showTranslation ? (
              <p className="text-xl text-jade-600 mb-6">
                {currentSentence.english}
              </p>
            ) : (
              <button
                onClick={() => setShowTranslation(true)}
                className="btn-primary mb-6"
              >
                Show Translation
              </button>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={prevSentence}
                className="px-6 py-2 rounded-lg bg-ink-100 hover:bg-ink-200 transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="px-6 py-2 rounded-lg bg-ink-100 hover:bg-ink-200 transition-colors"
              >
                {showTranslation ? "Hide" : "Show"}
              </button>
              <button
                onClick={nextSentence}
                className="px-6 py-2 rounded-lg bg-ink-100 hover:bg-ink-200 transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Browse Mode */}
      {mode === "browse" && (
        <div className="space-y-3">
          <div className="text-sm text-ink-600 mb-2">
            {sentences.length} sentences
          </div>
          {sentences.map((sentence, index) => (
            <div
              key={sentence.id}
              className="card hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                sentence.chinese[0] && playCharacter(sentence.chinese[0])
              }
            >
              <div className="flex items-start gap-4">
                <div className="text-xl text-ink-400 font-bold min-w-8">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xl text-ink-900 mb-1">
                    {sentence.chinese}
                  </p>
                  <p className="text-ink-500 text-sm">{sentence.english}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sentences.length === 0 && (
        <div className="text-center py-12 text-ink-500">
          No sentences found. Try a different search.
        </div>
      )}
    </div>
  );
}
