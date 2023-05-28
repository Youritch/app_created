source ~/.nvm/nvm.sh
if ! command -v nvm &> /dev/null
then
    electronmon main.js
    exit
fi
nvm use 18.13.0
electronmon main.js