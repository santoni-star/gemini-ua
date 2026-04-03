@echo off
echo 🚀 Employee Platform Setup
echo ==========================

REM Check if Flutter is installed
where flutter >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Flutter is not installed. Please install Flutter first.
    exit /b 1
)

echo ✅ Flutter found
flutter --version | findstr /C:"Flutter"

REM Get dependencies
echo.
echo 📦 Installing dependencies...
flutter pub get

REM Run build_runner
echo.
echo 🔨 Running code generation...
dart run build_runner build --delete-conflicting-outputs

REM Check for .env file
if not exist .env (
    echo.
    echo ⚠️  .env file not found. Creating from template...
    copy .env.example .env
    echo ✅ .env created. Please edit with your Supabase credentials.
)

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo    1. Edit .env with your Supabase URL and Anon Key
echo    2. Run SQL migrations in Supabase Dashboard
echo    3. Run: flutter run
echo.

pause
