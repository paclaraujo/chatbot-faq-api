import { describe, expect, it } from "vitest";
import { loginSchema } from "./login.dto";

describe("loginSchema", () => {
  it("rejects a missing email and password", () => {
    const result = loginSchema.safeParse({ email: "", password: "" });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "123456" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Email inválido");
  });

  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({ email: "user@teste.com", password: "123456" });

    expect(result.success).toBe(true);
  });
});
