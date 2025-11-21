FROM node:20

ENV HOME=/usr/src/app
WORKDIR $HOME

# Копируем package.json и lock файлы
COPY package*.json ./
COPY .npmrc ./
COPY package-lock.json ./

# Устанавливаем зависимости
RUN npm ci --legacy-peer-deps --silent

# Устанавливаем serve глобально для отдачи статики
RUN npm install -g serve

# Копируем весь исходный код и файлы проекта
COPY . .

# Собираем проект
RUN npm run build

# Открываем порт 3000 для отдачи статики
EXPOSE 3000

# Запускаем приложение через serve из папки dist на порту 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
