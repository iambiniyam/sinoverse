/**
 * Word Card Component
 * Displays word details with audio, pinyin, and meanings
 */

import { useState } from "react";
import { HskWord } from "../services/dataService";
import { AudioService } from "../services/audioService";

interface WordCardProps {
  word: HskWord;
  showDetails?: boolean;
  onAddToReview?: () => void;
  compact?: boolean;
}

export default function WordCard({
  word,
  showDetails = false,
  onAddToReview,
  compact = false,
}: WordCardProps) {
  const [expanded, setExpanded] = useState(showDetails);
  const primaryForm = word.forms[0];

  if (!primaryForm) return null;

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audioUrl = `/audio/syllabs/cmn-${
      primaryForm.transcriptions.numeric.split(" ")[0]
    }.mp3`;
    AudioService.play(audioUrl);
  };

  const getToneClass = (pinyin: string): string => {
    const toneMarks = {
      "1": "tone-1",
      ā: "tone-1",
      ē: "tone-1",
      ī: "tone-1",
      ō: "tone-1",
      ū: "tone-1",
      "2": "tone-2",
      á: "tone-2",
      é: "tone-2",
      í: "tone-2",
      ó: "tone-2",
      ú: "tone-2",
      "3": "tone-3",
      ǎ: "tone-3",
      ě: "tone-3",
      ǐ: "tone-3",
      ǒ: "tone-3",
      ǔ: "tone-3",
      "4": "tone-4",
      à: "tone-4",
      è: "tone-4",
      ì: "tone-4",
      ò: "tone-4",
      ù: "tone-4",
    };

    for (const [mark, className] of Object.entries(toneMarks)) {
      if (pinyin.includes(mark)) return className;
    }
    return "tone-5";
  };

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-ink-100 hover:border-chinese-red-300 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="text-2xl font-chinese">{word.simplified}</div>
        <div className="flex-1">
          <div
            className={`text-sm ${getToneClass(
              primaryForm.transcriptions.pinyin
            )}`}
          >
            {primaryForm.transcriptions.pinyin}
          </div>
          <div className="text-xs text-ink-600 truncate">
            {primaryForm.meanings[0]}
          </div>
        </div>
        <button
          onClick={playAudio}
          className="p-1 hover:bg-ink-100 rounded transition-colors"
        >
          
        </button>
      </div>
    );
  }

  return (
    <div
      className="card hover:shadow-md transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="text-4xl font-chinese cursor-pointer hover:scale-110 transition-transform"
            onClick={playAudio}
          >
            {word.simplified}
          </div>
          <div>
            <div
              className={`text-lg font-medium ${getToneClass(
                primaryForm.transcriptions.pinyin
              )}`}
            >
              {primaryForm.transcriptions.pinyin}
            </div>
            <div className="text-ink-600">
              {primaryForm.meanings.slice(0, 2).join("; ")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {word.level.map((level) => (
            <span key={level} className="hsk-badge text-xs">
              {level.replace("new-", "HSK ").replace("old-", "")}
            </span>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-ink-100 animate-fadeIn">
          {/* Traditional */}
          {primaryForm.traditional !== word.simplified && (
            <div className="mb-3">
              <span className="text-sm text-ink-500">Traditional: </span>
              <span className="text-lg font-chinese">
                {primaryForm.traditional}
              </span>
            </div>
          )}

          {/* All meanings */}
          <div className="mb-3">
            <div className="text-sm text-ink-500 mb-1">Meanings:</div>
            <ul className="list-disc list-inside text-ink-700">
              {primaryForm.meanings.map((meaning, idx) => (
                <li key={idx}>{meaning}</li>
              ))}
            </ul>
          </div>

          {/* Measure words */}
          {primaryForm.classifiers.length > 0 && (
            <div className="mb-3">
              <span className="text-sm text-ink-500">Measure word: </span>
              <span className="font-chinese text-lg">
                {primaryForm.classifiers.join(", ")}
              </span>
            </div>
          )}

          {/* Radical */}
          <div className="mb-3">
            <span className="text-sm text-ink-500">Radical: </span>
            <span className="font-chinese text-lg">{word.radical}</span>
          </div>

          {/* Part of speech */}
          {word.pos.length > 0 && (
            <div className="mb-3">
              <span className="text-sm text-ink-500">Part of speech: </span>
              <span className="text-ink-700">
                {word.pos
                  .map((p) => {
                    const posMap: Record<string, string> = {
                      n: "noun",
                      v: "verb",
                      adj: "adjective",
                      adv: "adverb",
                      prep: "preposition",
                      conj: "conjunction",
                      pron: "pronoun",
                      num: "number",
                      m: "measure word",
                      e: "exclamation",
                      y: "particle",
                      nz: "proper noun",
                    };
                    return posMap[p] || p;
                  })
                  .join(", ")}
              </span>
            </div>
          )}

          {/* Frequency */}
          <div className="mb-3">
            <span className="text-sm text-ink-500">Frequency rank: </span>
            <span className="text-ink-700">#{word.frequency}</span>
          </div>

          {/* Actions */}
          {onAddToReview && (
            <div className="mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToReview();
                }}
                className="btn-primary text-sm"
              >
                Add to Review
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
