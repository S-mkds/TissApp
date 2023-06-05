@echo off

REM Affichage d'un message avant le lancement du back-end
echo Lancement du back-end...
start cmd /k "cd back-end && npm run server"

REM Attente de quelques secondes pour permettre le lancement du back-end
timeout /t 5

REM Affichage d'un message avant le lancement du front-end
echo Lancement du front-end...
start cmd /k "cd front-end && npm start"

REM Attente de quelques secondes pour permettre le lancement du front-end
timeout /t 5

REM Affichage d'un message avant le lancement du panel admin
echo Lancement du panel admin...
start cmd /k "cd panel-admin && npm run dev"

REM Attente de quelques secondes pour permettre le lancement du panel admin
timeout /t 5

REM Pause pour empêcher la fermeture automatique de la fenêtre CMD
pause >nul
