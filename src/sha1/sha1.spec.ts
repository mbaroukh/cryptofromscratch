import { describe, it, expect } from "bun:test";
import openssl from "../openssl/openssl";
import sha1Naive, { rotateLeft } from "./sha1_naive";
import sha1Optimize from "./sha1_naive";

[
  {
    impl: sha1Naive,
    name: "naive",
  },
  //   {
  //     impl: sha1Optimize,
  //     name: "optimized",
  //   },
].forEach(({ impl, name }) => {
  describe(`tests sha1 - ${name}`, () => {
    it("genere le meme hash", async () => {
      const key = "coucou";
      const hashed = await impl.hash(key);
      expect(hashed).toBeDefined();
      const opensslHash = await openssl.sha1.hash(key);
      expect(hashed).toBe(opensslHash);
    });
  });
});

describe("test utilities", () => {
  it("rotate left 1", () => {
    expect(rotateLeft(0x80000000, 1)).toBe(1);
    expect(rotateLeft(0x40000000, 1)).toBe(0x80000000);
    expect(rotateLeft(0x0001, 1)).toBe(2);
    expect(rotateLeft(0x0001, 5)).toBe(0x10);

    expect(rotateLeft(0xd0000000, 4)).toBe(0xd);
  });
});
