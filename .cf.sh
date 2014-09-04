#!/bin/bash

# Download cf command line client
# wget https://cli.run.pivotal.io/stable?release=linux64-binary&source=github

# Install cf command line client

#...

cf login -a https://api.run.pivotal.io -u $CF_USER -p $CF_PASS

cf push $1 -c "node app.js" --no-manifest