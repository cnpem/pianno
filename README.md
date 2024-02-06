# pianno: The Pimega Annotator

A simple tool to help you annotate pimega images.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="apps/docs/src/assets/hero-dark.svg">
  <img alt="Shows the logo for the pianno web app: A Pimega annotator.." 
    src="apps/docs/src/assets/hero.svg">
</picture>

## User guide and documentation

For a complete guide with examples and documentation, please visit [the docs](https://cnpem.github.io/pianno/)).

### Run locally

You build the app yourself and run it locally by running the docker container with:

```bash
docker compose up --build
```

or simply pull it from the registry:

```bash
docker pull ghcr.io/cnpem/cnpem/pianno:main
```

## Developers

### Getting Started

One can run the development mode with the following commands:

```bash
pnpm install
pnpm dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the result. This will also start the docs page at [http://localhost:4321](http://localhost:4321).

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.
