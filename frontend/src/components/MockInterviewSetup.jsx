import React, { useState } from 'react';
import axios from 'axios';

function MockInterviewSetup({ onStartMock }) {
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [resume, setResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !skills || !resume) return;
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/mock', {
        role, skills, resume
      });
      onStartMock(response.data.reply, { role, skills });
    } catch(err) {
      console.error(err);
      alert("Error starting mock session. Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="ml-64 flex-1 flex flex-col items-center justify-center relative bg-surface overflow-y-auto text-on-surface h-screen p-8">
      <div className="w-full max-w-2xl bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 shadow-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-secondary to-secondary-container flex items-center justify-center shadow-lg shadow-secondary/20">
             <span className="material-symbols-outlined text-on-secondary" style={{fontVariationSettings: "'FILL' 1"}}>work</span>
          </div>
          <div>
            <h2 className="text-2xl font-['Space_Grotesk'] font-bold text-primary">Mock Interview Setup</h2>
            <p className="text-slate-400 text-sm mt-1">Configure an intelligent, resume-driven technical interview simulation.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Role</label>
             <input disabled={isLoading} value={role} onChange={e=>setRole(e.target.value)} required type="text" placeholder="e.g. Senior Frontend Engineer" className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"/>
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Key Skills</label>
             <input disabled={isLoading} value={skills} onChange={e=>setSkills(e.target.value)} required type="text" placeholder="e.g. React, Node.js, System Design" className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"/>
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Resume / Experience Summary</label>
             <textarea disabled={isLoading} value={resume} onChange={e=>setResume(e.target.value)} required rows="6" placeholder="Paste your resume or list your projects here..." className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 custom-scrollbar resize-none"></textarea>
           </div>
           
           <button disabled={isLoading} type="submit" className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-3.5 rounded-lg active:scale-[0.98] duration-150 flex items-center justify-center shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all mt-4 disabled:opacity-75 disabled:cursor-wait">
             {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin mr-3"></div>
                  Initializing AI Interviewer...
                </>
             ) : (
                <>
                  <span className="material-symbols-outlined mr-2">precision_manufacturing</span>
                  Start Mock Interview
                </>
             )}
           </button>
        </form>
      </div>
    </main>
  );
}

export default MockInterviewSetup;
