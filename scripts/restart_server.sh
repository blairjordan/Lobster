#!/bin/sh

rm -r dist

forever stopall

npm run-script build

forever start dist/server.js
