## usage

```
yarn install
yarn run start
```
I suggest using yarn.

## a word of caution

I suggest _never_ running electron manually, always use the yarn/npm run command.
I've seen a _ton_ of cases where the sandbox isn't being enabled due to odd electron behavior.
Seriously, verify that the damn sandbox is enabled, instructions below.

Take note of the following warnings in the package.json
```
{
  "name": "sandbox-preload-simple",
  "version": "1.0.0",
  "description": "",
  "main": "main.js", // DO NOT MESS WITH THIS
  "scripts": {
    "start": "electron --enable-sandbox .", // DO NOT MESS WITH THIS
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Kewde",
  "license": "MIT",
  "devDependencies": {
    "electron": "^1.7.11"
  }
}
```

note: remove the "// DO NOT MESS WITH THIS" comments, as they are not valid JSON.

## packaging
electron-builder does not support packaging sandboxed applications.
If you're looking to distribute your application then electron is not the right choice.
