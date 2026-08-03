import { describe, expect, it } from "vitest";
import { createFaqSchema, faqIdParamSchema, updateFaqSchema } from "./create-faq.dto";

describe("createFaqSchema", () => {
  it("rejects a blank question", () => {
    const result = createFaqSchema.safeParse({ question: "  ", answer: "A", category: "C" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Pergunta é obrigatória");
  });

  it("rejects a blank answer", () => {
    const result = createFaqSchema.safeParse({ question: "Q", answer: "", category: "C" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Resposta é obrigatória");
  });

  it("rejects a blank category", () => {
    const result = createFaqSchema.safeParse({ question: "Q", answer: "A", category: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Categoria é obrigatória");
  });

  it("trims and accepts valid input", () => {
    const result = createFaqSchema.safeParse({
      question: "  Q  ",
      answer: "A",
      category: "C",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ question: "Q", answer: "A", category: "C" });
  });
});

describe("updateFaqSchema", () => {
  it("accepts a partial payload", () => {
    const result = updateFaqSchema.safeParse({ answer: "Nova resposta" });

    expect(result.success).toBe(true);
  });

  it("accepts an empty payload", () => {
    const result = updateFaqSchema.safeParse({});

    expect(result.success).toBe(true);
  });
});

describe("faqIdParamSchema", () => {
  it("accepts a numeric id string", () => {
    const result = faqIdParamSchema.safeParse({ id: "1" });

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(1);
  });

  it("rejects a non-numeric id", () => {
    const result = faqIdParamSchema.safeParse({ id: "abc" });

    expect(result.success).toBe(false);
  });
});
