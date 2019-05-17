const fs = require('fs');
const cmd = require('node-cmd');
const os = require('os');
const folderPath = 'test';
fs.readdirSync(folderPath);

console.log(os.freemem());

// const dir = 'test'

// try {
//     if (!fs.existsSync(dir)){
//       fs.mkdirSync(dir)
//     }
// } catch (err) {
//     console.error(err)
// }


// fs.watch('test', )

// let text = fs.readdirSync('test');

// console.log(text);
// cmd.get(
//     'dir',
//     function(err, data ) {
//     }
// )