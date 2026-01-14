/**
 * Grammar Patterns Page
 * Learn common Chinese grammar structures through pattern recognition
 */

import { useState, useEffect } from "react";
import { DataService, SentencePair } from "../services/dataService";

interface GrammarPattern {
  id: string;
  pattern: string;
  structure: string;
  meaning: string;
  examples: SentencePair[];
  level: string;
}

export default function Grammar() {
  const [patterns] = useState<GrammarPattern[]>([
    {
      id: "1",
      pattern: "...的时候",
      structure: "[Subject] + 的时候 + [Action]",
      meaning: "When..., At the time of...",
      examples: [],
      level: "HSK 2",
    },
    {
      id: "2",
      pattern: "越...越...",
      structure: "越 + [Adj/Verb] + 越 + [Adj/Verb]",
      meaning: "The more..., the more...",
      examples: [],
      level: "HSK 4",
    },
    {
      id: "3",
      pattern: "不但...而且...",
      structure: "不但 + [Clause A] + 而且 + [Clause B]",
      meaning: "Not only..., but also...",
      examples: [],
      level: "HSK 4",
    },
    {
      id: "4",
      pattern: "虽然...但是...",
      structure: "虽然 + [Clause A] + 但是 + [Clause B]",
      meaning: "Although..., ...",
      examples: [],
      level: "HSK 3",
    },
    {
      id: "5",
      pattern: "如果...就...",
      structure: "如果 + [Condition] + 就 + [Result]",
      meaning: "If..., then...",
      examples: [],
      level: "HSK 3",
    },
    {
      id: "6",
      pattern: "一...就...",
      structure: "一 + [Action A] + 就 + [Action B]",
      meaning: "As soon as..., ...",
      examples: [],
      level: "HSK 4",
    },
    {
      id: "7",
      pattern: "因为...所以...",
      structure: "因为 + [Reason] + 所以 + [Result]",
      meaning: "Because..., therefore...",
      examples: [],
      level: "HSK 2",
    },
    {
      id: "8",
      pattern: "不是...而是...",
      structure: "不是 + [A] + 而是 + [B]",
      meaning: "Not..., but rather...",
      examples: [],
      level: "HSK 4",
    },
    {
      id: "9",
      pattern: "既...又...",
      structure: "既 + [Adj A] + 又 + [Adj B]",
      meaning: "Both... and...",
      examples: [],
      level: "HSK 4",
    },
    {
      id: "10",
      pattern: "...比...",
      structure: "[A] + 比 + [B] + [Adj]",
      meaning: "A is more [Adj] than B (comparison)",
      examples: [],
      level: "HSK 2",
    },
  ]);

  const [patternsWithExamples, setPatternsWithExamples] = useState<
    GrammarPattern[]
  >([]);
  const [selectedPattern, setSelectedPattern] = useState<GrammarPattern | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPatternExamples();
  }, []);

  const loadPatternExamples = () => {
    const allSentences = DataService.getRandomSentences(500);

    const patternsWithData = patterns.map((pattern) => {
      let examples: SentencePair[] = [];

      // Find sentences containing the pattern keywords
      const keywords = pattern.pattern.replace(/\.\.\./g, "").split("");
      const filteredSentences = allSentences.filter((s) =>
        keywords.every((k) => s.chinese.includes(k))
      );

      examples = filteredSentences.slice(0, 5);

      return { ...pattern, examples };
    });

    setPatternsWithExamples(patternsWithData);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredPatterns = searchQuery
    ? patternsWithExamples.filter(
        (p) =>
          p.pattern.includes(searchQuery) ||
          p.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.structure.includes(searchQuery)
      )
    : patternsWithExamples;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-bold text-ink-900 mb-1">
          Grammar Patterns
        </h1>
        <p className="text-ink-600 text-sm mb-4">
          Learn Chinese grammar through common structures
        </p>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search patterns..."
          className="w-full px-3 py-2 text-sm border border-ink-300 rounded-lg focus:ring-2 focus:ring-chinese-red-500 focus:border-transparent"
        />
      </div>

      {/* Pattern Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredPatterns.map((pattern) => (
          <div
            key={pattern.id}
            className="card hover:shadow-md transition-all cursor-pointer group"
            onClick={() => setSelectedPattern(pattern)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-chinese-red-600 group-hover:text-chinese-red-700">
                {pattern.pattern}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-jade-100 text-jade-700 font-medium">
                {pattern.level}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-ink-500 font-medium mb-1">
                  Structure
                </p>
                <p className="text-sm text-ink-700 font-mono bg-ink-50 px-2 py-1.5 rounded">
                  {pattern.structure}
                </p>
              </div>

              <div>
                <p className="text-xs text-ink-500 font-medium mb-1">Meaning</p>
                <p className="text-sm text-ink-700">{pattern.meaning}</p>
              </div>

              <div className="mt-2 pt-2 border-t border-ink-100">
                <p className="text-xs text-ink-400">
                  {pattern.examples.length} example
                  {pattern.examples.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pattern Detail Modal */}
      {selectedPattern && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPattern(null)}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-chinese-red-600 mb-2">
                  {selectedPattern.pattern}
                </h2>
                <span className="text-sm px-3 py-1 rounded bg-jade-100 text-jade-800">
                  {selectedPattern.level}
                </span>
              </div>
              <button
                onClick={() => setSelectedPattern(null)}
                className="text-3xl text-ink-400 hover:text-ink-600 leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-ink-50 rounded-lg">
                <p className="text-xs text-ink-500 uppercase font-medium mb-2">
                  Structure
                </p>
                <p className="text-lg text-ink-900 font-mono">
                  {selectedPattern.structure}
                </p>
              </div>

              <div className="p-4 bg-jade-50 rounded-lg">
                <p className="text-xs text-jade-700 uppercase font-medium mb-2">
                  Meaning
                </p>
                <p className="text-lg text-jade-900">
                  {selectedPattern.meaning}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-ink-900 mb-4">
                Example Sentences
              </h3>
              {selectedPattern.examples.length > 0 ? (
                <div className="space-y-3">
                  {selectedPattern.examples.map((example, idx) => (
                    <div
                      key={example.id}
                      className="p-4 bg-white border border-ink-200 rounded-lg hover:border-chinese-red-300 transition-colors"
                    >
                      <div className="flex gap-3">
                        <span className="text-ink-400 font-bold">
                          {idx + 1}.
                        </span>
                        <div className="flex-1">
                          <p className="text-lg text-ink-900 mb-1">
                            {example.chinese}
                          </p>
                          <p className="text-sm text-ink-600">
                            {example.english}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-ink-500 py-8">
                  No examples found for this pattern. Try searching sentences
                  directly!
                </p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-ink-200">
              <button
                onClick={() => setSelectedPattern(null)}
                className="w-full btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredPatterns.length === 0 && (
        <div className="text-center py-12 text-ink-500">
          No patterns found. Try a different search.
        </div>
      )}
    </div>
  );
}
