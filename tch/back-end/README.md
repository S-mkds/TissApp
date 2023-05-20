# APP-MOBILE-CHAT

Création d'un chat mobile avec React Native NodeJS, Express et Mysql

## Utilisation du projet

## Commencer par cloner le projet

https://github.com/Tchessi/app-mobile-chat.git


## Back-end

```
cd back-end
npm install
npm i nodemon
nodemon server ou node server
Pour des tests spécifiques (avec postman par exemple), le backend répond à l'adresse: http://localhost:3000

```
## Base de données

```
cd back-end
npm i mysql -g 

# Vérifier que le nom d'utilisateur et le mot de passe dans le fichier de configuration config.json correspondent à vos informations d'identification MySQL locales

npx sequelize-cli db:create
npx sequelize-cli db:migrate

# Pour installer sequilize CLI

npm install --save-dev sequelize-cli


```

## Technologies utilisées

```
# Pour le serveur : Node.js et framework Express
# Pour la base de données : MySQL et Sequelize ORM

```

## Mesures de sécurité et de mise en place

```
# Hashage du mot de passe utilisateur avec bcrypt
# Authentification de l'utilisateur par token avec jsonwebtoken

```
## API documentation Postman
https://documenter.getpostman.com/view/17540434/2s8Z72VX2N

## TRELLO 

https://trello.com/invite/tchessisamirismailsalim/ATTI9472e90e9d0b4861b4b1a72e24a8ecd3FCA49511

## FIGMA 

https://www.figma.com/file/pCwlYbexxiYcB8oRVCCwf5/Untitled?node-id=0%3A1&t=QOBwCJjSdCwnd9wU-0


# CONFIGURATION DATABASE
Crée un fichier config/config.json et mettre en place la configuration de la base de données

{
  "development": {
    "username": "root",
    "password": "",
    "database": "TissApp",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "",
    "database": "TissApp",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": "",
    "database": "TissApp",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql"
  }