source ~/.nvm/nvm.sh
if ! command -v nvm &> /dev/null
then
    electron main.js
    exit
fi
nvm use 18.13.0
electron main.js