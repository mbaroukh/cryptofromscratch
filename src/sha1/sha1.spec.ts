import { describe, it, expect } from "bun:test";
import openssl from "../openssl/openssl";
import sha1 from "./sha1";

describe("tests sha1", () => {
  it("genere le meme hash", async () => {
    const key = "coucou";
    const hashed = await sha1.hash(key);
    expect(hashed).toBeDefined();
    const opensslHash = await openssl.sha1.hash(key);
    expect(hashed).toBe(opensslHash);
  });
});
