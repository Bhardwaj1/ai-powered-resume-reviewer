export type ReviewStatus = "idle" | "loading" | "success" | "error";

export interface ReviewData {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface ReviewApiResponse {
  success: boolean;
  data: ReviewData;
  message: string;
}
