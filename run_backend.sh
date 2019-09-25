cd backend
source venv/bin/activate

export FLASK_APP=server.py
export FLASK_ENV=development

flask run -p 1234 --host=0.0.0.0