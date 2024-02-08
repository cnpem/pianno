# pianno: The Pimega Annotator

A simple tool to help you annotate pimega images.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/docs/public/hero-dark.svg">
  <img alt="Shows the logo for the pianno web app: A Pimega annotator.." 
    src="apps/docs/public/hero.svg">
</picture>

## User guide and documentation

For a complete guide with examples and documentation, please visit [the docs](https://pianno.lnls.br/uwu).

> Note: the docs page is currently hosted at [https://pianno.lnls.br/uwu](https://pianno.lnls.br/uwu), which is an internal server at CNPEM. If you are not at CNPEM, you can run the docs page locally by following the instructions below.

### Run locally

You build the app yourself and run it locally by running the docker container with:

```bash
docker compose up --build
```
Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the result. This will also start the docs page at [http://localhost:4321/uwu](http://localhost:4321/uwu).

or simply pull it from the registry:

```bash
docker pull ghcr.io/cnpem/cnpem/pianno:main
docker run -p 3000:3000 ghcr.io/cnpem/cnpem/pianno:main
```

The docs page is also available in the registry:

```bash
docker pull ghcr.io/cnpem/cnpem/pianno-docs:main
docker run -p 4321:3000 ghcr.io/cnpem/cnpem/pianno-docs:main
```

> Note: The docs page is available at the basePath `/uwu` in the container. Why? Thought it was a funny pun on www.

## Developers

### Getting Started

One can run the development mode with the following commands:

```bash
pnpm install
pnpm dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the result. This will also start the docs page at [http://localhost:4321/uwu](http://localhost:4321/uwu).

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.
