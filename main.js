  const fileExec = "resources/lib/main/index.js"
const {
    spawn
 } = require('child_process')
const fs = require('fs');
const path = require('path')
const port = 3000;
 function start() {
    const args = [path.join(__dirname, fileExec), ...process.argv.slice(2)];
    console.log("[DEBUG] Starting: "+ [...args].join('\n'));
    const p = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    })

        .on('message', data => {
            console.clear()
            if (data === 'reset') {
                console.log('Restarting Bot...');
                p.kill();
                start();
                delete p;
            }
        })
        .on('exit', code => {
            console.error('Exited with code:', code);
            if (code === '.' || code === 1 || code === 0) start();
        });
        
}
start();