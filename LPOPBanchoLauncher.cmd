@echo off
:: BatchGotAdmin
:-------------------------------------
REM  --> Check for permissions
IF '%PROCESSOR_ARCHITECTURE%' EQU 'amd64' (
   >nul 2>&1 "%SYSTEMROOT%\SysWOW64\icacls.exe" "%SYSTEMROOT%\SysWOW64\config\system"
 ) ELSE (
   >nul 2>&1 "%SYSTEMROOT%\system32\icacls.exe" "%SYSTEMROOT%\system32\config\system"
)

REM --> If error flag set, we do not have admin.
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    set params = %*:"=""
    echo UAC.ShellExecute "cmd.exe", "/c %~s0 %params%", "", "runas", 1 >> "%temp%\getadmin.vbs"

    "%temp%\getadmin.vbs"
    del "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    pushd "%CD%"
    CD /D "%~dp0"

copy C:\Windows\system32\drivers\etc\hosts hosts.bak
echo 104.208.31.60 osu.ppy.sh>>C:\Windows\system32\drivers\etc\hosts
echo 104.208.31.60 a.ppy.sh>>C:\Windows\system32\drivers\etc\hosts
echo 104.208.31.60 c.ppy.sh>>C:\Windows\system32\drivers\etc\hosts
echo 104.208.31.60 c1.ppy.sh>>C:\Windows\system32\drivers\etc\hosts
cls
echo osu! running.
%LOCALAPPDATA%\osu!\osu!.exe
cls
taskkill /im osu!.exe f
del C:\Windows\system32\drivers\etc\hosts
copy hosts.bak C:\Windows\system32\drivers\etc\hosts
del hosts.bak
