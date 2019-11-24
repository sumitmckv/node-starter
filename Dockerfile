FROM node:13.0.1-alpine
LABEL maintainer="sumitmckv14@gmail.com"
ARG PROJECT_DIR=/usr/app
WORKDIR $PROJECT_DIR
COPY src package.json package-lock.json tsconfig.json ./
RUN apk add --no-cache git
RUN npm ci
RUN npm run tsc

# multi-stage build
FROM node:13.0.1-alpine
ARG PROJECT_DIR=/usr/app
WORKDIR $PROJECT_DIR
COPY --from=0 $PROJECT_DIR .
COPY . .
EXPOSE 8080
CMD ["npm","start"]
