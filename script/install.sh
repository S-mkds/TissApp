#!/bin/bash

# Lancement de l'installation dans le dossier back-end
echo "Lancement de l'installation dans le dossier back-end..."
cd back-end
npm install
cd ..

# Attente de la fin de l'installation du back-end
echo "Attente de la fin de l'installation du back-end..."
sleep 6

# Lancement de l'installation dans le dossier front-end
echo "Lancement de l'installation dans le dossier front-end..."
cd front-end
npm install
cd ..

# Attente de la fin de l'installation du front-end
echo "Attente de la fin de l'installation du front-end..."
sleep 6

# Lancement de l'installation dans le dossier panel-admin
echo "Lancement de l'installation dans le dossier panel-admin..."
cd panel-admin
npm install
cd ..

# Attente de la fin de l'installation du panel-admin
echo "Attente de la fin de l'installation du panel-admin..."
sleep 6

# Lancement de ipconfig pour récupérer l'adresse IP de l'ordinateur
echo "Lancement de ipconfig..."
ipconfig
# ipconfig > ip.txt

# Affichage d'un message final
echo ""
echo "Installation terminée."
