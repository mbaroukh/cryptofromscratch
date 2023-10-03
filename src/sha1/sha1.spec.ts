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
      const key = "Hello world";
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
    expect(rotateLeft(0x0001, 5)).toBe(0x20);
    expect(rotateLeft(0xd0000000, 4)).toBe(0xd);
    expect(rotateLeft(parseInt("11100000100010101001101111110", 2), 1)).toBe(
      parseInt("111000001000101010011011111100", 2)
    );
    expect(rotateLeft(parseInt("11100000100010101001101111110000", 2), 1)).toBe(
      parseInt("11000001000101010011011111100001", 2)
    );
    expect(
      rotateLeft(parseInt("111000001000101010011011111100000", 2), 1)
    ).toBe(parseInt("10000010001010100110111111000001", 2));
  });
});
