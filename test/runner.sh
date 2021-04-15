#! /bin/bash

if [ "$TRAVIS_EVENT_TYPE" == "cron" ]; then
  yarn test:e2e
else
  yarn test:unit
fi
