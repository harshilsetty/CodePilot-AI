import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import apiClient from '../api/client';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

function ChatWindow({
  topic,
  difficulty,
  setDifficulty,
  messages,
  setMessages,
  isMock,
  mockContext,
  username,
  setCurrentView,
  completeSession
}) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [loadingText, setLoadingText] = useState('🧠 Evaluating your answer...');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceReplyEnabled, setIsVoiceReplyEnabled] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const modeLabel = isMock ? 'Mock Interview' : 'Topic Practice';
  const subjectLabel = isMock ? mockContext?.role : topic;
  const inputPlaceholder = isMock
    ? 'Answer the interview question...'
    : 'Ask anything about coding interviews...';

  const assistantMessages = messages.filter((msg) => msg.role === 'assistant');
  const summaryFeedback = assistantMessages
    .slice(-3)
    .map((msg) => msg.content.replace(/\[SCORE:\s*\d+\]/gi, '').trim())
    .filter(Boolean);

  const normalizedAccuracy = questionsAnswered > 0 ? Math.round((score / (questionsAnswered * 10)) * 100) : 0;
  const strengths = normalizedAccuracy >= 70
    ? ['Arrays', 'Basic logic']
    : ['Problem understanding', 'Structured attempts'];
  const weakAreas = [];
  if (normalizedAccuracy < 80) weakAreas.push('Optimization');
  if (normalizedAccuracy < 70) weakAreas.push('Edge cases');
  if (weakAreas.length === 0) weakAreas.push('Advanced optimization depth');
  const recommendation = weakAreas.includes('Optimization')
    ? 'Practice sliding window and two-pointer optimization problems.'
    : 'Keep practicing mixed DSA sets to maintain momentum.';

  const sendPresetMessage = async (text, customLoadingText = '🧠 Evaluating your answer...') => {
    if (isLoading) return;
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setLoadingText(customLoadingText);

    try {
      const response = await apiClient.post('/api/chat', {
        history: newMessages,
        topic: isMock ? undefined : topic,
        difficulty: isMock ? undefined : difficulty,
        isMock,
        mockContext
      });

      let nextReply = response.data.reply;
      const scoreMatch = nextReply.match(/\[SCORE:\s*(\d+)\]/i);
      if (scoreMatch) {
        const points = parseInt(scoreMatch[1], 10);
        setScore((prev) => prev + points);
        setQuestionsAnswered((prev) => prev + 1);
        nextReply = nextReply.replace(/\[SCORE:\s*\d+\]/i, '').trim();
      }

      const cleanReply = nextReply.replace(/\*\*/g, '').replace(/\n/g, ' ');

      if (isVoiceReplyEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(cleanReply);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        if (isMock && mockContext?.interviewerStyle === 'Hostile') {
          utterance.pitch = 0.8;
          utterance.rate = 1.1;
        } else if (isMock && mockContext?.interviewerStyle === 'Friendly') {
          utterance.pitch = 1.2;
          utterance.rate = 0.95;
        }
        window.speechSynthesis.speak(utterance);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: nextReply }]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '**Error**: Could not connect to AI Coach.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    await sendPresetMessage(input, '🧠 Evaluating your answer...');
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
         setInput((prev) => (prev ? prev + ' ' : '') + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <main className="ml-64 flex-1 flex flex-col relative bg-bg-primary overflow-hidden text-text-primary h-screen">
      <header className="flex justify-between items-center w-full px-6 py-4 bg-bg-secondary z-10 shrink-0 border-b border-text-secondary/10">
        <div className="flex items-center space-x-6 min-w-0">
          <div>
            <h1 className="text-text-primary font-['Space_Grotesk'] font-bold tracking-tight text-2xl">PrepPilot AI</h1>
            <div className="mt-1.5 flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${isMock ? 'bg-blue-500/10 text-blue-300 border-blue-500/30 shadow-glow-blue' : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-glow-cyan'}`}>
                {modeLabel}
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">{isMock ? 'Role' : 'Topic'}</span>
            <span className="px-3 py-1 rounded-full bg-bg-primary border border-text-secondary/20 text-blue-300 text-xs font-semibold truncate max-w-56">{subjectLabel}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isMock && (
             <div className="px-3 py-1.5 bg-bg-secondary border border-text-secondary/20 rounded-full text-text-primary text-xs shadow-soft font-medium">
                Question <span className="text-blue-400 font-bold">{Math.min(questionsAnswered + 1, 5)}</span> of 5
             </div>
          )}
          {questionsAnswered > 0 && (
            <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 font-mono text-sm shadow-soft">
              <span className="text-blue-300 tracking-widest uppercase text-xs mr-2">Score</span>
              <strong>{score}/{questionsAnswered * 10}</strong>
            </div>
          )}
          <button onClick={() => setShowSummary(true)} className="px-3 py-2 rounded-lg border border-text-secondary/20 text-text-secondary hover:bg-text-secondary/10 transition-smooth text-sm font-semibold">
            End Session
          </button>
        </div>
      </header>

      <div className="px-8 py-3 flex items-center justify-between bg-bg-primary border-b border-text-secondary/10 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Difficulty</span>
          {!isMock && (
            <div className="flex items-center bg-bg-secondary p-1 rounded-lg border border-text-secondary/20">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-smooth ${
                    difficulty === d ? 'text-blue-300 bg-blue-500/15 shadow-soft' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
          {isMock && mockContext?.usedFallback && (
            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-[10px] font-bold uppercase tracking-widest border border-yellow-400/30">
              Fallback question active
            </span>
          )}
        </div>
        <p className="text-xs text-text-secondary hidden sm:block">Session: {modeLabel}</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 sm:px-10 py-8 space-y-7 pb-44">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary space-y-5 pt-16 text-center max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-6xl text-text-secondary/30">forum</span>
            <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl text-text-primary font-semibold">
              Hello {username || 'there'}! Ready to crack interviews?
            </h2>
            <p className="text-text-secondary/70">Start with a quick action and PrepPilot will guide your next step.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => setCurrentView?.('mockSetup')} className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-accent-green to-accent-cyan text-bg-primary font-semibold transition-smooth duration-200 shadow-soft hover:shadow-glow-green">
                Start Mock Interview
              </button>
              <button onClick={() => setCurrentView?.('practice')} className="px-4 py-2.5 rounded-lg bg-bg-secondary border border-text-secondary/20 text-text-primary font-semibold hover:bg-bg-secondary/80 transition-smooth duration-200">
                Practice Mode
              </button>
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => {
          if (msg.role === 'user') {
            return (
              <div key={idx} className="flex items-start justify-end max-w-4xl ml-auto">
                <div className="max-w-[72%] glass-effect-sm rounded-2xl rounded-tr-md p-4 text-text-primary transition-smooth hover:bg-bg-secondary/60">
                  <p className="text-sm whitespace-pre-wrap leading-6">{msg.content}</p>
                </div>
              </div>
            );
          } else {
            return (
              <div key={idx} className="flex items-start space-x-3 max-w-4xl">
                <div className="w-10 h-10 rounded-xl bg-bg-secondary flex-shrink-0 flex items-center justify-center border border-text-secondary/20">
                  <span className="material-symbols-outlined text-blue-300" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                </div>
                <div className="space-y-2 flex-1 max-w-[74%]">
                  <div className="inline-flex items-center space-x-2 text-blue-300">
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em]">AI Coach</span>
                  </div>
                  <div className="glass-effect rounded-2xl rounded-tl-md p-5 transition-smooth hover:bg-bg-secondary/70">
                    <div className="flex items-center space-x-2 text-cyan-300 mb-3 opacity-80">
                      <span className="material-symbols-outlined text-sm">psychology</span>
                      <span className="text-xs font-bold uppercase tracking-wider">Coach Insights</span>
                    </div>
                    <ReactMarkdown
                      components={{
                        pre: ({node, ...props}) => (
                          <div className="bg-bg-primary rounded-lg overflow-hidden border border-text-secondary/20 my-4">
                            <pre className="p-4 code-block text-sm overflow-x-auto text-text-primary" {...props} />
                          </div>
                        ),
                        code: ({node, inline, ...props}) => (
                          inline 
                            ? <code className="bg-bg-secondary px-1.5 py-0.5 rounded text-cyan-300" {...props} />
                            : <code className="text-text-primary" {...props} />
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          }
        })}

        {isLoading && (
          <div className="flex items-start space-x-4 max-w-4xl">
            <div className="w-10 h-10 rounded-xl bg-bg-secondary flex-shrink-0 flex items-center justify-center border border-text-secondary/20 animate-pulse">
              <span className="material-symbols-outlined text-blue-300" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
            </div>
            <div className="glass-effect rounded-xl rounded-tl-none p-4 shadow-soft flex items-center space-x-3">
               <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-400 rounded-full animate-spin"></div>
              <span className="text-sm text-text-secondary italic font-medium">{loadingText}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 left-0 w-full p-5 sm:p-6 bg-gradient-to-t from-bg-primary via-bg-primary to-transparent z-20 border-t border-text-secondary/10">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => sendPresetMessage('start interview', '⚡ Generating next question...')}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-full border border-text-secondary/20 bg-bg-secondary text-xs font-semibold text-text-secondary hover:bg-bg-secondary/80 hover:text-text-primary transition-smooth disabled:opacity-60"
            >
              Start Interview
            </button>
            <button
              type="button"
              onClick={() => setCurrentView?.('practice')}
              className="px-3 py-1.5 rounded-full border border-text-secondary/20 bg-bg-secondary text-xs font-semibold text-text-secondary hover:bg-bg-secondary/80 hover:text-text-primary transition-smooth"
            >
              Practice DSA
            </button>
          </div>
          <div className="relative glass-effect rounded-xl flex flex-col p-2 shadow-soft transition-all ring-1 focus-within:ring-blue-400/50 ring-text-secondary/10">
            {/* Top Toolbar line (Voice Toggles & Hints) */}
            <div className="flex justify-between items-center px-2 pt-1 pb-2 border-b border-white/5 mb-1">
               <button 
                  type="button"
                  onClick={() => {
                     setIsVoiceReplyEnabled(!isVoiceReplyEnabled);
                     if (isVoiceReplyEnabled) window.speechSynthesis.cancel();
                  }}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${isVoiceReplyEnabled ? 'text-accent-cyan bg-accent-cyan/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
               >
                 <span className="material-symbols-outlined text-sm">{isVoiceReplyEnabled ? 'volume_up' : 'volume_off'}</span>
                 <span>AI Voice {isVoiceReplyEnabled ? 'ON' : 'OFF'}</span>
               </button>
               <span className="text-[10px] text-slate-500 uppercase tracking-widest">{isListening ? '🎙️ Listening...' : 'Enter your submission'}</span>
            </div>

            <div className="flex items-center">
              <input 
                className="flex-1 bg-transparent border-none focus:ring-0 text-text-primary placeholder:text-text-secondary/50 text-sm py-2 px-4 outline-none" 
                placeholder={isListening ? "Listening to your voice..." : inputPlaceholder}
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading}
              />
               <div className="flex items-center space-x-2 pr-2">
                <button 
                  type="button" 
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`p-2.5 rounded-lg active:scale-95 duration-150 flex items-center justify-center transition-smooth ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-bg-secondary text-text-secondary hover:text-text-primary hover:bg-white/5'}`}
                  title="Voice Typing (Dictation)"
                >
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>mic</span>
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-accent-green to-accent-cyan text-bg-primary p-2.5 rounded-lg shadow-soft shadow-accent-green/30 active:scale-95 duration-150 flex items-center justify-center disabled:opacity-50 hover:shadow-glow-green transition-smooth"
                >
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-text-secondary/60">Powered by Generative AI • PrepPilot AI v2.0</p>
        </form>
      </div>

      {showSummary && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl glass-effect rounded-2xl shadow-soft p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-['Space_Grotesk'] font-bold text-text-primary">Session Summary</h2>
                <p className="text-text-secondary text-sm mt-1">Review your progress before ending this session.</p>
              </div>
              <button onClick={() => setShowSummary(false)} className="text-text-secondary hover:text-text-primary transition-smooth">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-6">
              <div className="rounded-xl border border-text-secondary/20 glass-effect-sm p-4">
                <p className="text-xs uppercase tracking-widest text-text-secondary">Score</p>
                <p className="text-2xl font-bold text-blue-300 mt-1">{score}/{questionsAnswered * 10 || 0}</p>
              </div>
              <div className="rounded-xl border border-text-secondary/20 glass-effect-sm p-4">
                <p className="text-xs uppercase tracking-widest text-text-secondary">Questions</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{questionsAnswered}</p>
              </div>
              <div className="rounded-xl border border-text-secondary/20 glass-effect-sm p-4">
                <p className="text-xs uppercase tracking-widest text-text-secondary">Topics Covered</p>
                <p className="text-sm font-semibold text-text-primary mt-2">{subjectLabel || 'General coding'}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-text-secondary/20 glass-effect-sm p-4">
              <h3 className="text-sm font-bold text-text-primary mb-3">Performance Summary</h3>
              <div className="flex items-center gap-6 mb-4">
                 <p className="text-text-secondary text-sm">📊 Score: <span className="text-text-primary font-bold">{score}/{questionsAnswered * 10 || 0}</span></p>
                  <p className="text-text-secondary text-sm">🎯 Accuracy: <span className="text-cyan-300 font-bold">{normalizedAccuracy}%</span></p>
              </div>
              <p className="text-text-primary text-sm font-semibold">✅ Strengths:</p>
              <ul className="text-text-secondary text-sm mb-2 list-disc list-inside">
                {strengths.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="text-text-primary text-sm font-semibold">❌ Weak Areas:</p>
              <ul className="text-text-secondary text-sm mb-2 list-disc list-inside">
                {weakAreas.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="text-text-primary text-sm font-semibold">📈 Recommendation:</p>
              <p className="text-text-secondary text-sm">{recommendation}</p>
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.18em] text-text-secondary mb-2">Key Feedback</p>
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                {summaryFeedback.length === 0 && (
                  <p className="text-sm text-text-secondary/70">No feedback yet. Continue the conversation to generate insights.</p>
                )}
                {summaryFeedback.map((feedback, idx) => (
                  <div key={`${feedback.slice(0, 20)}-${idx}`} className="p-3 rounded-lg glass-effect-sm border border-text-secondary/10 text-sm text-text-secondary leading-6">
                    {feedback.length > 180 ? `${feedback.slice(0, 180)}...` : feedback}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={() => setShowSummary(false)} className="px-4 py-2 rounded-lg border border-text-secondary/20 text-text-secondary hover:bg-text-secondary/10 transition-smooth">
                Continue Session
              </button>
              <button
                onClick={() => {
                  completeSession?.(score, normalizedAccuracy, subjectLabel);
                  setShowSummary(false);
                  setMessages([]);
                  setCurrentView?.('dashboard');
                }}
                className="px-4 py-2 rounded-lg bg-accent-green text-bg-primary font-semibold hover:bg-accent-green/90 transition-smooth shadow-soft"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ChatWindow;
