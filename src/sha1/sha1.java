package sha1;

public class sha1 {

    private String padL(String message, int size) {
        while (message.length() < size) {
            message = "0" + message;
        }
        return message;
    }

    public String encode(String message) {

        int[] messageNumbers = new int[message.length()];
        for (int i = 0; i < message.length(); i++) {
            messageNumbers[i] = (int) message.charAt(i);
        }
        String[] messageOctets = new String[messageNumbers.length];
        for (int i = 0; i < messageNumbers.length; i++) {
            messageOctets[i] = padL(Integer.toString(messageNumbers[i], 2), 8);
        }
        String messageBinaire = "";
        for (int i = 0; i < messageOctets.length; i++) {
            messageBinaire += messageOctets[i];
        }
        String messageBinairePlus1 = messageBinaire + "1";
        int messageBinairePlus1LengthMod512 = messageBinairePlus1.length() % 512;

        int missing0 = 448 -
                messageBinairePlus1LengthMod512 +
                (messageBinairePlus1LengthMod512 < 448 ? 0 : 512);

        String fullBinaryMessage = messageBinairePlus1 + padL("", missing0)
                + padL(Integer.toString(messageBinairePlus1.length() + missing0, 2), 64);

        String[][] blocsBinary = new String[fullBinaryMessage.length() / 512][];
        for (int i = 0; i < blocsBinary.length; i++) {
            blocsBinary[i] = new String[16];
            for (int j = 0; j < 16; j++) {
                int idx = i * 512 + j * 16;
                blocsBinary[i][j] = fullBinaryMessage.substring(idx, idx + 16);
            }
        }
        int[] h = { 0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0 };
        for (int b = 0; b < blocsBinary.length; b++) {
            int[] W = new int[80];
            for (int i = 0; i < 16; i++) {
                W[i] = Integer.parseInt(blocsBinary[b][i], 2);
            }
            var A = h[0];
            var B = h[1];
            var C = h[2];
            var D = h[3];
            var E = h[4];
            for (int i = 0; i < 79; i++) {
                for (int t = 16; t < 79; t++) {
                    W[t] = Integer.rotateLeft(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
                }
                for (int t = 0; t < 79; t++) {
                    var f = t <= 19
                            ? (B & C) | ((~B) & D)
                            : t <= 39
                                    ? B ^ C ^ D
                                    : t <= 59
                                            ? (B & C) | (B & D) | (C & D)
                                            : (B ^ C ^ D);
                    var K = t <= 19
                            ? 0x5a827999
                            : t <= 39
                                    ? 0x6ed9eba1
                                    : t <= 59
                                            ? 0x8f1bbcdc
                                            : 0xca62c1d6;
                    var temp = Integer.rotateLeft(A, 5) + f + E + W[t] + K;
                    E = D;
                    D = C;
                    C = Integer.rotateLeft(B, 30);
                    B = A;
                    A = temp;
                }
                System.err.println("===> " + A + " / " + B + " /" + C);
            }
            h[0] = h[0] + A;
            h[1] = h[1] + B;
            h[2] = h[2] + C;
            h[3] = h[3] + D;
            h[4] = h[4] + E;
        }

        return padL(Integer.toHexString(h[0]), 8) + padL(Integer.toHexString(h[1]), 8)
                + padL(Integer.toHexString(h[2]), 8) + padL(Integer.toHexString(h[3]), 8)
                + padL(Integer.toHexString(h[4]), 8);
    }

    public static void main(String args[]) throws Exception {
        System.err.println("===> " + Integer.rotateLeft(0x80000000, 1));
        System.err.println(new sha1().encode("Hello world"));
    }

}