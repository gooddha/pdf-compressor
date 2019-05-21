const fs = require('fs');
const chokidar = require('chokidar');
const cmd = require('node-cmd');

chokidar.watch('.', { ignored: /(^|[\/\\])\../ }).on('all', (event, path) => {
    // console.log(path);
    if (path.toLowerCase().includes('pdf')) {
        console.log('Added PDF File: ' + path);
        const dir = path.split('.')[0];
        console.log(dir);

        fs.mkdirSync('jpg\\' + dir);
        cmd.get('gswin64c -dBATCH -dNOPAUSE -dSAFER -sDEVICE=jpeg -dJPEGQ=75 -r300 -sOutputFile=' +'"' + 'jpg\\'
            + dir + '\\%03d.jpg' + '" ' + '"' + path + '"', function(error, data){
            console.log(error);
            console.log(data);
        });
    }
});