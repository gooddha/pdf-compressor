const fs = require('fs');
const chokidar = require('chokidar');
const cmd = require('node-cmd');

//watch for new files in root directory
chokidar.watch('.', { ignored: /(^|[\/\\])\../, depth: 0 }).on('add', (path) => {

    if (!fs.existsSync('compressed')) {
        fs.mkdirSync('compressed');
    }

    if (!fs.existsSync('compressed\\jpg')) {
        fs.mkdirSync('compressed\\jpg');
    }

    //if added a pdf file 
    if (path.toLowerCase().includes('pdf')) {
        const jpgDir = 'compressed\\jpg\\' + path.split('.').slice(0, -1).join('.');        
        
        if (!fs.existsSync(jpgDir)) {
            fs.mkdirSync(jpgDir);
            console.log(`Getting ${path}`)
            
            //get jpegs from pdf
            cmd.get(`gswin32c -dBATCH -dNOPAUSE -dSAFER -sDEVICE=jpeg -dJPEGQ=75 -r300 -sOutputFile="${jpgDir}\\%03d.jpg" "${path}"`, (error, data) => {
                if (error) console.log(error);
                
                //get compressed pdf from jpegs
                cmd.get(`magick "${jpgDir}\\*.jpg" -resize 50%  -density 150 -compress JPEG -quality 30 "compressed\\${path}"`, (error, data) => {
                    if (error) console.log(error);
                    console.log(`${path} is compressed`);
                });            
            });         
        }
    }            
});