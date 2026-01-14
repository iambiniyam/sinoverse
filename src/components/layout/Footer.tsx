/**
 * Chinese Learning Platform
 * Copyright (C) 2025
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-ink-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-ink-900 mb-3">学中文</h3>
            <p className="text-sm text-ink-600">
              A free, open-source Chinese learning platform for foreigners in China.
              Learn Mandarin with AI-powered pronunciation, spaced repetition, and real-world scenarios.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-ink-900 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/learn" className="text-ink-600 hover:text-chinese-red-500">
                  Start Learning
                </Link>
              </li>
              <li>
                <Link to="/hsk" className="text-ink-600 hover:text-chinese-red-500">
                  HSK Preparation
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-ink-600 hover:text-chinese-red-500">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Open Source */}
          <div>
            <h3 className="font-bold text-ink-900 mb-3">Open Source</h3>
            <p className="text-sm text-ink-600 mb-2">
              Licensed under GPLv3. Free to use, modify, and distribute.
            </p>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-chinese-red-500 hover:text-chinese-red-600"
            >
              View on GitHub →
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-ink-100 text-center text-sm text-ink-500">
          <p>© 2025 Chinese Learning Platform. Released under the GNU General Public License v3.</p>
        </div>
      </div>
    </footer>
  );
}
