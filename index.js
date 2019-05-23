const fs = require('fs');
const chokidar = require('chokidar');
const cmd = require('node-cmd');
const { exec } = require('child_process');

chokidar.watch('.', { ignored: /(^|[\/\\])\../, depth: 0 }).on('add', (path) => {

    if (path.toLowerCase().includes('pdf')) {
        const dir = path.split('.').slice(0, -1).join('.');        
        
        if (!fs.existsSync('jpg\\' + dir)) {
            fs.mkdirSync('jpg\\' + dir);
            console.log(`Getting ${path}`)
                        
            cmd.get(
                `gswin32c -dBATCH -dNOPAUSE -dSAFER -sDEVICE=jpeg -dJPEGQ=75 -r300 -sOutputFile="jpg\\${dir}\\%03d.jpg" "${path}"`, (error, data) => {
                    if (error) console.log(error);
                    // console.log(data);
                    console.log('Converting pdf to jpg done');    
                    
                    console.log('Getting started jpeg resize and compression');
                    const resultDir = dir + '\\compressed';
                    const srcDir = `jpg\\${dir}`;

                    cmd.get(
                        `nconvert -out jpeg -o "jpg\\${resultDir}\\#.jpg" -resize 50% 50%  -dpi 150 "${srcDir}\\*.jpg"`, (error, data) => {
                            if (error) console.log(error);
                            // console.log(data);
                            console.log('Jpeg resize and compression done');

                            cmd.get(
                                `magick "jpg\\${resultDir}\\*.jpg" -compress JPEG -quality 30 "compressed\\${path}"`, (error, data) => {
                                    if (error) console.log(error);
                                    else console.log(`${path} compressed`);
                                }
                            )
                        }
                    );            
                }
            );           
            
        }
        
    }            
});