function removeJoinerWords(input) {
    const joinerWords = ["and", "or", "but", "the", "is", "at", "which", "on", "in", "a", "an", "for", "with", "of", "to", "from", "by", "about", "as"];
    const words = input.toLowerCase().split(" ");
    const filteredWords = words.filter(word => !joinerWords.includes(word));
    return filteredWords.join(" ");
}

function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, () => []);
    
    for (let i = 0; i <= a.length; i++) {
        for (let j = 0; j <= b.length; j++) {
            if (i === 0) matrix[i][j] = j;
            else if (j === 0) matrix[i][j] = i;
            else if (a[i - 1] === b[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
            else matrix[i][j] = Math.min(
                matrix[i - 1][j - 1] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j] + 1
            );
        }
    }

    return matrix[a.length][b.length];
}

function calculateMatchScore(sentence, input) {
    const sentenceWords = sentence.toLowerCase().split(" ");
    const inputWords = input.toLowerCase().split(" ");
    let totalDistance = 0;

    sentenceWords.forEach(word => {
        let minDistance = Infinity;
        inputWords.forEach(inputWord => {
            const distance = levenshtein(word, inputWord);
            if (distance < minDistance) minDistance = distance;
        });
        totalDistance += minDistance;
    });

    return 1 - (totalDistance / (sentenceWords.length * Math.max(...sentenceWords.map(w => w.length))));
}


const fileName = 'intents.json';


    // Read existing intents from file
    let sentences = [];

function getBestMatchingSentences(inputText, threshold) {

    const filteredInput = removeJoinerWords(inputText.toLowerCase());

    // Get matching sentences
    const matchingSentences = sentences.filter(item => {
        const matchScore = calculateMatchScore(item.sentence, filteredInput);
        return matchScore >= threshold;
    });

    // Combine responses into a single paragraph
    const combinedResponses = matchingSentences.map(item => item.response).join(" ");

    return combinedResponses;
}

// Example usage:
const inputText = global("USERQUERY");



function parseLLMOutput(sentences) {
    const intents = [];

    for (const { sentence, response } of sentences) {
        intents.push({ sentence, response });
    }

    return intents;
}


const defaultSentences = [
        { sentence: "Hello, how are you? Hi, how are you? Hello, how's it going? Hey, how are you doing?", response: "I'm just a chatbot, but I'm here to help you! How can I assist you today?" },
        { sentence: "What's the weather like today? How's the weather? Can you tell me the weather? What's the weather forecast?", response: "I can't check the weather right now, but you can use a weather app or website for the latest updates." },
        { sentence: "Can you tell me a joke? Tell me a joke. Do you know any jokes? Make me laugh.", response: "Sure! Why don't scientists trust atoms? Because they make up everything!" },
        { sentence: "I need help with my homework. Can you help me with homework? Homework help needed. I need assistance with my homework.", response: "I'd be happy to help! What subject are you working on?" },
        { sentence: "What's the capital of France? Capital of France? Do you know the capital of France? What is the capital city of France?", response: "The capital of France is Paris." },
        { sentence: "How do I make a cake? Cake recipe? How can I bake a cake? Instructions for making a cake?", response: "To make a cake, you'll need flour, sugar, eggs, butter, and your favorite flavoring. Mix the ingredients and bake at 350°F for 30 minutes." },
        { sentence: "Tell me about yourself. Who are you? Can you introduce yourself? What do you do?", response: "I'm an AI chatbot created to assist you with various questions and tasks. How can I help you today?" },
        { sentence: "What's the time now? What time is it? Current time? Can you tell me the time?", response: "I can't provide real-time information, but you can check the time on your device." },
        { sentence: "I'm feeling sad. I feel sad. I'm unhappy. I'm feeling down.", response: "I'm sorry to hear that. Sometimes talking to a friend or doing something you enjoy can help. Do you want to talk about it?" },
        { sentence: "Do you know any good movies? Recommend a movie. Any good movies to watch? Can you suggest a movie?", response: "Yes! If you like action, I recommend 'Mad Max: Fury Road'. For comedy, try 'The Grand Budapest Hotel'." },
        { sentence: "Can you help me plan a trip? Help me with trip planning. I need to plan a trip. Can you assist with travel planning?", response: "Sure! Where would you like to go, and what activities are you interested in?" },
        { sentence: "What's 2 + 2? What is 2 plus 2? 2 + 2 equals? Can you add 2 and 2?", response: "2 + 2 equals 4." },
        { sentence: "How do I fix my computer? Computer problem help. Can you fix my computer? I need help with my computer.", response: "Can you describe the issue you're having with your computer? I'll do my best to help." },
        { sentence: "What's your favorite color? Favorite color? What color do you like? Which color is your favorite?", response: "I don't have preferences, but I think all colors are wonderful!" },
        { sentence: "How do I get in shape? Fitness tips? How to get fit? Can you help me get in shape?", response: "Regular exercise, a balanced diet, and staying hydrated are key to getting in shape. Do you need specific advice?" },
        { sentence: "What's the best programming language? Best programming language? What programming language should I learn? Which is the top programming language?", response: "It depends on what you're looking to do. Python is great for beginners and versatile for many applications." },
        { sentence: "Can you translate something for me? Translate this. Can you help with translation? I need a translation.", response: "I'd be happy to help! What phrase or sentence do you need translated?" }
    ];

    try {
        // Try to read the file
        const fileContent = tk.readFile(fileName);
        sentences = JSON.parse(fileContent);
flash("loaded")
    } catch (error) {
        flash("Error reading file or file doesn't exist. Using default sentences.");
        sentences = defaultSentences.slice(); // Ensure a copy of the default sentences is used
    }



// Function to add new data to existing sentences array
function addData(existingSentences, newData) {
    newData.forEach(item => {
        existingSentences.push(item);
    });
}




// Example usage
/*const llmOutput = [
    { "sentence": "Whats your favorite color? Favorite color? What color do you like? Which color is your favorite?", "response": "don't have preferences, but I think all colors are wonderful!" },
    { "sentence": "How's the weather today? What's the weather like? Is it sunny outside? Is it raining?", "response": "The weather varies by location. Check your local forecast for the latest updates." }
];*/


// Update intents with LLM output


try{
const llmOutput = JSON.parse(global('TextToRun21'));
flash(JSON.stringify(llmOutput))
if(llmOutput!='%TextToRun21'){

    // Update intents
    // Add llmOutput data to sentences array
addData(sentences, llmOutput);

// Output the updated sentences array to verify
console.log(sentences);
flash(JSON.stringify(sentences, null, 2))
    // Write updated intents back to the file
    tk.writeFile(fileName, JSON.stringify(sentences, null, 2), false);
}
}
catch(err){
flash(err.stack)
}




const threshold = 0.8;
const result = getBestMatchingSentences(inputText, threshold);
if(result == ""){
   
    setGlobal('UNKNOWN_QUESTIONS_FILE', input);
    flash("I'm not sure how to respond to that. I've made a note to learn about it later.");
} 

setGlobal("BOTRESPONSE",result)
