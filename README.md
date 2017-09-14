# electron-sandbox
A simple example of a sandboxed renderer process with the ability to communicate to the backend (main.js) through IPC in a _secure_ manner.

## Why?
If you're dealing with potentially untrusted content (displaying videos,images, text, etc..) in your Electron application, then you should run it with the sandbox enabled. The sandbox provided by Chrome is very strong, it has the ability to mitigate zeroday exploits within the Chrome browser engine (Blink) by restricting the ability of the attacker.

The sandbox is disabled by default. Enabling it however removes the ability to use NodeJS freely within the renderer process. These backend tasks should be moved from the renderer process to the main process. The renderer process can trigger these tasks and get return values. 

## Terminology
Electron is built on top of Chromium, a multi-process browser.  What's so important you might wonder, multi-process sounds really boring. Well you're probably right about that one. The reason for being a multi-process browser is a simple one: security. 

The idea behind it is equally simple, we split the weak from the strong. Code has bugs, and those bugs are sometimes exploitable. There's a thing about bugs, as the complexity rises, their numbers rise too. Anddd the engine, that turns html, css & js into a visible thing on your screen, is one damn complex thing. 

_**rendering**_: turns code into what you see on your screen.

A lot of the complexity sits in the rendering engine, it's also the engine that is responsable for executing the JavaScript being loaded in the html files!
It's exactly this engine that's known to contain bugs. Have you ever been infected by visiting a website? The malicious entity found a way to exploit a bug in the rendering engine. 

You haven't forgetten the multi-process thing right? Well the chromium browser actually executes this vulnerable rendering engine in its own processes. Multiple renderer process co-exist on the same host. 

_**Renderer process**:_ the renderer processes evaluate and render the html, css and js.

You might wonder, what executes the render processes? That's a good question, with a simple answer:
the _browser process_ or also known as the _main process_. You can kinda look at the browser/main process as the boss who makes sure his minions are working.

Seperating the browser from the rendering engine actually doesn't do shit for security. Yeah I lied lol. Merely splitting it in multiple processes doesn't do crap for security. This is where the real magic happens.

Protecting against such bugs is easier if we maintain two levels of access. The renderer processes is a baby. Do you know where babies like to play? They play in **a sandbox**, well it's a magical sandbox. Any sandcastle you build is destroyed afterwards. You can't escape the sandbox (or atleast it's designed to be unescapable, but bugs happen..). Anything you do in the sandbox, stays in the sandbox. Technically speaking, the sandbox is a way to encapsulate existing code and execute it in the locked-down process with safeguards to prevent it from accessing or doing certain things. 

The browser/main generally execute in such a sandbox, it wields a lot more power than a renderer process. But there is are ways for processes to communicate **Inter-Process Communication** or IPC for short.

## preload-simple
A very simple pre-load script that servers as a dummy for tutorial purposes.

## preload-extended
A good implementation of a secure preload script, and main process initialization (main.js). 
Use this version in production!
