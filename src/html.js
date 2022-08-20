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

            if ((firstSpace < 0) || (firstQuotation < 0)) { //--- Remove firstQuotation? 

                if (firstSpace < 0 && firstQuotation < 0) {
                    if (croppedContent.length > 0) {               
                        attribute = this.divideAttributeNameAndValue(croppedContent, firstQuotation);
                        attributes.push(attribute);
                    }
                    continueLoop = false;                     

                } else if (firstSpace < 0 && firstQuotation >= 0){
                    attribute = this.divideAttributeNameAndValue(croppedContent, firstQuotation);
                    attributes.push(attribute);
                    continueLoop = false;

                } else if (true) {
                    
                }


                
                


            } else if (firstSpace < firstQuotation) {
                

            } else {
                

            }

        } while (continueLoop);

        return attributes;
    }

    divideAttributeNameAndValue(text, firstQuotation) {
        let attribute = {};
        let equalsPosition = text.search('=');
        let closeQuotation = undefined;
        
        if (equalsPosition >= 0) {
            attribute.name = text.substring(0, equalsPosition);
        } else {
            attribute.name = '';
        }

        if (firstQuotation >= 0) {
            text = text.substring(firstQuotation + 1);
            closeQuotation = text.search('"');
            text = text.substring(0, closeQuotation);            
        }
        attribute.value = text;

        return attribute;
    }



}


module.exports = Html;