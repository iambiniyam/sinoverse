/**
 * Measure Words (Classifiers) Page
 * Learn Chinese measure words/classifiers
 */

import { useState, useEffect } from "react";
import { DataService, MeasureWord } from "../services/dataService";
import { AudioService } from "../services/audioService";

export default function MeasureWordsPage() {
  const [measureWords, setMeasureWords] = useState<MeasureWord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupedByClassifier, setGroupedByClassifier] = useState<
    Record<string, MeasureWord[]>
  >({});

  useEffect(() => {
    loadMeasureWords();
  }, []);

  const loadMeasureWords = () => {
    const all = DataService.getAllMeasureWords();
    setMeasureWords(all);
    groupWords(all);
  };

  const groupWords = (words: MeasureWord[]) => {
    const grouped: Record<string, MeasureWord[]> = {};
    words.forEach((mw) => {
      if (!grouped[mw.classifier]) {
        grouped[mw.classifier] = [];
      }
      grouped[mw.classifier]!.push(mw);
    });
    setGroupedByClassifier(grouped);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = DataService.searchMeasureWords(query);
      setMeasureWords(results);
      groupWords(results);
    } else {
      loadMeasureWords();
    }
  };

  const playWord = (pinyin: string) => {
    const numeric = pinyin.split(" ")[0];
    if (numeric) {
      AudioService.play(`/audio/syllabs/cmn-${numeric}.mp3`).catch(() => {
        console.warn("Audio not available");
      });
    }
  };

  const classifiers = Object.keys(groupedByClassifier).sort();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">
          量词 Measure Words (Classifiers)
        </h1>
        <p className="text-ink-600 mb-4">
          Master Chinese classifiers - essential words for counting nouns.{" "}
          {measureWords.length} entries.
        </p>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by classifier, word, or pinyin..."
          className="w-full px-4 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent"
        />
      </div>

      {/* Quick Guide */}
      <div className="card p-6 bg-jade-50">
        <h3 className="font-bold text-ink-900 mb-2">What are Measure Words?</h3>
        <p className="text-ink-700 text-sm mb-2">
          In Chinese, you can't say "three books" directly. You need a
          classifier: "三本书" (sān běn shū).
        </p>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="bg-white p-3 rounded">
            <span className="font-bold text-chinese-red-600">个 (gè)</span> -
            general classifier, people
          </div>
          <div className="bg-white p-3 rounded">
            <span className="font-bold text-chinese-red-600">本 (běn)</span> -
            books, notebooks
          </div>
          <div className="bg-white p-3 rounded">
            <span className="font-bold text-chinese-red-600">只 (zhī)</span> -
            animals, one of a pair
          </div>
        </div>
      </div>

      {/* Grouped by Classifier */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-ink-900">
          {classifiers.length} Unique Classifiers
        </h2>
        {classifiers.map((classifier) => {
          const measureWordsGroup = groupedByClassifier[classifier]!;
          return (
            <div key={classifier} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-3xl font-bold text-chinese-red-600">
                    {classifier}
                  </h3>
                  <p className="text-sm text-ink-600">
                    Used with {measureWordsGroup.length} words
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {measureWordsGroup.slice(0, 12).map((mw, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-ink-50 rounded hover:bg-ink-100 transition-colors"
                  >
                    <div>
                      <span className="font-medium text-ink-900">
                        {mw.used_with}
                      </span>
                      <span className="text-sm text-ink-600 ml-2">
                        ({mw.pinyin})
                      </span>
                    </div>
                    <button
                      onClick={() => playWord(mw.pinyin)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      
                    </button>
                  </div>
                ))}
              </div>
              {measureWordsGroup.length > 12 && (
                <p className="text-sm text-ink-500 mt-2">
                  + {measureWordsGroup.length - 12} more...
                </p>
              )}
            </div>
          );
        })}
      </div>

      {classifiers.length === 0 && (
        <div className="text-center py-12 text-ink-500">
          No measure words found. Try a different search.
        </div>
      )}
    </div>
  );
}
