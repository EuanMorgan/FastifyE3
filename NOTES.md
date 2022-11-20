## Initialise NodeJS project and install dependencies

```
yarn init

yarn add fastify env-schema @fastify/swagger @fastify/swagger-ui nanoid @fastify/type-provider-json-schema-to-ts @sinclair/typebox @prisma/client zod

yarn add @types/node typescript @commitlint/config-conventional @commitlint/cli husky prettier vitest tsx prisma -D
```

## Initialise TypeScript

```
npx tsc --init
```

### Modify a few options in tsconfig.json

`"outDir":"./build"`

## Initialise git repository

```
git init
```

Create .gitignore file and add the following:

`node_modules`

`.env`

`build`

## Add scripts to package.json

`"scripts": { "build": "tsc", "dev":"tsx watch src/app.ts" }`

## Initialise Prisma

```
npx prisma init
```

### Modify a few options in prisma/schema.prisma

Prisma will create a .env with a DATABASE_URL variable. Modify this to point to your database.

It will also create a prisma folder with a schema.prisma, this is where we define our database schema.

Ensure that the options in datasource are correct (it defaults to postgresql).

## Folder structure

Put all your code in the src folder.

## Husky && commitlint

yarn husky install

touch .husky/commit-msg

```shell
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit "\${1}"
```

chmod a+x .husky/commit-msg

## Setup prettier

echo {}> .prettierrc.json

touch .prettierignore

touch .husky/pre-commit

chmod a+x .husky/pre-commit

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```
