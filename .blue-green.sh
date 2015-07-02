#!/bin/bash

set -e

# download cf cli
wget -O - https://cli.run.pivotal.io/stable\?release\=linux64-binary\&source\=github | tar xvz -C .

# login
./cf login -a https://api.run.pivotal.io -u $CF_USER -p $CF_PASS

if [ -z "$(./cf env review-ninja-staging-blue | grep \"staging.review.ninja\")" ]; then
    A="review-ninja-staging-blue"
    B="review-ninja-staging-green"
else
    A="review-ninja-staging-green"
    B="review-ninja-staging-blue"
fi

# push app
./cf push $A -c "node app.js" --no-manifest

# map routes
./cf map-route $A cfapps.io -n review-ninja-staging
./cf map-route $A review.ninja -n staging

# unmap routes
./cf unmap-route $B cfapps.io -n review-ninja-staging
./cf unmap-route $B review.ninja -n staging
