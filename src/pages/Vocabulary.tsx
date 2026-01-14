/**
 * Chinese Learning Platform
 * Copyright (C) 2025
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { useState, useEffect } from "react";
import { useVocabularyStore } from "../stores/vocabularyStore";
import { useProgressStore } from "../stores/progressStore";
import { DataService, HskWord } from "../services/dataService";
import Flashcard from "../components/Flashcard";
import { RecallRating } from "../types";

export default function Vocabulary() {
  const { addCard, reviewCard, getDueCards, getCardStats } =
    useVocabularyStore();
  const { recordWordLearned, addStudyTime, updateStreak } = useProgressStore();

  const [currentWord, setCurrentWord] = useState<HskWord | null>(null);
  const [dueCards, setDueCards] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    loadDueCards();
  }, []);

  const loadDueCards = () => {
    const due = getDueCards();
    setDueCards(due.map((c) => c.wordId));

    if (due.length > 0 && due[0]) {
      const word = DataService.getWord(due[0].wordId);
      setCurrentWord(word || null);
    } else {
      setSessionComplete(true);
    }
  };

  const addNewWords = (count: number) => {
    const words = DataService.getRandomWords(count, selectedLevel);
    words.forEach((word) => {
      addCard(word.simplified);
    });
    loadDueCards();
    setSessionComplete(false);
  };

  const handleRate = (rating: RecallRating) => {
    if (!currentWord) return;

    reviewCard(currentWord.simplified, rating);
    addStudyTime(1);
    updateStreak();

    if (rating === "good" || rating === "easy") {
      recordWordLearned();
    }

    // Move to next card
    const remaining = dueCards.slice(1);
    setDueCards(remaining);

    if (remaining.length > 0 && remaining[0]) {
      const nextWord = DataService.getWord(remaining[0]);
      setCurrentWord(nextWord || null);
    } else {
      setSessionComplete(true);
      setCurrentWord(null);
    }
  };

  const stats = getCardStats();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="card p-6">
        <h1 className="text-3xl font-bold text-ink-900 mb-4">
          Vocabulary Practice
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.dueToday}
            </div>
            <div className="text-xs text-ink-600">Due Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.learning}
            </div>
            <div className="text-xs text-ink-600">Learning</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.graduated}
            </div>
            <div className="text-xs text-ink-600">Mastered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-ink-600">{stats.total}</div>
            <div className="text-xs text-ink-600">Total Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {dueCards.length}
            </div>
            <div className="text-xs text-ink-600">Remaining</div>
          </div>
        </div>
      </div>

      {/* Practice Session */}
      {currentWord && !sessionComplete ? (
        <Flashcard word={currentWord} onRate={handleRate} />
      ) : (
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4"></div>
          <h2 className="text-2xl font-bold text-ink-900 mb-2">
            {stats.total === 0 ? "Start Learning!" : "All Done!"}
          </h2>
          <p className="text-ink-600 mb-6">
            {stats.total === 0
              ? "Add some words to start your learning journey"
              : "Great work! You've completed all reviews for now."}
          </p>

          {/* Add New Words */}
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                Select HSK Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(Number(e.target.value))}
                className="w-full px-4 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                  <option key={level} value={level}>
                    HSK {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => addNewWords(5)}
                className="flex-1 btn-primary"
              >
                Add 5 Words
              </button>
              <button
                onClick={() => addNewWords(10)}
                className="flex-1 btn-primary"
              >
                Add 10 Words
              </button>
              <button
                onClick={() => addNewWords(20)}
                className="flex-1 btn-gold"
              >
                Add 20 Words
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
