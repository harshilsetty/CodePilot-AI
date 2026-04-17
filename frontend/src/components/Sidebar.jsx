import React, { useEffect, useState } from 'react';

const TOPICS = [
  { name: 'Arrays & Hashing', icon: 'view_column' },
  { name: 'Strings', icon: 'segment' },
  { name: 'DSA Concepts', icon: 'code' },
  { name: 'System Design', icon: 'architecture' },
];

function Sidebar({ topic, handleSelectTopic, currentView, setCurrentView, handleLogout, chatHistory, activeChatId, loadChat, startNewChat, user }) {
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [customTopics, setCustomTopics] = useState([]);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [topicError, setTopicError] = useState('');

  const allTopics = [...TOPICS, ...customTopics.map((name) => ({ name, icon: 'bookmark' }))];

  useEffect(() => {
    if (currentView === 'chat') {
      setTopicsOpen(true);
    } else {
      setTopicsOpen(false);
    }
  }, [currentView]);

  useEffect(() => {
    try {
      const savedTopics = JSON.parse(localStorage.getItem('customTopics') || '[]');
      if (Array.isArray(savedTopics)) {
        setCustomTopics(savedTopics);
      }
    } catch (error) {
      setCustomTopics([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('customTopics', JSON.stringify(customTopics));
  }, [customTopics]);

  const handleAddNewTopic = (e) => {
    e.preventDefault();
    const normalized = newTopicName.trim();
    if (!normalized) {
      setTopicError('Topic name cannot be empty.');
      return;
    }

    const exists = allTopics.some((t) => t.name.toLowerCase() === normalized.toLowerCase());
    if (exists) {
      setTopicError('Topic already exists.');
      return;
    }

    setCustomTopics((prev) => [...prev, normalized]);
    setNewTopicName('');
    setTopicError('');
    setIsAddingTopic(false);
    handleSelectTopic(normalized);
  };

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-4 pb-5 space-y-4 bg-bg-secondary text-text-primary text-sm font-medium w-64 border-r border-text-secondary/10 shadow-soft z-20">
      {/* Logo */}
      <div className="flex items-center space-x-3 px-1 mt-1 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-soft-green flex items-center justify-center shadow-soft shadow-accent-green/20">
          <span className="material-symbols-outlined text-bg-primary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
        </div>
        <div>
          <h2 className="text-text-primary font-['Space_Grotesk'] font-bold text-base leading-none">CodePilot AI</h2>
          <p className="text-text-secondary text-xs mt-1">AI Mentor</p>
        </div>
      </div>

      {/* New Chat Button */}
      <button 
        onClick={startNewChat} 
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-accent-green to-accent-cyan text-bg-primary font-semibold py-3 rounded-lg active:scale-95 duration-150 shadow-soft shadow-accent-green/30 hover:shadow-glow-green transition-smooth shrink-0"
      >
        <span className="material-symbols-outlined text-base">add_comment</span>
        <span>New Chat</span>
      </button>
      
      {/* Main Navigation Section */}
      <nav className="space-y-1 shrink-0">
        <p className="text-xs font-bold text-text-secondary/60 uppercase tracking-wider pl-3 mb-2">Main</p>
        
        <button 
          onClick={() => setCurrentView('dashboard')} 
          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-smooth duration-200 ${
            currentView === 'dashboard' 
              ? 'bg-accent-green/15 text-accent-green shadow-soft shadow-accent-green/20' 
              : 'text-text-secondary hover:bg-text-secondary/10 hover:text-text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-lg">dashboard</span>
          <span>Dashboard</span>
        </button>
        
        <button 
          onClick={() => setCurrentView('mockSetup')} 
          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg duration-200 transition-all group ${
            currentView === 'mockSetup' 
              ? 'bg-blue-500/15 text-blue-400 shadow-glow-blue shadow-blue-500/40' 
              : 'text-text-secondary hover:bg-text-secondary/10 hover:text-text-primary hover:shadow-soft'
          }`}
        >
          <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform duration-200">record_voice_over</span>
          <span>Mock Interview</span>
        </button>
        
        <button 
          onClick={() => setCurrentView('practice')} 
          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg duration-200 transition-all group ${
            currentView === 'practice' 
              ? 'bg-accent-green/15 text-accent-green shadow-glow-green shadow-accent-green/40' 
              : 'text-text-secondary hover:bg-text-secondary/10 hover:text-text-primary hover:shadow-soft'
          }`}
        >
          <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform duration-200">auto_awesome</span>
          <span>Practice Mode</span>
        </button>

        <button 
          onClick={() => setCurrentView('profile')} 
          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg duration-200 transition-all group ${
            currentView === 'profile' 
              ? 'bg-cyan-500/15 text-cyan-300 shadow-glow-cyan shadow-cyan-500/30' 
              : 'text-text-secondary hover:bg-text-secondary/10 hover:text-text-primary hover:shadow-soft'
          }`}
        >
          <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform duration-200">person</span>
          <span>Profile</span>
        </button>
      </nav>

      {/* Topics Section */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <p className="text-xs font-bold text-text-secondary/60 uppercase tracking-wider pl-3 mb-2">Topics</p>
        
        <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1">
          <button
            onClick={() => {
              if (currentView === 'chat') {
                setTopicsOpen((prev) => !prev);
              } else {
                setCurrentView('chat');
                setTopicsOpen(true);
              }
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg duration-200 transition-all group ${
              currentView === 'chat' 
                ? 'bg-accent-green/15 text-accent-green shadow-glow-green shadow-accent-green/30' 
                : 'text-text-secondary hover:bg-text-secondary/10 hover:text-text-primary hover:shadow-soft'
            }`}
          >
            <span className="flex items-center space-x-3 flex-1 min-w-0">
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform duration-200">category</span>
              <span className="truncate">Browse Topics</span>
            </span>
            <span className={`material-symbols-outlined text-base transition-transform duration-200 flex-shrink-0 ${topicsOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </button>

          {topicsOpen && (
            <div className="ml-2 pl-2 border-l border-text-secondary/20 space-y-1">
              <button
                onClick={() => {
                  setIsAddingTopic((prev) => !prev);
                  setTopicError('');
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg duration-200 transition-all text-left text-text-secondary hover:bg-accent-green/10 hover:text-accent-green border border-dashed border-text-secondary/30 hover:border-accent-green/60 group"
              >
                <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform duration-200">add_circle</span>
                <span className="text-sm font-semibold">Add New Topic</span>
              </button>

              {isAddingTopic && (
                <form onSubmit={handleAddNewTopic} className="space-y-2 p-3 rounded-lg glass-effect-sm border border-text-secondary/10">
                  <input
                    value={newTopicName}
                    onChange={(e) => {
                      setNewTopicName(e.target.value);
                      if (topicError) setTopicError('');
                    }}
                    placeholder="Type topic name..."
                    className="w-full px-3 py-2 rounded-md bg-bg-primary border border-text-secondary/20 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-green/60 focus:shadow-glow-green focus:shadow-accent-green/20 transition-all duration-200"
                    autoFocus
                  />
                  {topicError && <p className="text-xs text-red-400">{topicError}</p>}
                  <div className="flex items-center gap-2">
                    <button 
                      type="submit" 
                      className="flex-1 px-3 py-2 rounded-md bg-accent-green/20 border border-accent-green/40 text-accent-green hover:bg-accent-green/30 hover:shadow-glow-green hover:shadow-accent-green/20 transition-all duration-200 text-xs font-semibold group"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingTopic(false);
                        setNewTopicName('');
                        setTopicError('');
                      }}
                      className="flex-1 px-3 py-2 rounded-md border border-text-secondary/30 text-text-secondary hover:bg-text-secondary/10 hover:border-text-secondary/50 transition-all duration-200 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {allTopics.map((t) => (
                <button
                  key={t.name}
                  onClick={() => handleSelectTopic(t.name)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg duration-200 transition-all group text-left ${
                    topic === t.name && currentView === 'chat'
                      ? 'bg-accent-green/15 text-accent-green shadow-glow-green shadow-accent-green/25'
                      : 'text-text-secondary hover:bg-text-secondary/10 hover:text-text-primary hover:shadow-soft hover:-translate-y-0.5'
                  }`}
                >
                  <span className="material-symbols-outlined text-base group-hover:scale-105 transition-transform duration-200">{t.icon}</span>
                  <span className="text-sm truncate">{t.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat History Section */}
      <div className="flex-1 overflow-hidden flex flex-col border-t border-text-secondary/10 pt-4">
        <p className="text-xs font-bold text-text-secondary/60 uppercase tracking-wider pl-3 mb-2">Chat History</p>

        {(!chatHistory || chatHistory.length === 0) && (
          <p className="px-3 text-xs text-text-secondary/50 italic py-2">No recent chats.</p>
        )}
        
        {chatHistory && (
          <div className="overflow-y-auto custom-scrollbar space-y-1 flex-1">
            {chatHistory.map(chat => (
              <button 
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className={`w-full text-left truncate px-3 py-2.5 rounded-lg duration-200 transition-all flex items-center space-x-3 border group ${
                  activeChatId === chat.id
                    ? 'bg-accent-green/15 text-accent-green border-accent-green/40 shadow-glow-green shadow-accent-green/30' 
                    : 'text-text-secondary border-transparent hover:bg-text-secondary/10 hover:text-text-primary hover:border-text-secondary/20 hover:shadow-soft hover:-translate-y-0.5'
                }`}
              >
                <span className="material-symbols-outlined text-base flex-shrink-0 group-hover:scale-105 transition-transform duration-200">chat_bubble_outline</span>
                <span className="truncate text-sm">{chat.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-text-secondary/10 shrink-0 mt-auto">
        <div className="px-3 py-3 mb-3 rounded-lg glass-effect-sm border border-text-secondary/10 hover:border-text-secondary/20 transition-colors duration-200">
          <p className="text-xs uppercase tracking-wider text-text-secondary/60">Signed in</p>
          <p className="text-sm text-text-primary mt-2 truncate font-semibold">{user?.name || 'CodePilot User'}</p>
          <p className="text-xs text-text-secondary/70 truncate">{user?.email || ''}</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/15 hover:shadow-soft hover:shadow-red-500/20 rounded-lg duration-200 transition-all group border border-red-500/20 hover:border-red-500/40"
        >
          <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform duration-200">logout</span>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

