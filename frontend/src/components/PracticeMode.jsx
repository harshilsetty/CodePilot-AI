import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';

function PracticeMode() {
  const [topic, setTopic] = useState('Arrays & Hashing');
  const [difficulty, setDifficulty] = useState('Medium');
  const [type, setType] = useState('MCQ');
  
  const [isPracticing, setIsPracticing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Answering state
  const [selectedOption, setSelectedOption] = useState('');
  const [codingAnswer, setCodingAnswer] = useState('');
  
  // Evaluation state
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  
  // Tracking
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('🧠 AI is analyzing your response...');

  const accuracy = attempted > 0 ? Math.round((score / attempted) * 100) : 0;
  const performanceTag = accuracy >= 80 ? 'Excellent' : accuracy >= 50 ? 'Average' : 'Needs Improvement';
  const performanceTagClass = accuracy >= 80
    ? 'bg-green-500/10 text-green-400 border-green-500/30'
    : accuracy >= 50
      ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
      : 'bg-red-500/10 text-red-400 border-red-500/30';

  useEffect(() => {
    let timer;
    if (isPracticing && !evalResult && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !evalResult) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [isPracticing, timeLeft, evalResult]);

  const fetchNextQuestion = async () => {
    setIsLoading(true);
    setLoadingMessage('⚡ Generating next question...');
    setEvalResult(null);
    setSelectedOption('');
    setCodingAnswer('');
    setTimeLeft(60);
    try {
      const res = await apiClient.post('/api/practice', {
        topic, difficulty, type
      });
      setQuestionData(res.data);
      setIsPracticing(true);
    } catch (error) {
      console.error(error);
      alert("Failed to load question");
      setIsPracticing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = () => {
    setScore(0);
    setAttempted(0);
    setShowSummary(false);
    fetchNextQuestion();
  };

  const handleTimeUp = () => {
    handleSubmitAnswer(true);
  };

  const handleSubmitAnswer = async (isTimeUp = false) => {
    if (evalResult || evaluating) return;
    setEvaluating(true);
    setLoadingMessage('🧠 AI is analyzing your response...');
    setAttempted(prev => prev + 1);
    
    if (type === 'MCQ') {
      const isCorrect = selectedOption === questionData.answer;
      if (isCorrect) setScore(prev => prev + 1);
      
      setEvalResult({
        result: isCorrect ? 'Correct' : 'Incorrect',
        feedback: isTimeUp ? "Time's up!" : (isCorrect ? "Great job!" : `The correct answer was:\n${questionData.answer}`)
      });
      setEvaluating(false);
    } else {
      try {
        const payload = isTimeUp ? "No answer provided" : codingAnswer;
        const res = await apiClient.post('/api/practice/evaluate', {
          question: questionData.question,
          userAnswer: payload || "No answer provided"
        });
        
        if (res.data.result === 'Correct') setScore(prev => prev + 1);
        else if (res.data.result === 'Partially Correct') setScore(prev => prev + 0.5);
        
        setEvalResult(res.data);
      } catch (error) {
        console.error(error);
        setEvalResult({ result: 'Error', feedback: 'Failed to evaluate answer. Please try again later.' });
      } finally {
        setEvaluating(false);
      }
    }
  };

  if (showSummary) {
    return (
      <main className="ml-64 flex-1 flex flex-col items-center justify-center relative bg-bg-primary overflow-y-auto text-text-primary h-screen p-8">
        <div className="w-full max-w-lg glass-effect rounded-2xl shadow-soft p-8 text-center">
          <span className="material-symbols-outlined text-6xl text-accent-green mb-4" style={{fontVariationSettings: "'FILL' 1"}}>emoji_events</span>
          <h2 className="text-3xl font-['Space_Grotesk'] font-bold text-text-primary mb-2">Practice Complete</h2>
          <p className="text-text-secondary mb-6">Here's how you performed.</p>
          <div className="flex justify-around mb-8 glass-effect-sm rounded-xl p-4">
            <div>
              <p className="text-sm text-text-secondary font-bold uppercase tracking-widest">Score</p>
              <p className="text-4xl text-text-primary font-bold">{score} / {attempted}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary font-bold uppercase tracking-widest">Accuracy</p>
              <p className="text-4xl text-accent-green font-bold">{accuracy}%</p>
            </div>
          </div>
          <div className={`mb-6 inline-flex px-4 py-2 rounded-full border text-sm font-semibold ${
            accuracy >= 80 ? 'bg-green-500/10 text-green-400 border-green-500/30' :
            accuracy >= 50 ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' :
            'bg-red-500/10 text-red-400 border-red-500/30'
          }`}>
            Result: {performanceTag}
          </div>
          <button onClick={() => setShowSummary(false)} className="w-full bg-accent-green text-bg-primary font-bold py-3.5 rounded-lg active:scale-[0.98] duration-150 transition-smooth shadow-soft hover:shadow-glow-green">
            Practice Again
          </button>
          <p className="text-center text-xs text-text-secondary/60 mt-6">Powered by Generative AI • CodePilot AI v2.0</p>
        </div>
      </main>
    )
  }

  if (!isPracticing) {
    return (
      <main className="ml-64 flex-1 flex flex-col items-center justify-center relative bg-bg-primary overflow-y-auto text-text-primary h-screen p-8">
        <div className="w-full max-w-2xl glass-effect rounded-2xl shadow-soft p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-soft-green flex items-center justify-center shadow-soft shadow-accent-green/20">
               <span className="material-symbols-outlined text-bg-primary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>fitness_center</span>
            </div>
            <div>
              <h2 className="text-2xl font-['Space_Grotesk'] font-bold text-text-primary">Practice Mode</h2>
              <p className="text-text-secondary text-sm mt-1">Sharpen your skills with timed multiple-choice or coding exercises.</p>
            </div>
          </div>
          
          <div className="space-y-5">
             <div>
               <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Topic</label>
               <input value={topic} onChange={e=>setTopic(e.target.value)} type="text" className="w-full bg-bg-secondary border border-text-secondary/20 rounded-lg p-3 text-text-primary focus:border-accent-green outline-none transition-smooth placeholder:text-text-secondary/50"/>
             </div>
             <div>
               <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Difficulty</label>
               <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="w-full bg-bg-secondary border border-text-secondary/20 rounded-lg p-3 text-text-primary focus:border-accent-green outline-none transition-smooth">
                 <option value="Easy">Easy</option>
                 <option value="Medium">Medium</option>
                 <option value="Hard">Hard</option>
               </select>
             </div>
             <div>
               <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Question Type</label>
               <div className="flex space-x-4">
                 <button onClick={() => setType('MCQ')} className={`flex-1 py-3 rounded-lg border-2 font-medium transition-smooth ${type === 'MCQ' ? 'border-accent-green text-accent-green bg-accent-green/10' : 'border-text-secondary/20 text-text-secondary hover:border-text-secondary/40'}`}>MCQ</button>
                 <button onClick={() => setType('Coding')} className={`flex-1 py-3 rounded-lg border-2 font-medium transition-smooth ${type === 'Coding' ? 'border-blue-400 text-blue-400 bg-blue-500/10' : 'border-text-secondary/20 text-text-secondary hover:border-text-secondary/40'}`}>Coding</button>
               </div>
             </div>
             
             <button disabled={isLoading} onClick={handleStart} className="w-full bg-accent-green text-bg-primary font-bold py-3.5 rounded-lg active:scale-[0.98] duration-150 flex items-center justify-center mt-4 hover:bg-accent-green/90 transition-smooth shadow-soft hover:shadow-glow-green">
               {isLoading ? <div className="w-5 h-5 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin mr-3"></div> : null}
               {isLoading ? "Starting..." : "Start Practice"}
             </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ml-64 flex-1 flex flex-col items-center bg-bg-primary overflow-y-auto text-text-primary h-screen p-8">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-text-primary">{type} Practice: {topic}</h2>
          <p className="text-sm text-text-secondary">Score: {score} / {attempted} | Accuracy: {accuracy}% | Difficulty: <span className="text-accent-green font-semibold">{difficulty}</span></p>
        </div>
        <div className="flex items-center space-x-6">
          <div className={`flex items-center space-x-2 font-mono text-xl font-bold glass-effect-sm px-4 py-2 rounded-lg ${
            timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-accent-green'
          }`}>
            <span className="material-symbols-outlined">timer</span>
            <span>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
          <button onClick={() => setShowSummary(true)} className="text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-smooth border border-red-500/30">
            End Session
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl glass-effect rounded-2xl shadow-soft p-8">
        <h3 className="text-lg font-medium text-text-primary mb-6 whitespace-pre-wrap">{questionData?.question}</h3>
        
        {type === 'MCQ' && questionData?.options && (
          <div className="space-y-3 mb-6">
            {questionData.options.map((opt, i) => (
              <button 
                key={i} 
                disabled={evalResult || evaluating}
                onClick={() => setSelectedOption(opt)} 
                className={`w-full text-left p-4 rounded-xl border-2 transition-smooth ${
                  selectedOption === opt 
                    ? 'border-accent-green bg-accent-green/10 text-accent-green' 
                    : 'border-text-secondary/20 hover:border-text-secondary/40 text-text-secondary bg-bg-secondary'
                } ${
                  evalResult && opt === questionData.answer && 'border-green-500 bg-green-500/10 text-green-400'
                }
                  ${evalResult && selectedOption === opt && opt !== questionData.answer && 'border-red-500 bg-red-500/10 text-red-400'}
                `}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {type === 'Coding' && (
          <textarea 
            disabled={evalResult || evaluating}
            value={codingAnswer}
            onChange={(e) => setCodingAnswer(e.target.value)}
            placeholder="Type your solution here..." 
            className="w-full h-48 bg-bg-secondary font-mono p-4 rounded-xl border border-text-secondary/20 text-text-primary focus:border-accent-green outline-none transition-smooth mb-6 resize-none custom-scrollbar placeholder:text-text-secondary/50"
          />
        )}

        {!evalResult ? (
          <button 
            disabled={evaluating || (!selectedOption && type === 'MCQ' && timeLeft > 0)}
            onClick={() => handleSubmitAnswer()} 
            className="w-full bg-accent-green text-bg-primary font-bold py-3.5 rounded-lg active:scale-[0.98] duration-150 disabled:opacity-50 hover:bg-accent-green/90 transition-smooth shadow-soft hover:shadow-glow-green"
          >
            {evaluating ? loadingMessage : "Submit Answer"}
          </button>
        ) : (
          <div className={`p-6 rounded-xl mb-4 ${
            evalResult.result === 'Correct' ? 'bg-green-500/10 border border-green-500/30' : 
            evalResult.result === 'Partially Correct' ? 'bg-yellow-500/10 border border-yellow-500/30' : 
            'bg-red-500/10 border border-red-500/30'
          }`}>
            <h4 className={`text-xl font-bold mb-2 flex items-center ${
              evalResult.result === 'Correct' ? 'text-green-400' : 
              evalResult.result === 'Partially Correct' ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              <span className="material-symbols-outlined mr-2">
                {evalResult.result === 'Correct' ? 'check_circle' : evalResult.result === 'Partially Correct' ? 'warning' : 'cancel'}
              </span>
              {evalResult.result}
            </h4>
            <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">{evalResult.feedback}</p>
            <button disabled={isLoading} onClick={fetchNextQuestion} className="w-full mt-6 bg-bg-secondary hover:bg-bg-secondary/80 text-text-primary font-bold py-3.5 rounded-lg transition-smooth border border-text-secondary/20">
              {isLoading ? loadingMessage : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default PracticeMode;
