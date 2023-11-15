FROM node:16.15.0-alpine

WORKDIR /usr/src/app

COPY ./package.json /package.json
RUN yarn install --no-lockfile
RUN yarn add react-router-dom
RUN npm install three
RUN npm install three-obj-loader
RUN npm install three-addons
RUN npm install --save @fortawesome/free-solid-svg-icons
RUN npm install --save-dev @types/howler



COPY . .

CMD ["yarn", "start"]