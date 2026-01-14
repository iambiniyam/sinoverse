/**
 * Quiz Page
 * Interactive vocabulary quizzes
 */

import { useState } from "react";
import Quiz from "../components/Quiz";
import { useProgressStore } from "../stores/progressStore";

export default function QuizPage() {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [questionCount, setQuestionCount] = useState(10);
  const [showQuiz, setShowQuiz] = useState(false);
  const { addXP } = useProgressStore();

  const handleQuizComplete = (score: number, _total: number) => {
    const xp = score * 10;
    addXP(xp);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card mb-6">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">Quiz 测验</h1>
        <p className="text-ink-600">
          Test your knowledge with interactive vocabulary quizzes
        </p>
      </div>

      {!showQuiz ? (
        <div className="card space-y-6 animate-fadeIn">
          {/* Level Selection */}
          <div>
            <label className="block text-lg font-semibold text-ink-800 mb-3">
              Select HSK Level
            </label>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`py-3 rounded-lg font-bold transition-all ${
                    selectedLevel === level
                      ? "bg-chinese-red-500 text-white scale-105"
                      : "bg-ink-100 hover:bg-ink-200 text-ink-700"
                  }`}
                >
                  HSK {level}
                  {level === 7 && <div className="text-xs">7-9</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-lg font-semibold text-ink-800 mb-3">
              Number of Questions
            </label>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    questionCount === count
                      ? "bg-jade-500 text-white"
                      : "bg-ink-100 hover:bg-ink-200 text-ink-700"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Types Info */}
          <div className="bg-ink-50 rounded-lg p-4">
            <h3 className="font-semibold text-ink-800 mb-3">Quiz Types</h3>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-chinese">字</span>
                <span className="text-ink-600">Character → Meaning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-chinese">音</span>
                <span className="text-ink-600">Character → Pinyin</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-chinese">义</span>
                <span className="text-ink-600">Meaning → Character</span>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={() => setShowQuiz(true)}
            className="w-full py-4 bg-chinese-red-500 hover:bg-chinese-red-600 text-white text-lg font-bold rounded-lg transition-colors"
          >
            Start Quiz →
          </button>
        </div>
      ) : (
        <div className="animate-fadeIn">
          <button
            onClick={() => setShowQuiz(false)}
            className="flex items-center gap-2 text-ink-600 hover:text-chinese-red-600 mb-6 transition-colors"
          >
            ← Back to Settings
          </button>
          <Quiz
            hskLevel={selectedLevel}
            questionCount={questionCount}
            onComplete={handleQuizComplete}
          />
        </div>
      )}
    </div>
  );
}
