const chokidar = require('chokidar');
const cmd = require('node-cmd');

chokidar.watch('.', { ignored: /(^|[\/\\])\../ }).on('all', (event, path) => {
    if (path.includes('pdf')) {
        console.log('Added PDF File: ' + path);
        cmd.run('gswin64c -dBATCH -dNOPAUSE -dSAFER -sDEVICE=jpeg -dJPEGQ=75 -r300 -sOutputFile=jpg/%03d.jpg ' + path);
    }
});