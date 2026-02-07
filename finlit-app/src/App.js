import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const simplyfyText = async () => {
    if(!input.trim())
      return;

    setLoading(true);
    setOutput('');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20241021",
          max_tokens: 1024,
          messages: [
{
              role: "user",
              content: `You're a financial literacy educator for Gen Z. Take this concept and explain it in simple, relatable terms. Use casual language, modern examples (apps, streaming services, social media), and break down any jargon. Keep it concise (2-3 sentences) and engaging.'
              Financial concept: ${input}

              Simplified output:`
            }
          ]
        })
      });

      const data = await response.json();
      const simpleText = data.content
        .map(item => (item.type === "text" ? item.text : ""))
        .filter(Boolean)
        .join("\n");

      setOutput(simpleText);
    } catch (error) {
      console.error('Error simplifying text:', error);
      setOutput('Sorry, there was an error processing your request.');
    }

    setLoading(false);

  };

  const speakText = () => {
    if (!output) 
      return;

    const utterance = new SpeechSynthesisUtterance(output);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const finTerms = ["APR", "Compound Interest", "Diversification", "Liquidity", "Asset Allocation"];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">

  )

  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
