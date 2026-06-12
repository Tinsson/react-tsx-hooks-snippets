# Repository Guidelines

## Project Structure & Module Organization

This repository is a VS Code snippets extension for React, Redux, hooks, and TypeScript/TSX. Snippet source files live under `example/`, grouped by topic:

- `example/react/` for React and hooks snippets.
- `example/redux/` for Redux snippets.
- `example/typescript/` for TypeScript snippets.

Each example file is compiled into `snippets/snippets.json` by `compiler.js`. The generated JSON is the file contributed to VS Code through `package.json`. Static extension assets live in `images/`, and `.vscode/launch.json` starts an Extension Host for local testing.

## Build, Test, and Development Commands

- `npm run build`: runs `node compiler.js` and regenerates `snippets/snippets.json` from `example/**/*.tsx`.
- `node compiler.js`: equivalent direct build command; useful when debugging the compiler.
- VS Code `Run and Debug` > `Extension`: launches a development Extension Host using the current workspace.

There is currently no automated test script. Validate changes by rebuilding and testing snippet prefixes in the Extension Host.

## Coding Style & Naming Conventions

Use 2-space indentation in snippet bodies and generated JSON. Keep JavaScript in `compiler.js` simple CommonJS, matching the existing style. Example snippet files should be named after their snippet prefix, such as `use.tsx`, `rafcts.tsx`, or `rdxact.tsx`.

Every snippet source should begin with metadata comments:

```tsx
// @name: useEffect
// @prefix: use
// @description: React useEffect
```

Keep snippet placeholders valid for VS Code, for example `${1:name}`, `${2:props}`, and `$0`.

## Testing Guidelines

After editing or adding snippets, run `npm run build` and inspect `snippets/snippets.json` for the expected `prefix`, `body`, and `description`. Then launch the Extension Host and verify the prefix expands in `.ts` and `.tsx` files, since both `typescript` and `typescriptreact` are configured in `package.json`.

## Commit & Pull Request Guidelines

Git history is brief and uses short imperative messages, with occasional Conventional Commit style such as `feat: add logo pic`. Prefer concise messages like `feat: add useId snippet` or `fix: correct redux selector body`.

Pull requests should describe the changed snippets, mention whether `npm run build` was run, and include screenshots or short before/after examples when snippet expansion behavior changes. Link related issues when available.
