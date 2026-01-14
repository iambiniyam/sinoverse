/**
 * Dictionary Component
 * Searchable word lookup with detailed information and example sentences
 */

import { useState, useCallback } from "react";
import { HskWord, DataService, SentencePair } from "../services/dataService";
import WordCard from "./WordCard";
import { useVocabularyStore } from "../stores/vocabularyStore";

export default function Dictionary() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HskWord[]>([]);
  const [selectedWord, setSelectedWord] = useState<HskWord | null>(null);
  const [exampleSentences, setExampleSentences] = useState<SentencePair[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const addCard = useVocabularyStore((state) => state.addCard);

  const handleSearch = useCallback(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    // Small delay for UX
    setTimeout(() => {
      const searchResults = DataService.searchWords(query);
      setResults(searchResults);
      setIsSearching(false);
    }, 100);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAddToReview = (word: HskWord) => {
    addCard(word.simplified);
  };

  const handleWordClick = (word: HskWord) => {
    setSelectedWord(word);
    const sentences = DataService.getSentencesWithWord(word.simplified);
    setExampleSentences(sentences);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-chinese-red-50 to-chinese-gold-50 border-2 border-chinese-red-200">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">
          Comprehensive Chinese Dictionary
        </h1>
        <p className="text-ink-600">
          Search through 10,000+ words from all HSK levels - Characters, Pinyin,
          or English meanings
        </p>
      </div>

      {/* Search bar */}
      <div className="card">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for characters, pinyin, or English..."
            className="flex-1 px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-chinese-red-500 outline-none"
          />
          <button
            onClick={handleSearch}
            className="btn-primary px-6"
            disabled={isSearching}
          >
            {isSearching ? "..." : "Search"}
          </button>
        </div>

        <div className="mt-3 text-sm text-ink-500">
          Try: 你好, hello, ni hao, 学习, study, 成语
        </div>
      </div>

      {/* Results */}
      {isSearching ? (
        <div className="text-center py-8">
          <div className="text-ink-500">Searching...</div>
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-ink-500">No results found for "{query}"</div>
          <div className="text-sm text-ink-400 mt-2">
            Try searching with different terms
          </div>
        </div>
      ) : hasSearched && results.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm text-ink-600">
            Found {results.length} result{results.length !== 1 ? "s" : ""}{" "}
            {results.length === 50 ? "(showing first 50)" : ""}
          </div>
          <div className="space-y-3">
            {results.map((word) => (
              <div key={word.simplified}>
                <div
                  onClick={() => handleWordClick(word)}
                  className="cursor-pointer"
                >
                  <WordCard
                    word={word}
                    onAddToReview={() => handleAddToReview(word)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Example Sentences Modal */}
      {selectedWord && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedWord(null)}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-4xl font-bold text-chinese-red-600 mb-2">
                  {selectedWord.simplified}
                </h2>
                <p className="text-lg text-ink-600">
                  {selectedWord.forms[0]?.transcriptions.pinyin}
                </p>
                <p className="text-ink-700 mt-2">
                  {selectedWord.forms[0]?.meanings.join(", ")}
                </p>
              </div>
              <button
                onClick={() => setSelectedWord(null)}
                className="text-2xl text-ink-500 hover:text-ink-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-ink-900">
                Example Sentences ({exampleSentences.length})
              </h3>
              {exampleSentences.length > 0 ? (
                <div className="space-y-3">
                  {exampleSentences.map((sentence) => (
                    <div key={sentence.id} className="p-4 bg-ink-50 rounded-lg">
                      <p className="text-lg text-ink-900 mb-2">
                        {sentence.chinese}
                      </p>
                      <p className="text-ink-600">{sentence.english}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-ink-500">
                  No example sentences found for this word.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick access HSK words */}
      {!hasSearched && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-ink-800">
            Browse by HSK Level
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map((level) => {
              const levelWords = DataService.getWordsByHskLevel(level);
              return (
                <button
                  key={level}
                  onClick={() => {
                    setQuery(`HSK ${level}`);
                    setTimeout(() => {
                      const words = levelWords.slice(0, 50);
                      setResults(words);
                      setHasSearched(true);
                    }, 100);
                  }}
                  className="p-4 bg-white rounded-lg border-2 border-ink-200 hover:border-chinese-red-400 hover:bg-chinese-red-50 transition-all transform hover:scale-105"
                >
                  <div className="text-lg font-bold text-chinese-red-600">
                    HSK {level}
                    {level === 7 ? " (7-9)" : ""}
                  </div>
                  <div className="text-sm text-ink-500">
                    {levelWords.length.toLocaleString()} words
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
