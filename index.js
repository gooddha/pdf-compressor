const fs = require('fs');
const cmd = require('node-cmd');

cmd.get(
    'dir',
    function(err, data ) {
        console.log(data);
    }
)