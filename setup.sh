#!/bin/bash

# Employee Platform - Setup Script

echo "🚀 Employee Platform Setup"
echo "=========================="

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed. Please install Flutter first."
    exit 1
fi

echo "✅ Flutter found: $(flutter --version | head -1)"

# Get dependencies
echo ""
echo "📦 Installing dependencies..."
flutter pub get

# Run build_runner
echo ""
echo "🔨 Running code generation..."
dart run build_runner build --delete-conflicting-outputs

# Check for .env file
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "✅ .env created. Please edit with your Supabase credentials."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Edit .env with your Supabase URL and Anon Key"
echo "   2. Run SQL migrations in Supabase Dashboard"
echo "   3. Run: flutter run"
echo ""
