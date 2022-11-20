## Initialise NodeJS project and install dependencies

```
yarn init

yarn add fastify env-schema @fastify/swagger @fastify/swagger-ui nanoid @fastify/type-provider-json-schema-to-ts @sinclair/typebox @prisma/client zod @fastify/jwt bcryptjs fastify-plugin

yarn add @types/node typescript @commitlint/config-conventional @commitlint/cli husky prettier vitest tsx prisma pino-pretty -D
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

I'm not sure yet if I agree with pre-commit hooks, however this one is cool to enforce convetions.

https://www.conventionalcommits.org/en/v1.0.0/

yarn husky install

touch .husky/commit-msg

```shell
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit "\${1}"
```

chmod a+x .husky/commit-msg

touch commitlint.config.js

```js
module.exports = {
	extends: ["@commitlint/config-conventional"],
};
```

## Setup prettier

Create a .prettierrc.json
Define some rules to match your preferences, I like

```json
{
	"semi": true,
	"singleQuote": false,
	"arrowParens": "avoid",
	"useTabs": true,
	"tabWidth": 2
}
```

Create a .prettierignore

```shell
node_modules
build
.nyc_output
```

touch .husky/pre-commit

chmod a+x .husky/pre-commit

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

Add the following to package.json

```json
"lint-staged": {
	"**/*": "prettier --write --ignore-unknown"
}
```
