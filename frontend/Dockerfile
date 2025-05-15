FROM node:18 as build

WORKDIR /app
COPY booking_front/package*.json ./
RUN npm install
COPY booking_front/ .
RUN npm run build

FROM nginx:1.21
COPY --from=build /app/build /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html