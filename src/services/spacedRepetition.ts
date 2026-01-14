/**
 * Spaced Repetition Service
 * Implementation of SM-2 Algorithm for optimal learning intervals
 */

import { RecallRating, CardStatus, IntervalResult } from "../types";

const GRADUATING_INTERVAL = 21; // Days until a card is considered mastered
const EASY_BONUS = 1.3;
const HARD_INTERVAL = 0.5;

export class SpacedRepetitionService {
  /**
   * Calculate next review interval based on SM-2 algorithm
   */
  static calculateInterval(
    rating: RecallRating,
    easeFactor: number,
    interval: number,
    repetitions: number,
    status: CardStatus
  ): IntervalResult {
    let newEaseFactor = easeFactor;
    let newInterval = interval;
    let newRepetitions = repetitions;
    let newStatus = status;

    switch (rating) {
      case "again":
        // Failed recall - reset to beginning
        newRepetitions = 0;
        newInterval = 1;
        newStatus = "learning";
        newEaseFactor = Math.max(1.3, easeFactor - 0.2);
        break;

      case "hard":
        // Difficult recall - small interval increase
        newRepetitions = repetitions;
        newInterval = Math.max(1, interval * HARD_INTERVAL);
        newEaseFactor = Math.max(1.3, easeFactor - 0.15);
        break;

      case "good":
        // Successful recall - standard progression
        newRepetitions = repetitions + 1;

        if (repetitions === 0) {
          newInterval = 1;
        } else if (repetitions === 1) {
          newInterval = 6;
        } else {
          newInterval = Math.round(interval * newEaseFactor);
        }

        if (newInterval >= GRADUATING_INTERVAL && status !== "graduated") {
          newStatus = "graduated";
        } else if (status === "new") {
          newStatus = "learning";
        }
        break;

      case "easy":
        // Very easy recall - bonus multiplier
        newRepetitions = repetitions + 1;

        if (repetitions === 0) {
          newInterval = 4;
        } else {
          newInterval = Math.round(interval * newEaseFactor * EASY_BONUS);
        }

        newEaseFactor = easeFactor + 0.15;

        if (newInterval >= GRADUATING_INTERVAL || status === "review") {
          newStatus = "graduated";
        } else if (status === "new") {
          newStatus = "learning";
        }
        break;
    }

    return {
      interval: newInterval,
      easeFactor: newEaseFactor,
      repetitions: newRepetitions,
      status: newStatus,
    };
  }

  /**
   * Get next review date
   */
  static getNextReviewDate(intervalDays: number): Date {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervalDays);
    nextDate.setHours(4, 0, 0, 0); // Schedule for 4 AM next day
    return nextDate;
  }

  /**
   * Check if card is due for review
   */
  static isDue(nextReviewDate: Date): boolean {
    return new Date() >= nextReviewDate;
  }

  /**
   * Calculate daily review load
   */
  static getDueCards<T extends { nextReviewDate: Date }>(cards: T[]): T[] {
    return cards.filter((card) => this.isDue(card.nextReviewDate));
  }

  /**
   * Prioritize cards by urgency (overdue cards first)
   */
  static prioritizeCards<
    T extends { nextReviewDate: Date; status: CardStatus }
  >(cards: T[]): T[] {
    return cards.sort((a, b) => {
      // Prioritize by status
      const statusPriority = { new: 0, learning: 1, review: 2, graduated: 3 };
      const statusDiff = statusPriority[a.status] - statusPriority[b.status];

      if (statusDiff !== 0) return statusDiff;

      // Then by due date (oldest first)
      return a.nextReviewDate.getTime() - b.nextReviewDate.getTime();
    });
  }
}
