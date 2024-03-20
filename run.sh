echo "Setting virtual environment"
cd api && python3 -m venv .venv

echo "Activate virtual environment"
. .venv/bin/activate

echo "Install Flask"
pip install Flask

echo "Start Application"
cd app && flask --app main run --debug