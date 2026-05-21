@echo off
setlocal
cd /d "%~dp0"

echo [1/4] Menyalakan Docker Desktop...
if exist "C:\Program Files\Docker\Docker\Docker Desktop.exe" (
  start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
)

echo [2/4] Menunggu Docker siap...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$deadline = (Get-Date).AddMinutes(3);" ^
  "while ((Get-Date) -lt $deadline) {" ^
  "  docker info *> $null;" ^
  "  if ($LASTEXITCODE -eq 0) { exit 0 }" ^
  "  Start-Sleep -Seconds 3;" ^
  "}" ^
  "Write-Error 'Docker belum siap setelah 3 menit.';" ^
  "exit 1"
if errorlevel 1 exit /b 1

echo [3/4] Menyalakan PostgreSQL container...
call npm run db:up
if errorlevel 1 exit /b 1

echo [4/4] Menjalankan backend dan frontend...
call npm run dev
