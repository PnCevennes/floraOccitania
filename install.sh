

. settings.ini

cd backend
rm -r venv
virtualenv -p /usr/bin/python3 venv

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate


