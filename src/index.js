const BaseFile = require('./baseFile');
const EPub = require('./epub');

function main() {
    // const baseFile = new BaseFile('test.epub');
    // const zip = baseFile.unpack();

    // const epub = new EPub(zip);


    
   //--- HTML
   const fs = require('fs');
   const Html = require('./html');
   const data = fs.readFileSync('test.html');

    let test = new Html(data.toString());

    let result = test.read();
    fs.writeFileSync('result/result.json', JSON.stringify(result, undefined, 4));
    


   



}

main();



