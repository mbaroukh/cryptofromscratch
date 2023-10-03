export const padL = (s: string, n: number) => {
  while (s.length < n) {
    s = "0" + s;
  }
  return s;
};

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

const DWORD = 0xffffffff;

export const rotateLeft = (value: number, digits: number) => {
  // Les opérateurs de shift en js sont sur 32 bits.
  // Par contre le shift left retour est un nombre signé.
  // Il existe un shift right non signé mais pas de shift left ...
  return ((value << digits) | (value >>> (32 - digits))) >>> 0;
};

const sha1 = {
  hash: async (message: string) => {
    // 1 - Décomposer le message en numbers
    const messageNumbers = Array.from({ length: message.length }, (_, i) =>
      message.charCodeAt(i)
    );

    // Puis en une string de binaires sur 8 bits
    const messageOctets = messageNumbers.map((n) => padL(n.toString(2), 8));

    // Puis en chaine
    const messageBinaire = messageOctets.join("");

    assert(
      messageBinaire.length % 8 === 0,
      "messageBinaire devrait avoir une longueur multiple de 8"
    );

    // Ajouter 1
    const messageBinairePlus1 = messageBinaire + "1";

    // Puis des 0 jusqu'à ce que la chaine soit un (multiple de 512) - 64
    const messageBinairePlus1LengthMod512 = messageBinairePlus1.length % 512;
    const missing0 =
      448 -
      messageBinairePlus1LengthMod512 +
      (messageBinairePlus1LengthMod512 < 448 ? 0 : 512);

    assert(
      (messageBinairePlus1.length + missing0 + 64) % 512 === 0,
      "missing0 est sans doute incorrecte"
    );

    // Cosntruction du message complet en binaire
    const fullBinaryMessage =
      messageBinairePlus1 +
      Array.from({ length: missing0 }, () => "0").join("") +
      padL(messageBinaire.length.toString(2), 64);

    assert(
      fullBinaryMessage.length % 512 === 0,
      "fullBinaryMessage devrait avoir une longueur telle que l % 512 = 448"
    );

    // On découpe en blocs. Chaque bloc contient 16 mots de 32 bits
    const blocsBinary = Array.from(
      { length: fullBinaryMessage.length / 512 },
      (_, i) => {
        const blocString = fullBinaryMessage.substring(i * 512, (i + 1) * 512);
        // Découper en 16 mots (donc de 32 bits)
        return Array.from({ length: 16 }, (_, j) =>
          blocString.substring(j * 32, (j + 1) * 32)
        );
      }
    );
    assert(
      !blocsBinary.find(
        (b) => b.length != 16 || b.find((s) => s.length !== 32)
      ),
      "tous les blocs devraient faire 32 caractères"
    );

    // Calcul principal en utilisant la méthode 6.1 de la doc
    let h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    for (let b = 0; b < blocsBinary.length; b++) {
      const W = blocsBinary[b].map((n) => parseInt(n, 2));

      for (let t = 16; t <= 79; t++) {
        W[t] = rotateLeft(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
      }
      let A = h[0],
        B = h[1],
        C = h[2],
        D = h[3],
        E = h[4];
      for (let t = 0; t <= 79; t++) {
        const f =
          t <= 19
            ? (B & C) | ((B ^ DWORD) & D)
            : t <= 39
            ? B ^ C ^ D
            : t <= 59
            ? (B & C) | (B & D) | (C & D)
            : B ^ C ^ D;
        const K =
          t <= 19
            ? 0x5a827999
            : t <= 39
            ? 0x6ed9eba1
            : t <= 59
            ? 0x8f1bbcdc
            : 0xca62c1d6;
        const temp = (rotateLeft(A, 5) + f + E + W[t] + K) >>> 0;
        E = D;
        D = C;
        C = rotateLeft(B, 30);
        B = A;
        A = temp;
      }

      h[0] = h[0] + A;
      h[1] = h[1] + B;
      h[2] = h[2] + C;
      h[3] = h[3] + D;
      h[4] = h[4] + E;
    }

    const toHex = (n: number) => {
      return padL((n >>> 0).toString(16), 8);
    };
    const result = h.map((v) => toHex(v)).join("");

    return Promise.resolve(result);
  },
};

export default sha1;
