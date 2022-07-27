const BaseFile = require('./baseFile');
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

function main() {
    const baseFile = new BaseFile('teste.epubs');
    const data = baseFile.unpack();

    console.log('Result:'+data)


}

main();



