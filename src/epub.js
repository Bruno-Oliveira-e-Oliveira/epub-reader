const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');

class EPub {
    constructor(files) {
        this.files = files;
        this.validated = false;
        this.mimetypeFile = 'mimetype';
        this.containerFile = 'META-INF/container.xml';
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

            await result.file(this.containerFile).async('string').then((container) => {
                console.log(container);
            });




            

        });
    }

    validateEpub(mimetype) {
        if (mimetype === 'application/epub+zip') {
            return true;
        } else {
            return false;
        }
    }

}

module.exports = EPub;