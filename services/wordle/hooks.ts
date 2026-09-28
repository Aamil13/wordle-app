import { useQuery } from "@tanstack/react-query";

import {
  getAllWordsApi,
  getRandomWordApi,
  getWordsByCategoryApi,
  getWordsByDifficultyApi,
} from "./api";
import { WordDifficulty } from "./types";

// GET ALL WORDS
export function useGetAllWords(enabled: boolean = true) {
  return useQuery({
    queryKey: ["getAllWords"],
    queryFn: () => getAllWordsApi(),
    enabled,
  });
}

// GET RANDOM WORD
export function useGetRandomWord(enabled: boolean = true) {
  return useQuery({
    queryKey: ["getRandomWord"],
    queryFn: () => getRandomWordApi(),
    enabled,
  });
}

// GET WORDS BY DIFFICULTY
export function useGetWordsByDifficulty(
  difficulty: WordDifficulty,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["getWordsByDifficulty", difficulty],
    queryFn: () => getWordsByDifficultyApi(difficulty),
    enabled: enabled && !!difficulty,
  });
}

// GET WORDS BY CATEGORY
export function useGetWordsByCategory(
  category: string,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["getWordsByCategory", category],
    queryFn: () => getWordsByCategoryApi(category),
    enabled: enabled && !!category,
  });
}
