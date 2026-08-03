import { describe, expect, it } from "vitest";
import { askQuestionSchema } from "./ask-question.dto";

describe("askQuestionSchema", () => {
  it("rejects a blank question", () => {
    const result = askQuestionSchema.safeParse({ question: "   " });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Pergunta é obrigatória");
  });

  it("trims and accepts a valid question", () => {
    const result = askQuestionSchema.safeParse({ question: "  Como funciona?  " });

    expect(result.success).toBe(true);
    expect(result.data?.question).toBe("Como funciona?");
  });
});
