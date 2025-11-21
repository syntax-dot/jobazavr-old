#!/usr/bin/env bash

read -p "Enter commit description: " commitDescription

git add .
git commit -m "$commitDescription"
git push origin main

rsync -avzh ./src root@92.118.114.119:/home/client-backend-app-production
rsync -avzh ./package.json root@92.118.114.119:/home/client-backend-app-production

ssh root@92.118.114.119 'cd /home/client-backend-app-production && yarn && yarn build && pm2 restart 3'

echo "Deployed successfully!"
