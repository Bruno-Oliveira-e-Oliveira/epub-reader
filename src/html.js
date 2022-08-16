class Html {
    constructor(baseContent){
        this.baseContent = baseContent;
    }

    read() {

        console.log('----------------------------------------------------------------')

        let baseContent = this.baseContent;

        //--- Test    
        for (let index = 0; index < 10; index++) {
            // console.log(baseContent)
            baseContent = this.getTag(baseContent);
        }

    }

    getTag(text) {
        let tag  = {};
        let start = text.search('<');
        let end = text.search('>') + 1;
        let originalContent = text.substring(start, end);
        let croppedContent = this.removeTagSymbols(originalContent);

        // detectSpecialTags(croppedContent);

        tag.name = this.getTagName(croppedContent); //--- TODO - Error handler
        let namePosition = croppedContent.search(tag.name) + tag.name.length;
        croppedContent = croppedContent.substring(namePosition);
        croppedContent = croppedContent.trim();

        tag.attributes = this.getTagAttributes(croppedContent);
        tag.inner = []; //--- TODO

        console.log(originalContent);
        console.log(tag);
        console.log('\n');

        return text.substring(end);
    }

    removeTagSymbols(tag) {
        let start = tag.search('<') + 1;
        let end = tag.search('>');
        let croppedContent = tag.substring(0, end);
        croppedContent = croppedContent.substring(start);
        return croppedContent.trim();
    }

    // detectSpecialTags(tag) {
    //     const DOCTYPE = '';
    //     const HTMLCOMMENT = '';
    //     const STYLE = '';

    // }

    getTagName(tag){
        let firstSpace = tag.search(' ');
        let tagName = undefined;
        
        if (firstSpace >= 0) {
            tagName = tag.substring(0, firstSpace);
        } else {
            tagName = tag;
        }

        tagName = tagName.replace(/[^a-zA-Z0-9 ]/g, '');
        return tagName;
    }    

    getTagAttributes(croppedContent) {
        const attributes = [];
        
        let continueLoop = true;
        do {
            let attribute = {};
            let firstSpace = croppedContent.search(' ');

            if (firstSpace >= 0) {
                attribute = this.divideAttributeNameAndValue(croppedContent.substring(0, firstSpace));
                croppedContent = croppedContent.substring(firstSpace);
                croppedContent = croppedContent.trim();     
                attributes.push(attribute);
            } else {
                if (croppedContent.length > 0) {               
                    attribute = this.divideAttributeNameAndValue(croppedContent);
                    if (attribute) {
                        attributes.push(attribute);
                    }
                }
                continueLoop = false; 
            }

        } while (continueLoop);

        return attributes;
    }

    divideAttributeNameAndValue(croppedContent) {
        let attribute = {};
        let equalsPosition = croppedContent.search('=');

        if (equalsPosition >= 0) {
            attribute.name = croppedContent.substring(0, equalsPosition);
            croppedContent = croppedContent.substring(equalsPosition + 1);
            let firstChar = croppedContent.substring(0,1);
            croppedContent = croppedContent.substring(1);
            let endValuePosition = croppedContent.search(firstChar);
            attribute.value = croppedContent.substring(0, endValuePosition);
            return attribute;
        } else {
            return undefined; //--- attributes without value?
        }
    }



}


module.exports = Html;