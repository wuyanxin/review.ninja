# Contributing to ReviewNinja

We provide a `docker-compose.yml` to make local development fun and simple.

Prerequisites:
- docker
- docker-compose
- [kitematic](https://kitematic.com) (optional, but highly recommended)

To setup your local environment:

1) Fork this repo

2) Create a GitHub [developer application](https://github.com/settings/applications/new)

> For now, since we do not know what our application URL will be just enter
> any URL for the homepage and callback URL.

3) Rename `docker-compose.example.yml` to `docker-compose.yml`

4) Copy and paste your client id/secret into `docker-compose.yml`

```yml
environment:
  MONGODB: mongodb://Mongo/reviewninja
  GITHUB_CLIENT: *Your generated client id*
  GITHUB_SECRET: *Your generated client secret*
```

5) Run `docker-compose up -d`

> This will take a long time the very first time your run it since docker will
> need to grab all images and dependancies.

6) Set the application URL's

Now that our application is up and running we need to set the callback URL's
so that we can authenticate with GitHub. For example, if your app container
is using `192.168.99.100:5000` you would set the following:

```
Homepage URL: http://192.168.99.100:5000
Authorization callback URL: http://192.168.99.100:5000/auth/github/callback
```

7) Use ngrok to get GitHub webhooks (optional)

For convienence we have included an ngrok container, we can use this service
to forward webhook requests from GitHub to our local machine.

When you enable ReviewNinja on a repo we will automatically create a GitHub
webhook. We need to change this URL to ngrok instead of the default localhost.

In GitHub go to your repo, then settings, then 'Webhooks & Services'. Find
a URL that looks like this:
```
http://localhost:5000/github/webhook/8y7582c037e3f5fs0dpa48f2
```

And change it to your ngrok URL. This can be found in the logs of your ngrok 
container. Be sure to keep "/github/webhook/..."
```
http://8795536b.ngrok.com/github/webhook/8y7582c037e3f5fs0dpa48f2
```


## License

Contributions to this project are very welcome, but can only be accepted if 
the contributions themselves are given to the project under the Apache License 
2.0. Contributions other than those given under Apache License 2.0 will be 
rejected.

## CLA

When you create a pull request you will be asked to "digitally sign" a CLA
over at [CLA Assistant](https://cla-assistant.io/). In order for us to merge
your pull request you must sign our CLA.
