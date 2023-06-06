@echo off

REM Start script project installation
echo Start script project installation.

REM Lancement de l'installation dans le dossier back-end
echo Lancement de l'installation dans le dossier back-end...
cd back-end
call npm install
cd ..

REM En attente pour le lancement de l'installation du back-end
echo En attente pour le lancement de l'installation du back-end...
ping 127.0.0.1 -n 6 > nul

REM Lancement de l'installation dans le dossier front-end
echo Lancement de l'installation dans le dossier front-end...
cd front-end
call npm install
cd ..

REM En attente pour le lancement de l'installation du front-end
echo En attente pour le lancement de l'installation du front-end...
ping 127.0.0.1 -n 6 > nul

REM Lancement de l'installation dans le dossier panel-admin
echo Lancement de l'installation dans le dossier panel-admin...
cd panel-admin
call npm install
cd ..

REM En attente pour le lancement de l'installation du panel-admin
echo En attente pour le lancement de l'installation du panel-admin...
ping 127.0.0.1 -n 6 > nul

REM Lancement de ipconfig pour récupérer l'adresse IP de l'ordinateur
echo Lancement de ipconfig...
ipconfig
@REM ipconfig > ip.txt

REM Affichage d'un message final en couleur
echo.
echo Installation complete.
