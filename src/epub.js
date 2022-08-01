const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

class EPub {
    constructor(files) {
        this.files = files;
        this.validated = false;
        this.mimetypeFile = 'mimetype';
        this.containerFile = 'META-INF/container.xml';
        this.contentFile = 'content.opf'; //--- temp
        this.contentFullPath = undefined;
        this.contentBasePath = undefined;
        this.load();   
    }

    load() {
        this.files.then(async (result) => {
            await result.file(this.mimetypeFile).async('string').then((mimetype) => {
                this.validated = this.validateEpub(mimetype);
            });

            if (!this.validated) {
                return undefined;
            }

            this.contentFullPath = await result.file(this.containerFile).async('string').then((container) => {
                const options = {
                    ignoreAttributes: false
                }
                const parser = new XMLParser(options);
                const output = parser.parse(container);

                return output.container.rootfiles.rootfile['@_full-path']; //--- "application/oebps-package+xml"    
            });

            if (!this.contentFullPath) {
                return undefined;
            }

            let position = this.contentFullPath.search(this.contentFile);
            this.contentBasePath = this.contentFullPath.substring(0, position);

            this.getSpine();
        });
    }

    validateEpub(mimetype) {
        if (mimetype === 'application/epub+zip') {
            return true;
        } else {
            return false;
        }
    }

    getSpine() {
        this.files.then(async (result) => {
            await result.file(this.contentFullPath).async('string').then((content) => {
                const options = {
                    ignoreAttributes: false
                }
                const parser = new XMLParser(options);
                const contentObj = parser.parse(content);
                const spine = contentObj.package.spine.itemref;

                if (Array.isArray(spine)) {
                    spine.forEach(spineItem => {
                        this.getManifestItem(spineItem['@_idref']);
                    });
                } else {
                    this.getManifestItem(spine['@_idref']);
                }



            });

        });    

        // console.log(this)
    }

    getManifestItem(id) {
        this.files.then(async (result) => {
            await result.file(this.contentFullPath).async('string').then((content) => {


                console.log(content);
            });
        });    
    }



}

module.exports = EPub;