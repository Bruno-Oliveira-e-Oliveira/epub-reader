const fs = require('fs');
const JSZip = require('jszip');
const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

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
        const options = {
            ignoreAttributes : false
        };
        const parser = new XMLParser(options);
        const containerObject = parser.parse(container);
        const contentLocation = containerObject.container.rootfiles.rootfile['@_full-path'];

        return contentLocation;
    });

    epub.contentOBJ = await result.file(epub.contentLocation).async('string').then((contentXML) => {
        const options = {
            ignoreAttributes : false
        };
        const parser = new XMLParser(options);
        const contentOBJ = parser.parse(contentXML);

        return contentOBJ;
    });

    console.log(epub);
});


