/**
 * Chengyu (Chinese Idioms) Page
 * 30,895 idioms with explanations and examples
 */

import { useState, useEffect } from "react";
import { DataService, Chengyu } from "../services/dataService";
import { AudioService } from "../services/audioService";

export default function ChengyuPage() {
  const [chengyu, setChengyu] = useState<Chengyu[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChengyu, setSelectedChengyu] = useState<Chengyu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRandomChengyu();
  }, []);

  const loadRandomChengyu = () => {
    setLoading(true);
    const items = DataService.getRandomChengyu(20);
    setChengyu(items);
    setLoading(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = DataService.searchChengyu(query);
      setChengyu(results);
    } else {
      loadRandomChengyu();
    }
  };

  const playPronunciation = (pinyin: string) => {
    // Try to play first syllable
    const firstSyllable = pinyin.split(" ")[0];
    if (firstSyllable) {
      AudioService.play(`/audio/syllabs/cmn-${firstSyllable}.mp3`).catch(() => {
        console.warn("Audio not available");
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-ink-600">Loading idioms...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">
          成语 Chengyu - Chinese Idioms
        </h1>
        <p className="text-ink-600 mb-4">
          Master 30,895 Chinese four-character idioms with explanations,
          derivations, and examples
        </p>

        {/* Search */}
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by idiom, pinyin, or abbreviation..."
            className="flex-1 px-4 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent"
          />
          <button
            onClick={loadRandomChengyu}
            className="px-6 py-2 rounded-lg bg-ink-100 hover:bg-ink-200 transition-colors"
          >
            Random
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-ink-600">
        Showing {chengyu.length} idioms
      </div>

      {/* Chengyu Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {chengyu.map((item, index) => (
          <div
            key={index}
            className="card hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSelectedChengyu(item)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-2xl font-bold text-chinese-red-600">
                  {item.word}
                </h3>
                <p className="text-sm text-ink-600">{item.pinyin}</p>
                <p className="text-xs text-ink-500 mt-1">
                  Abbr: {item.abbreviation}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playPronunciation(item.pinyin);
                }}
                className="p-2 rounded-lg hover:bg-ink-100 transition-colors"
              >
                
              </button>
            </div>
            <p className="text-ink-700 text-sm line-clamp-2">
              {item.explanation}
            </p>
          </div>
        ))}
      </div>

      {chengyu.length === 0 && (
        <div className="text-center py-12 text-ink-500">
          No idioms found. Try a different search.
        </div>
      )}

      {/* Detail Modal */}
      {selectedChengyu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedChengyu(null)}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-4xl font-bold text-chinese-red-600 mb-2">
                  {selectedChengyu.word}
                </h2>
                <p className="text-lg text-ink-600">{selectedChengyu.pinyin}</p>
                <p className="text-sm text-ink-500">
                  Abbreviation: {selectedChengyu.abbreviation}
                </p>
              </div>
              <button
                onClick={() => setSelectedChengyu(null)}
                className="text-2xl text-ink-500 hover:text-ink-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-ink-900 mb-2">Explanation</h3>
                <p className="text-ink-700">{selectedChengyu.explanation}</p>
              </div>

              {selectedChengyu.derivation && (
                <div>
                  <h3 className="font-bold text-ink-900 mb-2">Derivation</h3>
                  <p className="text-ink-700">{selectedChengyu.derivation}</p>
                </div>
              )}

              {selectedChengyu.example && (
                <div>
                  <h3 className="font-bold text-ink-900 mb-2">Example</h3>
                  <p className="text-ink-700">{selectedChengyu.example}</p>
                </div>
              )}

              <button
                onClick={() => playPronunciation(selectedChengyu.pinyin)}
                className="btn-primary w-full"
              >
                Play Pronunciation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
