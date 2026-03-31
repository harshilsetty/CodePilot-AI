import React from 'react';

const TOPICS = [
  { name: 'Arrays & Hashing', icon: 'view_column' },
  { name: 'Strings', icon: 'segment' },
  { name: 'DSA Concepts', icon: 'code' },
  { name: 'System Design', icon: 'architecture' },
];

function Sidebar({ topic, handleSelectTopic, currentView, setCurrentView }) {
  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-4 space-y-2 bg-[#1a1c1f] text-[#c3f5ff] font-['Inter'] text-sm font-medium w-64 shadow-[32px_0px_32px_rgba(195,245,255,0.06)] z-20">
      <div className="flex items-center space-x-3 mb-8 px-2 mt-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
        </div>
        <div>
          <h2 className="text-[#c3f5ff] font-['Space_Grotesk'] font-bold text-base leading-none">CodePilot AI</h2>
          <p className="text-slate-500 text-xs mt-1">Intelligent Coding Interview Coach</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1">
        <button onClick={() => setCurrentView('dashboard')} className="w-full flex items-center space-x-3 px-3 py-2.5 bg-[#282a2d] text-[#c3f5ff] rounded-md transition-all duration-200 ease-in-out group">
          <span className="material-symbols-outlined text-lg">dashboard</span>
          <span>Dashboard</span>
        </button>
        
        {TOPICS.map(t => (
          <button 
            key={t.name}
            onClick={() => handleSelectTopic(t.name)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all duration-200 ease-in-out ${
              topic === t.name && currentView === 'chat'
                ? 'bg-[#333538] text-[#4edea3]' 
                : 'text-slate-500 hover:bg-[#333538] hover:text-[#4edea3]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{t.icon}</span>
            <span>{t.name}</span>
          </button>
        ))}

        <button onClick={() => setCurrentView('mockSetup')} className={`w-full flex items-center space-x-3 px-3 py-2.5 mt-4 rounded-md transition-all duration-200 ease-in-out ${currentView === 'mockSetup' ? 'bg-[#333538] text-[#4edea3]' : 'text-slate-500 hover:bg-[#333538] hover:text-[#4edea3]'}`}>
          <span className="material-symbols-outlined text-lg">record_voice_over</span>
          <span>Mock Interview</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-3 py-2.5 text-slate-500 hover:bg-[#333538] hover:text-[#4edea3] rounded-md transition-all duration-200 ease-in-out">
          <span className="material-symbols-outlined text-lg">settings</span>
          <span>Settings</span>
        </button>
      </nav>

      <div className="pt-4 border-t border-outline-variant/10 space-y-1">
        <button onClick={() => setCurrentView('mockSetup')} className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-2.5 rounded-md mb-4 active:scale-95 duration-150">
          Start New Session
        </button>
        <a className="flex items-center space-x-3 px-3 py-2 text-slate-500 hover:text-[#4edea3] transition-colors" href="#">
          <span className="material-symbols-outlined text-lg">menu_book</span>
          <span>Documentation</span>
        </a>
        <a className="flex items-center space-x-3 px-3 py-2 text-slate-500 hover:text-[#4edea3] transition-colors" href="#">
          <span className="material-symbols-outlined text-lg">help_outline</span>
          <span>Support</span>
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;
