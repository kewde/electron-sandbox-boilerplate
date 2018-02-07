![](electron-sandbox.jpeg)

> This repository has not been reviewed for security flaws by external parties, use at your own risk.

# electron-sandbox
A simple code example of a sandboxed renderer process with the ability to communicate with backend (main.js) through IPC in a _secure_ manner.

If you're developing an electron application then I strongly recommend you to read the [Blackhat Electron Security Checklist by Cerettoni](https://www.blackhat.com/docs/us-17/thursday/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf).

## table of contents

- [security updates](https://github.com/kewde/electron-sandbox-boilerplate#security-updates)
- [overview](https://github.com/kewde/electron-sandbox-boilerplate#overview)
- [examples](https://github.com/kewde/electron-sandbox-boilerplate#examples)
    * [muon-simple](https://github.com/kewde/electron-sandbox-boilerplate#muon-simple)
    * [sandbox-preload-simple](https://github.com/kewde/electron-sandbox-boilerplate#sandbox-preload-simple)
    * [sandbox-preload-extended](https://github.com/kewde/electron-sandbox-boilerplate#sandbox-preload-extended)
- [usage](https://github.com/kewde/electron-sandbox-boilerplate#usage)
- [packaging/distributing](https://github.com/kewde/electron-sandbox-boilerplate#packaging-distribution)
- [security assumptions](https://github.com/kewde/electron-sandbox-boilerplate#security-assumptions)
- [chromium sandbox explained](https://github.com/kewde/electron-sandbox-boilerplate#chromium-sandbox-explained)
    * [purpose](https://github.com/kewde/electron-sandbox-boilerplate#purpose)
    * [terminology](https://github.com/kewde/electron-sandbox-boilerplate#terminology)
- [good reads on security](https://github.com/kewde/electron-sandbox-boilerplate#good-reads-on-security)
    
## security updates
23th October 2018: Update Electron to 1.7.11 to fix [CVE-2018-1000006](https://electronjs.org/blog/protocol-handler-fix)

## overview
If you're an application developer looking to create a sandboxed application, I highly recommend looking into [Muon](https://github.com/brave/muon).

|                          | sandbox | sandboxed distributables | Electron fork |
|--------------------------|---------|--------------------------|---------------|
| muon-simple              |      y  |            y             | Muon          |
| sandbox-preload-simple   |      y  |          no              | Electron      |
| sandbox-preload-extended |      y  |          no              | Electron      |


## examples

### muon-simple
After a lot of experimenting with electron, I've decided that it wasn't the best fit for my purpose.
Unlike Electron, Muon exposes a 'pure' Chrome ipcRenderer to the renderer process that has no internal 'ELECTRON' channels that can be used to do evil stuff.
So we don't need a whitelist filter on the ipcRenderer in a preloader (like the examples below).

Also if you want to package your application into .exe, .deb, or w/e format for distribution then you'll want to use Muon.
The electron-builder does not provide a way to start with `--enable-sandbox` as far as I know.

**I suggest using Muon.**

### sandbox-preload-simple
A very simple pre-load script that serves as a dummy for tutorial purposes.

### sandbox-preload-extended
A pretty good implementation of a secure preload script, and main process initialization (main.js). It's available in the subfolder named `sandbox-preload-extended`.
You can use this version in production.


[https://github.com/kewde/electron-sandbox](https://github.com/kewde/electron-sandbox)

## usage

```
$ cd sandbox-preload-simple
$ yarn install
$ yarn run start
```

General note on usage: the --enable-sandbox parameter is critical when running electron. The sandbox is not enabled without it.
The npm/yarn start scripts take care of it, but it is fragile.

## packaging distribution

**WARNING:** Due to the fact that --enable-sandbox is required, the current electron-builder does not enable you to sandbox your application properly.
I'm working on this, check https://github.com/kewde/electron-sandbox-boilerplate/issues/7 for more information on the status.

## security assumptions

For the Electron sandbox-preload samples:
If a malicious attacker is able to break into the scope / context of the SafeIpcRenderer then they have full control over the ipcRenderer, and can thus enjoy the benefits of an unfiltered ipcRenderer.

## chromium sandbox explained

### purpose
If you're dealing with potentially untrusted content (displaying videos,images, text, etc..) in your Electron application, then you should run it with the sandbox enabled. The sandbox provided by Chrome is considered among the best in the browser space, it has the ability to mitigate certain zeroday exploits within the Chrome browser engine (Blink) by restricting the ability of what the attacker can do.

The sandbox is disabled by default in Electron (not in the official Chromium/Chrome builds). Enabling the sandbox removes the ability to use NodeJS freely within the renderer process. Code that uses NodeJS should be moved from the renderer process to the main process. The sandboxed renderer process can then communicate commands through IPC, triggering the execution of these tasks (in the privileged browser process main.js), which in turn feeds back the return values to the unprivileged/sandboxed process. The renderer process is restricted to the tasks that you allow it to execute, however a clever attacker could potentially use them to his/her benefit so construct the functionalliy carefully. Give the renderer process the least amount of privilege, "make it dumb". 

Things renderer processes shouldn't be able to do:
* execute/create a new (more) privileged process
* freely read and write to whichever file they want
* freely pick a channel to send IPC messages over (use a whitefilter instead) (only for electron)

Do not allow the renderer process to freely specify which files to access. The backend should have immutable file names & locations, or at the very least use a whitefilter for which files and directories the unprivileged process is permissioned to deal with.

**Bad example**
```
renderer -> main: badDeleteFile /path/to/file
main -> renderer: OK deleteFile /path/to/file
```

Instead use predefined values, path & file name management should be whitelisted in the backend.

**Good example**
```
renderer -> main: deleteFile CONFIG
main: translates CONFIG into the right path + filename: /home/user/.config/store.cfg and deletes it
main -> renderer: OK deleteFile CONFIG
```


### terminology
Electron is built on top of Chromium, a multiprocess browser.  What's so important you might wonder, multiprocess sounds really boring. Well you're probably right about that one. The reason for being a multiprocess browser is a simple one: security.

The idea behind it is equally simple, we split the weak from the strong. Code has bugs, and those bugs are sometimes exploitable. The thing is, as the complexity of code rises, the numbers of bugs rises too. The engine, that turns html, css & js into a visible thing on your screen, is one damn complex thing.

Every website you load, runs in its own process. Additionally if one tab (process) crashes, the rest of the browser still functions properly. The scope of the damage has been reduced to that single website.

_**rendering**_: turning code into what you see on your screen.

A lot of the complexity sits in the rendering engine, it's also the engine that is responsable for executing the JavaScript being loaded in the html files!
It's exactly this engine that's known to contain bugs. Have you ever been infected by visiting a website? The malicious entity probably found a way to exploit a bug in the rendering engine. 

You haven't forgotten the multiprocess thing right? Well the chromium browser actually executes this vulnerable rendering engine in its own processes. Multiple renderer process co-exist on the same host.

_**Renderer process**:_ the renderer processes evaluate and render the html, css and executes js.

![overview](https://kewde.github.io/res/electron-sandbox/ChromeSiteIsolationProject-arch.png)

You might wonder, what executes the render processes? That's a good question, with a simple answer:
the _**browser process**_ or also known as the _**main process**_. You can kinda look at the browser/main process as the boss who makes sure his minions are working. 

**Pro tip:** Create two folders: 'render' and 'main'. This will help you keep track of which files are executed in the main process and which ones are executed in the renderer process.

Seperating the browser from the rendering engine actually doesn't do shit for security. Yeah I lied lol. Merely splitting it in multiple processes doesn't do crap for security. This is where the real magic happens.

Protecting against such bugs is easier if we maintain two levels of access. The renderer processes is a baby. Do you know where babies like to play? They play in **a sandbox**, well it's a magical sandbox. The sandbox is designed to contain the application and permission what it can do (it's designed to be inescapable, but bugs happen..). Anything you do in the sandbox, stays in the sandbox (kinda). Technically speaking, the sandbox is a way to encapsulate existing code and execute it in the locked-down process with safeguards to prevent it from accessing or doing certain things.
Want to know more about the Chromium sandbox? [Take a look here!](https://chromium.googlesource.com/chromium/src/+/lkcr/docs/linux_sandboxing.md))

The browser/main process does *not* execute in such a sandbox, so it wields a lot more power than a renderer process. The renderer process is very limited in what it can do when it's sandboxed, but it does have the ability to communicate with the browser process over **Inter-Process Communication** or IPC for short. 

Electron is a bit of a different beast than Chromium, as it also provides you with a very powerful NodeJS API by default with your electron application. You might have already guessed it, the sandbox is disabled by default. 

This example will re-enable the sandbox and deal with the limitations. We get a chance to do _some_ of the NodeJS API in the renderer process. This is due to the **preload.js script**, it runs in a private scope  but be carefully what you leak to the global scope (ie: attaching functions to the window) and it has _some_ NodeJS functionality. We prefer having a more privileged environment, so we only use the preload script to act as a bridge. The bridge that connects the renderer process with the browser process: making available the **ipcRenderer**. Check out preload-simple.js or preload-extended.js for more information. 

## good reads on security

### Good reads about Chromium & their sandbox:

[Azimuth Security: Chrome Sandbox - Overview (1/3)](http://blog.azimuthsecurity.com/2010/05/chrome-sandbox-part-1-of-3-overview.html)

[Azimuth Security: Chrome Sandbox - IPC (1/3)](http://blog.azimuthsecurity.com/2010/08/chrome-sandbox-part-2-of-3-ipc.html)

Don't bother looking for part 3 - it doesn't seem to exist :(.

### Good reads about how the sandbox works with electron & NodeJS

A quite in-depth presentation about the security of electron and how it can be improved:

[Carettoni: a presentation on the findings of the security of electron](https://www.blackhat.com/docs/us-17/thursday/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security.pdf)

[Electron: Sandbox docs](https://electron.atom.io/docs/api/sandbox-option/)

[Carettoni: A checklist that every electron developer should know about!](https://www.blackhat.com/docs/us-17/thursday/us-17-Carettoni-Electronegativity-A-Study-Of-Electron-Security-wp.pdf)

