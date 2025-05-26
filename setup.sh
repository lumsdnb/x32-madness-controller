#!/bin/bash

echo "🎛️  Setting up X32 Channel Group Switcher..."

echo "📦 Installing frontend dependencies..."
pnpm install

echo "📦 Installing backend dependencies..."
pnpm run install:backend

echo "🔨 Building native addons..."
pnpm run build:native

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run dev:all    # Start both frontend and backend"
echo "  npm run dev        # Start frontend only"
echo "  npm run dev:backend # Start backend only"
echo ""
echo "The frontend will be available at: http://localhost:5173"
echo "The backend will be available at: http://localhost:3001"
echo ""
echo "⚠️  Don't forget to:"
echo "  1. Configure your X32 IP address in the web interface"
echo "  2. Make sure your X32 has OSC enabled"
echo "  3. Start Ableton Live with Link enabled for auto-switching" 