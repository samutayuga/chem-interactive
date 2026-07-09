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

> **Heroku registry requirement:** Heroku container registry only accepts Docker
> schema2 manifests (`application/vnd.docker.distribution.manifest.v2+json`). It
> rejects both OCI manifest *lists* (multi-platform indexes) and OCI *image*
> manifests with `error from registry: unsupported`.
>
> - `--provenance=false` removes the attestation manifest list.
> - `oci-mediatypes=false` forces a Docker schema2 image manifest instead of the
>   OCI manifest that Docker Desktop's containerd image store (and newer
>   BuildKit) now emits by default. **Required** — without it the push fails with
>   `unsupported`, even though the layers upload fine.
>
> The plain `--push` flag does not let you set `oci-mediatypes`, so use the
> explicit `--output type=image,...,push=true` form. `heroku container:push` has
> the same limitation and also fails.

```sh
docker buildx build --platform linux/amd64 --provenance=false \
  --output type=image,oci-mediatypes=false,push=true \
  --tag registry.heroku.com/chem-interactive/web -f Dockerfile .
```

This single command builds **and** pushes the image.

2. Deploy the image to Heroku:

```sh
heroku container:release web --app chem-interactive
```
