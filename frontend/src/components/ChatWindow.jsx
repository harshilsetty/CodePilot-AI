import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

function ChatWindow({ topic, difficulty, setDifficulty, messages, setMessages }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/chat', {
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
         setScore(prev => prev + points);
         setQuestionsAnswered(prev => prev + 1);
         nextReply = nextReply.replace(/\[SCORE:\s*\d+\]/i, '').trim();
      }

      const aiMsg = { role: 'assistant', content: nextReply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: '**Error**: Could not connect to AI Coach.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="ml-64 flex-1 flex flex-col relative bg-surface overflow-hidden text-on-surface h-screen">
      {/* TopNavBar */}
      <header className="flex justify-between items-center w-full px-6 py-4 h-16 bg-[#1a1c1f] z-10 shrink-0 border-b border-outline-variant/10">
        <div className="flex items-center space-x-8">
          <span className="text-[#c3f5ff] font-['Space_Grotesk'] font-bold tracking-tight text-xl">CodePilot AI</span>
          <nav className="hidden md:flex items-center space-x-6">
            <a className="font-['Space_Grotesk'] font-bold text-lg text-[#c3f5ff] border-b-2 border-[#c3f5ff] pb-1 hover:text-[#4edea3] transition-colors" href="#">Focus Mode</a>
            <a className="font-['Space_Grotesk'] font-bold text-lg text-slate-400 hover:text-[#4edea3] transition-colors" href="#">Docs</a>
            <a className="font-['Space_Grotesk'] font-bold text-lg text-slate-400 hover:text-[#4edea3] transition-colors" href="#">Session Log</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
           {questionsAnswered > 0 && (
             <div className="mr-6 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary font-mono text-sm shadow-lg flex items-center space-x-2">
                <span className="text-secondary tracking-widest uppercase text-xs">Score</span> 
                <strong>{score}/{questionsAnswered * 10}</strong>
             </div>
           )}
          <button className="text-[#c3f5ff] hover:text-[#4edea3] transition-colors active:scale-95 duration-150">
            <span className="material-symbols-outlined">terminal</span>
          </button>
          <button className="text-[#c3f5ff] hover:text-[#4edea3] transition-colors active:scale-95 duration-150">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/20 overflow-hidden">
            <img alt="Developer Profile Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYVlV_15ESLYUhZiisO1inDzDMug44YZL8tag1LPCT3J3FK4rBZ4RVUp2fO17r8wpyniCOMHpXPf9VKgiZKGAWOajEbyVhcTHisqqkfqh8UF5L3-0kistLygw_Q5PIqFid1eUD4GaIMCAZ1-TPRIm57i7ppCeFKV9Q1Gt3TzZmBTq9fFQh2maRI1VrSFdo0AI5at9BPOKIugREf415X-HAPxTy2VwRyU-hRTBHgHQWfpowe_ONB35q8CrP46SauBUfI4MIJclUZQg"/>
          </div>
        </div>
      </header>

      {/* Difficulty Toggles */}
      <div className="px-8 py-4 flex items-center justify-between bg-surface-container-low/50 backdrop-blur-md border-b border-outline-variant/10 shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mr-2">{isMock ? 'Role:' : 'Topic:'}</span>
          <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold">{isMock ? mockContext?.role : topic}</span>
        </div>
        {!isMock && (
          <div className="flex items-center bg-surface-container-lowest p-1 rounded-lg">
            {DIFFICULTIES.map(d => (
              <button 
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  difficulty === d ? 'text-secondary bg-surface-container-high shadow-lg' : 'text-slate-500 hover:text-on-surface'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 space-y-8 pb-32">
        {messages.length === 0 && (
           <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 pt-12">
              <span className="material-symbols-outlined text-6xl text-surface-container-high">forum</span>
              <p className="font-['Space_Grotesk'] text-xl">Type "start interview" to begin your mock session.</p>
           </div>
        )}
        
        {messages.map((msg, idx) => {
          if (msg.role === 'user') {
            return (
              <div key={idx} className="flex items-start justify-end space-x-4 max-w-4xl ml-auto">
                <div className="space-y-2 text-right">
                  <div className="bg-primary/10 backdrop-blur-sm p-4 rounded-xl rounded-tr-none border border-primary/20 text-on-surface inline-block text-left">
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex-shrink-0 flex items-center justify-center border border-outline-variant/20 overflow-hidden">
                  <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8IV5cupdLYdAe5Yx9X41_K9IiI_r6-7-frbxO4od0CmsPGjxlO0rIFi-42uvdG7pxbWFBVBiVPd5iQ3aKRGIer9suIzL4kKSQWh2Veow2-zfEF4sZqb1RdE9w5uG2lH711KnSUpd2UApErM_askdGVIjroZWq4YPFzdNXVC26kd4Wu5nKztGFi0ICVEyIFABc7KAUbe9uv0aQedATIpEg78Qv3eERjuKv1BhL63-KAKiZFZwKtUS6pCEW-5mtc5Y0qJVHzjcL8uU" />
                </div>
              </div>
            );
          } else {
            return (
              <div key={idx} className="flex items-start space-x-4 max-w-4xl">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high flex-shrink-0 flex items-center justify-center border border-primary/10">
                  <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="bg-surface-container-low p-6 rounded-xl rounded-tl-none border border-outline-variant/5 shadow-xl prose prose-invert prose-p:text-sm prose-p:text-on-surface/90 max-w-none">
                    <div className="flex items-center space-x-2 text-secondary mb-3">
                      <span className="material-symbols-outlined text-sm">psychology</span>
                      <span className="text-xs font-bold uppercase tracking-wider">Coach Insights</span>
                    </div>
                    <ReactMarkdown
                      components={{
                        pre: ({node, ...props}) => (
                          <div className="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/10 my-4">
                            <pre className="p-4 code-block text-sm overflow-x-auto text-on-surface" {...props} />
                          </div>
                        ),
                        code: ({node, inline, ...props}) => (
                          inline 
                            ? <code className="bg-surface-container-highest px-1.5 py-0.5 rounded text-secondary" {...props} />
                            : <code className="text-on-surface" {...props} />
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-xs font-bold text-slate-500 hover:text-secondary flex items-center space-x-1 transition-colors">
                      <span className="material-symbols-outlined text-sm">thumb_up</span>
                      <span>Helpful</span>
                    </button>
                    <button className="text-xs font-bold text-slate-500 hover:text-error flex items-center space-x-1 transition-colors">
                      <span className="material-symbols-outlined text-sm">thumb_down</span>
                      <span>Confusing</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        })}

        {isLoading && (
          <div className="flex items-start space-x-4 max-w-4xl">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex-shrink-0 flex items-center justify-center border border-primary/10 animate-pulse">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
            </div>
            <div className="bg-surface-container-low p-4 rounded-xl rounded-tl-none border border-outline-variant/5 shadow-xl flex items-center space-x-3">
               <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
               <span className="text-sm text-slate-400 italic font-medium">AI is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar (Floating) */}
      <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-surface via-surface to-transparent z-20">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-500 pointer-events-none"></div>
          <div className="relative bg-surface-container-highest rounded-xl border border-outline-variant/20 flex items-center p-2 shadow-2xl">
            <button type="button" className="p-2 text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">add_circle</span>
            </button>
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-slate-500 text-sm py-3 px-4 outline-none" 
              placeholder="Ask about time complexity, edge cases, or optimizations..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
            />
             <div className="flex items-center space-x-2 pr-2">
              <button type="button" className="p-2 text-slate-500 hover:text-secondary transition-colors">
                <span className="material-symbols-outlined">mic</span>
              </button>
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-primary to-primary-container text-on-primary p-2.5 rounded-lg shadow-lg active:scale-95 duration-150 flex items-center justify-center disabled:opacity-50"
              >
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-3 space-x-6 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-600">
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></span>Logic Engine Active</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>Session: {isMock ? 'Mock Interview' : topic}</span>
            <span className="flex items-center hover:text-slate-400 cursor-pointer transition-colors">View Keybindings ⌘K</span>
          </div>
        </form>
      </div>
    </main>
  );
}

export default ChatWindow;
