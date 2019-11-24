# Node Starter

A NodeJS starter template with NodeJS + TypeScript + Hapi + TypeORM + Postgres + GraphQL

## Demo

##### Default credential: `node/node`

1. Visit [https://typescript-node-starter.herokuapp.com/doc](https://typescript-node-starter.herokuapp.com/doc) to view swagger docs.
2. Visit [https://typescript-node-starter.herokuapp.com](https://typescript-node-starter.herokuapp.com) to view the status monitor.
3. Visit [https://typescript-node-starter.herokuapp.com/graphql](https://typescript-node-starter.herokuapp.com/graphql) to view GraphQl Playground.

## What currently supports?

This starter kit comes with the following features:

- **Swagger-UI**
- **Status Monitor**
- **Authorization with Basic and JWT**
- **Apollo GraphQL**
- **TypeORM and Postgres**
- **.env files support**
- **nodemon for hot-reload**
- **Pretty Console Logger with Winston**
- **Code formatting with Prettier as hook for Pre-commit**
- **Dockerfile + docker-compose for development**
- **Basic Test Suite with Tape and Test coverage**
- **Coverage Report**
- **Supports Github Action**
- **Supports Heroku Deployment**
- **Supports Prettier for code formating**
- **Supports commitlint via husky to have standarized commit messages**

## Requirements

- NodeJS > 10.x
- Yarn > 1.x
- NPM > 5.x
- Postgres 11.5

## How to use it?

1. CLone this project
2. Run `npm install`
3. Run `npm run dev`
4. Visit [http://localhost:8080/doc](http://localhost:8080/doc) to view swagger docs.
5. Visit [http://localhost:8080](http://localhost:8080) to view the status monitor.
6. Visit [http://localhost:8080/graphql](http://localhost:8080/graphql) to view GraphQl Playground.

## Documentation

### Configurations

- Update `ormconfig.yml` to configure Database
- Add or update other configurations in `.env`, `src/config.ts`

### What are the package.json scripts for?

- `tsc`: Compiles typescript based on config set in tsconfig.json.
- `start`: Starts node with the compiled typescript. Used by eg. Heroku.
- `docker:logs`: View Docker logs
- `docker:ps`: List Docker containers
- `docker:start`: Start Docker container based on docker-compose.yml file.
- `docker:stop`: Stop Docker container
- `nodemon:start`: Starts the Nodemon using ts-node. No need to compile beforehand.
- `dev`: Same as nodemon:start
- `format:lint`: Runs tslint on the typescipt files, based on tslint.js settings.
- `format:prettier`: Runs prettier on all ts-files.
- `test`: Runs tests using nyc, and creates coverage report.

## Issues

If you found a bug, or you have an answer, or whatever. Please, raise an [issue](https://github.com/sumitmckv/node-starter/issues/new).

## Contributing

Of course, if you see something that you want to upgrade from this library, or a bug that needs to be solved, PRs are welcome!

## License

Distributed under the **MIT license**. See [LICENSE](https://github.com/sumitmckv/node-starter/blob/master/LICENSE) for more information.
