const electron = require('electron')
const proc = require('child_process')

console.log("THIS WILL NOT CREATE SANDBOXED RENDERER PROCESSES, DO NOT USE THIS EXAMPLE YET.");

console.log("path to electron: " + electron)
console.log("dirname: " + __dirname)

console.log('proc.spawn should execute: ' + electron + ' --enable-sandbox  ' + __dirname + "/main.js");
/*
	It is CRITICAL that you run electron with the --enable-sandbox on the MAIN process.
	If you do not do this, then the OS-enforced sandbox is NOT ENABLED.
	Your code will not be sandboxed without this flag.

	Hence we spawn the process here.
*/
const child = proc.spawn(electron , ["--enable-sandbox", __dirname + "/main.js"])

/* Catch the outputs of the electron child process */
child.stdout.on('data', (data) => {
  console.log(`[electron] ${data}`);
});

child.stderr.on('data', (data) => {
  console.log(`[electron] stderr: ${data}`);
});

child.on('close', (code) => {
  console.log(`[electron] about to exit with code: ${code}`);
});



// on exit of this process
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
