Update the Raspberry Pi and install required packages: 
  sudo apt update,
  sudo apt install python3 python3-venv python3-pip git -y


Clone the repository: 
  git clone VetApp2,
  cd VetApp2


Create a virtual environment: 
  python3 -m venv venv


Activate the virtual environment: 
  source venv/bin/activate


Install the required dependencies: 
  pip install -r requirements.txt


Run the application: 
  python app.py

Find the Raspberry Pi IP address: 
  hostname -I


gunicorn -w 4 -b 0.0.0.0:8000 app:app
