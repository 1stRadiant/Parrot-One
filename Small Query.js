// File name for storing sentences
const fileName = "intents.json";

// Default sentences
const defaultSentences = [
    { sentence: "Hello, how are you? Hi, how are you? Hello, how's it going? Hey, how are you doing?", response: "I'm just a chatbot, but I'm here to help you! How can I assist you today?" },
    { sentence: "What's the weather like today? How's the weather? Can you tell me the weather? What's the weather forecast?", response: "I can't check the weather right now, but you can use a weather app or website for the latest updates." },
    { sentence: "I'm feeling sad. I feel sad. I'm unhappy. I'm feeling down.", response: "I'm sorry to hear that you're feeling down. Remember that it's okay to have these feelings. Would you like to talk about what's bothering you?" },
    // ... (other default sentences)
];

// Try to load sentences from file, or use defaults
let sentences;
try {
    const fileContent = tk.readFile(fileName);
    sentences = JSON.parse(fileContent);
    tk.flash("Sentences loaded from file");
} catch (error) {
    tk.flash("Error reading file or file doesn't exist. Using default sentences.");
    sentences = defaultSentences.slice(); // Use a copy of the default sentences
}

// Function to calculate word similarity
function calculateSimilarity(word1, word2) {
    if (word1 === word2) return 1;
    if (word1.length < 2 || word2.length < 2) return 0;
    
    // Check for common prefixes
    if (word1.startsWith(word2) || word2.startsWith(word1)) {
        return 0.8;
    }
    
    // Check for simple edit distance (very basic implementation)
    const maxLength = Math.max(word1.length, word2.length);
    let sameChars = 0;
    for (let i = 0; i < Math.min(word1.length, word2.length); i++) {
        if (word1[i] === word2[i]) sameChars++;
    }
    return sameChars / maxLength;
}

const conversationalAnalyzer = (input, threshold) => {
    const inputWords = input.toLowerCase().split(/\s+/);
    const results = [];

    for (const entry of sentences) {
        const sentenceVariants = entry.sentence.toLowerCase().split('?');
        let bestMatchPercentage = 0;

        for (const variant of sentenceVariants) {
            const variantWords = variant.trim().split(/\s+/);
            let totalSimilarity = 0;

            for (const inputWord of inputWords) {
                let maxSimilarity = 0;
                for (const variantWord of variantWords) {
                    const similarity = calculateSimilarity(inputWord, variantWord);
                    if (similarity > maxSimilarity) {
                        maxSimilarity = similarity;
                    }
                }
                totalSimilarity += maxSimilarity;
            }

            const matchPercentage = (totalSimilarity / inputWords.length) * 100;
            if (matchPercentage > bestMatchPercentage) {
                bestMatchPercentage = matchPercentage;
            }
        }

        if (bestMatchPercentage >= threshold) {
            results.push({
                sentence: entry.sentence,
                response: entry.response,
                matchPercentage: bestMatchPercentage
            });
        }
    }

    if (results.length === 0) {
        return "I'm not quite sure how to respond to that. Trying to learn it so I know how to respond in the future.";
    }

    // Sort results by match percentage in descending order
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Construct a paragraph of responses
    let outputParagraph = "";
    results.forEach((result, index) => {
        if (index > 0) {
            outputParagraph += index === results.length - 1 ? " Finally, " : " Additionally, ";
        }
        outputParagraph += result.response;
    });

    return outputParagraph.trim() + ".";
};

// Example usage
// Example usage:
const inputText = global("USERQUERY");
const threshold = 80;

const result = conversationalAnalyzer(input, threshold);
setGlobal("BOTRESPONSE",result);
if(result=="I'm not quite sure how to respond to that. Trying to learn it so I know how to respond in the future."){
setGlobal("unknownInput",result)
}
