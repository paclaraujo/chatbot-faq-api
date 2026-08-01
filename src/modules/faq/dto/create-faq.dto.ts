export interface CreateFaqDTO {
  question: string;
  answer: string;
  category: string;
}

export interface UpdateFaqDTO {
  question?: string;
  answer?: string;
  category?: string;
}