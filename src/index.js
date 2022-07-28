const BaseFile = require('./baseFile');
const EPub = require('./epub');

function main() {
    const baseFile = new BaseFile('teste.epub');
    const zip = baseFile.unpack();

    const epub = new EPub(zip);

    
   
    


}

main();



