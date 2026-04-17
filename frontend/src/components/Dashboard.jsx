import React from 'react';

function Dashboard({ username, topic, setCurrentView, streak, performanceStats, chatHistory, loadChat }) {
  const hasHistory = chatHistory && chatHistory.length > 0;
  
  const getGreeting = () => {
    if (!hasHistory) return { text: "Ready to crack interviews today?", emoji: "💪", subtext: "Welcome" };
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Let's start fresh", emoji: "🚀", subtext: "Morning" };
    if (hour < 18) return { text: "Keep pushing", emoji: "💪", subtext: "Afternoon" };
    return { text: "Late grind pays off", emoji: "🔥", subtext: "Night" };
  };

  const handleResumeSession = () => {
     if (hasHistory) {
        loadChat(chatHistory[0].id);
     }
  };

  const greeting = getGreeting();

  return (
    <main className="ml-64 flex-1 flex flex-col items-center bg-bg-primary overflow-y-auto text-text-primary h-screen">
      <div className="w-full max-w-6xl">
        {/* Hero Section */}
        <div className="relative px-8 pt-12 pb-8">
          <div className="relative bg-gradient-dark glass-effect rounded-3xl p-8 md:p-12 border border-text-secondary/10 overflow-hidden">
            {/* Enhanced Decorative Elements with Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/12 rounded-full blur-3xl -mr-32 -mt-32 opacity-70"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-cyan-400/12 rounded-full blur-3xl opacity-70"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/10 pointer-events-none"></div>
            
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/40 shadow-soft shadow-blue-500/20">
                    <p className="text-xs font-semibold text-blue-300 uppercase tracking-wide">{greeting.subtext}</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/40 shadow-soft shadow-orange-500/20">
                    <span className="text-sm">🔥</span>
                    <p className="text-xs font-semibold text-orange-400 uppercase tracking-wide">Streak: {streak || 0} days</p>
                  </div>
                </div>
                <h1 className="text-5xl md:text-6xl font-['Space_Grotesk'] font-bold text-text-primary mb-3 leading-tight">
                  Hello {username} <span className="text-4xl md:text-5xl ml-2 inline-block">{greeting.emoji}</span>
                </h1>
                <p className="text-lg md:text-xl text-text-secondary/90 mb-8 font-medium">
                  {greeting.text}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setCurrentView('mockSetup')}
                    className="px-6 py-3 bg-gradient-to-r from-accent-green to-accent-cyan text-bg-primary font-semibold rounded-lg shadow-soft shadow-accent-green/30 active:scale-95 duration-150 transition-all hover:shadow-glow-green"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">record_voice_over</span>
                      Start Mock Interview
                    </span>
                  </button>
                  <button 
                    onClick={() => setCurrentView('practice')}
                    className="px-6 py-3 bg-bg-secondary border border-text-secondary/20 text-text-primary font-semibold rounded-lg hover:border-blue-400/50 transition-all duration-200 shadow-soft-sm hover:shadow-soft active:scale-95"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base">auto_awesome</span>
                      Practice DSA
                    </span>
                  </button>
                  {hasHistory && (
                    <button 
                      onClick={handleResumeSession}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/30 text-blue-400 font-semibold rounded-lg hover:border-blue-400/60 hover:bg-blue-500/20 transition-all duration-200 shadow-soft-sm hover:shadow-glow-blue active:scale-95"
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">history</span>
                        Resume Last Session
                      </span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Enhanced Hero Icon Card */}
              <div className="hidden md:flex w-32 h-32 rounded-2xl bg-gradient-soft-green items-center justify-center border border-blue-400/30 shadow-soft hover:shadow-glow-green transition-all duration-300 group cursor-pointer hover:scale-110 hover:-rotate-3">
                <span className="material-symbols-outlined text-6xl text-blue-300 group-hover:scale-125 transition-transform duration-300" style={{fontVariationSettings: "'FILL' 1"}}>psychology_alt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="px-8 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="glass-effect rounded-2xl p-5 border border-text-secondary/10 flex flex-col justify-center items-center text-center shadow-soft hover:shadow-glow-blue transition-smooth duration-200 cursor-default interactive-card">
                <span className="text-[10px] text-text-secondary uppercase tracking-widest mb-2 font-semibold">Sessions Completed</span>
                <span className="text-3xl font-bold text-text-primary font-['Space_Grotesk']">{performanceStats?.totalSessions || 0}</span>
             </div>
             <div className="glass-effect rounded-2xl p-5 border border-text-secondary/10 flex flex-col justify-center items-center text-center shadow-soft hover:shadow-glow-blue transition-smooth duration-200 cursor-default interactive-card">
                <span className="text-[10px] text-text-secondary uppercase tracking-widest mb-2 font-semibold">Avg Score</span>
               <span className="text-3xl font-bold text-blue-300 font-['Space_Grotesk']">{performanceStats?.avgScore || 0}</span>
             </div>
             <div className="glass-effect rounded-2xl p-5 border border-text-secondary/10 flex flex-col justify-center items-center text-center shadow-soft hover:shadow-glow-blue transition-smooth duration-200 cursor-default interactive-card">
                <span className="text-[10px] text-text-secondary uppercase tracking-widest mb-2 font-semibold">Last Accuracy</span>
                <span className="text-3xl font-bold text-blue-400 font-['Space_Grotesk']">{performanceStats?.lastAccuracy || 0}%</span>
             </div>
             <div className="glass-effect rounded-2xl p-5 border border-text-secondary/10 flex flex-col justify-center items-center text-center shadow-soft transition-smooth duration-200 cursor-default bg-bg-secondary/30 interactive-card">
                <span className="text-[10px] text-text-secondary uppercase tracking-widest mb-2 font-semibold">Last Topic</span>
                <span className="text-sm font-bold text-text-primary px-2">{performanceStats?.lastTopic || 'None'}</span>
             </div>
          </div>
        </div>

        {/* Quick Cards Grid */}
        <div className="px-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            
            {/* Practice Card */}
            <div 
              className="group glass-effect rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-glow-cyan border-l-4 border-cyan-400/40 hover:border-cyan-300 hover:-translate-y-2 hover:bg-bg-secondary/80 interactive-card"
              onClick={() => setCurrentView('practice')}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-soft-green flex items-center justify-center group-hover:shadow-glow-cyan transition-all duration-200 group-hover:scale-110">
                      <span className="material-symbols-outlined text-cyan-300 text-2xl">school</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">Practice Mode</h3>
                  </div>
                  <p className="text-sm text-text-secondary/90">Test your DSA & coding skills</p>
                </div>
              </div>
              <div className="bg-bg-primary/50 rounded-lg p-4 border border-text-secondary/10 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary uppercase tracking-wide">Current Topic</span>
                  <span className="text-sm font-bold text-cyan-300">{topic || 'Select a topic'}</span>
                </div>
              </div>
              <p className="text-xs text-cyan-300/80 font-semibold group-hover:text-cyan-200 transition-colors">
                Continue Practice →
              </p>
            </div>

            {/* Mock Interview Card */}
            <div 
              className="group glass-effect rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-glow-blue border-l-4 border-blue-500/40 hover:border-blue-400 hover:-translate-y-2 hover:bg-bg-secondary/80 interactive-card"
              onClick={() => setCurrentView('mockSetup')}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-soft-blue flex items-center justify-center group-hover:shadow-glow-blue transition-all duration-200 group-hover:scale-110">
                      <span className="material-symbols-outlined text-blue-400 text-2xl">record_voice_over</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">Mock Interview</h3>
                  </div>
                  <p className="text-sm text-text-secondary/90">Simulate a full role interview</p>
                </div>
              </div>
              <div className="bg-bg-primary/50 rounded-lg p-4 border border-text-secondary/10 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary uppercase tracking-wide">AI Coach</span>
                  <span className="text-sm font-bold text-blue-400">Ready to begin</span>
                </div>
              </div>
              <p className="text-xs text-blue-400/80 font-semibold group-hover:text-blue-400 transition-colors">
                Start Interview →
              </p>
            </div>

          </div>

          {/* Tips + Highlights Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tip Card */}
            <div className="glass-effect rounded-2xl p-6 border border-text-secondary/5 hover:border-text-secondary/20 transition-all duration-200 hover:bg-bg-secondary/50 hover:-translate-y-1">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-yellow-400 text-2xl">lightbulb</span>
                Interview Tip
              </h3>
              <p className="text-sm text-text-secondary/90 leading-relaxed">
                "Before writing any code, always confirm problem constraints with your interviewer. Ask questions about edge cases to show robust thinking process!"
              </p>
            </div>

            {/* Highlights Card */}
            <div className="glass-effect rounded-2xl p-6 border border-text-secondary/5 hover:border-text-secondary/20 transition-all duration-200 hover:bg-bg-secondary/50 hover:-translate-y-1">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-300 text-2xl">bolt</span>
                System Highlights
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-300 flex-shrink-0"></div>
                  <p className="text-sm text-text-secondary/90">AI-powered instant feedback</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-300 flex-shrink-0"></div>
                  <p className="text-sm text-text-secondary/90">Multi-mode learning (Chat, Practice, Mock)</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-300 flex-shrink-0"></div>
                  <p className="text-sm text-text-secondary/90">Persistent sessions with history</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-text-secondary/10 text-center">
          <p className="text-xs text-text-secondary/70">Powered by Generative AI • CodePilot AI v2.0</p>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
