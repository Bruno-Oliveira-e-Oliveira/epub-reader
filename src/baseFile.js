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

    unpack() {
        const data = this.read();
        
        if (!data) {
            return data;
        }

        return 'OK';
    }

}

module.exports = BaseFile;