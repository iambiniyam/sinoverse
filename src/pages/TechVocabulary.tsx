import { useState } from "react";
import techVocabulary from "../data/tech-it-vocabulary.json";

interface TechWord {
  simplified: string;
  traditional: string;
  pinyin: string;
  english: string;
  category: string;
}

export default function TechVocabulary() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(techVocabulary.map((word) => word.category))),
  ];

  // Filter words
  const filteredWords = techVocabulary.filter((word) => {
    const matchesCategory =
      selectedCategory === "All" || word.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      word.simplified.includes(searchQuery) ||
      word.traditional.includes(searchQuery) ||
      word.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.english.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group words by category for display
  const groupedWords: Record<string, TechWord[]> = {};
  filteredWords.forEach((word) => {
    if (!groupedWords[word.category]) {
      groupedWords[word.category] = [];
    }
    groupedWords[word.category]!.push(word);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">
          💻 Tech & IT Vocabulary
        </h1>
        <p className="text-ink-600">
          Learn essential Chinese technology and IT terminology -{" "}
          {techVocabulary.length} words across {categories.length - 1}{" "}
          categories
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Chinese, pinyin, or English..."
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-ink-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "All"
                  ? `All Categories (${techVocabulary.length})`
                  : `${cat} (${
                      techVocabulary.filter((w) => w.category === cat).length
                    })`}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 text-sm text-ink-500">
          Showing {filteredWords.length} of {techVocabulary.length} words
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-ink-700 border border-ink-200 hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            {cat === "All" ? "All" : cat}
          </button>
        ))}
      </div>

      {/* Words Display */}
      {filteredWords.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-ink-500">
            No words found matching your search
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedWords).map(([category, words]) => (
            <div key={category} className="space-y-3">
              <h2 className="text-xl font-bold text-ink-800 flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-blue-500 rounded"></span>
                {category}
                <span className="text-sm font-normal text-ink-500">
                  ({words.length})
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {words.map((word, idx) => (
                  <div
                    key={idx}
                    className="card hover:shadow-lg transition-all border border-ink-100 hover:border-blue-300"
                  >
                    {/* Chinese Characters */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-chinese font-bold text-chinese-red-600">
                        {word.simplified}
                      </span>
                      {word.traditional !== word.simplified && (
                        <span className="text-lg font-chinese text-ink-400">
                          ({word.traditional})
                        </span>
                      )}
                    </div>

                    {/* Pinyin */}
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      {word.pinyin}
                    </div>

                    {/* English */}
                    <div className="text-ink-700">{word.english}</div>

                    {/* Category Badge */}
                    <div className="mt-3 pt-3 border-t border-ink-100">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        {word.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="card bg-indigo-50 border border-indigo-200">
        <h3 className="text-lg font-bold text-indigo-900 mb-2">
          📚 About This Vocabulary
        </h3>
        <p className="text-indigo-800 mb-3">
          This curated collection covers essential technology and IT terms in
          Chinese. Perfect for:
        </p>
        <ul className="list-disc list-inside space-y-1 text-indigo-800">
          <li>Software developers working with Chinese teams</li>
          <li>IT professionals in Chinese-speaking environments</li>
          <li>Students studying computer science in Chinese</li>
          <li>Anyone interested in tech terminology in Chinese</li>
        </ul>
        <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200">
          <div className="text-sm text-indigo-700">
            💡 <strong>Pro Tip:</strong> Click on category chips to quickly
            filter by topic. Use the search bar to find specific terms!
          </div>
        </div>
      </div>
    </div>
  );
}
