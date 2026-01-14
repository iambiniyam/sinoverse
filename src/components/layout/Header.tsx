/**
 * Chinese Learning Platform
 * Copyright (C) 2025
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-white border-b border-ink-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🇨🇳</span>
            <span className="font-bold text-xl text-ink-900">学中文</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/learn"
              className="text-ink-600 hover:text-chinese-red-500 transition-colors"
            >
              Learn
            </Link>
            <Link
              to="/vocabulary"
              className="text-ink-600 hover:text-chinese-red-500 transition-colors"
            >
              Vocabulary
            </Link>
            <Link
              to="/lessons"
              className="text-ink-600 hover:text-chinese-red-500 transition-colors"
            >
              Lessons
            </Link>
            <Link
              to="/progress"
              className="text-ink-600 hover:text-chinese-red-500 transition-colors"
            >
              Progress
            </Link>
          </nav>

          {/* Settings */}
          <Link
            to="/settings"
            className="p-2 text-ink-500 hover:text-ink-700 transition-colors"
            aria-label="Settings"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
