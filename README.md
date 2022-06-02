# Projet de Service Web 2022

> Ce projet a pour but la mise en place d'un service web à travers l'utilisation de bots sur différentes "bouches" (Discord, socket) et ayant des "cerveaux" (.rive) modifiables.

## Utilisation de l'application

### 1ère étape : Mise en place de l'environnement de travail

Ouvrir 3 terminaux (1 pour chaque serveur : brainServer, mouthServer et server) avec dans chacun le chemin vers un des serveurs.

### 2e étape : Initialisation des serveurs

Entrez la commande suivante dans chaque terminal :
`$npm init`

Appuyez sur la touche `entrée` pour chaque item puis validez (`yes`).

### 3e étape : Intallation des modules

Installer tous les modules cités dans les "package.json" pour chaque serveur dans le terminal correspondant :

`$npm install nom_du_module`

### 4e étape : Lancement des serveurs

Entrez les commandes suivantes dans chaque terminal :

`$npm install`

`$npm run nodemon`

### 5e étape : Lancement du client

Ouvrez un navigateur Mozilla Firefox et entrez l'URL suivant :
`http://localhost:3001/`

## Utilisation de la partie Socket

A partir de la page d'accueil, cliquez sur le bouton `Talk to a chatbot`.

Vous pouvez alors choisir le bot avec lequel vous souhaitez communiquer ainsi que la bouche que vous souhaitez utiliser. Si vous souhaitez utiliser un socket, sélectionnez `socket` dans la liste des Mouth puis cliquez sur `Talk to a chatbot`.

Une interface de communication avec le bot sélectionné s'ouvre alors dans votre navigateur. Vous pouvez entrer vos requêtes dans la partie basse de la page et presser la touche `entrée` ou bien cliquer sur le bouton `Send`.

Vos requêtes s'afficheront en gris sur la partie haute de la page. Les réponses du bot s'afficheront en blanc en dessous de vos requêtes.

## Utilisation du bot Discord

A partir de la page d'accueil, cliquez sur le bouton `Talk to a chatbot`.

Vous pouvez alors choisir le bot avec lequel vous souhaitez communiquer ainsi que la bouche que vous souhaitez utiliser. Si vous souhaitez utiliser Discord, sélectionnez `Discord` dans la liste des Mouth puis cliquez sur `Talk to a chatbot`.

## Utilisation du bot Mastodon

## Auteurs

**Sarah CLAUDE & Karole GODIN**
