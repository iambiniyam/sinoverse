/**
 * Settings Page
 * User preferences and data management
 */

import { useState } from "react";
import { useProgressStore } from "../stores/progressStore";
import { useVocabularyStore } from "../stores/vocabularyStore";

interface UserSettings {
  dailyGoal: number;
  hskLevel: number;
  showPinyin: boolean;
  audioEnabled: boolean;
  darkMode: boolean;
}

export default function Settings() {
  const {
    xpTotal,
    currentStreak,
    level,
    wordsLearned,
    reset: resetProgress,
  } = useProgressStore();
  const { cards, clearAll } = useVocabularyStore();
  const [settings, setSettings] = useState<UserSettings>({
    dailyGoal: 20,
    hskLevel: 1,
    showPinyin: true,
    audioEnabled: true,
    darkMode: false,
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExportData = () => {
    const exportData = {
      settings,
      progress: {
        xpTotal,
        currentStreak,
        level,
        wordsLearned,
      },
      vocabulary: Array.from(cards.entries()),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chinese-learning-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetAll = () => {
    resetProgress();
    clearAll();
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="card">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">Settings 设置</h1>
        <p className="text-ink-600">Customize your learning experience</p>
      </div>

      {/* Study Preferences */}
      <div className="card space-y-6">
        <h2 className="text-xl font-bold text-ink-900">Study Preferences</h2>

        {/* Daily Goal */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            Daily Word Goal
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={settings.dailyGoal}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  dailyGoal: Number(e.target.value),
                }))
              }
              className="flex-1 h-2 bg-ink-200 rounded-lg appearance-none cursor-pointer accent-chinese-red-500"
            />
            <span className="text-lg font-bold text-chinese-red-600 w-12 text-center">
              {settings.dailyGoal}
            </span>
          </div>
        </div>

        {/* HSK Level */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            Current HSK Level
          </label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7].map((level) => (
              <button
                key={level}
                onClick={() => setSettings((s) => ({ ...s, hskLevel: level }))}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  settings.hskLevel === level
                    ? "bg-chinese-red-500 text-white"
                    : "bg-ink-100 hover:bg-ink-200"
                }`}
              >
                HSK {level}
                {level === 7 && <span className="text-xs ml-1">(7-9)</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-ink-700">Show Pinyin by default</span>
            <button
              onClick={() =>
                setSettings((s) => ({ ...s, showPinyin: !s.showPinyin }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.showPinyin ? "bg-jade-500" : "bg-ink-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.showPinyin ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-ink-700">Enable audio</span>
            <button
              onClick={() =>
                setSettings((s) => ({ ...s, audioEnabled: !s.audioEnabled }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.audioEnabled ? "bg-jade-500" : "bg-ink-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.audioEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Progress Statistics */}
      <div className="card">
        <h2 className="text-xl font-bold text-ink-900 mb-4">Your Progress</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-ink-50 rounded-lg">
            <div className="text-2xl font-bold text-chinese-red-600">
              {level}
            </div>
            <div className="text-sm text-ink-600">Level</div>
          </div>
          <div className="text-center p-4 bg-ink-50 rounded-lg">
            <div className="text-2xl font-bold text-jade-600">{xpTotal}</div>
            <div className="text-sm text-ink-600">Total XP</div>
          </div>
          <div className="text-center p-4 bg-ink-50 rounded-lg">
            <div className="text-2xl font-bold text-chinese-gold-600">
              {currentStreak}
            </div>
            <div className="text-sm text-ink-600">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-ink-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {wordsLearned}
            </div>
            <div className="text-sm text-ink-600">Words Learned</div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <h2 className="text-xl font-bold text-ink-900 mb-4">Data Management</h2>
        <div className="space-y-4">
          <button
            onClick={handleExportData}
            className="w-full py-3 px-4 bg-jade-500 hover:bg-jade-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            📥 Export Progress Data
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-3 px-4 bg-ink-100 hover:bg-ink-200 text-ink-700 rounded-lg transition-colors"
          >
            🔄 Reset All Progress
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 animate-slideIn">
            <h3 className="text-xl font-bold text-ink-900 mb-2">
              Reset All Progress?
            </h3>
            <p className="text-ink-600 mb-6">
              This will permanently delete all your vocabulary cards, progress,
              XP, and streak data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 px-4 bg-ink-100 hover:bg-ink-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAll}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About */}
      <div className="card">
        <h2 className="text-xl font-bold text-ink-900 mb-4">About</h2>
        <div className="text-ink-600 space-y-2">
          <p>
            <strong>Chinese Learning Platform</strong> - A minimalist approach
            to mastering Mandarin Chinese.
          </p>
          <p className="text-sm">
            Built with ❤ using React, TypeScript, and Tailwind CSS. Uses spaced
            repetition (SM-2 algorithm) for optimal learning.
          </p>
          <p className="text-sm text-ink-500">
            Data sources: HSK vocabulary, CEDICT, Make Me a Hanzi.
          </p>
        </div>
      </div>
    </div>
  );
}
