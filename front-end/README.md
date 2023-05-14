rnfe = new react views

npm i = installation du projet front

npm start = lancement du projet front

npx react-native run-android --variant=release = création du build apk pour déployé le projet

### create apk tuto
npm i -g eas-cli

### entrez l'id et mdp de votre compte expo 
eas build -p android 

### Copy & past next code on eas.json

{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview3": {
      "developmentClient": true
    },
    "production": {}
  }
}


### continue on terminal create apk android or emulator

eas build -p android --profile preview
