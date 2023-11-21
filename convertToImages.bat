@echo off
setlocal enabledelayedexpansion

set "rootDirectory=%cd%\bills"

for /d %%D in ("%rootDirectory%\*") do (
    set "subDirectory=%%~fD"
    set "outputDirectory=!subDirectory!\images"

    if not exist "!outputDirectory!" mkdir "!outputDirectory!"

    for %%F in ("!subDirectory!\*.pdf") do (
        set "filename=%%~nF"
        set "outputPrefix=!outputDirectory!\!filename!_"

        rem Convert each page of the PDF to a separate PNG image
        pdftoppm -png "%%F" "!outputPrefix!"

        rem Rename the generated images to include the page number
        set "counter=1"
        for %%I in ("!outputPrefix!*") do (
            set "newName=!outputDirectory!\!filename!_page!counter!.png"
            ren "%%I" "!newName!"
            set /a counter+=1
        )
    )
)

echo Conversion completed.
pause
