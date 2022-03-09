FROM node:15-alpine AS build

ENV NODE_ENV build

ARG app_env

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/
COPY package-lock.json /app/

RUN npm i --silent

COPY . /app/

RUN npm run build-$app_env

EXPOSE 3000

# production environment
FROM nginx:1.13.9-alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /etc/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]