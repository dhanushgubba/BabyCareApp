@echo off
echo ===================================
echo FFmpeg Direct Download Helper
echo ===================================
echo.
echo This script will download and set up FFmpeg for you.
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
echo This script will:
echo 1. Download FFmpeg from gyan.dev
echo 2. Extract it to a folder in your BabyCare project
echo 3. Add it to the PATH for this session
echo.
set /p choice="Continue with download and setup? (Y/N): "

if /i not "%choice%"=="Y" goto END

echo.
echo Creating directories...
if not exist "ffmpeg_bin" mkdir ffmpeg_bin

echo Downloading FFmpeg...
echo This might take a few minutes...

REM Use PowerShell to download the file
powershell -Command "& {Add-Type -AssemblyName System.Net.Http; $client = New-Object System.Net.Http.HttpClient; $task = $client.GetByteArrayAsync('https://github.com/GyanD/codexffmpeg/releases/download/2023-07-16-git-b85a0e5f11/ffmpeg-2023-07-16-git-b85a0e5f11-essentials_build.zip'); $task.Wait(); [System.IO.File]::WriteAllBytes('ffmpeg.zip', $task.Result)}"

if not exist ffmpeg.zip (
    echo Download failed. Please manually download FFmpeg from:
    echo https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
    goto END
)

echo Extracting FFmpeg...
powershell -Command "& {Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('ffmpeg.zip', 'ffmpeg_extract')}"

echo Copying FFmpeg binaries...
xcopy /E /I /Y ffmpeg_extract\*\bin\*.* ffmpeg_bin\

echo Cleaning up...
rmdir /S /Q ffmpeg_extract
del ffmpeg.zip

echo Setting up temporary PATH...
set PATH=%CD%\ffmpeg_bin;%PATH%

echo.
echo Verifying FFmpeg installation...
where ffmpeg
if %ERRORLEVEL% EQU 0 (
    echo.
    echo FFmpeg is now available for this session!
    ffmpeg -version
    echo.
    echo IMPORTANT: For permanent installation, add this path to your system PATH:
    echo %CD%\ffmpeg_bin
    echo.
    echo To do this:
    echo 1. Right-click on 'This PC' or 'My Computer'
    echo 2. Select 'Properties'
    echo 3. Click on 'Advanced system settings'
    echo 4. Click on 'Environment Variables'
    echo 5. Under 'System variables', find and select 'Path', then click 'Edit'
    echo 6. Click 'New' and add: %CD%\ffmpeg_bin
    echo 7. Click 'OK' on all dialogs
) else (
    echo.
    echo Something went wrong with FFmpeg setup.
    echo Please try manual installation:
    echo 1. Download from https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
    echo 2. Extract and add the bin folder to your PATH
)

:END
echo.
echo ===================================
echo.
echo Press any key to restart the API server...
pause > nul
python app.py
