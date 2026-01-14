/**
 * Data Service
 * Loads and manages Chinese learning data
 */

import hskData from "../data/hsk-complete.json";
import radicalsData from "../data/radicals.json";
import tonePairsData from "../data/tone-pairs.json";
import chengyuData from "../data/chengyu-idioms.json";
import sentencesData from "../data/sentence-pairs-zh-en.json";
import measureWordsData from "../data/measure-words-extracted.json";

export interface HskWord {
  simplified: string;
  radical: string;
  level: string[];
  frequency: number;
  pos: string[];
  forms: Array<{
    traditional: string;
    transcriptions: {
      pinyin: string;
      numeric: string;
    };
    meanings: string[];
    classifiers: string[];
  }>;
}

export interface Radical {
  radical: string;
  pinyin: string;
  meaning: string;
  strokes: number;
  examples: string[];
}

export interface TonePair {
  pair: string;
  description: string;
  difficulty: string;
  examples: Array<{
    syllable1: string;
    syllable2: string;
    audio1: string;
    audio2: string;
  }>;
}

export interface Chengyu {
  word: string;
  pinyin: string;
  abbreviation: string;
  explanation: string;
  derivation: string;
  example: string;
}

export interface SentencePair {
  id: string;
  chinese: string;
  english: string;
}

export interface MeasureWord {
  classifier: string;
  used_with: string;
  pinyin: string;
}

export interface CharacterStrokes {
  strokes: string[];
  medians: number[][][];
}

export class DataService {
  private static hskWords: HskWord[] = hskData as HskWord[];
  private static radicals: Radical[] = (radicalsData as any).radicals;
  private static tonePairs: TonePair[] = (tonePairsData as any).pairs;
  private static chengyu: Chengyu[] = chengyuData as Chengyu[];
  private static sentences: SentencePair[] = sentencesData as SentencePair[];
  private static measureWords: MeasureWord[] = Object.values(
    measureWordsData
  ) as MeasureWord[];

  /**
   * Get HSK words by level
   * Note: Level 7 includes HSK 7-9 (all marked as "new-7" in data)
   */
  static getWordsByHskLevel(level: number): HskWord[] {
    const levelStr = `new-${level}`;
    return this.hskWords.filter(
      (word) =>
        word.level.includes(levelStr) || word.level.includes(`old-${level}`)
    );
  }

  /**
   * Get random words for practice
   */
  static getRandomWords(count: number, hskLevel?: number): HskWord[] {
    let pool = this.hskWords;

    if (hskLevel) {
      pool = this.getWordsByHskLevel(hskLevel);
    }

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Search words by simplified or pinyin
   */
  static searchWords(query: string): HskWord[] {
    const lowerQuery = query.toLowerCase();
    return this.hskWords
      .filter(
        (word) =>
          word.simplified.includes(query) ||
          word.forms.some(
            (form) =>
              form.transcriptions.pinyin.toLowerCase().includes(lowerQuery) ||
              form.meanings.some((m) => m.toLowerCase().includes(lowerQuery))
          )
      )
      .slice(0, 50);
  }

  /**
   * Get word by simplified character
   */
  static getWord(simplified: string): HskWord | undefined {
    return this.hskWords.find((w) => w.simplified === simplified);
  }

  /**
   * Get all radicals
   */
  static getRadicals(): Radical[] {
    return this.radicals;
  }

  /**
   * Get radical by character
   */
  static getRadical(radical: string): Radical | undefined {
    return this.radicals.find((r) => r.radical === radical);
  }

  /**
   * Get tone pairs for pronunciation practice
   */
  static getTonePairs(): TonePair[] {
    return this.tonePairs;
  }

  /**
   * Get tone pair by combination
   */
  static getTonePair(pair: string): TonePair | undefined {
    return this.tonePairs.find((tp) => tp.pair === pair);
  }

  /**
   * Load character stroke data dynamically
   */
  static async getCharacterStrokes(
    character: string
  ): Promise<CharacterStrokes | null> {
    try {
      const data = await import(`../data/hanzi-strokes/${character}.json`);
      return data.default || data;
    } catch (error) {
      console.warn(`Stroke data not found for character: ${character}`);
      return null;
    }
  }

  /**
   * Get HSK vocabulary count by level
   * Note: Only returns counts for levels 1-7 (level 7 includes 7-9)
   */
  static getHskStats() {
    const stats: Record<number, number> = {};

    for (let i = 1; i <= 7; i++) {
      stats[i] = this.getWordsByHskLevel(i).length;
    }

    return stats;
  }

  /**
   * Get random chengyu idioms
   */
  static getRandomChengyu(count: number = 10): Chengyu[] {
    const shuffled = [...this.chengyu].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Search chengyu by word or pinyin
   */
  static searchChengyu(query: string): Chengyu[] {
    const lowerQuery = query.toLowerCase();
    return this.chengyu
      .filter(
        (item) =>
          item.word.includes(query) ||
          item.pinyin.toLowerCase().includes(lowerQuery) ||
          item.abbreviation.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 20);
  }

  /**
   * Get chengyu by exact word
   */
  static getChengyu(word: string): Chengyu | undefined {
    return this.chengyu.find((c) => c.word === word);
  }

  /**
   * Get random sentence pairs
   */
  static getRandomSentences(count: number = 10): SentencePair[] {
    const shuffled = [...this.sentences].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Search sentences by Chinese or English
   */
  static searchSentences(query: string): SentencePair[] {
    const lowerQuery = query.toLowerCase();
    return this.sentences
      .filter(
        (s) =>
          s.chinese.includes(query) ||
          s.english.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 30);
  }

  /**
   * Get sentences containing specific word
   */
  static getSentencesWithWord(word: string): SentencePair[] {
    return this.sentences.filter((s) => s.chinese.includes(word)).slice(0, 20);
  }

  /**
   * Get measure word for a specific noun
   */
  static getMeasureWord(word: string): MeasureWord | undefined {
    return this.measureWords.find((mw) => mw.used_with === word);
  }

  /**
   * Get all measure words
   */
  static getAllMeasureWords(): MeasureWord[] {
    return this.measureWords;
  }

  /**
   * Search measure words by classifier or word
   */
  static searchMeasureWords(query: string): MeasureWord[] {
    const lowerQuery = query.toLowerCase();
    return this.measureWords
      .filter(
        (mw) =>
          mw.classifier.includes(query) ||
          mw.used_with.includes(query) ||
          mw.pinyin.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 20);
  }

  /**
   * Get words by part of speech
   */
  static getWordsByPOS(pos: string): HskWord[] {
    return this.hskWords.filter((word) => word.pos.includes(pos)).slice(0, 100);
  }

  /**
   * Get words by frequency (most common first)
   */
  static getWordsByFrequency(count: number = 100): HskWord[] {
    return [...this.hskWords]
      .sort((a, b) => a.frequency - b.frequency)
      .slice(0, count);
  }

  /**
   * Get words by radical
   */
  static getWordsByRadical(radical: string): HskWord[] {
    return this.hskWords
      .filter((word) => word.radical === radical)
      .slice(0, 50);
  }

  /**
   * Get related words (same radical)
   */
  static getRelatedWords(word: string): HskWord[] {
    const mainWord = this.getWord(word);
    if (!mainWord) return [];

    return this.getWordsByRadical(mainWord.radical)
      .filter((w) => w.simplified !== word)
      .slice(0, 10);
  }

  /**
   * Get comprehensive dataset stats
   */
  static getDatasetStats() {
    return {
      totalWords: this.hskWords.length,
      totalChengyu: this.chengyu.length,
      totalSentences: this.sentences.length,
      totalMeasureWords: this.measureWords.length,
      totalRadicals: this.radicals.length,
      totalTonePairs: this.tonePairs.length,
      hskLevels: this.getHskStats(),
    };
  }
}
