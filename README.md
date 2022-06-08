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

Installer tous les modules cités dans les dépendances (dependencies) du fichier "package.json" pour chaque serveur dans le terminal correspondant :

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

Discord s'ouvre alors sur un nouvel onglet de votre navigateur. Vous pouvez également choisir de l'ouvrir via l'application. Une fois sur Discord, vous pouvez entrer vos requêtes sur le canal `#général` et le bot vous répondra directement dans le canal.

Remarque : Le bot sur Discord se prénomme **Steeve**. Cependant, cela ne signifie pas que c'est l'instance du bot Steeve sur le serveur qui est chargée. Le nom qui apparaît est seulement le nom du bot sur la plateforme Discord. Le bot qui est connecté depuis le serveur est celui que vous avez choisi sur le client.

## Utilisation du bot Mastodon

La connexion vers le bot mastodon a été implémentée mais elle n'est pas fonctionnelle. Par conséquent, le code permettant de l'utiliser est accessible sur ce dépôt mais il n'est pas possible de communiquer avec le bot mastodon depuis notre application.

## Auteurs

**Sarah CLAUDE & Karole GODIN**
