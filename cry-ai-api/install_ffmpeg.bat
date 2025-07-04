@echo off
echo ===================================
echo FFmpeg Installation Helper
echo ===================================
echo.
echo This script will help you install FFmpeg for audio conversion.
echo.

REM Check if FFmpeg is already installed
where ffmpeg >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo FFmpeg is already installed.
    echo.
    ffmpeg -version
    echo.
    echo You're all set! Your application should now be able to convert audio files.
    goto END
)

echo FFmpeg is not installed or not in your PATH.
echo.
echo Installation Options:
echo.
echo 1. Automatic Installation (using Chocolatey - recommended)
echo 2. Manual Installation (download instructions)
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Checking if Chocolatey is installed...
    where choco >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo Chocolatey is installed. Installing FFmpeg...
        echo This might take a few minutes...
        echo.
        choco install ffmpeg -y
    ) else (
        echo Chocolatey is not installed. Would you like to install it?
        echo Chocolatey is a package manager for Windows that makes installing software easier.
        echo.
        set /p install_choco="Install Chocolatey? (Y/N): "
        if /i "%install_choco%"=="Y" (
            echo.
            echo Installing Chocolatey...
            @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"
            echo.
            echo Installing FFmpeg...
            choco install ffmpeg -y
        ) else (
            goto MANUAL
        )
    )
    
    echo.
    echo Verifying FFmpeg installation...
    where ffmpeg >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo FFmpeg installed successfully!
        echo.
        echo You might need to restart your command prompt or IDE for the changes to take effect.
        echo After restarting, your application should be able to convert audio files.
    ) else (
        echo.
        echo FFmpeg installation through Chocolatey failed.
        goto MANUAL
    )
) else (
    :MANUAL
    echo.
    echo Manual Installation Instructions:
    echo.
    echo 1. Download FFmpeg from https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
    echo 2. Extract the zip file to a folder (e.g., C:\ffmpeg)
    echo 3. Add the bin folder to your PATH:
    echo    - Right-click on 'This PC' or 'My Computer'
    echo    - Select 'Properties'
    echo    - Click on 'Advanced system settings'
    echo    - Click on 'Environment Variables'
    echo    - Under 'System variables', find and select 'Path', then click 'Edit'
    echo    - Click 'New' and add the path to the bin folder (e.g., C:\ffmpeg\bin)
    echo    - Click 'OK' on all dialogs
    echo 4. Restart your command prompt or IDE
    echo 5. Verify installation by typing 'ffmpeg -version'
    echo.
    echo After installation, your application should be able to convert audio files.
)

:END
echo.
echo ===================================
echo.
pause
