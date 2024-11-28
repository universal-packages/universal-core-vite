# Core Vite

[![npm version](https://badge.fury.io/js/@universal-packages%2Fcore-vite.svg)](https://www.npmjs.com/package/@universal-packages/core-vite)
[![Testing](https://github.com/universal-packages/universal-core-vite/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-core-vite/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-core-vite/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-core-vite)

[Vite](https://vite.dev/) universal-core abstraction.

## Install

```shell
npm install @universal-packages/core-vite
```

## Initialization

This will create a vite app using `vite` and install the core packages as well as adapting the resulting app to use the core abstraction.

```shell
ucore initialize vite --name my-app --template vue
```

## Development

Instead of running `npm start` you use the `ucore run` command to start the development server of you react app, you can have multiple apps initialized in the same project and run them individually.

```shell
ucore run vite --name my-app
```

### Vite configuration

To match core config conventions a `vite.yaml` configuration file will be created to pass simple configuration to vite. If you need to configure vite more robustly you can always use the `vite.config.js` file.

## Build and Eject

```shell
ucore exec vite build
ucore exec vite preview
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
