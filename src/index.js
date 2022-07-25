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

    epub.fullPath = await result.file('META-INF/container.xml').async('string').then((container) => {
        const options = {
            ignoreAttributes : false
        };
        const parser = new XMLParser(options);
        const containerObject = parser.parse(container);
        const fullPath = containerObject.container.rootfiles.rootfile['@_full-path'];

        return fullPath;
    });

    let position = epub.fullPath.search('content.opf');
    epub.contentPath = epub.fullPath.substring(0, position)

    epub.contentOBJ = await result.file(epub.fullPath).async('string').then((contentXML) => {
        const options = {
            ignoreAttributes : false
        };
        const parser = new XMLParser(options);
        const contentOBJ = parser.parse(contentXML);

        return contentOBJ;
    });

    const spine = epub.contentOBJ.package.spine.itemref;
    const manifest = epub.contentOBJ.package.manifest.item;

    spine.forEach(async (item) => {
        let spineItem = item['@_idref'];
        let spineItemInfo = manifest.filter((manifestItem) => {return spineItem === manifestItem['@_id']});
        let spineItemFilePath = spineItemInfo[0]['@_href'];

        result.file(epub.contentPath + spineItemFilePath).async('string').then(async (filexHtml) => {


            if (spineItem === 'Cover.xhtml') {

                //--- Test
                const options = {
                    ignoreAttributes : false
                };
                const parser = new XMLParser(options);                
                const fileOBJ = parser.parse(filexHtml);
                
                let img = fileOBJ.html.body.div.svg.image['@_xlink:href'];

                let repeat = true;
                while (repeat) {
                    let position = img.search('/');
                    if (position >= 0) {
                        img = img.substring(position +1);
                    } else {
                        repeat = false;
                    }
                }
                
                let imgInfo = manifest.filter((manifestItem) => {return img === manifestItem['@_id']});

                let newFileXHtml = await result.file(epub.contentPath + imgInfo[0]['@_href']).async('base64').then((imageBase64) => {                    
                    fileOBJ.html.body.div.svg.image['@_xlink:href'] = `data:${imgInfo[0]['@_media-type']};base64;${imageBase64}`; 
                    let builder = new XMLBuilder(options);
                    return builder.build(fileOBJ);
                }); 

                fs.writeFile('result/' + spineItem, newFileXHtml, (err) => {
                    if (err) throw err;
                    console.log(`${spineItem} is created successfully.`);
                });      
            }      




        });

    });





    // console.log(epub);
});


