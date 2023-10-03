# SHA1

L'objectif est à partir d'un texte quelconque, générer un hash de 40 caractères.

SHA1 n'est plus considérer comme sécurisé, mais osn implémentation est interessante
à réaliser et peut ensuite servir de base pour les algorithme successeurs comme SHA-256

## Sources :

- [Intro to cyrptographic hash functions and sha1](https://www.youtube.com/watch?v=kmHojGMUn0Q)
- [US Secure Hash Algorithm 1 (SHA1)](https://www.ietf.org/rfc/rfc3174.txt)
- La même, en français : [Algorithme 1 de hachage sécurisé (SHA-1)](http://abcdrfc.free.fr/rfc-vf/pdf/rfc3174.pdf)

## Notes

On va faire 2 implémentations : 
- la premiere, naïve, va créer en mémoire les structures intermédiaires, y compris la représentation en binaire du message. Ceci permettra de plus facilement se représenter les opérations.
- la seconde sera plus optimisée car elle n'opérera que sur une tableau "virtuel" et ne nécessitera pas de créer de structures volumineuses en mémoire. Ceci est possible car sha est un algorithme qui peut être appliqué à un stream.
- L'algorithme utilise un hash initial composé des valeurs 67452301 EFCDAB89 98BADCFE 10325476 C3D2E1F0. Il est éventuellement possible de changer ces hash initiaux pour avoir un résultat différent et évitr les attaque par dictionnaire. Mais généralement il est plutot conseillé de faire un hmac en utilisant un salt.

## Démarche

La vidéo dans les sources donne une bonne idée de ce qui va se passer mais a quelques erreurs ou imprécisions.  
Donc l'implémentation se fera à l'aide de la spec qui sera plus facile à lire une fois la vidéo vue.

## Résultat attendu

En testant sur la chaine de caractères `Hello world` le résultat attendu est `7b502c3a1f48c8609ae212cdfb639dee39673f5e`
