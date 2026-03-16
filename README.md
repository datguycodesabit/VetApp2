Create Python3.11.11 venv
  python3.11.11 -m venv venv
  source venv/bin/activate

Install gunicorn

Install requirements (or PyTorch CPU downloaded manually)
  pip install -r requirements.txt

gunicorn -w 4 -b 0.0.0.0:8000 app:app
