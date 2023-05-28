source ~/.nvm/nvm.sh
if ! command -v nvm &> /dev/null
then
    npm i
    exit
fi
nvm use 18.13.0
npm i