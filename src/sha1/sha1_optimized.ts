const sha1 = {
  hash: async (message: string) => {
    // Taille du message en bits :
    const l = message.length * 8;
    // bits à ajouter pour padder à droite de façons à ce que
    // la longueur du dernier bloc fasse 448
    const lMod512 = l % 512;
    const pad1Length = 448 - lMod512 + (lMod512 >= 448 ? 512 : 0);
    // Taille du message paddé
    const lpad = l + pad1Length;
    // Taille du message paddé en octets
    const lpadOctets = lpad / 8;

    const getBloc = (n: number) => {
      const blocs: number[] = [];
      const octetStart = n * 16;
      for (let i = octetStart; i < octetStart + 16; i++) {
        if (i < l) {
          blocs.push(message.charCodeAt(i));
        } else {
          // Offet au delà du message
          const offsetmessage = i * 8 - l * 8;
        }
      }
    };

    // 1 - convertir en un tableau de caractères
    const messageArray = Array.from({ length: message.length }, (_, i) =>
      message.charCodeAt(i)
    );

    // 2 - conversion de chaque caracère en chaine binaire de 8 bits

    return Promise.resolve("");
  },
};

export default sha1;
