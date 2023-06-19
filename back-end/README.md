# APP-MOBILE-CHAT

Création d'un chat mobile avec React Native NodeJS, Express et Mysql

## Lancement du projet

## Commencer par cloner le projet

https://github.com/Tchessi/app-mobile-chat.git


## Back-end

```
cd back-end
npm install
npm i nodemon
npm run server || node app || nodemon app
le port du server est: 3100
Pour des tests spécifiques (avec postman par exemple), le backend répond à l'adresse: http://localhost:3100

```

## Base de données

```
cd back-end
npm i mysql -g 

# Vérifier que le nom d'utilisateur et le mot de passe dans le fichier de configuration config.json correspondent à vos informations d'identification MySQL locales

npx sequelize-cli db:create
npx sequelize-cli db:migrate

// Faire attention à la date de migration. Assurez-vous que la table parente existe (Primary Key, Foreign Key)

```

# Example: Génerer les models et les migrations

```
User:
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string,password:string,imageUrl:string,deleted:boolean,isOnline:boolean,admin:boolean

Migrations uniquement : 
npx sequelize-cli migration:generate --name migration_name_here --model User --generate-migration
```

# Pour installer sequilize CLI

```
npm install --save-dev sequelize-cli
```

## Crée un fichier public pour l'enregistrement des images

```
/public
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
## Test Function Jest Package
Jest est un package de test JavaScript largement utilisé pour exécuter des tests unitaires, d'intégration et de bout en bout dans des projets JavaScript. Il fournit un ensemble d'outils et de fonctionnalités pour écrire, exécuter et analyser les résultats des tests de manière efficace.

Pour exécuter les tests de votre projet, vous pouvez utiliser les commandes suivantes "script test -> package.json" :
- `cd .\back-end`

- `npm run test`
  Cette commande permet d'exécuter les tests une fois et affiche les résultats dans la console.

- `npm run test --watchAll --verbose`
  Cette commande permet de lancer les tests en mode de surveillance (watch mode) pour détecter les modifications dans les fichiers et les réexécuter automatiquement. L'option `--verbose` affiche des informations détaillées sur les tests.
- `npm run test -- --coverage`
  Cette commande permet de générer un rapport de couverture de code (code coverage report) en plus d'exécuter les tests. Le rapport de couverture indique quelle partie de votre code est couverte par les tests, ce qui peut être utile pour identifier les zones non testées.

- `cd .\coverage\lcov-report\back-end`
- `explorer "index.html"`
  La commande `explorer` est utilisée pour ouvrir le fichier index.html dans le navigateur par défaut. En utilisant cette séquence de commandes, vous devriez pouvoir accéder au répertoire contenant le rapport de couverture de code généré et ouvrir le fichier index.html dans le navigateur.


N'hésitez pas à ajuster ces commandes en fonction des besoins spécifiques de votre projet.


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
    "host": "127.0.0.21",
    "port": 3306,
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": "",
    "database": "TissApp",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql",
    "charset": "cesu8",
    "logging": false,
    "operatorsAliases": false,
    "pool": {
      "max": 5,
      "min": 0,
      "idle": 10000
    },
    "define": {
      "underscored": true
    },
    "timezone": "-03:00",
    "dialectOptions": {
      "useUTC": false,
      "dateStrings": true,
      "typeCast": true
    },
    "query": {
      "raw": true
    },
    "sync": {
      "force": true
    },
    "benchmark": true,
    "omitNull": true,
    "retry": {
      "max": 10
    },
    "transactionType": "IMMEDIATE",
    "isolationLevel": "READ COMMITTED"
  },
  "production": {
    "username": "root",
    "password": "",
    "database": "TissApp",
    "host": "127.0.0.1",
    "port": 3306,
    "dialect": "mysql",
    "charset": "cesu8"
  }
}