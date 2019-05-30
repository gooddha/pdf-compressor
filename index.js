const fs = require('fs');
const chokidar = require('chokidar');
const cmd = require('node-cmd');
const gs = 'assets\\gs\\bin\\gswin32c';
const dirs = ['compressed', 'compressed\\jpg'];


//watch for new files in the root directory
chokidar.watch('.', { ignored: /(^|[\/\\])\../, depth: 0 }).on('add', (newFile) => {

    initializeDirs(dirs);

    //if added a pdf file 
    if (newFile.toLowerCase().includes('pdf')) {
        const pdf = newFile;
        const jpgDir = 'compressed\\jpg\\' + pdf.split('.').slice(0, -1).join('.');        
        
        if (!fs.existsSync(jpgDir)) {
            fs.mkdirSync(jpgDir);
            print(`Getting ${pdf}`)
            
            //get jpegs from pdf
            const gsOptions = '-dBATCH -dNOPAUSE -dSAFER -sDEVICE=jpeg -dJPEGQ=75 -r300';
            cmd.get(`${gs} ${gsOptions} -sOutputFile="${jpgDir}\\%03d.jpg" "${pdf}"`, (error, data) => {                
                if (error) console.log(error);
                print(`${pdf} pages is splitted by jpegs, start ${pdf} compression`);
                
                //get compressed pdf from jpegs
                const magickOptions = '-resize 50%  -density 150 -strip -compress JPEG -quality 30 ';
                cmd.get(`magick "${jpgDir}\\*.jpg" ${magickOptions} "compressed\\${pdf}"`, (error, data) => {

                    if (error) console.log(error);
                    print(`${pdf} is compressed`);

                });            
            });         
        }
    }            
});

function initializeDirs(dirs) {
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    });

}

function printTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return `${hours}:${minutes}:${seconds} > `;
}

function print(message) {
    return console.log(`${printTime()}${message}`)
}