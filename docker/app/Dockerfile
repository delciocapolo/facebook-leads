ARG NODE_VERSION=22

# STAGE 1: BASE
FROM node:${NODE_VERSION} AS base
ARG USER=node
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app && chown ${USER}:${USER} /usr/src/app
USER ${USER}

# STAGE 2: DEPENDENCIES
FROM base AS dependencies
COPY --chown=${USER}:${USER} ./package*.json ./
RUN npm ci --omit=dev

# STAGE 3: DEV_DEPENDENCIES
FROM base AS dev_dependencies
COPY --chown=${USER}:${USER} ./package*.json ./
RUN npm ci

# STAGE 4: BUILD
FROM dev_dependencies AS build
COPY --chown=${USER}:${USER} . .
RUN npm run build

# STAGE 5: PRODUCTION
FROM base AS production
COPY --chown=${USER}:${USER} --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --chown=${USER}:${USER} --from=build /usr/src/app/dist ./dist
COPY --chown=${USER}:${USER} ./package.json ./

EXPOSE 3331
ENTRYPOINT [ "./docker/app/entrypoint.sh" ]