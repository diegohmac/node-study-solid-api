# Typescript Node Template

This template provides a starting point for building Node applications using TypeScript. It includes essential elements like:

- **TypeScript configuration**: Set up for compiling and running TypeScript code.
- **Linting and formatting**: Configured Biome to ensure code quality and consistency.

## Packages
| Package | Description |
| --- | --- |
| `typescript` | For type safe JS applications.
| `@types/node` |  Type definitions for Node core modules and enables seamless integration of TS with Node applications.
| `tsx` | CLI command for running TS and ESM in both `commonjs` and `module` package types.
| `tsup` | Bundle TS with no config.
| `@biomejs/biome` | Format, lint, and more in a fraction of a second.
| `dotenv` | Loads environment variables.
| `zod` | TypeScript-first schema validation with static type inference

## Setup

### Biome
Install the VsCode Biome extension and you can either run `npx @biomejs/biome init` to create a `biome.json` config file or you can copy paste my custom config:

biome.json
```json
{
  "$schema": "https://biomejs.dev/schemas/1.5.3/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "files": {
    "ignore": ["dist/*", "build/*"]
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingComma": "es5"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```
