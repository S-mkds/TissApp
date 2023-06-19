@echo off
echo Lancement du script de la création d'une insertion dans la base de données des utilisateurs...

node back-end\fixtures\user.js

if %errorlevel% equ 0 (
  echo La base de données a été remplie avec succès.
) else (
  echo Une erreur s'est produite lors de la création d'une insertion dans la base de données des utilisateurs.
)

echo Script terminé.