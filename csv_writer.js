module.exports.write = write;
module.exports.writer = writer;
const fs = require('fs');
const csvWriter = require('csv-write-stream');
const writeMode = { flags: 'a' };

const options = {
    separator: ',',
    newline: '\n',
    // headers: [ 'gameId', 'drawId', 'dayPrize', '0', '1', '2', '3', '4', '5' ],
    sendHeaders: true
};

var writer = csvWriter(options);

function configure(options) {
    
}

function write(path, data, mode = null) {
    writer.pipe(fs.createWriteStream(path, mode || writeMode));
    if (data) {
        writer.write(data);
    } else {
        writer.end();
    }
}

