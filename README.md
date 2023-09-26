# CryptoFromScratch

Tentative d'implémentation d'algorithmes liés à la cryptographie (hashage, chiffrement symétrique, chiffremetn asymétrique, ...) en js.  
(et non, désolé, ce n'est pas "comment faire votre propre blockchain ...)

Afin de pouvoir réaliser des tests de bon fonctionnement, il y a également une implémentation de tous ces algorithme [qui appelle openssl](./src/openssl/openssl.ts).

**Note1**: THIS IS A WORK IN PROGRESS !. Donc pas grand chose de terminé encore. Revenez plus tard.  
**Note2**: Si un jour certains algorithmes fonctionnent, l'objectif n'est pas de les utiliser concrêtement en production ! Il existe déjà des implémentations native, testées et surtout maintenues. C'est bien évidemment celles-ci qu'il faut utiliser.  
**Note3**: J'ai hésité à le faire en anglais mais il existe tellement peu de ressources en français que le faire en français pourra peut-être être utile à ceux pour qui l'anglais est une barrière.

## Hashage

### Les propriétés d'un algorithme de hashage :

- irreversible : impossible de remonter aux données à partir du hash
- rapide : bah parce que ...
- déterministe : les mêmes données en entrée doivent toujours donner le même résultat
- effet cascade :le moindre changement dans les données donne un résultat complêtement différent
- resistant à la collision : 2 sources de données doivent avoir un minimum de chances d'avoir le même hash

### Les algorithmes implémentés :

- [sha1](./src/sha1/README.md)

## Chiffrement

### Symétrique

- [aes](./src/aes/README.md)
- 3des

### Asymétrique

- rsa