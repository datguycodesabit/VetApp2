Running Python3.11.11 virtual enviorment

pip install -r requirements.txt

gunicorn -w 4 -b 0.0.0.0:8000 app:app
