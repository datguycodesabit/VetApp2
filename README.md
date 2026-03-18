Create a Python3.11.11 venv:
  python3.11.11 -m venv [your-venv-name]
  source [your-venv-name]/bin/activate

Install requirements:
  pip install -r requirements.txt

Install gunicorn:
  gunicorn -w 4 -b 0.0.0.0:8000 app:app
