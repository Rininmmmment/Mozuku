FROM node:16.15.0-alpine

WORKDIR /usr/src/app

COPY ./package.json /package.json
RUN yarn install --no-lockfile

COPY . .

CMD ["yarn", "start"]