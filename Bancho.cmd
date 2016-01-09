@echo off
if exist node_modules goto start
echo Checking your computer..
echo node.js version:
node --version
if errorlevel 9009 goto nodejs
echo Installing Dependencies..
npm install
:start
echo Starting..
node server.js
timeout -t 30
exit
:nodejs
echo It seems your computer don't have node.js.
echo Press any key to Download, or close to cancel.
pause>nul
explorer https://nodejs.org/dist/v5.4.0/node-v5.4.0-x64.msi