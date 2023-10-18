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

## Implémentation "naïve"

Elle est fonctionelle: [./sha1_naive.ts](./sha1_naive.ts).  
Il n'y a aucune optimisation.

### Points d'attention

1. Les opérations binaires sont signées à partir de 32 bits.

Si on prend le plus petit nombre sur 32 bits, le decalage vers la droite donne le bon résultat en valeur absolue, mais est signé.

```javascript
> 0x80000000
2147483648
> 0x80000000 >> 1
-1073741824
```

Alors que le plus grand nombre de 31 bits (la valeur du dessus moins 1) reste lui non signé :

```javascript
> 0x7fffffff
2147483647
> 0x7fffffff >> 1
1073741823
```

Idem pour le décalage vers la gauche : le decalage du plus grans nombre de 31 bits ne fait pas un nombre positif de 32 bits mais un nombre signé.

```javascript
> 0x7fffffff
2147483647
> 0x7fffffff << 1
-2
```

Dans le cas du decalage vers la droite, il existe un opérateur de decalage non signé en triplant les chevrons :

```javascript
> 0x80000000 >>> 1
1073741824
```

Mais il n'existe pas le même opérateur poir les décalage à gauche.

Par contre, l'tutilisation du decalage à droite non signé avec un décalage de 0 (donc identité) transforme l'opération en "non signée" ! :

```javascript
> 0x7fffffff << 1
-2
> 0x7fffffff << 1 >>> 0
4294967294
```

> **ATTENTION 1**:
> Ceci ne se limite pas aux décalages.

```javascript
> 0x80000000 | 1
-2147483647
> (0x80000000 | 1) >>> 0
2147483649
```

donc quand vous faites des opérations binaires sur des nombres supérieurs à 31 bits, attention au signe.

> **ATTENTION 2**:
> Une opération sur un nombre de 33 bits en essayant d'éviter le problème de signe est juste fausse !

```javascript
> 0x180000000
6442450944
> 0x180000000 + 1
6442450945
> (0x180000000 | 1) >>> 0
2147483649
```

Donc si vous manipulez des nombre de plus de 31 bits, il est péférable de passer par des bigint (en ajoutant le 'n') :

```
> 0x80000000
2147483648
> 2147483648 << 1
0
> 2147483648n << 1n
4294967296n
```

Mais il me semble que bizarrement ce genre d'opération soit plutot rare même si on est sur des architectures 64 bits.

> **ATTENTION 3**:
> Quand les valeurs sont fausse en décimales, elles sont cependant correcte en binaire.

```javascript
> const v = 0x70000000
1879048192
> const w = v << 1
-536870912
> const x = w >>> 0
3758096384
```

Donc bien que la valeur de `w` ne soit pas en décimal le double de `v`, le passage de signé à non signé pour x permet bien de retrouver le double de `v`

2. Il n'existe pas d'opérateur pour les rotations

Les rotations sont beaucoup utilisées dans cet algorithme.  
Malheureusement, elles ne sont pas présente en JS et on doit les simuler.  
C'est l'ojectif de la fonction `rotateLeft`.

On peut se demander pourquoi ces opérateurs plutôt courant n'ont pas été implémentés.  
En java, la rotation existe et est implémenté comme une fonction de la classe Integer.

J'avais en tête que le "triple chevron" était d'ordinaire utilisé pour les rotations contrairement à ici
mais bizarrement ça ne semble être le cas ni en java, ni en python, ni en C, ni en pascal, ... donc je ne sais pas.

C'est dommage vu que tous les CPUs ont une instruction ROR / ROL (Rotate Right / Left) qui s'exécute en 1 cycle.

Après, c'est vrai que c'est plutôt inhabituel de faire des rotations, contraiement aux décalages.

3.
