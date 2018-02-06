## differences
This example has three notable difference but only one important one:
* preload-extended.js (in /electron/renderer) is a more complex preloader that provides the whole IPC api yet filters the channels to a predefined whitelist.

Other two:
* electron is started by a Node env (index.js)  through proc.spawn (caution)
* more complex folder structure

If you like the folder structure, yet don't like the way the electron is being launched (I don't like it either) then you can use the package-alt.json instead.

## usage

```
yarn install
yarn run start
```
I suggest using yarn.

## a word of caution
In this example we're actually _spawning_ the electron shell.
It comes with its own fair share of ways to fuck up, so I suggest manually checking that the sandbox is indeed enabled.

## HOW TO FUCK UP.
Running the index.js from the command line ruins everything.
```
$ node index.js // DO NOT DO THIS.
```

Will result in these processes:

```
user@host:~/projects/electron/electron-sandbox$ ps aux | grep "electron"
user     25513 11.5  1.7 1146760 91464 pts/0   Sl+  22:07   0:00 /somepath/sandbox-preload-extended/node_modules/electron/dist/electron --enable-sandbox /somepath/sandbox-preload-extended/main.js
user     25516  0.5  0.5 323788 28904 pts/0    S+   22:07   0:00 /home/user/projects/electron/electron- andbox/sandbox-preload-extended/node_modules/electron/dist/electron --type=zygote
user     25518  0.0  0.1 323788  8404 pts/0    S+   22:07   0:00 /home/user/projects/electron/electron- andbox/sandbox-preload-extended/node_modules/electron/dist/electron --type=zygote
user     25548  2.0  1.3 717784 67652 pts/0    Sl+  22:07   0:00 /home/user/projects/electron/electron- andbox/sandbox-preload-extended/node_modules/electron/dist/electron --type=zygote
user     25564  0.0  0.0  12728  2248 pts/5    S+   22:07   0:00 grep electron

```

If you're only seeing processes of the type `zygote` then something is wrong and you have no sandbox.

**result: no sandbox**

I don't know why (yet).

## packaging
electron-builder does not support packaging sandboxed applications.
If you're looking to distribute your application then electron is not the right choice.
