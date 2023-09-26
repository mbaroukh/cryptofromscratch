import { describe, it, expect } from "bun:test";
import openssl from "../openssl/openssl";
import aes from "./aes";

describe("tests aes", () => {
  it("encode", async () => {
    const key = "coucou";
    const message = "message";
    const encoded = await aes.encode(key, message);
    expect(encoded).toBeDefined();
    const decoded = await openssl.aes.decode(key, encoded);
    expect(decoded).toBe(message);
  });
});
