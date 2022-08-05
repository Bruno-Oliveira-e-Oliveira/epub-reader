class Html {
    constructor(baseContent){
        this.baseContent = baseContent;
    }

    read() {
        let baseContent = this.baseContent;

        baseContent = this.getTag(baseContent);
        // baseContent = this.getTag(baseContent);


    }

    getTag(text) {
        let start = text.search('<');
        let end = text.search('>') + 1;
        let tag = text.substring(start,end);

        // if (this.isXml(tag)){
            
        // }

        this.getTagElements(start, end, tag)

        console.log(tag);

        return text.substring(end);
    }

    getTextPosition(text, searchText) {
        let position = text.search(searchText);
        return position;
    }

    isXml(tag) {
        let begin = tag.search('<?');
        let xml = tag.search('xml');
        let end = tag.search('/?>');

        if (begin >= 0 && xml >= 0 && end >= 0) {
            return true;
        } else {
            return false;
        }
    }

    getTagElements(start, end, tag) {
        let tagCropped = this.removeTagSymbols(start, end, tag);
        let tagName = this.getTagName(tagCropped);


        console.log(tagName)
    }

    removeTagSymbols(start, end, tag) {
        let tagCropped = tag.substring(0, end -1);
        tagCropped = tagCropped.substring(start +1);
        return tagCropped.trim();
    }

    getTagName(tag){
        let firstSpace = tag.search(' ');
        return tag.substring(0, firstSpace);
    }

}


module.exports = Html;