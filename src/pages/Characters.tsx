/**
 * Chinese Learning Platform
 * Copyright (C) 2025
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { useState } from "react";
import { DataService, Radical } from "../services/dataService";
import StrokeAnimator from "../components/StrokeAnimator";

type ViewMode = "radicals" | "strokes";

export default function Characters() {
  const [radicals] = useState<Radical[]>(DataService.getRadicals());
  const [selectedRadical, setSelectedRadical] = useState<Radical | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("radicals");
  const [strokeCharacter, setStrokeCharacter] = useState("中");

  const filteredRadicals = radicals.filter(
    (r) =>
      r.radical.includes(searchQuery) ||
      r.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.pinyin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedByStrokes = filteredRadicals.reduce((acc, radical) => {
    const strokeCount = radical.strokes;
    if (!acc[strokeCount]) {
      acc[strokeCount] = [];
    }
    acc[strokeCount].push(radical);
    return acc;
  }, {} as Record<number, Radical[]>);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">
          Chinese Characters 汉字
        </h1>
        <p className="text-ink-600">
          Learn radicals and character components to master Chinese writing
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode("radicals")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === "radicals"
              ? "bg-chinese-red-500 text-white"
              : "bg-white border border-ink-200 hover:border-chinese-red-400"
          }`}
        >
          Radicals
        </button>
        <button
          onClick={() => setViewMode("strokes")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === "strokes"
              ? "bg-chinese-red-500 text-white"
              : "bg-white border border-ink-200 hover:border-chinese-red-400"
          }`}
        >
          ✏ Stroke Order
        </button>
      </div>

      {viewMode === "strokes" ? (
        /* Stroke Order View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Character Input */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink-900 mb-4">
              Practice Stroke Order
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-ink-600 mb-2">
                  Enter a character to practice:
                </label>
                <input
                  type="text"
                  value={strokeCharacter}
                  onChange={(e) =>
                    setStrokeCharacter(e.target.value.slice(0, 1))
                  }
                  className="w-full px-4 py-3 text-3xl font-chinese text-center border border-ink-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent"
                  placeholder="中"
                  maxLength={1}
                />
              </div>

              {/* Quick character selection */}
              <div>
                <label className="block text-sm text-ink-600 mb-2">
                  Or select a common character:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "中",
                    "国",
                    "人",
                    "大",
                    "小",
                    "日",
                    "月",
                    "水",
                    "火",
                    "山",
                    "木",
                    "心",
                  ].map((char) => (
                    <button
                      key={char}
                      onClick={() => setStrokeCharacter(char)}
                      className={`w-12 h-12 text-2xl font-chinese rounded-lg border-2 transition-all hover:scale-110 ${
                        strokeCharacter === char
                          ? "border-chinese-red-500 bg-chinese-red-50"
                          : "border-ink-200 hover:border-chinese-red-300"
                      }`}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stroke Animation */}
          <div className="card p-6 flex flex-col items-center justify-center">
            <StrokeAnimator character={strokeCharacter} size={280} />
          </div>
        </div>
      ) : (
        /* Radicals View */
        <>
          {/* Search */}
          <div className="card p-4">
            <input
              type="text"
              placeholder="Search radicals by meaning, pinyin, or character..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-ink-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radical List */}
            <div className="lg:col-span-2 space-y-4">
              {Object.entries(groupedByStrokes)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([strokeCount, rads]) => (
                  <div key={strokeCount} className="card p-4">
                    <h3 className="font-bold text-ink-900 mb-3">
                      {strokeCount}{" "}
                      {Number(strokeCount) === 1 ? "Stroke" : "Strokes"}
                    </h3>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                      {rads.map((radical) => (
                        <button
                          key={radical.radical}
                          onClick={() => setSelectedRadical(radical)}
                          className={`aspect-square p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                            selectedRadical?.radical === radical.radical
                              ? "border-chinese-red-500 bg-chinese-red-50"
                              : "border-ink-200 hover:border-chinese-red-300"
                          }`}
                        >
                          <div className="text-2xl font-chinese">
                            {radical.radical}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

              {filteredRadicals.length === 0 && (
                <div className="card p-8 text-center text-ink-500">
                  No radicals found matching "{searchQuery}"
                </div>
              )}
            </div>

            {/* Radical Details */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                {selectedRadical ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-6xl font-chinese mb-4">
                        {selectedRadical.radical}
                      </div>
                      <div className="text-lg font-medium text-ink-900">
                        {selectedRadical.meaning}
                      </div>
                      {selectedRadical.pinyin && (
                        <div className="text-sm text-ink-600">
                          {selectedRadical.pinyin}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-ink-200 pt-4">
                      <div className="text-sm font-medium text-ink-700 mb-2">
                        Stroke Count: {selectedRadical.strokes}
                      </div>
                    </div>

                    <div className="border-t border-ink-200 pt-4">
                      <div className="text-sm font-medium text-ink-700 mb-3">
                        Example Characters ({selectedRadical.examples.length})
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {selectedRadical.examples
                          .slice(0, 15)
                          .map((char, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setViewMode("strokes");
                                setStrokeCharacter(char);
                              }}
                              className="aspect-square flex items-center justify-center bg-ink-50 hover:bg-chinese-red-50 rounded text-2xl font-chinese cursor-pointer transition-colors"
                              title="View stroke order"
                            >
                              {char}
                            </button>
                          ))}
                      </div>
                      {selectedRadical.examples.length > 15 && (
                        <div className="text-xs text-ink-500 mt-2 text-center">
                          +{selectedRadical.examples.length - 15} more
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-ink-500 py-12">
                    <div className="text-4xl mb-3 font-chinese">部</div>
                    <p>Select a radical to see details</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="card p-6">
            <h3 className="font-bold text-lg text-ink-900 mb-4">
              Radical Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-chinese-red-600">
                  {radicals.length}
                </div>
                <div className="text-sm text-ink-600">Total Radicals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-jade-600">
                  {Object.keys(groupedByStrokes).length}
                </div>
                <div className="text-sm text-ink-600">Stroke Groups</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-chinese-gold-600">
                  {Math.min(...radicals.map((r) => r.strokes))}
                </div>
                <div className="text-sm text-ink-600">Minimum Strokes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.max(...radicals.map((r) => r.strokes))}
                </div>
                <div className="text-sm text-ink-600">Maximum Strokes</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
