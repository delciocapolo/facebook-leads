ARG NODE_VERSION=22

# STAGE 1: BASE
FROM node:${NODE_VERSION} AS base
ARG USER=node
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app && chown ${USER}:${USER} /usr/src/app \
   && mkdir tmp && chown -R ${USER}:${USER} tmp \
   && apt-get update && apt-get install -y netcat-openbsd
USER ${USER}

# STAGE 2: DEPENDENCIES
FROM base AS dependencies
COPY --chown=${USER}:${USER} ./package*.json ./
RUN npm install
COPY --chown=${USER}:${USER} . .

# STAGE 3: BUILD
FROM dependencies AS build
RUN npm run build

# STAGE 4: production
FROM build AS production
COPY --chown=${USER}:${USER} ./package*.json ./
COPY --chown=${USER}:${USER} --from=build /usr/src/app/dist .
COPY --chown=${USER}:${USER} --from=dependencies /usr/src/app/node_modules ./node_modules

EXPOSE 3331
ENTRYPOINT [ "./docker/app/entrypoint.sh" ]
