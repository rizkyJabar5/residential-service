FROM node:13-alpine AS build

WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
