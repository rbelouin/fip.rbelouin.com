#! /bin/bash

if [ "$TRAVIS_EVENT_TYPE" == "cron" ]; then
  npm run test:e2e
else
  npm run test:unit
fi
