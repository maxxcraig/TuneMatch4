#!/bin/bash

echo "🚀 Setting up TuneMatch4 Project..."

# Step 1: Set up virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Step 2: Install backend dependencies
echo "⬇️ Installing Python dependencies..."
pip install -r requirements.txt

# Step 3: Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Setup complete! You can now run the project."
echo "Start Django backend: python manage.py runserver"
echo "Start React frontend: cd frontend && npm run dev"
