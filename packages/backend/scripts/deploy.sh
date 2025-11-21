#!/usr/bin/env bash

read -p "Enter commit description: " commitDescription

git add .
git commit -m "$commitDescription"
git push origin main

rsync -avzh ./src root@92.118.114.119:/home/vk-mini-app
rsync -avzh ./package.json root@92.118.114.119:/home/vk-mini-app

ssh root@92.118.114.119 'cd /home/vk-mini-app && yarn && yarn build && pm2 restart 0'

echo "Deployed successfully!"
