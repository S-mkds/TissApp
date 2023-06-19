@echo off
echo Lancement du script de troncature de la base de données...

node back-end\services\truncateDb.js

if %errorlevel% equ 0 (
  echo La base de données a été tronquée avec succès.
) else (
  echo Une erreur s'est produite lors de la troncature de la base de données.
)

echo Script terminé.
pause
