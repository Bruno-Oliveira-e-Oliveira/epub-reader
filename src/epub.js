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
        this.manifest = undefined;
        this.spine = undefined;
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

            await result.file(this.contentFullPath).async('string').then((content) => {
                const options = {
                    ignoreAttributes: false
                }
                const parser = new XMLParser(options);
                const contentObject = parser.parse(content);
                this.manifest = contentObject.package.manifest.item;
                this.spine = contentObject.package.spine.itemref;
            });

            this.getSpineItems();
        });
    }

    validateEpub(mimetype) {
        if (mimetype === 'application/epub+zip') {
            return true;
        } else {
            return false;
        }
    }

    getSpineItems() {
        if (Array.isArray(this.spine)) {
            this.spine.forEach(spineItem => {
                const manifestItemObject = this.getManifestItem(spineItem['@_idref']);

                console.log(manifestItemObject);
            });
        } else {
            const manifestItemObject = this.getManifestItem(this.spine['@_idref']);
        }



        // console.log(this)
    }

    getManifestItem(id) {
        let manifestItemObject = undefined;
        for (const manifestItem of this.manifest) {
            if (manifestItem['@_id'] === id) {
                manifestItemObject = manifestItem;
                break;            
            }            
        }

        return manifestItemObject;
    }



}

module.exports = EPub;