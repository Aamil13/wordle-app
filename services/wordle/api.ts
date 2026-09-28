import { client } from "../apiClient";
import { WordDifficulty } from "./types";

// GET ALL WORDS
export async function getAllWordsApi() {
  const res = await client("/wordle");
  return res;
}

// GET RANDOM WORD
export async function getRandomWordApi() {
  const res = await client("/wordle/random");
  return res;
}

// GET WORDS BY DIFFICULTY
export async function getWordsByDifficultyApi(difficulty: WordDifficulty) {
  const res = await client(`/wordle/difficulty/${difficulty}`);
  return res;
}

// GET WORDS BY CATEGORY
export async function getWordsByCategoryApi(category: string) {
  const res = await client(`/wordle/category/${category}`);
  return res;
}
