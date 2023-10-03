# CryptoFromScratch

Tentative d'implémentation d'algorithmes liés à la cryptographie (hashage, chiffrement symétrique, chiffrement asymétrique, ...) en ts dans le but de comprendre le fonctionnement de ces algorithmes.  
(et non, désolé, ce n'est pas "comment faire votre propre blockchain" même s'il y a "crypto" dans le sujet :) ...)

Afin de pouvoir réaliser des tests de bon fonctionnement, il y a également une implémentation de tous ces algorithmes [qui appelle openssl](./src/openssl/openssl.ts).

- **Note1**: THIS IS A WORK IN PROGRESS !. Status actuel :
  - sha1 : Implémentation "naïve" fonctionnelle
- **Note2**: Si un jour certains algorithmes fonctionnent, l'objectif n'est pas de les utiliser concrêtement en production ! Il existe déjà des implémentations native, testées et surtout maintenues. C'est bien évidemment celles-ci qu'il faut utiliser.
- **Note3**: J'ai hésité à le faire en anglais mais il existe tellement peu de ressources en français que le faire en français pourra peut-être être utile à ceux pour qui l'anglais est une barrière.

## Hashage

### Les propriétés d'un algorithme de hashage :

- irreversible : impossible de remonter aux données à partir du hash
- rapide : bah parce que ...
- déterministe : les mêmes données en entrée doivent toujours donner le même résultat
- effet cascade :le moindre changement dans les données donne un résultat complêtement différent
- resistant à la collision : 2 sources de données doivent avoir un minimum de chances (voire quasiment aucune) d'avoir le même hash

### Nomenclature

- MAC : Message Authenticity Code
- HMAC : (H = Hashed) MAC créé en ajoutant aux données hashées un salt (cf ligne du dessous) afin de contrer les attaque par dictionnaire.
- SALT: Donnée random ajoutée aux données à hasher. Sans salt sha1 vas toujours renvoyer le même résultat pour la même données en entrée (principe de base d'un algorithme de hashage). Donc, dans le cas de hashs de mots de passe, si on a un dictionnaire des hashs des mots de passe les plus couramment utilisés, on peut remonter facilement remonter aux mots de passe qui se trouvent dans ce dictionnaire. Ajouter un salt lors du hash va rendre le hash différent de celui par défaut rendant impossile l'utilisation d'un dictionnaire. Il y a 2 options :
  - soit le salt est généré pour chaque hashage et stocké avec la donnée hashée.
  - soit le salt n'est pas stocké avec la donnée hashée mais est gardé secret. En le perdant, on est plus capable de vérifier les signaure faites avec. Dans le cas ou il est secret, on appelle souvent ça "pepper" au lieu de "salt".

### Les algorithmes implémentés :

- [sha1](./src/sha1/README.md)

## Chiffrement

### Symétrique

- [aes](./src/aes/README.md)
- 3des

### Asymétrique

- rsa
