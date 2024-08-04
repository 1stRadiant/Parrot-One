# Parrot-One
A chatbot that allows you to save big your llm tokens by caching your responses. Which means you can reprompt unlimited times without using anymore tokens or even offline.

# Advanced Chatbot with Pattern Matching and LLM Integration

This project implements a sophisticated chatbot that uses a multi-tiered approach to pattern matching, combined with LLM (Language Model) integration for handling unknown queries and expanding its knowledge base.

## Components

1. **main.js**: Primary script for handling larger prompts and complex matching logic.
2. **query.js** (aka "Small Query.js"): Secondary script for processing smaller queries.
3. **LLM Integration**: Handles unknown queries and expands the chatbot's knowledge base.

## Workflow

1. User input is stored in the `USERQUERY` global variable.
2. `main.js` is executed to process the query.
3. If `main.js` doesn't set the `BOTRESPONSE` global variable:
   - `query.js` is executed as a fallback.
4. If `query.js` returns the message "I'm not quite sure how to respond to that. Trying to learn it so I know how to respond in the future.":
   - An HTTP request is made to a chosen LLM with a specific prompt.
   - The LLM generates new patterns and responses in JSON format.
5. The new patterns and responses are extracted from the LLM output.
6. The scripts (`main.js` and `query.js`) are re-run with the updated knowledge base.
7. The final response is stored in the `BOTRESPONSE` global variable.

## Key Features

- Multi-tiered pattern matching (complex and simple)
- Dynamic knowledge base expansion using LLM
- Fallback mechanisms to ensure a response is always provided
- Automatic learning and improvement from unknown queries

## LLM Integration

When an unknown query is encountered, the system sends the following prompt to the LLM:

```
Act as a knowledge base builder. You receive input and then detect the patterns for all parts of the input that a chatbot would need to address in response. Create a sentence key with patterns that map to similar queries, as well as the responses to give for each of the patterns detected. Here's an example of an input you might get and the output you would produce:

Input: 'Hello, what's the weather like today'

Output:
[{
  "sentence": "Hello, how are you? Hi, how are you? Hello, how's it going? Hey, how are you doing?",
  "response": "I'm just a chatbot, but I'm here to help you! How can I assist you today?"
},
{
  "sentence": "What's the weather like today? How's the weather? Can you tell me the weather? What's the weather forecast?",
  "response": "I can't check the weather right now, but you can use a weather app or website for the latest updates."
}]

Please follow the example precisely. Use double quotes for property names and string values. Make sure you output full responses and do not escape anything. For the code to be easily extractable, only it should be stored inside ``` ```. Only output the result.

Input: %USERQUERY
```

The LLM's response is then processed and integrated into the chatbot's knowledge base.

## Usage

1. Set the user's input in the `USERQUERY` global variable.
2. Execute `main.js`.
3. Check the `BOTRESPONSE` global variable:
   - If empty, execute `query.js`.
   - If `query.js` returns the "not sure" message, trigger the LLM integration.
4. After LLM integration, re-run the scripts to generate the final response.
5. The final answer will be stored in the `BOTRESPONSE` global variable.

## Extending the System

The chatbot's knowledge base (`intents.json`) is automatically updated with new patterns and responses from the LLM. This allows the system to continuously learn and improve its ability to handle a wide range of queries.

## Note

This advanced chatbot system provides a robust approach to pattern matching and query processing, with built-in learning capabilities. It combines rule-based matching with machine learning to offer accurate and expanding conversational abilities.
