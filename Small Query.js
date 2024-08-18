// File name for storing sentences
const fileName = "intents.json";

// Default sentences (unchanged)
const defaultSentences = [
    { sentence: "Hello, how are you? Hi, how are you? Hello, how's it going? Hey, how are you doing?", response: "I'm just a chatbot, but I'm here to help you! How can I assist you today?" },
    { sentence: "What's the weather like today? How's the weather? Can you tell me the weather? What's the weather forecast?", response: "I can't check the weather right now, but you can use a weather app or website for the latest updates." },
    { sentence: "I'm feeling sad. I feel sad. I'm unhappy. I'm feeling down.", response: "I'm sorry to hear that you're feeling down. Remember that it's okay to have these feelings. Would you like to talk about what's bothering you?" },
    // ... (other default sentences)
];

// Load sentences from file or use defaults (unchanged)
let sentences;
try {
    const fileContent = tk.readFile(fileName);
    sentences = JSON.parse(fileContent);
    tk.flash("Sentences loaded from file");
} catch (error) {
    tk.flash("Error reading file or file doesn't exist. Using default sentences.");
    sentences = defaultSentences.slice();
}

// Improved word similarity function using Levenshtein distance
function calculateSimilarity(word1, word2) {
    if (word1 === word2) return 1;
    if (word1.length < 2 || word2.length < 2) return 0;

    const len1 = word1.length;
    const len2 = word2.length;
    const matrix = Array(len2 + 1).fill().map(() => Array(len1 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;

    for (let j = 1; j <= len2; j++) {
        for (let i = 1; i <= len1; i++) {
            const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + cost
            );
        }
    }

    const distance = matrix[len2][len1];
    const maxLength = Math.max(len1, len2);
    return 1 - distance / maxLength;
}

// Function to preprocess text
function preprocessText(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
}

// Improved conversational analyzer
const conversationalAnalyzer = (input, threshold) => {
    const inputWords = preprocessText(input);
    const results = [];

    for (const entry of sentences) {
        const sentenceVariants = entry.sentence.split('?');
        let bestMatchPercentage = 0;

        for (const variant of sentenceVariants) {
            const variantWords = preprocessText(variant);
            let totalSimilarity = 0;
            let matchedWords = 0;

            for (const inputWord of inputWords) {
                let maxSimilarity = 0;
                for (const variantWord of variantWords) {
                    const similarity = calculateSimilarity(inputWord, variantWord);
                    if (similarity > maxSimilarity) {
                        maxSimilarity = similarity;
                    }
                }
                if (maxSimilarity > 0.7) {  // Consider a word matched if similarity is above 0.7
                    matchedWords++;
                }
                totalSimilarity += maxSimilarity;
            }

            // Calculate match percentage based on both word similarity and matched word count
            const similarityScore = totalSimilarity / inputWords.length;
            const matchedWordsScore = matchedWords / inputWords.length;
            const matchPercentage = (similarityScore * 0.6 + matchedWordsScore * 0.4) * 100;

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
        return "I'm not quite sure how to respond to that. I'm always learning to improve my responses.";
    }

    // Sort results by match percentage in descending order
    results.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Return the best match
    return results[0].response;
};

// Example usage
const inputText = global("USERQUERY");
const threshold = 90;  // Adjusted threshold to be more strict

const result = conversationalAnalyzer(inputText, threshold);
setGlobal("BOTRESPONSE", result);
if (result === "I'm not quite sure how to respond to that. I'm always learning to improve my responses.") {
    setGlobal("unknownInput", inputText);
}
