/**
 * Progress Store
 * Tracks user learning progress, streaks, and achievements
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProgress, DailyStats, Badge } from "../types";

interface ProgressState extends UserProgress {
  dailyStats: DailyStats[];

  // Actions
  addStudyTime: (minutes: number) => void;
  recordWordLearned: () => void;
  recordWordMastered: () => void;
  recordLessonCompleted: () => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  getTodayStats: () => DailyStats;
  getWeekStats: () => DailyStats[];
  checkAndAwardBadges: () => void;
  reset: () => void;
}

const INITIAL_STATE: UserProgress = {
  totalStudyTime: 0,
  currentStreak: 0,
  longestStreak: 0,
  wordsLearned: 0,
  wordsMastered: 0,
  lessonsCompleted: 0,
  xpTotal: 0,
  level: 1,
  badges: [],
  skillLevels: {
    reading: 0,
    writing: 0,
    listening: 0,
    speaking: 0,
  },
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      dailyStats: [],

      addStudyTime: (minutes: number) => {
        const today = get().getTodayStats();
        const dailyStats = get().dailyStats.filter(
          (s) => s.date !== today.date
        );

        set((state) => ({
          totalStudyTime: state.totalStudyTime + minutes,
          dailyStats: [
            ...dailyStats,
            { ...today, studyTime: today.studyTime + minutes },
          ],
        }));
      },

      recordWordLearned: () => {
        const today = get().getTodayStats();
        const dailyStats = get().dailyStats.filter(
          (s) => s.date !== today.date
        );

        set((state) => ({
          wordsLearned: state.wordsLearned + 1,
          dailyStats: [
            ...dailyStats,
            { ...today, newWordsLearned: today.newWordsLearned + 1 },
          ],
        }));

        get().addXP(10);
        get().checkAndAwardBadges();
      },

      recordWordMastered: () => {
        set((state) => ({
          wordsMastered: state.wordsMastered + 1,
        }));

        get().addXP(25);
        get().checkAndAwardBadges();
      },

      recordLessonCompleted: () => {
        const today = get().getTodayStats();
        const dailyStats = get().dailyStats.filter(
          (s) => s.date !== today.date
        );

        set((state) => ({
          lessonsCompleted: state.lessonsCompleted + 1,
          dailyStats: [
            ...dailyStats,
            { ...today, lessonsCompleted: today.lessonsCompleted + 1 },
          ],
        }));

        get().addXP(50);
        get().checkAndAwardBadges();
      },

      addXP: (amount: number) => {
        set((state) => {
          const newXP = state.xpTotal + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;

          const today = get().getTodayStats();
          const dailyStats = get().dailyStats.filter(
            (s) => s.date !== today.date
          );

          return {
            xpTotal: newXP,
            level: newLevel,
            dailyStats: [
              ...dailyStats,
              { ...today, xpEarned: today.xpEarned + amount },
            ],
          };
        });
      },

      updateStreak: () => {
        const today = new Date().toISOString().split("T")[0];
        const { dailyStats } = get();

        // Check if already studied today
        const studiedToday = dailyStats.some(
          (s) => s.date === today && s.studyTime > 0
        );

        if (!studiedToday) {
          return; // No activity today yet
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const studiedYesterday = dailyStats.some(
          (s) => s.date === yesterdayStr && s.studyTime > 0
        );

        set((state) => {
          let newStreak = state.currentStreak;

          if (studiedYesterday || state.currentStreak === 0) {
            newStreak = state.currentStreak + 1;
          }

          return {
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
          };
        });
      },

      getTodayStats: () => {
        const today = new Date().toISOString().split("T")[0] as string;
        const { dailyStats } = get();

        const existing = dailyStats.find((s) => s.date === today);

        return (
          existing || {
            date: today,
            studyTime: 0,
            wordsReviewed: 0,
            newWordsLearned: 0,
            lessonsCompleted: 0,
            xpEarned: 0,
          }
        );
      },

      getWeekStats: () => {
        const { dailyStats } = get();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        return dailyStats.filter((s) => new Date(s.date) >= weekAgo);
      },

      checkAndAwardBadges: () => {
        const state = get();
        const newBadges: Badge[] = [];

        // First Words badge
        if (
          state.wordsLearned >= 10 &&
          !state.badges.some((b) => b.type === "first_10")
        ) {
          newBadges.push({
            id: `badge-${Date.now()}-1`,
            type: "first_10",
            name: "初学者",
            description: "Learned 10 words",
            earnedAt: new Date(),
          });
        }

        // Vocabulary Master
        if (
          state.wordsLearned >= 100 &&
          !state.badges.some((b) => b.type === "vocab_100")
        ) {
          newBadges.push({
            id: `badge-${Date.now()}-2`,
            type: "vocab_100",
            name: "词汇大师",
            description: "Learned 100 words",
            earnedAt: new Date(),
          });
        }

        // Week Streak
        if (
          state.currentStreak >= 7 &&
          !state.badges.some((b) => b.type === "streak_7")
        ) {
          newBadges.push({
            id: `badge-${Date.now()}-3`,
            type: "streak_7",
            name: "七天坚持",
            description: "7-day study streak",
            earnedAt: new Date(),
          });
        }

        if (newBadges.length > 0) {
          set((state) => ({
            badges: [...state.badges, ...newBadges],
          }));
        }
      },

      reset: () => {
        set({ ...INITIAL_STATE, dailyStats: [] });
      },
    }),
    {
      name: "progress-storage",
    }
  )
);
