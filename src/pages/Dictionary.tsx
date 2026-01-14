/**
 * Dictionary Page
 * Searchable word lookup
 */

import Dictionary from "../components/Dictionary";

export default function DictionaryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">
          Dictionary 词典
        </h1>
        <p className="text-ink-600">
          Search for Chinese words, characters, and their meanings
        </p>
      </div>
      <Dictionary />
    </div>
  );
}
