#!/bin/sh

echo "-> Current NODE_ENV is [$NODE_ENV]"

if [ "$NODE_ENV" = "production" ]; then
  echo "-> Running application in production mode"
  npm run start
elif [ "$NODE_ENV" = "development" ]; then
  echo "-> Running application in development mode"
  npm run start:dev
else
  echo "-> NODE_ENV not set or unknown. Falling back to default."
  npm run start
fi
