
. settings.ini

export BASE_DIR=$(readlink -e "${0%/*}")
echo "Arret de l'application..." 
sudo systemctl stop flora_occitania.service

# make nvm available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

 
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


cd ..
pip install .
deactivate


# Front end
cd frontend/flora-occitania
nvm install
nvm use
#création d'un fichier de configuration
if [ ! -f src/app/appSettings.ts ]; then
  echo 'Fichier de configuration non existant'
  cp src/app/appSettings.ts.sample src/app/appSettings.ts
fi 

npm install
npm run build

#Lancement de l'application
cd ${BASE_DIR} 
envsubst '${USER} ${BASE_DIR}' < "${BASE_DIR}/flora_occitania.service" | sudo tee  /etc/systemd/system/flora_occitania.service


sudo systemctl enable flora_occitania.service
sudo systemctl start flora_occitania