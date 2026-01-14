/**
 * Vocabulary Store
 * Manages flashcards and spaced repetition state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VocabularyCard, RecallRating } from "../types";
import { SpacedRepetitionService } from "../services/spacedRepetition";

interface VocabularyState {
  cards: Map<string, VocabularyCard>;

  // Actions
  addCard: (wordId: string) => void;
  reviewCard: (wordId: string, rating: RecallRating) => void;
  getDueCards: () => VocabularyCard[];
  getCardStats: () => {
    total: number;
    new: number;
    learning: number;
    review: number;
    graduated: number;
    dueToday: number;
  };
  resetCard: (wordId: string) => void;
  clearAll: () => void;
}

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      cards: new Map(),

      addCard: (wordId: string) => {
        const { cards } = get();

        if (cards.has(wordId)) {
          return; // Card already exists
        }

        const newCard: VocabularyCard = {
          id: `card-${wordId}-${Date.now()}`,
          wordId,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          nextReviewDate: new Date(),
          lastReviewDate: new Date(),
          status: "new",
        };

        set({ cards: new Map(cards).set(wordId, newCard) });
      },

      reviewCard: (wordId: string, rating: RecallRating) => {
        const { cards } = get();
        const card = cards.get(wordId);

        if (!card) {
          console.error("Card not found:", wordId);
          return;
        }

        const result = SpacedRepetitionService.calculateInterval(
          rating,
          card.easeFactor,
          card.interval,
          card.repetitions,
          card.status
        );

        const updatedCard: VocabularyCard = {
          ...card,
          easeFactor: result.easeFactor,
          interval: result.interval,
          repetitions: result.repetitions,
          status: result.status,
          nextReviewDate: SpacedRepetitionService.getNextReviewDate(
            result.interval
          ),
          lastReviewDate: new Date(),
        };

        set({ cards: new Map(cards).set(wordId, updatedCard) });
      },

      getDueCards: () => {
        const { cards } = get();
        const cardArray = Array.from(cards.values());
        const dueCards = SpacedRepetitionService.getDueCards(cardArray);
        return SpacedRepetitionService.prioritizeCards(dueCards);
      },

      getCardStats: () => {
        const { cards } = get();
        const cardArray = Array.from(cards.values());

        return {
          total: cardArray.length,
          new: cardArray.filter((c) => c.status === "new").length,
          learning: cardArray.filter((c) => c.status === "learning").length,
          review: cardArray.filter((c) => c.status === "review").length,
          graduated: cardArray.filter((c) => c.status === "graduated").length,
          dueToday: SpacedRepetitionService.getDueCards(cardArray).length,
        };
      },

      resetCard: (wordId: string) => {
        const { cards } = get();
        const card = cards.get(wordId);

        if (!card) return;

        const resetCard: VocabularyCard = {
          ...card,
          easeFactor: 2.5,
          interval: 0,
          repetitions: 0,
          nextReviewDate: new Date(),
          status: "new",
        };

        set({ cards: new Map(cards).set(wordId, resetCard) });
      },

      clearAll: () => {
        set({ cards: new Map() });
      },
    }),
    {
      name: "vocabulary-storage",
      // Custom serialization for Map
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              cards: new Map(Object.entries(state.cards || {})),
            },
          };
        },
        setItem: (name, value) => {
          const { state } = value;
          localStorage.setItem(
            name,
            JSON.stringify({
              state: {
                ...state,
                cards: Object.fromEntries(state.cards),
              },
            })
          );
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
