import React, { useState, useRef } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);

  const simplifyText = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setOutput('');

    const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyCE-uNHYVc5QeF40a3FdSgBiVuHN9pUNyc";

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a Gen Z financial educator who explains complex finance topics in the most casual, relatable way possible. You write like you're texting in a group chat - super casual, using slang, emojis, and keeping it real about money.

Rewrite this financial info like you're explaining it to your group chat. Maximum casual energy:

- write like you're literally typing fast in a group text
- use slang naturally ("fr," "ngl," "lowkey," "deadass")  
- be slightly hyperbolic for effect
- use lowercase and unconventional punctuation
- explain it like you're just learning about this and hype to share 
- limit swearing but use full word if doing so
- throw in a couple emojis where they fit
- keep it real about money stress
- skip the intro and jump straight into details
- be funny and make current pop culture references where it makes sense
- reference 6/7 joke ("6 or 7 hundred dollars," etc) but only once in a response
- Kill ALL jargon - if a word sounds "finance-y," replace it
- Use analogies to everyday Gen Z life
- Emphasize the "why should I care"

Original text:
"""
${input}
"""

Just give me the ultra-casual version, nothing else:`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 2048,
              topP: 0.95,
            }
          })
        }
      );

      const data = await response.json();

      // Error handling
      if (!response.ok) {
        console.error("Gemini API Error:", data);
        if (data.error?.message) {
          setOutput(`API Error: ${data.error.message}`);
          setLoading(false);
          return;
        }
        setOutput("API request failed");
        setLoading(false);
        return;
      }

      // Check if we got content
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error("Unexpected response format:", data);
        setOutput("No content received from API");
        setLoading(false);
        return;
      }

      // Extract text from Gemini's response structure
      const ultraCasualText = data.candidates[0].content.parts[0].text;
      setOutput(ultraCasualText);

    } catch (error) {
      console.error("Error:", error);
      setOutput("bruh the api said no 💀");
    } finally {
      setLoading(false);
    }
  };

  const speakText = () => {
    if (!output) return;

    if( videoRef.current && !isSpeaking && !isPaused){
      videoRef.current.play().catch(err => console.log("Video play error:", err));
    }

    if (isPaused){
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    if (isSpeaking){
      window.speechSynthesis.pause();
      setIsSpeaking(false);
      setIsPaused(true);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(output);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {          
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {             
      setIsSpeaking(false);
      setIsPaused(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
    utterance.onerror = () => {          
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {               
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);

    if(videoRef.current){
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const financialTerms = ["APR", "Compound Interest", "Diversification", "Liquidity", "Asset Allocation"];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      
      {/* video background */}
      {output && (
        <div className={`fixed inset-0 z-0 transition-opacity duration-500 ${output ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <video
            ref={videoRef}
            className='w-full h-full object-cover opacity-100 border-8 border-red-500'
            loop
            muted
            playsInline
            autoPlay
          >
            <source src="/subway-surfers.mp4" type="video/mp4" />
            </video>
            {/* overlay to darken video and make text readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90"></div>
              </div>
        )}

      {!output && (                                     
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" 
               style={{top: '10%', left: '20%', animationDuration: '4s'}}></div>
          <div className="absolute w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" 
               style={{top: '50%', right: '20%', animationDuration: '6s', animationDelay: '1s'}}></div>
          <div className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" 
               style={{bottom: '10%', left: '40%', animationDuration: '5s', animationDelay: '2s'}}></div>
        </div>
      )}

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
              Drop that confusing finance stuff 👇
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
              {financialTerms.map((term, i) => (
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
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl max-h-96 overflow-y-auto">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-pink-300 font-semibold text-sm uppercase tracking-wide">
                  ✨ Simplified
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={speakText}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:scale-105"
                  >
                    {isSpeaking ? '⏸️ Pause' : isPaused ? '▶️ Resume' : '🔊 Read Aloud'}
                  </button>
                  {(isSpeaking || isPaused) && (
                    <button
                      onClick={stopAudio}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:scale-105"
                    >
                      ⏹️ Stop
                    </button>
                  )}
            </div>
          </div>
          {/* Scrollable text container */}
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                {output}
              </p>
            </div>
        </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-purple-300 text-sm">
            Powered by Gemini | Built for Gen Z | Made by Tanushree and Amelia
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;