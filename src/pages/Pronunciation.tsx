/**
 * Chinese Learning Platform
 * Copyright (C) 2025
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { useState, useEffect } from "react";
import { DataService, TonePair } from "../services/dataService";
import { AudioService } from "../services/audioService";

export default function Pronunciation() {
  const [tonePairs] = useState<TonePair[]>(DataService.getTonePairs());
  const [currentPair, setCurrentPair] = useState<TonePair | null>(null);
  const [currentExample, setCurrentExample] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (tonePairs.length > 0) {
      setCurrentPair(tonePairs[0] ?? null);
    }
  }, [tonePairs]);

  const playTonePair = async () => {
    if (!currentPair || isPlaying) return;

    const example = currentPair.examples[currentExample];
    if (!example) return;

    setIsPlaying(true);

    try {
      await AudioService.play(example.audio1);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await AudioService.play(example.audio2);
    } catch (error) {
      console.error("Audio playback failed:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  const playIndividual = (audioUrl: string) => {
    AudioService.play(audioUrl);
  };

  const nextExample = () => {
    if (!currentPair) return;
    const next = (currentExample + 1) % currentPair.examples.length;
    setCurrentExample(next);
  };

  const selectPair = (pair: TonePair) => {
    setCurrentPair(pair);
    setCurrentExample(0);
  };

  const getToneName = (toneNum: string) => {
    const names = [
      "1st (flat)",
      "2nd (rising)",
      "3rd (dipping)",
      "4th (falling)",
      "5th (neutral)",
    ];
    return names[parseInt(toneNum) - 1] || toneNum;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-ink-100 text-ink-700";
    }
  };

  if (!currentPair) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const example = currentPair.examples[currentExample];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h1 className="text-3xl font-bold text-ink-900 mb-2">
          Tone Pair Practice
        </h1>
        <p className="text-ink-600">
          Master Chinese tones by practicing common tone combinations
        </p>
      </div>

      {/* Tone Pair Grid */}
      <div className="card p-6">
        <h2 className="font-bold text-lg text-ink-900 mb-4">
          Select Tone Combination
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {tonePairs.map((pair) => (
            <button
              key={pair.pair}
              onClick={() => selectPair(pair)}
              className={`p-3 rounded-lg border-2 transition-all ${
                currentPair.pair === pair.pair
                  ? "border-chinese-red-500 bg-chinese-red-50"
                  : "border-ink-200 hover:border-chinese-red-300"
              }`}
            >
              <div className="font-bold text-lg text-ink-900">{pair.pair}</div>
              <div
                className={`text-xs px-2 py-1 rounded mt-1 inline-block ${getDifficultyColor(
                  pair.difficulty
                )}`}
              >
                {pair.difficulty}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Practice Area */}
      <div className="card p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-ink-900 mb-2">
            Tone {currentPair.pair}
          </h2>
          <p className="text-ink-600">{currentPair.description}</p>
        </div>

        {/* Tone Display */}
        {example && (
          <div className="max-w-md mx-auto bg-gradient-to-br from-chinese-red-50 to-jade-50 rounded-2xl p-8 mb-6">
            <div className="flex justify-center items-center gap-8 mb-6">
              <button
                onClick={() => playIndividual(example.audio1)}
                className="flex flex-col items-center gap-2 hover:scale-110 transition-transform"
              >
                <div className="text-5xl font-bold text-chinese-red-600">
                  {example.syllable1.replace(/[0-9]/g, "")}
                </div>
                <div className="text-sm text-ink-600">
                  {getToneName(currentPair.pair.split("-")[0] ?? "")}
                </div>
              </button>

              <div className="text-3xl text-ink-400">+</div>

              <button
                onClick={() => playIndividual(example.audio2)}
                className="flex flex-col items-center gap-2 hover:scale-110 transition-transform"
              >
                <div className="text-5xl font-bold text-jade-600">
                  {example.syllable2.replace(/[0-9]/g, "")}
                </div>
                <div className="text-sm text-ink-600">
                  {getToneName(currentPair.pair.split("-")[1] ?? "")}
                </div>
              </button>
            </div>

            <button
              onClick={playTonePair}
              disabled={isPlaying}
              className="w-full btn-primary text-lg py-4"
            >
              {isPlaying ? "Playing..." : " Play Tone Pair"}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button onClick={nextExample} className="btn-secondary">
            Next Example ({currentExample + 1}/{currentPair.examples.length})
          </button>
        </div>
      </div>

      {/* Tone Chart Reference */}
      <div className="card p-6">
        <h3 className="font-bold text-lg text-ink-900 mb-4">Tone Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl tone-1">ā</div>
            <div>
              <div className="font-medium text-ink-900">
                1st Tone - Flat/High
              </div>
              <div className="text-sm text-ink-600">
                Maintain a high, steady pitch
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl tone-2">á</div>
            <div>
              <div className="font-medium text-ink-900">2nd Tone - Rising</div>
              <div className="text-sm text-ink-600">Like asking "huh?"</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl tone-3">ǎ</div>
            <div>
              <div className="font-medium text-ink-900">3rd Tone - Dipping</div>
              <div className="text-sm text-ink-600">Dip down then rise</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl tone-4">à</div>
            <div>
              <div className="font-medium text-ink-900">4th Tone - Falling</div>
              <div className="text-sm text-ink-600">Sharp, emphatic drop</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
