import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getAllWordsApi,
  getRandomWordApi,
  getWordsByCategoryApi,
  getWordsByDifficultyApi,
  updatePlayedWordApi,
} from "./api";
import { IWordles, RandomWordResponse, WordDifficulty } from "./types";

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
  return useQuery<RandomWordResponse>({
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

// UPDATE PLAYED WORD
export function useUpdatePlayedWord() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IWordles> }) =>
      updatePlayedWordApi(id, data),
  });
}
