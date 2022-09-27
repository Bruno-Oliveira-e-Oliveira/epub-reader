class Html {
    constructor(baseContent){
        this.baseContent = baseContent;
    }

    read() {

        console.log('----------------------------------------------------------------')

        let baseContent = this.baseContent;  
        let htmlObject = [];
        let specialTag = undefined;

        baseContent = baseContent.replace(/(\r\n|\n|\r)/gm, '');
        htmlObject = this.parse(baseContent, specialTag, htmlObject);

        htmlObject  = this.sortObject(htmlObject); 

        return {"object":htmlObject};
    }

    parse(text, specialTag, htmlObject) {
        let newText = undefined;
        let namePosition  = undefined;
        let originalContent = undefined;
        let croppedContent = undefined;    
        let closeTag = undefined;    
        let tag  = {};
        let start = undefined;
        let end = undefined;
        let content = undefined;

        if (specialTag) {
            let name = undefined;
            let innerTag = '';
            let continueLoop = true;
            text = text.trim();

            while (continueLoop) { //Infinity loop?
                start = text.search('<');
                end = text.search('>') + 1;        
                content = text.substring(0, start)
    
                originalContent = text.substring(start, end);
                croppedContent = this.removeTagSymbols(originalContent);
                closeTag = this.detectCloseTags(croppedContent);
                name = this.getTagName(croppedContent); //--- TODO - Error handler

                if (specialTag === name && closeTag) {
                    if (content.length > 0) {
                        innerTag += content;
                        text = text.substring(start);    
                    }
                    continueLoop = false;

                } else {
                    innerTag += text.substring(0, end);
                    text = text.substring(end);
                }                
            }

            if (innerTag.length > 0){
                htmlObject.push(innerTag);
            }

            specialTag = undefined;
        } 

        text = text.trim();
        start = text.search('<');
        end = text.search('>') + 1;        
        content = text.substring(0, start)

        if (content.length > 0 || start < 0 && text.length > 0) {
            if (start < 0) {
                content = text;
                newText = '';
            } else {
                newText = text.substring(start);
            }

            content = content.trim();
            htmlObject.push(content);
            
        } else {
            if (start < 0) {          
                return htmlObject;
            }
    
            originalContent = text.substring(start, end);
            croppedContent = this.removeTagSymbols(originalContent);
            closeTag = this.detectCloseTags(croppedContent);
            tag.name = this.getTagName(croppedContent); //--- TODO - Error handler
            namePosition = croppedContent.search(tag.name) + tag.name.length;
            croppedContent = croppedContent.substring(namePosition);
            croppedContent = croppedContent.trim();
            tag.attributes = this.getTagAttributes(croppedContent);
            tag.close = closeTag;
            tag.inner = [];
            specialTag = this.detectSpecialTags(tag);
            
            htmlObject.push(tag);
            newText = text.substring(end);
        }

        return this.parse(newText, specialTag, htmlObject);
    }

    removeTagSymbols(tag) {
        let start = tag.search('<') + 1;
        let end = tag.search('>');
        let croppedContent = tag.substring(0, end);
        croppedContent = croppedContent.substring(start);
        return croppedContent.trim();
    }

    detectCloseTags(tag) {
        let closeTag = false;
        let firstSpace = tag.search(' ');
        let slashPosition = tag.search('/')

        if (slashPosition >= 0) {
            if (firstSpace >= 0) {
                if (slashPosition < firstSpace) {
                    closeTag = true;
                }
                
            } else {
                closeTag = true;
            }
        }

        return closeTag;
    }

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

    detectSpecialTags(tag) {
        let specialTag = undefined;
        const specialTags = ['style', 'script'];

        if (!tag.close) {
            specialTags.forEach(element => {
                if (tag.name.toLowerCase() === element.toLowerCase()) {
                    specialTag = element;
                }  
            });
        }
        return specialTag;
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

    sortObject(originalObject) {
        let temp = [];
        let tempReverse = undefined;
        let inner = undefined;
        let insertInner = undefined;

        for (const tag of originalObject) {
            if (tag.close) {
                tempReverse = temp;
                temp = [];
                inner = [];
                insertInner = true;

                for (const tagB of tempReverse.reverse()) {
                    if (tag.name === tagB.name) {
                        tagB.inner = inner;
                        temp.unshift(tagB);
                        insertInner = false;
                    } else {
                        if (insertInner) {
                            inner.unshift(tagB);
                        } else {
                            temp.unshift(tagB);
                        }
                    }
                }

            } else {
                temp.push(tag);
            }
        }
        return temp;
    }
    

}


module.exports = Html;