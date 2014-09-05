Installation
============

This guide is thought for people who want to setup a private instance of
ReviewNinja. It is thought to be executed on an ubuntu machine.

> Tested on Ubuntu 14.04

General
-------

Create a user to run the application

	sudo adduser --disabled-login --gecos 'ReviewNinja' reviewninja

And install some utilities used in this guide

	sudo apt-get install -y vim git-core

And set some default values for the system

	sudo update-alternatives --set editor /usr/bin/vim.basic

Install Node.JS
---------------

Setup the package repository

	curl -sL https://deb.nodesource.com/setup | sudo bash -

Install the package

	sudo apt-get install nodejs

Setup MongoDB
-------------

Import the public key used by the package management system.

	sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

Create a list file for MongoDB.

	echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list

Update local package database.

	sudo apt-get update

Install MongoDB

	sudo apt-get install mongodb-org

Make sure it is running

	sudo service mongod start

Open the MongoDB interactive shell

	mongo --port 27017 --authenticationDatabase admin

Add the user reviewninja

	use reviewninja
	db.createUser({
	user: "reviewninja",
	pwd: "reviewninja",
	roles: [
	        { role: "readWrite", db: "reviewninja" }
	    ]
	})

Exit the interactive shell

	exit

Setup ReviewNinja
-----------------

Start by changing to the user to install ReviewNinja under, which was created
in the beginning

	su reviewninja
 
Clone this repository:

	git clone https://github.com/reviewninja/review.ninja.git

The app is located in `/home/review.ninja`.  

	cd ~/review.ninja

Install npm and bower dependencies:

	npm install

To configure the application, copy the `.env.example` file to `.env`:

	cp .env.example venv

You need to [register the application on
GitHub](https://github.com/settings/applications/new). The callback is
http://localhost:5000/auth/github/callback.  Fill out the name and homepage as
you wish.

Set the `GITHUB_CLIENT` and `GITHUB_SECRET` environment variables accordingly
in the `.env` file.

The `MONGODB` default in the `.env.example` file is correct if you followed
this guide 100%, however, it is recommended to choose a secure password for
your MongoDB user.

The following environment variables are mandatory: 

  * `NODE_ENV`
  * `HOST`
  * `SESSION_SECRET`
  * `MONGODB`
  * `GITHUB_CLIENT`
  * `GITHUB_SECRET` 

Refer to [Further Reading on Environment
Variables](#Further-Reading-on-Environment-Variables) for more information on
what to set the variables to.

Once that is done you can source the environment variables

	source .env

And start the application with

	npm app.js

### Further Reading on Environment Variables

The following are the environment variables you have to configure to run a
private instance:

#### General

`NODE_ENV`: Should be set to production, unless you want to help developing
ReviewNinja

`HOST`: Defaults to "review.ninja".

`PORT`: The local port to bind to. Defaults to 5000.

`PROTOCOL`: Valid options are "http" or "https". Defaults to "https".

`HOST_PORT`: This only needs to be set if it is a custom host port.  For
example, http and https are used but not on port 80 and 443.

`GITHUB_CLIENT`: Required. From your registered application in GitHub.

`GITHUB_SECRET`: Required. From your registered application in GitHub.

`GITHUB_PROTOCOL`: Valid options are "http" or "https". Defaults to "https".

`GITHUB_HOST`: Defaults to "github.com". 

> *Warning:* If this variable is set, it is assumed that GitHub Enterprise is
> used.

`GITHUB_API_HOST`: Defaults to "api.github.com".

`MONGODB`: Mandatory. This has to be in form of a mongodb url, e.g. `mongodb://<user>:<password>@<host>:<port>/<dbname>`.

> `MONGODB` is an alias for the environment variable `MONGOLAB_URI`, so both
> are suitable to be used. (`MONGODB` will be favored if both are set)

`GACODE`: Optional. If this is not set, Google Analytics will not be recorded.

#### SMTP

> If `SMTP_HOST` is set, then all `SMTP_*` variables must be set. If
> `SMTP_HOST` is not set, then the systems's sendmail will be used.
 
 * `SMTP_HOST`: Host on which the SMTP Server runs on.
 * `SMTP_PORT`: Port on which the SMTP Server runs on.
 * `SMTP_SSL`: Use ssl or not, values are "true" or "false". Defaults to "true".
 * `SMTP_USER`: User on the SMTP Server.
 * `SMTP_PASS`: Password for the `SMTP_USER`.
