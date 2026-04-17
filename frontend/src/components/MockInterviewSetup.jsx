import React, { useState } from 'react';
import apiClient from '../api/client';

function MockInterviewSetup({ onStartMock }) {
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !skills || !resumeFile) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('role', role);
      formData.append('skills', skills);
      formData.append('resumeFile', resumeFile);

      const response = await apiClient.post('/api/mock', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onStartMock(response.data.reply, {
        role,
        skills,
        usedFallback: Boolean(response.data.fallback)
      });
    } catch(err) {
      const backendMessage = err?.response?.data?.error;
      console.error('Error starting mock session:', err);
      alert(backendMessage || 'Error starting mock session. Check console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="ml-64 flex-1 flex flex-col items-center justify-center relative bg-bg-primary overflow-y-auto text-text-primary h-screen p-8">
      <div className="w-full max-w-2xl glass-effect p-8 rounded-2xl border border-text-secondary/20 shadow-soft">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-green to-accent-cyan flex items-center justify-center shadow-lg shadow-blue-500/30">
             <span className="material-symbols-outlined text-white" style={{fontVariationSettings: "'FILL' 1"}}>work</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Mock Interview Setup</h2>
            <p className="text-text-secondary/70 text-sm mt-1">Configure an intelligent, resume-driven technical interview simulation.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
           <div>
             <label className="block text-xs font-bold text-text-secondary/60 uppercase tracking-widest mb-2">Target Role</label>
             <input disabled={isLoading} value={role} onChange={e=>setRole(e.target.value)} required type="text" placeholder="e.g. Senior Frontend Engineer" className="w-full bg-bg-primary/70 border border-text-secondary/20 rounded-lg p-3 text-text-primary focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 focus:shadow-glow-blue outline-none transition-all duration-200 placeholder:text-text-secondary/50 disabled:opacity-50"/>
           </div>
           <div>
             <label className="block text-xs font-bold text-text-secondary/60 uppercase tracking-widest mb-2">Key Skills</label>
             <input disabled={isLoading} value={skills} onChange={e=>setSkills(e.target.value)} required type="text" placeholder="e.g. React, Node.js, System Design" className="w-full bg-bg-primary/70 border border-text-secondary/20 rounded-lg p-3 text-text-primary focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 focus:shadow-glow-blue outline-none transition-all duration-200 placeholder:text-text-secondary/50 disabled:opacity-50"/>
           </div>
           <div>
             <label className="block text-xs font-bold text-text-secondary/60 uppercase tracking-widest mb-2">Resume Upload (PDF/DOCX/TXT)</label>
             <div className="relative">
               <input 
                 disabled={isLoading} 
                 onChange={e => setResumeFile(e.target.files[0])} 
                 required 
                 type="file" 
                 accept=".pdf,.doc,.docx,.txt"
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait z-10"
               />
               <div className={`w-full bg-bg-primary/70 border-2 border-dashed ${resumeFile ? 'border-blue-400/60 shadow-glow-blue shadow-blue-400/20' : 'border-text-secondary/30'} rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-200`}>
                 <span className={`material-symbols-outlined mb-2 ${resumeFile ? 'text-blue-300' : 'text-text-secondary/50'}`} style={{fontSize: '32px'}}>
                   {resumeFile ? 'check_circle' : 'upload_file'}
                 </span>
                 <p className={`font-medium ${resumeFile ? 'text-blue-300' : 'text-text-primary'}`}>
                   {resumeFile ? resumeFile.name : 'Click or drag file to upload'}
                 </p>
                 {!resumeFile && <p className="text-xs text-text-secondary/50 mt-1">Supports PDF, DOCX, TXT</p>}
               </div>
             </div>
           </div>
           
           <button disabled={isLoading} type="submit" className="w-full bg-gradient-to-r from-accent-green to-accent-cyan text-text-primary font-bold py-3.5 rounded-lg active:scale-[0.98] duration-150 flex items-center justify-center shadow-lg shadow-accent-green/30 hover:shadow-glow-green hover:shadow-accent-green/40 hover:-translate-y-0.5 transition-all mt-4 disabled:opacity-60 disabled:cursor-wait group">
             {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-text-primary/30 border-t-text-primary rounded-full animate-spin mr-3"></div>
                  Initializing AI Interviewer...
                </>
             ) : (
                <>
                  <span className="material-symbols-outlined mr-2 group-hover:scale-110 transition-transform duration-200">precision_manufacturing</span>
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
