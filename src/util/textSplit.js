function chunkSplit(text) {
    const chunkSize = 1000;
    if (text < chunkSize) {
        return text;
    }
    else {
        const punctuation = /[.!?]/;
        const chunks = [];
        
        let start = 0;
        let end = chunkSize;
        
        while (start < text.length) {
            if (end < text.length) {
                // Find the next punctuation mark after the chunkSize limit
                while (!punctuation.test(text[end]) && end < text.length) {
                    end++;
                }
            }
        
            // Adjust end to include the punctuation mark
            end = Math.min(end + 1, text.length);
        
            // Add the chunk to the chunks array
            chunks.push(text.substring(start, end));
        
            // Update start and end for the next iteration
            start = end;
            end = start + chunkSize;
        }
        return chunks;
    }
    
}

function codeSnippetRestoration(text){
    return "```" + text + "```";
}

//Split messages by code blocks and by size for non code blocks
function textSplit(text){
    const delimiter = "```";
    
    // Split the text using the delimiter
    const parts = text.split(delimiter);
    
    // Array to store information about each part
    const updatedParts = parts.map((part, index) => {
        return {
            text: part,
            isCodeBlock: index % 2 !== 0 // Every alternate element after splitting is a code block
        };
    }).map((part) => {
        if (part.isCodeBlock) {
            return {
                ...part,
                text: codeSnippetRestoration(part.text)
            }

        } else {
            part.chunks = chunkSplit(part.text)
            return part;
        }
    }).reduce((list, part) => {
        if (!part.chunks) {
            list.push(part.text);
            return list;
        } 
        else {
            part.chunks.forEach((chunk) => list.push(chunk))
            return list;
        }
    }, []);

    return updatedParts;
}

module.exports = textSplit;