const fs = require('fs');
const JSZip = require('jszip');

function readFile(name) {
    const fileContent = fs.readFileSync(`${__dirname}/${name}`);

    return fileContent;
}

function loadEpub(fileContent) {
    const zip = JSZip();
    return zip.loadAsync(fileContent).then((result) => {
        return result;
    });
}

const epub = {};
const fileContent = readFile('teste.epub');
const epubContent = loadEpub(fileContent);

epubContent.then(async (result) => {
    epub.mimetype = await result.file('mimetype').async('string').then((mimetype) => {
        return mimetype;
    });

    epub.contentLocation = await result.file('META-INF/container.xml').async('string').then((container) => {
        console.log(container);

        
        // return contentLocation;
    });

    console.log(epub);
});


