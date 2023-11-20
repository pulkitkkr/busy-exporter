@echo off
setlocal

REM Set the desired Node.js version
set NODE_VERSION=18.18.2

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js not found. Installing Node.js...
  REM Download and install Node.js from the official website
  curl -o node_installer.msi https://nodejs.org/dist/v%NODE_VERSION%/win-x64/node.exe
  msiexec /i node_installer.msi /quiet /qn /norestart
  del node_installer.msi
) else (
  echo Node.js found.
)

REM Check if NVM is installed
where nvm >nul 2>nul
if %errorlevel% neq 0 (
  echo NVM not found. Installing NVM...
  REM Download and install NVM for Windows
  curl -o nvm_setup.zip https://github.com/coreybutler/nvm-windows/releases/download/1.1.7/nvm-noinstall.zip
  mkdir "%APPDATA%\nvm"
  tar -xf nvm_setup.zip -C "%APPDATA%\nvm"
  del nvm_setup.zip
) else (
  echo NVM found.
)

REM Check if the correct Node.js version is in use
call nvm use %NODE_VERSION%

REM Install dependencies and run the command
npm install
npm run exec

endlocal
