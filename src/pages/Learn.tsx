/**
 * Sinoverse - Daily Learning Hub
 * Interactive learning with flashcards, spaced repetition, and progress tracking
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVocabularyStore } from "../stores/vocabularyStore";
import { useProgressStore } from "../stores/progressStore";
import { DataService, HskWord } from "../services/dataService";
import Flashcard from "../components/Flashcard";
import { RecallRating } from "../types";
import { AudioService } from "../services/audioService";

export default function Learn() {
  const navigate = useNavigate();
  const { getDueCards, reviewCard, addCard, getCardStats } =
    useVocabularyStore();
  const { addXP, recordWordLearned, addStudyTime, updateStreak } =
    useProgressStore();

  const [dueCards, setDueCards] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<HskWord | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [recommendedLevel, setRecommendedLevel] = useState(1);

  const stats = getCardStats();
  const progress = useProgressStore();

  useEffect(() => {
    loadDueCards();
    determineLevel();
    updateStreak();
    // Preload audio for better UX
    if (currentWord) {
      const form = currentWord.forms[0];
      if (form) {
        AudioService.preloadWordAudio(form.transcriptions.numeric);
      }
    }
  }, []);

  const determineLevel = () => {
    const wordsLearned = progress.wordsLearned;
    if (wordsLearned < 150) setRecommendedLevel(1);
    else if (wordsLearned < 300) setRecommendedLevel(2);
    else if (wordsLearned < 600) setRecommendedLevel(3);
    else if (wordsLearned < 1200) setRecommendedLevel(4);
    else if (wordsLearned < 2500) setRecommendedLevel(5);
    else setRecommendedLevel(6);
  };

  const loadDueCards = () => {
    const due = getDueCards();
    const dueIds = due.map((c) => c.wordId);
    setDueCards(dueIds);

    if (dueIds.length > 0 && due[0]) {
      const word = DataService.getWord(due[0].wordId);
      setCurrentWord(word || null);
      setSessionComplete(false);
    } else {
      setSessionComplete(true);
    }
  };

  const addNewWords = (count: number, level?: number) => {
    const targetLevel = level || recommendedLevel;
    const words = DataService.getRandomWords(count, targetLevel);

    words.forEach((word) => {
      addCard(word.simplified);
    });

    loadDueCards();
    setShowStats(false);
  };

  const handleRate = (rating: RecallRating) => {
    if (!currentWord) return;

    reviewCard(currentWord.simplified, rating);
    addStudyTime(1);
    addXP(rating === "easy" ? 15 : rating === "good" ? 10 : 5);

    if (rating === "good" || rating === "easy") {
      recordWordLearned();
    }

    const remaining = dueCards.slice(1);
    setDueCards(remaining);

    if (remaining.length > 0 && remaining[0]) {
      const nextWord = DataService.getWord(remaining[0]);
      setCurrentWord(nextWord || null);
      // Preload next word audio
      if (nextWord) {
        const form = nextWord.forms[0];
        if (form) {
          AudioService.preloadWordAudio(form.transcriptions.numeric);
        }
      }
    } else {
      setSessionComplete(true);
      setCurrentWord(null);
    }
  };

  const playWord = async () => {
    if (!currentWord) return;
    const form = currentWord.forms[0];
    if (!form) return;

    try {
      await AudioService.playWord(form.transcriptions.numeric, 250);
    } catch (error) {
      console.warn("Audio playback failed:", error);
    }
  };

  if (showStats || sessionComplete) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Daily Learning</h1>
            <p className="text-xl text-white/90">
              每日学习 • Master Chinese with Science-Backed Methods
            </p>
          </div>
        </div>

        {/* Progress Overview - Enhanced Design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-red-200">
            <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {progress.wordsLearned}
            </div>
            <div className="text-sm font-medium text-gray-700 mt-2">
              Words Learned
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-green-200">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {progress.currentStreak}
            </div>
            <div className="text-sm font-medium text-gray-700 mt-2">
              Day Streak
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-yellow-200">
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              {Math.floor(progress.totalStudyTime / 60)}h
            </div>
            <div className="text-sm font-medium text-gray-700 mt-2">
              Study Time
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-blue-200">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {stats.dueToday}
            </div>
            <div className="text-sm font-medium text-gray-700 mt-2">
              Due Today
            </div>
          </div>
        </div>

        {/* Learning Status - Modern Cards */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Vocabulary Progress
            </h3>
            <div className="text-sm text-gray-500">
              Total:{" "}
              <span className="font-bold text-gray-900">{stats.total}</span>{" "}
              cards
            </div>
          </div>

          <div className="space-y-6">
            {/* New Cards */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="font-semibold text-gray-700">New</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {stats.new}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-blue-700"
                  style={{
                    width: `${
                      stats.total > 0 ? (stats.new / stats.total) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Learning Cards */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg"></span>
                  <span className="font-semibold text-gray-700">Learning</span>
                </div>
                <span className="text-sm font-bold text-orange-600">
                  {stats.learning}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-500 group-hover:from-orange-600 group-hover:to-orange-700"
                  style={{
                    width: `${
                      stats.total > 0 ? (stats.learning / stats.total) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Review Cards */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg"></span>
                  <span className="font-semibold text-gray-700">Mastered</span>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {stats.review}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500 group-hover:from-green-600 group-hover:to-emerald-700"
                  style={{
                    width: `${
                      stats.total > 0 ? (stats.review / stats.total) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        {sessionComplete ? (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-10 shadow-2xl border-2 border-green-200 animate-scaleIn">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full -mr-48 -mt-48 blur-3xl"></div>

            <div className="relative z-10 text-center">
              <div className="text-7xl mb-6 animate-pulse"></div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Session Complete!
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                干得好! You've reviewed all due cards for today.
              </p>

              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={() => addNewWords(10)}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  Learn 10 New Words (HSK {recommendedLevel})
                </button>
                <button
                  onClick={() => navigate("/lessons")}
                  className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:border-red-600 hover:text-red-600 transition-all duration-200 shadow hover:shadow-lg transform hover:scale-105 active:scale-95"
                >
                  Browse Lessons
                </button>
                <button
                  onClick={() => navigate("/quiz")}
                  className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:border-orange-600 hover:text-orange-600 transition-all duration-200 shadow hover:shadow-lg transform hover:scale-105 active:scale-95"
                >
                  Take a Quiz
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Start Session Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span></span> Start Your Learning Session
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                You have{" "}
                <span className="font-bold text-red-600">{stats.dueToday}</span>{" "}
                cards due for review today. Consistent practice is key to
                mastery!
              </p>
              <button
                onClick={() => setShowStats(false)}
                className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-lg rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Start Reviewing ({dueCards.length} cards)
              </button>
            </div>

            {/* Add New Words Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">+</span> Add New Words
              </h3>
              <p className="text-gray-600 mb-6">
                Recommended level based on your progress:
                <span className="ml-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold rounded-full text-sm">
                  HSK {recommendedLevel}
                </span>
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => addNewWords(5)}
                  className="flex-1 min-w-[120px] px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold rounded-lg hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-400 transition-all transform hover:scale-105 active:scale-95"
                >
                  +5 Words
                </button>
                <button
                  onClick={() => addNewWords(10)}
                  className="flex-1 min-w-[120px] px-6 py-3 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-semibold rounded-lg hover:from-orange-100 hover:to-orange-200 border-2 border-orange-200 hover:border-orange-400 transition-all transform hover:scale-105 active:scale-95"
                >
                  +10 Words
                </button>
                <button
                  onClick={() => addNewWords(20)}
                  className="flex-1 min-w-[120px] px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 font-semibold rounded-lg hover:from-red-100 hover:to-red-200 border-2 border-red-200 hover:border-red-400 transition-all transform hover:scale-105 active:scale-95"
                >
                  +20 Words
                </button>
              </div>
            </div>

            {/* Quick Navigation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Quick Actions
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate("/vocabulary")}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg transition-all text-left border-2 border-purple-200 hover:border-purple-400 transform hover:scale-105 active:scale-95"
                >
                  <div className="text-3xl mb-3 font-bold text-purple-600">
                    V
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    Vocabulary
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Browse and practice flashcards
                  </p>
                </button>

                <button
                  onClick={() => navigate("/lessons")}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition-all text-left border-2 border-blue-200 hover:border-blue-400 transform hover:scale-105 active:scale-95"
                >
                  <div className="text-3xl mb-3 font-bold text-blue-600">L</div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    HSK Lessons
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Complete HSK 1-9 curriculum
                  </p>
                </button>

                <button
                  onClick={() => navigate("/pronunciation")}
                  className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 hover:shadow-lg transition-all text-left border-2 border-pink-200 hover:border-pink-400 transform hover:scale-105 active:scale-95"
                >
                  <div className="text-3xl mb-3"></div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    Pronunciation
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Master Chinese tones
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active review session
  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span className="font-semibold text-gray-900">
            Progress: {stats.dueToday - dueCards.length + 1} / {stats.dueToday}
          </span>
          <button
            onClick={() => setShowStats(true)}
            className="text-red-600 hover:text-red-700 font-semibold transition-colors hover:underline"
          >
            View Stats
          </button>
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full transition-all duration-500 shadow-lg"
            style={{
              width: `${
                stats.dueToday > 0
                  ? ((stats.dueToday - dueCards.length) / stats.dueToday) * 100
                  : 0
              }%`,
            }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          {dueCards.length} cards remaining
        </div>
      </div>

      {/* Flashcard */}
      {currentWord && (
        <div className="space-y-4">
          <Flashcard word={currentWord} onRate={handleRate} />

          {/* Audio Button */}
          <div className="text-center">
            <button
              onClick={playWord}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
            >
              <span></span>
              <span>Play Pronunciation</span>
            </button>
          </div>

          {/* Helpful Tips */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>💡</span> Pro Tip
            </h4>
            <p className="text-sm text-gray-700">
              Focus on understanding, not just memorizing. Try to create your
              own sentences using this word!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
