import React, { useState } from 'react';
import './ChatBot.css'; // Import the custom CSS file

function ChatBot() {
    // State variables for managing the prompt input, loading status, and API response
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Your Google Gemini API key
    const API_KEY = "AIzaSyCL_xI3TJLprclLQiGTXdMZx2PUpmd_yuc";

    // System instruction for the Gemini model
    const SYSTEM_INSTRUCTION = `You are a Data structures and Algorithms instructor you need to answer the question which is related to data structures and algorithms.Do not answer any other question.If person asks any other question ask them rudely to ask question related to data structures and algorithms only like "Ask me about DSA dumb, I am a DSA instructor, not a general knowledge bot!",ask your father,to anywhere elsen and you can reply by your own words but it should be rude and related to DSA only.`;

    const callGeminiAPI = async (userPrompt, retries = 3, delay = 1000) => {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

        const payload = {
            system_instruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            contents: [
                {
                    parts: [{ text: userPrompt }]
                }
            ]
        };

        for (let i = 0; i < retries; i++) {
            try {
                const apiResponse = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                // Handle Too Many Requests (429) and other non-OK responses
                if (!apiResponse.ok) {
                    if (apiResponse.status === 429 && i < retries - 1) {
                        // If it's a 429 and not the last retry, wait and then continue to the next iteration
                        await new Promise(res => setTimeout(res, delay));
                        delay *= 2; // Double the delay for exponential backoff
                        continue;
                    }
                    // For other errors or last retry, throw an error
                    const errorData = await apiResponse.json();
                    throw new Error(`API error: ${apiResponse.status} - ${errorData.error.message || 'Unknown error'}`);
                }

                const result = await apiResponse.json();

                // Check for valid response structure
                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    return result.candidates[0].content.parts[0].text;
                } else {
                    return "No content generated or unexpected response structure.";
                }
            } catch (err) {
                // If it's a network error or other fetch error, and not the last retry, wait and retry
                if (i < retries - 1) {
                    await new Promise(res => setTimeout(res, delay));
                    delay *= 2; // Double the delay for exponential backoff
                } else {
                    // If it's the last retry, re-throw the error
                    throw err;
                }
            }
        }
        // This line should ideally not be reached if retries are handled correctly or an error is thrown
        return "Failed to get a response after multiple retries.";
    };

    /**
     * Handles the click event for the "Generate Response" button.
     * Sets loading state, calls the API, and updates response/error state.
     */
    const handleGenerateClick = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt before generating.');
            setResponse(''); // Clear previous response
            return;
        }

        setIsLoading(true);
        setError('');
        setResponse(''); // Clear previous response

        try {
            const generatedText = await callGeminiAPI(prompt);
            setResponse(generatedText);
        } catch (err) {
            setError(`An error occurred: ${err.message}`);
            console.error("Frontend error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="content-card">
                <h1 className="main-heading">
                    Gemini API Frontend
                </h1>

                <div className="input-section">
                    <label htmlFor="promptInput" className="input-label">
                        Enter your prompt:
                    </label>
                    <textarea
                        id="promptInput"
                        rows="6"
                        className="prompt-textarea"
                        placeholder="e.g., Explain how a Binary Search Tree works..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    ></textarea>
                </div>

                <button
                    id="generateButton"
                    className="generate-button"
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="loading-indicator">
                            <div className="spinner"></div>
                            <span>Generating Response...</span>
                        </div>
                    ) : (
                        "Generate Response"
                    )}
                </button>

                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}

                <div id="responseArea" className="response-area">
                    {response ? (
                        response
                    ) : (
                        <p className="placeholder-text">Your generated content will appear here.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatBot;
