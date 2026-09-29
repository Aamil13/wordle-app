import { IWordles } from "../wordle/types";

export interface DailyWordResponse {
  data: IWordles;
  success: boolean;
}