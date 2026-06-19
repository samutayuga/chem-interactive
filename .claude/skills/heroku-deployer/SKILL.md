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

> **Heroku registry requirement:** Heroku container registry rejects OCI manifest lists (multi-platform manifests).
> Use `--provenance=false` to produce a single-manifest image. Combine with `--push` to build and push in one step.

```sh
docker buildx build --platform linux/amd64 --push --provenance=false \
  --tag registry.heroku.com/chem-interactive/web -f Dockerfile .
```

This single command builds **and** pushes the image.

2. Deploy the image to Heroku:

```sh
heroku container:release web --app chem-interactive
```
