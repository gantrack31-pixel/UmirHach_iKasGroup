FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV VITE_USE_DEMO_SERVICE=false VITE_OCR_API_URL=/ocr-api
RUN npm test && npm run build

FROM nginx:1.28-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# Absolute image URLs are not bundled by Vite.
COPY --from=build /app/assets /usr/share/nginx/html/assets
EXPOSE 80
