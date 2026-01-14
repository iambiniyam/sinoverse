/**
 * Audio Service
 * Enhanced pronunciation audio playback with caching and preloading
 */

export class AudioService {
  private static audioCache: Map<string, HTMLAudioElement> = new Map();
  private static currentAudio: HTMLAudioElement | null = null;
  private static preloadQueue: string[] = [];
  private static isPreloading = false;

  /**
   * Play audio file with caching and error handling
   */
  static async play(audioUrl: string): Promise<void> {
    try {
      // Stop current audio if playing
      if (this.currentAudio && !this.currentAudio.paused) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }

      // Get from cache or create new
      let audio = this.audioCache.get(audioUrl);

      if (!audio) {
        audio = new Audio(audioUrl);
        audio.preload = "auto";
        this.audioCache.set(audioUrl, audio);

        // Set up error handling
        audio.onerror = () => {
          console.warn(`Audio file not found: ${audioUrl}`);
          this.audioCache.delete(audioUrl);
        };
      }

      this.currentAudio = audio;
      audio.currentTime = 0;

      await audio.play();
    } catch (error) {
      console.error("Audio playback failed:", error);
      // Silently fail - don't interrupt user experience
    }
  }

  /**
   * Play multiple audio files in sequence
   */
  static async playSequence(audioUrls: string[], delayMs = 500): Promise<void> {
    for (const url of audioUrls) {
      await this.play(url);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  /**
   * Preload audio files for smoother playback
   */
  static preload(audioUrls: string[]): void {
    audioUrls.forEach((url) => {
      if (!this.audioCache.has(url) && !this.preloadQueue.includes(url)) {
        this.preloadQueue.push(url);
      }
    });

    if (!this.isPreloading) {
      this.processPreloadQueue();
    }
  }

  /**
   * Process preload queue with rate limiting
   */
  private static async processPreloadQueue(): Promise<void> {
    if (this.preloadQueue.length === 0) {
      this.isPreloading = false;
      return;
    }

    this.isPreloading = true;
    const url = this.preloadQueue.shift();

    if (url && !this.audioCache.has(url)) {
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.onerror = () => {
        console.warn(`Failed to preload: ${url}`);
      };
      this.audioCache.set(url, audio);

      // Wait a bit before preloading next to avoid overwhelming the browser
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Continue processing queue
    this.processPreloadQueue();
  }

  /**
   * Preload audio for a Chinese word based on pinyin
   */
  static preloadWordAudio(numericPinyin: string): void {
    const syllables = numericPinyin.split(" ");
    const urls = syllables
      .map((syllable) => `/audio/syllabs/cmn-${syllable}.mp3`)
      .filter((url) => url.includes("cmn-")); // Ensure valid format

    this.preload(urls);
  }

  /**
   * Play word pronunciation by combining syllables
   */
  static async playWord(numericPinyin: string, delayMs = 300): Promise<void> {
    const syllables = numericPinyin.split(" ");
    const urls = syllables
      .map((syllable) => `/audio/syllabs/cmn-${syllable}.mp3`)
      .filter((url) => url.includes("cmn-"));

    await this.playSequence(urls, delayMs);
  }

  /**
   * Clear audio cache to free memory
   */
  static clearCache(): void {
    this.audioCache.forEach((audio) => {
      audio.pause();
      audio.src = "";
    });
    this.audioCache.clear();
    this.currentAudio = null;
    this.preloadQueue = [];
  }

  /**
   * Stop current audio playback
   */
  static stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
  }

  /**
   * Get cache size for monitoring
   */
  static getCacheSize(): number {
    return this.audioCache.size;
  }

  /**
   * Check if audio exists (for testing)
   */
  static async checkAudioExists(audioUrl: string): Promise<boolean> {
    try {
      const response = await fetch(audioUrl, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  }
}
