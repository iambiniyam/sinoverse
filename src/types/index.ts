/**
 * Chinese Learning Platform
 * Copyright (C) 2025
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

// Profile types
export type FocusArea = 'business' | 'daily_life' | 'travel' | 'hsk_prep';
export type ChineseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LocalProfile {
  id: string;
  nativeLanguage: string;
  chineseLevel: ChineseLevel;
  hskLevel: number;
  focusAreas: FocusArea[];
  createdAt: Date;
  updatedAt: Date;
}

// Vocabulary types
export type RecallRating = 'again' | 'hard' | 'good' | 'easy';
export type CardStatus = 'new' | 'learning' | 'review' | 'graduated';

export interface VocabularyCard {
  id: string;
  wordId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: Date;
  lastReviewDate: Date;
  status: CardStatus;
}

export interface IntervalResult {
  interval: number;
  easeFactor: number;
  repetitions: number;
  status: CardStatus;
}

// Word types
export interface Word {
  id: string;
  simplified: string;
  traditional: string;
  pinyin: string;
  tone: number;
  meaning: string;
  examples: string[];
  hskLevel: number;
  audioUrl?: string;
}

// Progress types
export interface SkillLevels {
  reading: number;
  writing: number;
  listening: number;
  speaking: number;
}

export interface UserProgress {
  totalStudyTime: number;
  currentStreak: number;
  longestStreak: number;
  wordsLearned: number;
  wordsMastered: number;
  lessonsCompleted: number;
  xpTotal: number;
  level: number;
  badges: Badge[];
  skillLevels: SkillLevels;
}

export interface Badge {
  id: string;
  type: string;
  name: string;
  description: string;
  earnedAt: Date;
}

export interface DailyStats {
  date: string;
  studyTime: number;
  wordsReviewed: number;
  newWordsLearned: number;
  lessonsCompleted: number;
  xpEarned: number;
}

// Lesson types
export type LessonCategory = 'business' | 'daily_life' | 'travel' | 'hsk_prep' | 'culture';
export type SkillType = 'reading' | 'writing' | 'listening' | 'speaking';
export type ExerciseType = 'multiple_choice' | 'fill_blank' | 'listening' | 'speaking' | 'character_writing' | 'matching';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  questionAudio?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleChinese: string;
  description: string;
  hskLevel: number;
  category: LessonCategory;
  skillTypes: SkillType[];
  prerequisites: string[];
  vocabulary: string[];
  grammarPoints: string[];
  exercises: Exercise[];
  estimatedMinutes: number;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  completedAt?: Date;
}

// Storage types
export interface ExportData {
  version: string;
  exportedAt: Date;
  profile: LocalProfile;
  vocabularyCards: VocabularyCard[];
  progress: UserProgress;
  lessonProgress: LessonProgress[];
}

export interface StorageUsage {
  used: number;
  quota: number;
  percentage: number;
}
