# Summary

This skill is used to `prepare`, then `deploy` the application into heroku. The following are the steps,
* `preparation`

Build `chem-interactive` project artefacts.

From the root directory of the `chem-interactive` project, execute the following command:

```sh
npm ci && npm run build
```
This will produce the bundle that contains, directory containing highly optimized, minified, and bundled versions of your application's files.


* `containerized in local then push to heroku image registry`

1. Containerize the application by building and pushing the Docker image.

* Build the Docker image:

From the project root directory, run the following command,

```sh
docker build --no-cache --tag registry.heroku.com/chem-interactive/web -f Dockerfile .
```

2. Push the Docker image to Heroku:

```sh
docker push registry.heroku.com/chem-interactive/web
```

3. Deploy the image to Heroku:

```sh
heroku container:release web --app chem-interactive
```
