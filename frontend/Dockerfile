FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
# Inject build arguments
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

ARG VITE_IMAGE_SERVICE_URL
ENV VITE_IMAGE_SERVICE_URL=${VITE_IMAGE_SERVICE_URL}

ARG VITE_AUTH_SERVICE_URL
ENV VITE_AUTH_SERVICE_URL=${VITE_AUTH_SERVICE_URL}

ARG VITE_CHATBOT_SERVICE_URL
ENV VITE_CHATBOT_SERVICE_URL=${VITE_CHATBOT_SERVICE_URL}

RUN npm run build

FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
EXPOSE 5173
ENV PORT=5173
CMD ["npm", "run", "start"]