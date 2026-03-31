import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MockInterviewSetup from './components/MockInterviewSetup';

function App() {
  const [currentView, setCurrentView] = useState('chat');
  const [topic, setTopic] = useState('Arrays & Hashing');
  const [difficulty, setDifficulty] = useState('Medium');
  const [messages, setMessages] = useState([]);
  
  const [isMock, setIsMock] = useState(false);
  const [mockContext, setMockContext] = useState(null);

  const handleSelectTopic = (newTopic) => {
    setTopic(newTopic);
    setIsMock(false);
    setMockContext(null);
    setCurrentView('chat');
    // If you want to reset messages when switching topics:
    // setMessages([]); 
  };

  const handleStartMock = (firstAiMessage, contextInfo) => {
    setIsMock(true);
    setMockContext(contextInfo);
    setMessages([{ role: 'assistant', content: firstAiMessage }]);
    setCurrentView('chat');
  };

  return (
    <>
      <Sidebar 
        topic={topic} 
        handleSelectTopic={handleSelectTopic} 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      {currentView === 'chat' ? (
        <ChatWindow 
          topic={topic}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          messages={messages}
          setMessages={setMessages}
          isMock={isMock}
          mockContext={mockContext}
        />
      ) : (
        <MockInterviewSetup 
          onStartMock={handleStartMock} 
        />
      )}
    </>
  );
}

export default App;
