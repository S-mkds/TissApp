#!/bin/bash

# Lancement du back-end
echo "Lancement du back-end..."
start "" "C:\Program Files\Git\bin\bash.exe" -c "cd back-end && npm run server"

# Attente de quelques secondes pour permettre le lancement du back-end
sleep 5

# Lancement du front-end
echo "Lancement du front-end..."
start "" "C:\Program Files\Git\bin\bash.exe" -c "cd front-end && npm start"

# Attente de quelques secondes pour permettre le lancement du front-end
sleep 5

# Lancement du panel admin
echo "Lancement du panel admin..."
start "" "C:\Program Files\Git\bin\bash.exe" -c "cd panel-admin && npm run dev"

# Pause pour empêcher la fermeture automatique du terminal principal
read -p "Appuyez sur Entrée pour quitter..."
