const fs = require('fs');
const JSZip = require('jszip');

class BaseFile {
    constructor(path) {
        this.path = path;
    }

    read() {
        try {
            const data = fs.readFileSync(this.path);
            return data;
        } catch (error) {
            // console.log(error);
            return undefined;
        }
    }

    async unpack() {
        const data = this.read();
        
        if (!data) {
            return data;
        }

        const zip = new JSZip();
        return await zip.loadAsync(data).then((files) => {
            return files;
        });
    }
}

module.exports = BaseFile;