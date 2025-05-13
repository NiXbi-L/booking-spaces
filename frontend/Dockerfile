FROM node:18 as build

WORKDIR /app
COPY booking_front/package*.json ./
RUN npm install -g react-scripts
RUN npm install
COPY booking_front/ .
RUN chmod +x node_modules/.bin/react-scripts
RUN npm run build

FROM nginx:1.21
COPY --from=build /app/build /usr/share/nginx/html