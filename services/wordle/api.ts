import { client } from "../apiClient";
import { IWordles, RandomWordResponse, WordDifficulty } from "./types";

// GET ALL WORDS
export async function getAllWordsApi() {
  const res = await client("/wordle");
  return res;
}

// GET RANDOM WORD
export async function getRandomWordApi(): Promise<RandomWordResponse> {
  const res = await client<RandomWordResponse>("/wordle/random");
  return res as RandomWordResponse;
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

// UPDATE PLAYED WORD
export async function updatePlayedWordApi(id: string, data: Partial<IWordles>) {
  const res = await client(`/wordle/played/${id}`, {
    method: "PATCH",
    data: data,
  });
  return res;
}
