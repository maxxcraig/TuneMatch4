@echo off
echo 🚀 Setting up TuneMatch4 Project...

:: Step 1: Create and activate virtual environment
echo 📦 Creating virtual environment...
python -m venv venv
call venv\Scripts\activate

:: Step 2: Install backend dependencies
echo ⬇️ Installing Python dependencies...
pip install -r requirements.txt

:: Step 3: Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

echo ✅ Setup complete! You can now run the project.
echo Run Django backend: "venv\Scripts\activate & python manage.py runserver"
echo Run React frontend: "cd frontend & npm run dev"
