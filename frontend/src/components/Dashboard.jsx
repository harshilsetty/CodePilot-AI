import React from 'react';

function Dashboard({ username, topic, setCurrentView, streak, performanceStats, chatHistory, loadChat }) {
  const hasHistory = chatHistory && chatHistory.length > 0;
  
  const getGreeting = () => {
    if (!hasHistory) return { text: "Ready to crack interviews today?", emoji: "🚀", subtext: "Welcome" };
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Let's start fresh", emoji: "🌅", subtext: "Morning" };
    if (hour < 18) return { text: "Keep pushing", emoji: "🚀", subtext: "Afternoon" };
    return { text: "Late grind pays off", emoji: "🌙", subtext: "Evening" };
  };

  const handleResumeSession = () => {
     if (hasHistory) {
        loadChat(chatHistory[0].id);
     }
  };

  const render3DName = (name) => {
    if (!name) return null;
    return (
      <span className="inline-block" style={{ perspective: '1000px' }}>
        <span className="name-3d-animated">
          {name}
        </span>
      </span>
    );
  };

  const greeting = getGreeting();

  return (
    <main className="ml-64 flex-1 bg-[#060A0F] overflow-y-auto text-slate-200 min-h-screen relative font-['Inter',sans-serif]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.08),_transparent_40%),radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.08),_transparent_40%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 relative z-10 space-y-8 animate-fade-in">
        
        {/* Advanced Hero Section */}
        <section className="relative bg-[#0A0F16]/50 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 border border-white/5 overflow-hidden shadow-2xl group">
          {/* Internal Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-500/10 via-accent-cyan/5 to-transparent rounded-full blur-[80px] -mr-48 -mt-48 pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex-1 space-y-5">
              <div className="flex items-center gap-3">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md">
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">{greeting.subtext}</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 backdrop-blur-md">
                  <span className="text-sm">🔥</span>
                  <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Streak: {streak || 0} days</p>
                </div>
              </div>

              <div>
                <h1 className="text-5xl md:text-6xl font-['Space_Grotesk'] font-bold text-white tracking-tight leading-[1.1]">
                  Hello, {render3DName(username)} <span className="text-4xl md:text-5xl ml-1 inline-block animate-[wave_2s_ease-in-out_infinite] origin-[70%_70%]">{greeting.emoji}</span>
                </h1>
                <p className="mt-4 text-xl text-slate-400 font-light max-w-xl">
                  {greeting.text} Your next big opportunity is just a few practice rounds away.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => setCurrentView('mockSetup')}
                  className="px-6 py-3.5 bg-white text-[#060A0F] font-semibold text-sm rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all flex items-center gap-2 border border-white"
                >
                  <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  Start Mock Interview
                </button>
                <button 
                  onClick={() => setCurrentView('practice')}
                  className="px-6 py-3.5 bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] text-white font-medium text-sm rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">code</span>
                  Practice DSA
                </button>
                {hasHistory && (
                  <button 
                    onClick={handleResumeSession}
                    className="px-6 py-3.5 bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/20 text-blue-300 font-medium text-sm rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">history</span>
                    Resume Last Session
                  </button>
                )}
              </div>
            </div>
            
            <div className="hidden lg:flex w-40 h-40 rounded-3xl bg-gradient-to-br from-accent-green/20 via-accent-cyan/10 to-blue-500/20 backdrop-blur-md items-center justify-center border border-white/10 shadow-2xl shadow-accent-green/10 transform hover:-translate-y-2 transition-all duration-500 border-b-2 border-r-2 border-b-accent-green/30 border-r-accent-cyan/30">
              <span className="material-symbols-outlined text-[80px] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-lg" style={{fontVariationSettings: "'FILL' 1"}}>psychology</span>
            </div>
          </div>
        </section>

        {/* Global Analytics Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Sessions Completed', value: performanceStats?.totalSessions || 0, icon: 'done_all' },
             { label: 'Avg Score', value: performanceStats?.avgScore || 0, icon: 'analytics', highlight: true },
             { label: 'Last Accuracy', value: `${performanceStats?.lastAccuracy || 0}%`, icon: 'track_changes', highlight: true },
             { label: 'Last Topic', value: performanceStats?.lastTopic || 'None', icon: 'category' }
           ].map((stat, i) => (
             <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-colors border-l-[3px] border-l-accent-green/50 hover:border-l-accent-green group shadow-md backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">{stat.label}</span>
                  <span className="material-symbols-outlined text-[16px] text-slate-600 group-hover:text-accent-green/70 transition-colors">{stat.icon}</span>
                </div>
                <span className={`text-3xl font-bold font-['Space_Grotesk'] tracking-tight ${stat.highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-accent-green to-accent-cyan' : 'text-white'}`}>
                  {stat.value}
                </span>
             </div>
           ))}
        </section>

        {/* Quick Launch & Intel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Practice Card */}
            <div 
              className="bg-[#0A0F16] border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-accent-cyan/30 hover:bg-white/[0.02] transition-all duration-300 group shadow-lg hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
              onClick={() => setCurrentView('practice')}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined text-[80px] -mr-4 -mt-4 text-accent-cyan" style={{fontVariationSettings: "'FILL' 1"}}>school</span>
              </div>
              <div className="relative z-10 mb-8">
                <div className="inline-flex w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 items-center justify-center mb-4 shadow-inner">
                  <span className="material-symbols-outlined text-accent-cyan text-lg">code_blocks</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Algorithms Base</h3>
                <p className="text-sm text-slate-400 font-light">Train specifically on Data Structures & Algorithms without the timer pressure.</p>
              </div>
              <div className="relative z-10">
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center justify-between mb-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Focus Area</span>
                  <span className="text-xs font-semibold text-accent-cyan truncate max-w-[120px]">{topic || 'Any Topics'}</span>
                </div>
                <div className="flex items-center text-[12px] font-bold text-white uppercase tracking-widest group-hover:text-accent-cyan transition-colors">
                  <span>Enter Training</span>
                  <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                </div>
              </div>
            </div>

            {/* Mock Card */}
            <div 
              className="bg-[#0A0F16] border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-accent-green/30 hover:bg-white/[0.02] transition-all duration-300 group shadow-lg hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
              onClick={() => setCurrentView('mockSetup')}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined text-[80px] -mr-4 -mt-4 text-accent-green" style={{fontVariationSettings: "'FILL' 1"}}>mic</span>
              </div>
              <div className="relative z-10 mb-8">
                <div className="inline-flex w-10 h-10 rounded-xl bg-accent-green/10 border border-accent-green/20 items-center justify-center mb-4 shadow-inner">
                  <span className="material-symbols-outlined text-accent-green text-lg">record_voice_over</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Live Simulation</h3>
                <p className="text-sm text-slate-400 font-light">A comprehensive role-play mock interview with an AI engineering manager.</p>
              </div>
              <div className="relative z-10">
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 flex items-center justify-between mb-4">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Target Env</span>
                  <span className="text-xs font-semibold text-accent-green truncate max-w-[120px]">FAANG standard</span>
                </div>
                <div className="flex items-center text-[12px] font-bold text-white uppercase tracking-widest group-hover:text-accent-green transition-colors">
                  <span>Start Interview</span>
                  <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <div className="bg-[#13171D] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
               <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-yellow-400/0 via-yellow-400/50 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <h3 className="text-white font-semibold flex items-center space-x-2 mb-4">
                 <span className="material-symbols-outlined text-yellow-400 text-[18px]">emoji_objects</span>
                 <span>Intelligence Brief</span>
               </h3>
               <p className="text-sm text-slate-300 font-light leading-relaxed italic">
                 "In system design questions, immediately identify read-heavy vs write-heavy characteristics. High conversational throughput with your AI interviewer will drastically boost your final communication score."
               </p>
            </div>
            <div className="bg-[#0A0F16] border border-white/5 rounded-2xl p-6 shadow-xl flex-1 border-t-2 border-t-blue-500">
               <h3 className="text-white font-semibold flex items-center space-x-2 mb-4">
                 <span className="material-symbols-outlined text-blue-400 text-[18px]">verified</span>
                 <span>System Status</span>
               </h3>
               <ul className="space-y-3">
                 <li className="flex items-center space-x-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                   <span className="text-sm text-slate-400 font-light">Gemini Integration Online</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                   <span className="text-sm text-slate-400 font-light">Auto-save Enabled</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse"></div>
                   <span className="text-sm text-slate-400 font-light">Score Computation Live</span>
                 </li>
               </ul>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="py-8 border-t border-white/5 text-center flex items-center justify-center gap-2 mt-4">
           <span className="material-symbols-outlined text-slate-600 text-sm">memory</span>
           <p className="text-[11px] font-bold tracking-widest uppercase text-slate-600">Enterprise AI Infrastructure • v2.0</p>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
