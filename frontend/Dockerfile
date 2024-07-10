FROM node:14-alpine AS build

WORKDIR /app
COPY package*.json .

RUN yarn install
COPY . .
ENV GENERATE_SOURCEMAP false
RUN yarn run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -r /usr/share/nginx/html/*

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
