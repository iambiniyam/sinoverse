/**
 * Sinoverse - 华语宇宙
 * The World's Most Comprehensive Chinese Learning Platform
 * Copyright (C) 2025-2026
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Loading from "./components/Loading";
import { useProgressStore } from "./stores/progressStore";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Learn = lazy(() => import("./pages/Learn"));
const Vocabulary = lazy(() => import("./pages/Vocabulary"));
const Characters = lazy(() => import("./pages/Characters"));
const Pronunciation = lazy(() => import("./pages/Pronunciation"));
const Lessons = lazy(() => import("./pages/Lessons"));
const DictionaryPage = lazy(() => import("./pages/Dictionary"));
const Sentences = lazy(() => import("./pages/Sentences"));
const QuizPage = lazy(() => import("./pages/Quiz"));
const ChengyuPage = lazy(() => import("./pages/Chengyu"));
const MeasureWordsPage = lazy(() => import("./pages/MeasureWords"));
const GrammarPage = lazy(() => import("./pages/Grammar"));
const TechVocabularyPage = lazy(() => import("./pages/TechVocabulary"));

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { updateStreak } = useProgressStore();

  useEffect(() => {
    // Update streak on app load
    updateStreak();

    // Register service worker for PWA
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.warn("Service worker registration failed:", error);
      });
    }
  }, [updateStreak]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-chinese-red-50/30 flex flex-col">
          {/* Top Navigation */}
          <nav className="bg-white/95 backdrop-blur-sm border-b border-ink-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <NavLink to="/" className="flex items-center gap-2 group">
                  <div className="text-3xl font-bold bg-gradient-to-r from-chinese-red-600 to-chinese-red-500 bg-clip-text text-transparent group-hover:from-chinese-red-500 group-hover:to-chinese-gold-500 transition-all duration-300">
                    Sinoverse
                  </div>
                  <div className="text-lg font-medium text-ink-400 group-hover:text-chinese-red-500 transition-colors">
                    华语宇宙
                  </div>
                </NavLink>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-ink-100 transition-colors"
                  aria-label="Toggle menu"
                >
                  <span className="text-2xl">{mobileMenuOpen ? "✕" : "☰"}</span>
                </button>

                {/* Desktop nav - Enhanced */}
                <div className="hidden md:flex items-center gap-6">
                  <NavLink
                    to="/learn"
                    className={({ isActive }) =>
                      `text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "text-chinese-red-600 scale-105"
                          : "text-ink-600 hover:text-chinese-red-600 hover:scale-105"
                      }`
                    }
                  >
                    Learn
                  </NavLink>
                  <NavLink
                    to="/dictionary"
                    className={({ isActive }) =>
                      `text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "text-chinese-red-600 scale-105"
                          : "text-ink-600 hover:text-chinese-red-600 hover:scale-105"
                      }`
                    }
                  >
                    Dictionary
                  </NavLink>
                  <NavLink
                    to="/quiz"
                    className={({ isActive }) =>
                      `text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "text-chinese-red-600 scale-105"
                          : "text-ink-600 hover:text-chinese-red-600 hover:scale-105"
                      }`
                    }
                  >
                    Practice
                  </NavLink>
                </div>
              </div>

              {/* Mobile nav - Streamlined */}
              {mobileMenuOpen && (
                <div className="md:hidden py-4 border-t border-ink-100 animate-fadeIn">
                  <div className="flex flex-col gap-1.5">
                    {[
                      { to: "/learn", label: " Learn", group: "main" },
                      {
                        to: "/dictionary",
                        label: " Dictionary",
                        group: "main",
                      },
                      { to: "/grammar", label: "Grammar", group: "main" },
                      { to: "/quiz", label: " Practice", group: "main" },
                      {
                        to: "/vocabulary",
                        label: "Vocabulary",
                        group: "extra",
                      },
                      {
                        to: "/characters",
                        label: "Characters",
                        group: "extra",
                      },
                      {
                        to: "/pronunciation",
                        label: "Pronunciation",
                        group: "extra",
                      },
                      { to: "/sentences", label: "Sentences", group: "extra" },
                      { to: "/chengyu", label: "Idioms", group: "extra" },
                      {
                        to: "/measure-words",
                        label: "Measure Words",
                        group: "extra",
                      },
                      {
                        to: "/tech-vocabulary",
                        label: "💻 Tech/IT",
                        group: "extra",
                      },
                      { to: "/lessons", label: "Lessons", group: "extra" },
                    ].map((link, idx) => (
                      <div key={link.to}>
                        {link.group === "extra" && idx === 4 && (
                          <div className="px-4 py-2 text-xs font-semibold text-ink-400 uppercase tracking-wider">
                            More Tools
                          </div>
                        )}
                        <NavLink
                          to={link.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2.5 rounded-lg transition-colors ${
                              link.group === "main" ? "font-medium" : ""
                            } ${
                              isActive
                                ? "bg-chinese-red-50 text-chinese-red-600"
                                : "text-ink-600 hover:bg-ink-50"
                            }`
                          }
                        >
                          {link.label}
                        </NavLink>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 py-6 px-4">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/vocabulary" element={<Vocabulary />} />
                <Route path="/dictionary" element={<DictionaryPage />} />
                <Route path="/characters" element={<Characters />} />
                <Route path="/pronunciation" element={<Pronunciation />} />
                <Route path="/sentences" element={<Sentences />} />
                <Route path="/grammar" element={<GrammarPage />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/chengyu" element={<ChengyuPage />} />
                <Route path="/measure-words" element={<MeasureWordsPage />} />
                <Route
                  path="/tech-vocabulary"
                  element={<TechVocabularyPage />}
                />
              </Routes>
            </Suspense>
          </main>

          {/* Footer */}
          <footer className="bg-white/95 backdrop-blur-sm border-t border-ink-100 py-6">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <div className="text-lg font-bold bg-gradient-to-r from-chinese-red-600 to-chinese-gold-600 bg-clip-text text-transparent">
                    Sinoverse 华语宇宙
                  </div>
                  <p className="text-xs text-ink-500 mt-1">
                    The World's Most Comprehensive Chinese Learning Platform
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-ink-400">
                  <span>Open Source</span>
                  <span>•</span>
                  <span>GPL-3.0</span>
                  <span>•</span>
                  <a
                    href="https://github.com/iambiniyam/sinoverse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-chinese-red-600 transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
