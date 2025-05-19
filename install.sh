
. settings.ini

DIR=$(readlink -e "${0%/*}")
echo "Arret de l'application..."
sudo -s supervisorctl stop ${app_name}



# make nvm available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


#Création des répertoires systèmes
mkdir -p var/log

# Backend
cd backend

echo "Création du fichier de configuration ..."
if [ ! -f config.py ]; then
  cp config.py.sample config.py
fi


echo "préparation du fichier config.py..."
sed -i "s/SQLALCHEMY_DATABASE_URI = .*$/SQLALCHEMY_DATABASE_URI = \"postgresql:\/\/$user_pg:$user_pg_pass@$db_host:$db_port\/$db_name\"/" config.py


rm -r venv
python3 -m venv venv

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate


cd ..


# Front end
cd frontend 

nvm install
nvm use


cd flora-occitania/

#création d'un fichier de configuration
if [ ! -f src/app/appSettings.ts ]; then
  echo 'Fichier de configuration non existant'
  cp src/app/appSettings.ts.sample src/app/appSettings.ts
fi



npm install


#Lancement de l'application
cd ${DIR}
sudo -s cp flora_occitania-service.conf /etc/supervisor/conf.d/
sudo -s sed -i "s%APP_PATH%${DIR}%" /etc/supervisor/conf.d/flora_occitania-service.conf

sudo -s supervisorctl reread
sudo -s supervisorctl reload
