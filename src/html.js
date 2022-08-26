class Html {
    constructor(baseContent){
        this.baseContent = baseContent;
    }

    read() {

        console.log('----------------------------------------------------------------')

        let baseContent = this.baseContent;
        let htmlObject  = { content:[] };
        htmlObject = this.getTag(baseContent, htmlObject);

        // console.log('\n');
        // console.log('Output:');
        // console.log(htmlObject);
    }

    getTag(text, htmlObject) {
        let tag  = {};
        let start = text.search('<');
        let end = text.search('>') + 1;
        let originalContent = text.substring(start, end);
        let croppedContent = this.removeTagSymbols(originalContent);

        if (start < 0) {          
            return htmlObject;
        }

        // detectSpecialTags(croppedContent);

        tag.name = this.getTagName(croppedContent); //--- TODO - Error handler
        let namePosition = croppedContent.search(tag.name) + tag.name.length;
        croppedContent = croppedContent.substring(namePosition);
        croppedContent = croppedContent.trim();

        tag.attributes = this.getTagAttributes(croppedContent);
        tag.inner = []; //--- TODO


        //--- TEST
        console.log('------------------');
        console.log(originalContent);
        console.log(tag);
        console.log('\n');


        htmlObject.content.push(tag);
        let newText = text.substring(end);
        
        return this.getTag(newText, htmlObject);
    }

    removeTagSymbols(tag) {
        let start = tag.search('<') + 1;
        let end = tag.search('>');
        let croppedContent = tag.substring(0, end);
        croppedContent = croppedContent.substring(start);
        return croppedContent.trim();
    }

    // detectSpecialTags(tag) {
    //     const DOCTYPE = '!DOCTYPE';
    //     const HTMLCOMMENT = '!--';
    //     const STYLE = '';
    //     const SCRIPT = '';
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
            let firstQuotation = croppedContent.search('"');
            let closeQuotation = undefined;
            let textAttribute = undefined;
            let nextSpace = undefined;

            if ((firstSpace < 0) || (firstQuotation < 0)) {

                if (firstSpace < 0 && firstQuotation < 0) {
                    if (croppedContent.length > 0) {               
                        attribute = this.divideAttributeNameAndValue(croppedContent, firstQuotation, closeQuotation);
                        attributes.push(attribute);
                    }
                    continueLoop = false;                     

                } else if (firstSpace < 0 && firstQuotation >= 0){
                    closeQuotation = croppedContent.indexOf('"', firstQuotation + 1);  
                    attribute = this.divideAttributeNameAndValue(croppedContent, firstQuotation, closeQuotation);
                    attributes.push(attribute);
                    continueLoop = false;
                    
                } else {
                    textAttribute = croppedContent.substring(0, firstSpace);
                    attribute = this.divideAttributeNameAndValue(textAttribute, firstQuotation, closeQuotation);
                    attributes.push(attribute);   
                    croppedContent = croppedContent.substring(firstSpace);
                    croppedContent = croppedContent.trim()                    
                }

            } else if (firstSpace < firstQuotation) {
                let quotation = -1;
                textAttribute = croppedContent.substring(0, firstSpace);
                attribute = this.divideAttributeNameAndValue(textAttribute, quotation, closeQuotation);
                attributes.push(attribute); 
                croppedContent = croppedContent.substring(firstSpace);
                croppedContent = croppedContent.trim()

            } else {
                closeQuotation = croppedContent.indexOf('"', firstQuotation + 1);
                nextSpace = croppedContent.indexOf(' ', closeQuotation + 1);
                
                if (nextSpace < 0) {
                    nextSpace = closeQuotation + 1;
                }

                textAttribute = croppedContent.substring(0, nextSpace);
                attribute = this.divideAttributeNameAndValue(textAttribute, firstQuotation, closeQuotation);
                attributes.push(attribute);   
                croppedContent = croppedContent.substring(nextSpace);
                croppedContent = croppedContent.trim()    
            }

        } while (continueLoop);

        return attributes;
    }

    divideAttributeNameAndValue(text, firstQuotation, closeQuotation) {
        let attribute = {};
        let equalsPosition = text.search('=');
        let start = firstQuotation + 1;
        let end = closeQuotation;  
        
        if (equalsPosition >= 0) {
            attribute.name = text.substring(0, equalsPosition);
        } else {
            attribute.name = '';
        }

        if (firstQuotation >= 0) {
            text = text.substring(start, end);          
        }
        attribute.value = text;

        return attribute;
    }



}


module.exports = Html;