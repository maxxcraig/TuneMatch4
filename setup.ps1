Write-Host "🚀 Setting up TuneMatch4 Project..."

# Step 1: Create and activate virtual environment
Write-Host "📦 Creating virtual environment..."
python -m venv venv
.\venv\Scripts\activate

# Step 2: Install backend dependencies
Write-Host "⬇️ Installing Python dependencies..."
pip install -r requirements.txt

# Step 3: Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

Write-Host "✅ Setup complete! You can now run the project."
Write-Host "Run Django backend: .\venv\Scripts\activate; python manage.py runserver"
Write-Host "Run React frontend: cd frontend; npm run dev"
