const fs = require('fs');
const JSZip = require('jszip');

function readFile(name) {
    const fileContent = fs.readFileSync(`${__dirname}/${name}`);

    return fileContent;
}

async function loadEpub(fileContent) {
    const epub = {};
    const zip = JSZip();

    zip.loadAsync(fileContent).then((epubContent) => {

        epubContent.file('mimetype').async('string').then((mimetype) => {
            epub.mimetype = mimetype;

            console.log(epub);
        });
    });

}

const fileContent = readFile('teste.epub');
loadEpub(fileContent);


