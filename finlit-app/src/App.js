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
      {/* subway surfers video implementation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" 
             style={{top: '10%', left: '20%', animationDuration: '4s'}}></div>
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" 
             style={{top: '50%', right: '20%', animationDuration: '6s', animationDelay: '1s'}}></div>
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" 
             style={{bottom: '10%', left: '40%', animationDuration: '5s', animationDelay: '2s'}}></div>
      </div>

      {/* main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">

      {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            FinLit Simplifier
          </h1>
          <p className="text-2xl text-purple-200">
            Financial jargon? We don't know her 💅
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-3xl backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-purple-200 text-sm font-semibold mb-2">
              Drop that confusing finance term 👇
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  simplifyText();
                }
              }}
              placeholder="e.g., What's a Roth IRA?"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none backdrop-blur-sm"
              rows="3"
            />
          </div>
        
        {/* Example Pills */}
          <div className="mb-6">
            <p className="text-purple-200 text-xs mb-2">Or try these:</p>
            <div className="flex flex-wrap gap-2">
              {exampleTerms.map((term, i) => (
                <button
                  key={i}
                  onClick={() => setInput(term)}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm text-purple-100 transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Simplify Button */}
          <button
            onClick={simplifyText}
            disabled={loading || !input.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg mb-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Simplifying with AI...
              </span>
            ) : (
              '✨ Simplify It!'
            )}
          </button>

          {/* Output Section */}
          {output && (
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-pink-300 font-semibold text-sm uppercase tracking-wide">
                  ✨ Simplified
                </h3>
                <button
                  onClick={speakText}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:scale-105"
                >
                  🔊 Read Aloud
                </button>
              </div>
              <p className="text-white text-lg leading-relaxed">
                {output}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-purple-300 text-sm">
            Powered by Claude AI ✨ | Built for Gen Z 💸
          </p>
        </div>
      </div>
    </div>
  );
}
export default App;
