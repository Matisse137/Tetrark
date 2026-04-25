@echo off
setlocal enabledelayedexpansion
:: Passe la console en UTF-8 pour bien afficher les accents
chcp 65001 >nul

echo === Suppression des identifiants Git ===
echo.

set count=0

:: On cherche toutes les lignes contenant "git:" dans le gestionnaire
for /f "tokens=*" %%A in ('cmdkey /list ^| findstr /i "git:"') do (
    :: Astuce pour extraire la cible (le dernier mot de la ligne)
    for %%B in (%%A) do set "cible=%%B"
    
    echo Suppression en cours pour : !cible!
    cmdkey /delete:!cible! >nul
    set /a count+=1
)

echo.
:: Affichage du résultat sans parenthèses pour ne pas casser le Batch
if !count! equ 0 (
    echo Aucun identifiant Git trouve.
) else (
    echo !count! identifiants Git supprimes avec succes !
)

echo.
echo === Nouvelle Identification ===
echo.

:: On vérifie si on est dans un dossier Git
if exist ".git\" (
    echo Depot Git local detecte. Lancement de "git fetch"...
    echo.
    git fetch
) else (
    echo [ATTENTION] Vous n'etes pas a la racine d'un depot Git local.
    echo Pour vous reidentifier, placez-vous dans votre dossier de projet et tapez 'git fetch'.
)

echo.
pause