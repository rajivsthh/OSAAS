#!/bin/bash

echo "🚀 Setting up OSAAS - Offensive Security as a Service..."
echo ""

# Install root dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create backend .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run start        # Start both frontend & backend"
echo ""
echo "Or run separately:"
echo "  npm run dev          # Frontend only (http://localhost:5173)"
echo "  npm run backend      # Backend only (http://localhost:3001)"
echo ""
echo "📚 See README.md for more information"
