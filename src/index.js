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

    console.log(data.toString()); 

    let test = new Html(data.toString());
    test.read();


   



}

main();



