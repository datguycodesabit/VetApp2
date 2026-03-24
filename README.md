Running on a Python3.11.11 virtual enviorment

Install requirements:
  pip install -r requirements.txt

Install gunicorn:
  gunicorn -w 4 -b 0.0.0.0:8000 app:app
