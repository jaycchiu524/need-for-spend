# Need For Spend Server

## Yarn 2

```bash
# Integrate typescript & prettier to vscode
yarn sdks vscode
```

## Dev

```bash
# Env for app
cp .env.example .env

# Env for testing, different port / database
cp .env.example .env.test

# Setup dev database
docker-compose up -d
```

## Bugs

### Fix `@prisma/client` module not found

[Reference: Support (@prisma/client) for Yarn 2 with PnP](https://github.com/prisma/prisma/issues/1439)

1. Install `@yarnpkg/pnpify`
2. Set output path for generated client

```javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated"
}
```

3. Import `@prisma/client` from generated

```javascript
import { PrismaClient } from '@/src/generated/'
```

4. Copy `@/src/generated` to `dist/src/` with `copy-files` after build

```json
// package.json

"scripts": {
  // ...
  "copy-files": "copyfiles -u 1 \"./src/generated/**/*\" dist/src",
}
```
