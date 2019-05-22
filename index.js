const fs = require('fs');
const chokidar = require('chokidar');
const cmd = require('node-cmd');

chokidar.watch('.', { ignored: /(^|[\/\\])\../ }).on('add', (path) => {

    if (path.toLowerCase().includes('pdf')) {
        const dir = path.split('.').slice(0, -1).join('.');        
        console.log(dir);
        
        if (!fs.existsSync('jpg\\' + dir)) {
            fs.mkdirSync('jpg\\' + dir);
            console.log(`Getting ${path}`)
            cmd.get(
                'gswin32c -dBATCH -dNOPAUSE -dSAFER -sDEVICE=jpeg -dJPEGQ=75 -r300 -sOutputFile="' 
                + `jpg\\${dir}\\%03d.jpg" ` + `"${path}"`, (error, data) => {
                if (error) console.log(error);
                console.log(data);
                console.log('Converting done');
                // nconvert -out jpeg -o process\#.jpg -resize 50% 50%  -dpi 150 *.jpg
            });
        }
        
    }            
});