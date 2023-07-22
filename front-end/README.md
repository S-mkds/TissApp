rnfe = new react views

npm i = installation du projet front

npm start = lancement du projet front

npx react-native run-android --variant=release = création du build apk pour déployé le projet

### create apk start
npm i -g eas-cli 

powershell -ExecutionPolicy Bypass -Command "eas build -p android" 

### Id & mdp expo login 
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

powershell -ExecutionPolicy Bypass -Command "eas build -p android --profile preview"

### Lien de l'APK à télécharger

https://expo.dev/artifacts/eas/35LzyJyXJAo8mDchJporoT.apk