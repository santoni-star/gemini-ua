@echo off
setlocal enabledelayedexpansion
chcp 65001 > nul

set "REPO_URL=https://github.com/santoni-star/gemini-ua.git"
set "INSTALL_DIR=gemini-ua"

echo ============================================================
echo    Gemini CLI (Українська версія) - Майстер встановлення
echo ============================================================
echo.

:: 1. Перевірка Git
echo [1/5] Перевірка Git...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ПОМИЛКА: Git не знайдено. Будь ласка, встановіть Git з https://git-scm.com/
    pause
    exit /b 1
)
echo OK.

:: 2. Перевірка Node.js
echo [2/5] Перевірка Node.js та NPM...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ПОМИЛКА: Node.js не знайдено. Будь ласка, встановіть Node.js з https://nodejs.org/ (рекомендовано LTS)
    pause
    exit /b 1
)
echo OK.

:: 3. Клонування/Оновлення
echo [3/5] Отримання вихідного коду...
if exist "%INSTALL_DIR%" (
    echo Оновлення існуючої папки...
    cd "%INSTALL_DIR%"
    git pull
) else (
    echo Клонування репозиторію...
    git clone %REPO_URL% "%INSTALL_DIR%"
    cd "%INSTALL_DIR%"
)

:: 4. Збірка
echo [4/5] Встановлення залежностей та збірка (це може зайняти час)...
echo Будь ласка, зачекайте...
call npm install --no-audit --no-fund
if %errorlevel% neq 0 (
    echo ПОМИЛКА під час встановлення залежностей.
    pause
    exit /b 1
)

call npm run bundle
if %errorlevel% neq 0 (
    echo ПОМИЛКА під час збірки (bundle).
    pause
    exit /b 1
)

:: 5. Глобальне встановлення
echo [5/5] Глобальне встановлення в систему...
call npm install -g .
if %errorlevel% neq 0 (
    echo ПОМИЛКА під час глобального встановлення. 
    echo Спробуйте запустити цей файл від імені Адміністратора.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo ВІТАЄМО! Gemini CLI успішно встановлено.
echo.
echo Тепер ви можете використовувати команду: gemini-ua
echo Спробуйте: gemini-ua --version
echo ============================================================
echo.
pause
