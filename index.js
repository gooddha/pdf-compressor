const fs = require('fs');
const chokidar = require('chokidar');
const cmd = require('node-cmd');

chokidar.watch('.', { ignored: /(^|[\/\\])\../, depth: 0 }).on('add', (path) => {

    if (path.toLowerCase().includes('pdf')) {
        const dir = path.split('.').slice(0, -1).join('.');        
        
        if (!fs.existsSync('jpg\\' + dir)) {
            fs.mkdirSync('jpg\\' + dir);
            console.log(`Getting ${path}`)
            
            //get jpegs from pdf
            cmd.get(
                `gswin32c -dBATCH -dNOPAUSE -dSAFER -sDEVICE=jpeg -dJPEGQ=75 -r300 -sOutputFile="jpg\\${dir}\\%03d.jpg" "${path}"`, (error, data) => {
                    if (error) console.log(error);
                    
                    const resultDir = `jpg\\${dir}\\compressed`;
                    const srcDir = `jpg\\${dir}`;
                    fs.mkdirSync(resultDir);

                    //get compressed pdf from jpegs
                    cmd.get(
                        `magick "${srcDir}\\*.jpg" -resize 50%  -density 150 -compress JPEG -quality 30 "compressed\\${path}"`, (error, data) => {
                            if (error) console.log(error);
                            console.log(`${path} is compressed`);
                        }
                    );            
                }
            );         
        }
    }            
});