import { exec } from "node:child_process";

const openssl = {
  aes: {
    encode: async (key: string, clear_message: string) => {
      return "";
    },
    decode: async (key: string, encrypted_message: string) => {
      return "";
    },
  },
  sha1: {
    hash: async (message: string) => {
      return new Promise((a, r) => {
        const child = exec(`openssl dgst -sha1`, (error, stdout, stderr) => {
          if (error || stderr) {
            r(stdout || stderr);
          } else {
            a(stdout.split(" ")[1].split("\n")[0]);
          }
        });
        child.stdin!.write(message);
        child.stdin!.end();
      });
    },
  },
};

export default openssl;
