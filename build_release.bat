@echo off & setlocal

set HOMEY_DIR=%APPDATA%\Homey
call :ResolvePath TARGET_DIR %~dpn0\..\target\release

for /F "tokens=1-9 delims= " %%a in ("%*") do (
    if %%a==-rd (
        set HOMEY_DIR=%%~fb
    )
)

echo Starting build
set FFMPEG_SIDECAR=0
cargo build --release

dir /A:D %HOMEY_DIR% >nul 2>&1 & if ERRORLEVEL 1 (
    mkdir %HOMEY_DIR%
)
echo %TARGET_DIR%
echo %HOMEY_DIR%
copy %TARGET_DIR%\*.exe %HOMEY_DIR%
xcopy /s /e /h /i .\assets %HOMEY_DIR%\assets

@REM echo Cleaning up...
@REM cargo clean -vv --release
echo Done!
exit /b

:ResolvePath
    set %1=%~f2
    exit /b
