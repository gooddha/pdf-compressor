const fs = require('fs');
const chokidar = require('chokidar');
const cmd = require('node-cmd');
const gs = 'assets\\gs\\bin\\gswin32c';
const dirs = ['compressed', 'compressed\\jpg'];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});

print(`PDF compressor is started and watching for PDF files...`);
chokidar.watch('.', { ignored: /(^|[\/\\])\../, depth: 0 }).on('add', compress);

function compress(newFile) {
    const pdf = newFile;
    const jpgDir = 'compressed\\jpg\\' + pdf.split('.').slice(0, -1).join('.');    
    
    if (newFile.toLowerCase().includes('pdf')) {

        if (!fs.existsSync(jpgDir)) {
            fs.mkdirSync(jpgDir);
            jpgSplit().then(pdfCompress).catch(error => print(error));
        };
        
    }    
    
    function jpgSplit() {
        print(`Getting ${pdf}`);
        const gsOptions = '-dBATCH -dNOPAUSE -dSAFER -sDEVICE=jpeg -dJPEGQ=75 -r300';
        const gsCMD = `${gs} ${gsOptions} -sOutputFile="${jpgDir}\\%03d.jpg" "${pdf}"`;
        
        return new Promise((resolve, reject) => {
            cmd.get(gsCMD, (error, data) => {
                if (error) reject(error);
                print(`${pdf} pages is splitted by jpegs, start ${pdf} compression`);
                resolve();
            })
        }) 
    }
    
    
    function pdfCompress() {
        const magickOptions = '-resize 50%  -density 150 -strip -compress JPEG -quality 30 ';
        const magikCMD = `magick "${jpgDir}\\*.jpg" ${magickOptions} "compressed\\${pdf}"`;
        
        cmd.get(magikCMD, (error) => {
            if (error) reject(error);
            print(`${pdf} is compressed`);
        });            
    }

};


function print(message) {
    return console.log(`${printTime()}${message}`)
}


function printTime() {
    const now = new Date();
    const hours = addLeadingZero(now.getHours());
    const minutes = addLeadingZero(now.getMinutes());
    const seconds = addLeadingZero(now.getSeconds());

    return `${hours}:${minutes}:${seconds} > `;

    function addLeadingZero(number) {
        return number < 10 ? `0${number}` : number;
    }
}