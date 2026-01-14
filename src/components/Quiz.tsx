/**
 * Quiz Component
 * Interactive exercises for vocabulary practice
 */

import { useState, useEffect } from "react";
import { HskWord, DataService } from "../services/dataService";
import { AudioService } from "../services/audioService";

type QuizType = "meaning" | "pinyin" | "character" | "audio";

interface QuizQuestion {
  word: HskWord;
  type: QuizType;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  hskLevel?: number;
  questionCount?: number;
  onComplete?: (score: number, total: number) => void;
}

export default function Quiz({
  hskLevel = 1,
  questionCount = 10,
  onComplete,
}: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, [hskLevel, questionCount]);

  const generateQuestions = () => {
    const words = DataService.getRandomWords(questionCount * 2, hskLevel);
    const newQuestions: QuizQuestion[] = [];

    const types: QuizType[] = ["meaning", "pinyin", "character"];

    for (let i = 0; i < Math.min(questionCount, words.length); i++) {
      const word = words[i];
      if (!word) continue;

      const type = types[i % types.length];
      const primaryForm = word.forms[0];

      if (!primaryForm) continue;

      let correctAnswer: string = "";
      let optionPool: string[] = [];

      switch (type) {
        case "meaning":
          correctAnswer = primaryForm.meanings[0] || "";
          optionPool = words
            .filter((w) => w && w.simplified !== word.simplified && w.forms[0])
            .map((w) => w.forms[0]?.meanings[0])
            .filter((m): m is string => Boolean(m));
          break;
        case "pinyin":
          correctAnswer = primaryForm.transcriptions.pinyin;
          optionPool = words
            .filter((w) => w && w.simplified !== word.simplified && w.forms[0])
            .map((w) => w.forms[0]?.transcriptions.pinyin)
            .filter((p): p is string => Boolean(p));
          break;
        case "character":
          correctAnswer = word.simplified;
          optionPool = words
            .filter((w) => w && w.simplified !== word.simplified)
            .map((w) => w.simplified);
          break;
        default:
          continue;
      }

      if (!correctAnswer) continue;

      // Generate 3 wrong options
      const shuffledPool = optionPool.sort(() => Math.random() - 0.5);
      const wrongOptions = shuffledPool.slice(0, 3);

      // Create options array with correct answer
      const options = [...wrongOptions, correctAnswer].sort(
        () => Math.random() - 0.5
      );

      newQuestions.push({
        word,
        type,
        options,
        correctAnswer,
      });
    }

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setIsComplete(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    const currentQ = questions[currentIndex];
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
      onComplete?.(
        score + (currentQ && selectedAnswer === currentQ.correctAnswer ? 1 : 0),
        questions.length
      );
    }
  };

  const getQuestionPrompt = (question: QuizQuestion): string => {
    const primaryForm = question.word.forms[0];
    switch (question.type) {
      case "meaning":
        return `What does "${question.word.simplified}" mean?`;
      case "pinyin":
        return `What is the pinyin for "${question.word.simplified}"?`;
      case "character":
        return `Which character means "${primaryForm?.meanings[0]}"?`;
      default:
        return "";
    }
  };

  if (questions.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-ink-500">Loading quiz...</div>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="card p-8 text-center animate-fadeIn">
        <div className="text-6xl mb-4">
          {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"}
        </div>
        <h2 className="text-2xl font-bold text-ink-900 mb-2">Quiz Complete!</h2>
        <p className="text-4xl font-bold text-chinese-red-600 mb-4">
          {score} / {questions.length}
        </p>
        <p className="text-ink-600 mb-6">
          {percentage >= 80
            ? "Excellent work! Keep it up!"
            : percentage >= 60
            ? "Good job! Practice makes perfect."
            : "Keep studying, you'll improve!"}
        </p>
        <button onClick={generateQuestions} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="card p-8 text-center">
        <div className="text-ink-500">Loading quiz...</div>
      </div>
    );
  }

  const primaryForm = currentQuestion.word.forms[0];

  return (
    <div className="card p-6 space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-ink-600">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span>Score: {score}</span>
      </div>

      <div className="w-full bg-ink-200 rounded-full h-2">
        <div
          className="bg-chinese-red-500 h-full rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="text-center py-6">
        {currentQuestion.type !== "character" && (
          <div
            className="text-5xl font-chinese mb-4 cursor-pointer hover:scale-110 transition-transform inline-block"
            onClick={() => {
              const audioUrl = `/audio/syllabs/cmn-${
                primaryForm?.transcriptions.numeric.split(" ")[0]
              }.mp3`;
              AudioService.play(audioUrl);
            }}
          >
            {currentQuestion.word.simplified}
          </div>
        )}
        <p className="text-lg text-ink-700">
          {getQuestionPrompt(currentQuestion)}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {currentQuestion.options.map((option, idx) => {
          let buttonClass = "p-4 rounded-lg border-2 text-left transition-all ";

          if (!showResult) {
            buttonClass +=
              "border-ink-200 hover:border-chinese-red-400 hover:bg-chinese-red-50";
          } else if (option === currentQuestion.correctAnswer) {
            buttonClass += "border-green-500 bg-green-50 text-green-700";
          } else if (option === selectedAnswer) {
            buttonClass += "border-red-500 bg-red-50 text-red-700";
          } else {
            buttonClass += "border-ink-200 opacity-50";
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              className={buttonClass}
              disabled={showResult}
            >
              <span
                className={
                  currentQuestion.type === "character"
                    ? "text-2xl font-chinese"
                    : ""
                }
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {showResult && (
        <div className="text-center animate-fadeIn">
          <button onClick={nextQuestion} className="btn-primary">
            {currentIndex < questions.length - 1
              ? "Next Question"
              : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}
