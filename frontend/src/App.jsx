import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MockInterviewSetup from './components/MockInterviewSetup';
import PracticeMode from './components/PracticeMode';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

const getHistoryStorageKey = (user) => {
  const identifier = user?.id || user?.email;
  return identifier ? `chatHistory:${identifier}` : null;
};

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [topic, setTopic] = useState('Arrays & Hashing');
  const [difficulty, setDifficulty] = useState('Medium');
  const [messages, setMessages] = useState([]);
  
  const [isMock, setIsMock] = useState(false);
  const [mockContext, setMockContext] = useState(null);

  const [activeChatId, setActiveChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  const [streak, setStreak] = useState(0);
  const [activityMap, setActivityMap] = useState({});
  const [performanceStats, setPerformanceStats] = useState({
    totalSessions: 0,
    avgScore: 0,
    lastScore: 0,
    lastAccuracy: 0,
    lastTopic: ''
  });

  const handleSelectTopic = (newTopic) => {
    setTopic(newTopic);
    setIsMock(false);
    setMockContext(null);
    setMessages([]);
    setActiveChatId(null);
    setCurrentView('chat');
  };

  const handleStartMock = (firstAiMessage, contextInfo) => {
    setIsMock(true);
    setMockContext(contextInfo);
    setMessages([{ role: 'assistant', content: firstAiMessage }]);
    setActiveChatId(null);
    setCurrentView('chat');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setChatHistory([]);
      setMessages([]);
      setActiveChatId(null);
      setStreak(0);
      setActivityMap({});
      setPerformanceStats({ totalSessions: 0, avgScore: 0, lastScore: 0, lastAccuracy: 0, lastTopic: '' });
      return;
    }

    const identifier = user.id || user.email;
    const historyKey = getHistoryStorageKey(user);
    if (!historyKey) {
      setChatHistory([]);
      return;
    }

    try {
      const savedHistory = localStorage.getItem(historyKey);
      const parsed = savedHistory ? JSON.parse(savedHistory) : [];
      setChatHistory(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      setChatHistory([]);
    }

    // Load performance stats
    const statsKey = `perfStats:${identifier}`;
    try {
      const savedStats = localStorage.getItem(statsKey);
      if (savedStats) setPerformanceStats(JSON.parse(savedStats));
    } catch(e){}

    // Load activity map
    const activityKey = `activity:${identifier}`;
    try {
      const savedActivity = localStorage.getItem(activityKey);
      if (savedActivity) setActivityMap(JSON.parse(savedActivity));
    } catch(e){}

    // Streak logic
    const streakKey = `streak:${identifier}`;
    try {
      const savedStreak = JSON.parse(localStorage.getItem(streakKey) || '{}');
      const today = new Date().setHours(0, 0, 0, 0);
      let currentStreak = savedStreak.count || 0;
      
      if (savedStreak.lastActiveDate) {
         const diffTime = today - savedStreak.lastActiveDate;
         const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
         if (diffDays === 1) {
            currentStreak += 1;
         } else if (diffDays > 1) {
            currentStreak = 1;
         }
      } else {
         currentStreak = 1; // First time
      }
      
      setStreak(currentStreak);
      localStorage.setItem(streakKey, JSON.stringify({ count: currentStreak, lastActiveDate: today }));
    } catch (e) {
      setStreak(1);
    }

    setMessages([]);
    setActiveChatId(null);
    setCurrentView('dashboard');
  }, [user]);

  useEffect(() => {
    const historyKey = getHistoryStorageKey(user);

    if (messages.length > 0 && historyKey) {
      let currentId = activeChatId;
      if (!currentId) {
        currentId = Date.now().toString();
        setActiveChatId(currentId);
      }

      let titleString = `Chat: ${topic}`;
      if (isMock && mockContext?.role) {
        titleString = `Mock: ${mockContext.role}`;
      } else if (currentView === 'practice') {
        titleString = `Practice: ${topic}`;
      }

      const chatObj = {
        id: currentId,
        title: titleString,
        topic,
        difficulty,
        isMock,
        role: mockContext?.role || null,
        skills: mockContext?.skills || null,
        usedFallback: mockContext?.usedFallback || false,
        messages,
        timestamp: Date.now()
      };

      setChatHistory(prev => {
        const existingIdx = prev.findIndex(c => c.id === currentId);
        let updated;
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = chatObj;
        } else {
          updated = [chatObj, ...prev];
        }
        
        updated.sort((a,b) => b.timestamp - a.timestamp);
        const sliced = updated.slice(0, 10);
        localStorage.setItem(historyKey, JSON.stringify(sliced));
        return sliced;
      });
    }
  }, [messages, activeChatId, currentView, difficulty, isMock, mockContext, topic, user]);

  const loadChat = (id) => {
    const chat = chatHistory.find(c => c.id === id);
    if (chat) {
      setMessages(chat.messages);
      setTopic(chat.topic);
      setDifficulty(chat.difficulty);
      setIsMock(chat.isMock || false);
      setMockContext(
        chat.role
          ? {
              role: chat.role,
              skills: chat.skills || '',
              usedFallback: Boolean(chat.usedFallback)
            }
          : null
      );
      setActiveChatId(chat.id);
      setCurrentView('chat');
    }
  };

  const completeSession = (score, accuracy, topicPracticed) => {
    const identifier = user?.id || user?.email;
    if (!identifier) return;

    setPerformanceStats(prev => {
      const newTotal = prev.totalSessions + 1;
      const newAvgScore = Math.round(((prev.avgScore * prev.totalSessions) + score) / newTotal);
      
      const newStats = {
        totalSessions: newTotal,
        avgScore: newAvgScore,
        lastScore: score,
        lastAccuracy: accuracy,
        lastTopic: topicPracticed || topic
      };
      
      localStorage.setItem(`perfStats:${identifier}`, JSON.stringify(newStats));
      return newStats;
    });

    const dateStr = new Date().toISOString().split('T')[0];
    setActivityMap(prev => {
      const updated = { ...prev, [dateStr]: (prev[dateStr] || 0) + 1 };
      localStorage.setItem(`activity:${identifier}`, JSON.stringify(updated));
      return updated;
    });
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setIsMock(false);
    setMockContext(null);
    setCurrentView('dashboard');
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setChatHistory([]);
    setMessages([]);
    setActiveChatId(null);
    setIsMock(false);
    setMockContext(null);
    setUser(null);
    setCurrentView('dashboard');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <Sidebar 
        topic={topic} 
        handleSelectTopic={handleSelectTopic} 
        currentView={currentView}
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        loadChat={loadChat}
        startNewChat={startNewChat}
        user={user}
      />
      {currentView === 'dashboard' && (
        <Dashboard 
          username={user.name} 
          topic={topic} 
          setCurrentView={setCurrentView} 
          streak={streak}
          performanceStats={performanceStats}
          chatHistory={chatHistory}
          loadChat={loadChat}
        />
      )}
      {currentView === 'chat' && (
        <ChatWindow 
          topic={topic}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          messages={messages}
          setMessages={setMessages}
          isMock={isMock}
          mockContext={mockContext}
          username={user?.name}
          setCurrentView={setCurrentView}
          completeSession={completeSession}
        />
      )}
      {currentView === 'mockSetup' && (
        <MockInterviewSetup 
          onStartMock={handleStartMock} 
        />
      )}
      {currentView === 'practice' && (
        <PracticeMode />
      )}
      {currentView === 'profile' && (
        <Profile user={user} streak={streak} performanceStats={performanceStats} activityMap={activityMap} />
      )}
    </>
  );
}

export default App;
