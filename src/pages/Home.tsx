/**
 * Sinoverse - Home Page
 * The World's Most Comprehensive Chinese Learning Platform
 */

import { Link } from "react-router-dom";
import { useProgressStore } from "../stores/progressStore";
import { useVocabularyStore } from "../stores/vocabularyStore";
import { DataService } from "../services/dataService";
import { useEffect, useState } from "react";

export default function Home() {
  const progress = useProgressStore();
  const { getCardStats } = useVocabularyStore();
  const [stats, setStats] = useState<ReturnType<
    typeof DataService.getDatasetStats
  > | null>(null);
  const cardStats = getCardStats();

  useEffect(() => {
    setStats(DataService.getDatasetStats());
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12 mb-12">
        <div className="inline-block mb-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            <span className="bg-gradient-to-r from-chinese-red-600 via-chinese-red-500 to-chinese-gold-500 bg-clip-text text-transparent">
              Sinoverse
            </span>
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-ink-600">
            华语宇宙
          </p>
        </div>

        <p className="text-xl text-ink-700 mb-2 max-w-3xl mx-auto leading-relaxed">
          The World's Most Comprehensive Chinese Learning Platform
        </p>
        <p className="text-lg text-ink-600 mb-8 max-w-2xl mx-auto">
          Master Mandarin with spaced repetition, native audio, stroke
          animations, and science-backed learning methods.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/learn"
            className="px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-chinese-red-600 to-chinese-red-500 text-white hover:from-chinese-red-500 hover:to-chinese-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {progress.wordsLearned > 0 ? "Continue Learning" : "Start Learning"}
          </Link>
          <Link
            to="/dictionary"
            className="px-8 py-4 text-lg font-bold rounded-xl bg-white border-2 border-chinese-red-500 text-chinese-red-600 hover:bg-chinese-red-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Explore Dictionary
          </Link>
        </div>

        {progress.wordsLearned > 0 && (
          <div className="inline-flex items-center gap-6 p-5 bg-gradient-to-r from-jade-50 to-chinese-gold-50 rounded-xl border border-jade-200 shadow-md">
            <div className="text-center">
              <div className="text-3xl font-bold text-jade-700">
                {progress.wordsLearned}
              </div>
              <div className="text-sm text-ink-600">words learned</div>
            </div>
            <div className="h-12 w-px bg-ink-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-chinese-red-600">
                {progress.currentStreak}
              </div>
              <div className="text-sm text-ink-600">day streak</div>
            </div>
            <div className="h-12 w-px bg-ink-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-chinese-gold-600">
                {cardStats.dueToday}
              </div>
              <div className="text-sm text-ink-600">due today</div>
            </div>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-ink-900 mb-8">
          Everything You Need to Master Chinese
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/vocabulary"
            className="group card hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-chinese-red-200"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              <span className="font-bold text-chinese-red-600">V</span>
            </div>
            <h3 className="font-bold text-lg text-ink-900 mb-2">
              Spaced Repetition
            </h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              SM-2 algorithm optimizes review timing for maximum long-term
              retention and efficient learning
            </p>
            <div className="mt-3 text-xs text-chinese-red-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              {cardStats.total} cards tracked →
            </div>
          </Link>

          <Link
            to="/pronunciation"
            className="group card hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-jade-200"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              <span className="font-bold text-jade-600">♪</span>
            </div>
            <h3 className="font-bold text-lg text-ink-900 mb-2">
              Native Audio
            </h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              Practice perfect pronunciation with {stats?.totalTonePairs || 16}{" "}
              tone pair combinations and native speaker recordings
            </p>
            <div className="mt-3 text-xs text-jade-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Master all 4 tones →
            </div>
          </Link>

          <Link
            to="/characters"
            className="group card hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-chinese-gold-200"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              <span className="font-bold text-chinese-gold-600">書</span>
            </div>
            <h3 className="font-bold text-lg text-ink-900 mb-2">
              Stroke Order Animations
            </h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              Learn proper character writing with animated stroke-by-stroke
              guides for 20,000+ characters
            </p>
            <div className="mt-3 text-xs text-chinese-gold-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Perfect your writing →
            </div>
          </Link>

          <Link
            to="/lessons"
            className="group card hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-blue-200"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              <span className="font-bold text-blue-600">L</span>
            </div>
            <h3 className="font-bold text-lg text-ink-900 mb-2">
              Complete HSK 1-9 Curriculum
            </h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              {stats?.totalWords.toLocaleString() || "10,000+"} words covering
              all 9 levels of the new HSK 3.0 standard
            </p>
            <div className="mt-3 text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Browse by level →
            </div>
          </Link>

          <Link
            to="/dictionary"
            className="group card hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-purple-200"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              <span className="font-bold text-purple-600">D</span>
            </div>
            <h3 className="font-bold text-lg text-ink-900 mb-2">
              Comprehensive Dictionary
            </h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              Search {stats?.totalWords.toLocaleString() || "10,000+"} words
              with pinyin, meanings, examples, and audio pronunciation
            </p>
            <div className="mt-3 text-xs text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Search now →
            </div>
          </Link>

          <Link
            to="/chengyu"
            className="group card hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-chinese-red-200"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              <span className="font-bold text-chinese-red-600">成</span>
            </div>
            <h3 className="font-bold text-lg text-ink-900 mb-2">
              {stats?.totalChengyu.toLocaleString() || "30,895"} Chinese Idioms
            </h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              Master chengyu (成语) with explanations, derivations, and usage
              examples
            </p>
            <div className="mt-3 text-xs text-chinese-red-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Explore idioms →
            </div>
          </Link>

          <Link
            to="/sentences"
            className="group card hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-jade-200"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              <span className="font-bold text-jade-600">句</span>
            </div>
            <h3 className="font-bold text-lg text-ink-900 mb-2">
              {stats?.totalSentences.toLocaleString() || "13,023"} Example
              Sentences
            </h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              Practice listening, reading comprehension, and learn vocabulary in
              context
            </p>
            <div className="mt-3 text-xs text-jade-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Start practicing →
            </div>
          </Link>

          <Link
            to="/measure-words"
            className="group card hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-chinese-gold-200"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              <span className="font-bold text-chinese-gold-600">量</span>
            </div>
            <h3 className="font-bold text-lg text-ink-900 mb-2">
              Essential Measure Words
            </h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              {stats?.totalMeasureWords || 129} essential Chinese classifiers
              with usage patterns and examples
            </p>
            <div className="mt-3 text-xs text-chinese-gold-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Learn classifiers →
            </div>
          </Link>

          <Link
            to="/grammar"
            className="group card hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-blue-200"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              <span className="font-bold text-blue-600">文</span>
            </div>
            <h3 className="font-bold text-lg text-ink-900 mb-2">
              Grammar Patterns
            </h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              Master essential Chinese grammar structures with clear
              explanations and examples
            </p>
            <div className="mt-3 text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Study grammar →
            </div>
          </Link>

          <Link
            to="/tech-vocabulary"
            className="group card hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-indigo-200"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              💻
            </div>
            <h3 className="font-bold text-lg text-ink-900 mb-2">
              Tech & IT Vocabulary
            </h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              100+ essential technology and IT terms in Chinese - perfect for
              developers and tech professionals
            </p>
            <div className="mt-3 text-xs text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Learn tech terms →
            </div>
          </Link>

          <Link
            to="/quiz"
            className="group card hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-purple-200"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              <span className="font-bold text-purple-600">Q</span>
            </div>
            <h3 className="font-bold text-lg text-ink-900 mb-2">
              Interactive Practice
            </h3>
            <p className="text-sm text-ink-600 leading-relaxed">
              Test your knowledge with adaptive quizzes and instant feedback on
              your progress
            </p>
            <div className="mt-3 text-xs text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Take a quiz →
            </div>
          </Link>
        </div>
      </div>

      {/* HSK Levels - Enhanced */}
      <div className="card bg-gradient-to-br from-chinese-red-50 via-chinese-gold-50 to-jade-50 border-2 border-chinese-red-200 mb-12">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-ink-900 mb-3">
            Complete HSK 3.0 Curriculum
          </h2>
          <p className="text-ink-600 text-lg">
            {stats?.totalWords.toLocaleString() || "10,000+"} words across 7
            levels
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {[1, 2, 3, 4, 5, 6, 7].map((level) => {
            const levelWords = stats?.hskLevels[level] || 0;
            const levelName = level === 7 ? "7-9 (Advanced)" : `${level}`;
            return (
              <Link
                key={level}
                to={`/lessons?level=${level}`}
                className="group px-6 py-4 rounded-xl bg-white hover:bg-gradient-to-r hover:from-chinese-red-500 hover:to-chinese-red-600 border-2 border-chinese-red-300 hover:border-chinese-red-500 font-bold text-ink-900 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
              >
                <div className="text-lg">HSK {levelName}</div>
                {levelWords > 0 && (
                  <div className="text-xs opacity-70 mt-1">
                    {levelWords.toLocaleString()} words
                  </div>
                )}
              </Link>
            );
          })}
        </div>
        <p className="text-center text-sm text-ink-500 mt-4">
          From beginner to advanced - your complete learning path
        </p>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="card text-center bg-gradient-to-br from-chinese-red-50 to-white border border-chinese-red-200">
            <div className="text-4xl font-bold text-chinese-red-600 mb-2">
              {stats.totalWords.toLocaleString()}
            </div>
            <div className="text-sm text-ink-600">HSK Words</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-jade-50 to-white border border-jade-200">
            <div className="text-4xl font-bold text-jade-600 mb-2">
              {stats.totalChengyu.toLocaleString()}
            </div>
            <div className="text-sm text-ink-600">Chinese Idioms</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-chinese-gold-50 to-white border border-chinese-gold-200">
            <div className="text-4xl font-bold text-chinese-gold-600 mb-2">
              {stats.totalSentences.toLocaleString()}
            </div>
            <div className="text-sm text-ink-600">Example Sentences</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-blue-50 to-white border border-blue-200">
            <div className="text-4xl font-bold text-blue-600 mb-2">20,000+</div>
            <div className="text-sm text-ink-600">Stroke Animations</div>
          </div>
        </div>
      )}

      {/* Open Source CTA - Enhanced */}
      <div className="card bg-gradient-to-r from-ink-900 to-ink-800 text-white text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-3">100% Free & Open Source</h3>
          <p className="text-ink-200 text-lg max-w-2xl mx-auto">
            Built with React, TypeScript, and modern web technologies.
            Contribute to make Chinese learning accessible to everyone.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://github.com/iambiniyam/sinoverse"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 text-lg rounded-xl bg-white text-ink-900 hover:bg-ink-100 font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            ⭐ Star on GitHub
          </a>
          <Link
            to="/learn"
            className="px-8 py-3 text-lg rounded-xl bg-transparent border-2 border-white text-white hover:bg-white hover:text-ink-900 font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🚀 Start Learning
          </Link>
        </div>
      </div>
    </div>
  );
}
