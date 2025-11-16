`pnpm install`

`cp .env.example .env`

### Config settings .env for sending a notification when a user registers, forgets password or changes password

https://chatgpt.com/share/68b6e38c-bf9c-8008-a1df-75caf3f07a39

`
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_AUTH_USER=[:user]
   EMAIL_AUTH_PASSWORD=[:password]
   EMAIL_DEBUG=true
   EMAIL_LOGGER=true
`
### Config settings .env for TypeORM MySQL Database
Once the database has been configured, start the Nest App via `pnpm run start:dev` it automatically synchronizes the entities so it is ready to use.

`
   TYPEORM_CONNECTION = "mysql"
   TYPEORM_HOST = "localhost"
   TYPEORM_PORT = 3306
   TYPEORM_USERNAME = [:user]
   TYPEORM_PASSWORD = [:password]
   TYPEORM_DATABASE = [:database]
   TYPEORM_AUTO_SCHEMA_SYNC = true
   TYPEORM_ENTITIES = "dist/**/*.entity.js"
   TYPEORM_SUBSCRIBERS = "dist/subscriber/**/*.js"
   TYPEORM_MIGRATIONS = "dist/migrations/**/*.js"
   TYPEORM_ENTITIES_DIR = "src/entity"
   TYPEORM_MIGRATIONS_DIR = "src/migration"
   TYPEORM_SUBSCRIBERS_DIR = "src/subscriber"
`

```sql
CREATE DATABASE IF NOT EXISTS `slava_server`
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_0900_ai_ci;
```

### Install TypeScript Node

` pnpm install -g ts-node `

## Running migrations with typeorm

`   ts-node node_modules/.bin/typeorm migration:run -d dist/typeorm-cli.config `

or

`   node_modules/.bin/typeorm migration:run -d dist/typeorm-cli.config `

`
    # development
    $ pnpm dev

    # watch mode
    $ pnpm start:dev

    # production mode
    $ pnpm start:prod
`

### Docker

There is a `docker-compose.yml` file for starting MySQL with Docker.

`$ docker-compose up db`

After running, you can stop the Docker container with

`$ docker-compose down`

### Url Swagger for Api Documentation

` http://127.0.0.1:3000/docs `

or

` http://127.0.0.1:3000/docs-json `

or

` http://127.0.0.1:3000/docs-yaml `

Configure `SWAGGER_USER` and `SWAGGER_PASSWORD` in the .env file for to access the Swagger(Open API) documentation with basic authentication. `NODE_ENV`
must not be equal to "production" otherwise the Swagger is not displayed.

`
NODE_ENV=[:enviroments]
SWAGGER_USER=[:user]
SWAGGER_PASSWORD=[:password]
`
### Configuring the SERVER_PORT environment variable as the default port if you don't want to use the default

`   SERVER_PORT=3333 `

### Configuring the ENDPOINT_URL_CORS environment variable for app frontend

` ENDPOINT_URL_CORS='http://127.0.0.1:4200' `
