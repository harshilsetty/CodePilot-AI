import React, { useState } from 'react';
import apiClient from '../api/client';

function MockInterviewSetup({ onStartMock }) {
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [interviewerStyle, setInterviewerStyle] = useState('Standard');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role || !skills || !resumeFile) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('role', role);
      formData.append('skills', skills);
      // These additional fields can be passed optionally or handled by backend later
      formData.append('interviewerStyle', interviewerStyle);
      formData.append('difficulty', difficulty);
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
    <main className="ml-64 flex-1 bg-[#060A0F] overflow-y-auto text-slate-200 min-h-screen relative font-['Inter',sans-serif]">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.1),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.1),_transparent_50%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="max-w-6xl mx-auto px-8 py-12 relative z-10 w-full animate-fade-in">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-accent-green/20 bg-accent-green/10 text-accent-green text-[11px] font-bold uppercase tracking-widest backdrop-blur-md mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            <span>AI Simulation Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold text-white tracking-tight">
            Configure Interview
          </h1>
          <p className="mt-3 text-slate-400 font-light max-w-2xl text-lg">
            Customize your mock interview environment. Our generative AI will adopt the persona, technical bars, and context tailored to your specifics.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
          
          {/* Form Panel */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden group/card hover:border-white/10 transition-colors">
            {/* Soft inner glow */}
            <div className="absolute -inset-2 bg-gradient-to-br from-accent-green/5 to-accent-cyan/5 blur-xl pointer-events-none opacity-50 group-hover/card:opacity-100 transition-opacity duration-700"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
               <div className="space-y-1">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Target Role</label>
                 <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-green transition-colors">work</span>
                    <input disabled={isLoading} value={role} onChange={e=>setRole(e.target.value)} required type="text" placeholder="e.g. Senior Frontend Engineer" className="w-full pl-12 pr-4 py-3.5 bg-[#0A0F16] border border-white/5 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-accent-green/50 focus:bg-white/[0.03] focus:ring-1 focus:ring-accent-green/20 transition-all duration-300"/>
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Key Technical Skills</label>
                 <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-green transition-colors">code</span>
                    <input disabled={isLoading} value={skills} onChange={e=>setSkills(e.target.value)} required type="text" placeholder="e.g. React, Node.js, System Design" className="w-full pl-12 pr-4 py-3.5 bg-[#0A0F16] border border-white/5 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:border-accent-green/50 focus:bg-white/[0.03] focus:ring-1 focus:ring-accent-green/20 transition-all duration-300"/>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Difficulty Bar</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-green transition-colors pointer-events-none">stacked_bar_chart</span>
                      <select 
                        disabled={isLoading}
                        value={difficulty} 
                        onChange={e=>setDifficulty(e.target.value)}
                        className="w-full pl-12 pr-10 py-3.5 bg-[#0A0F16] border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-accent-green/50 focus:bg-white/[0.03] focus:ring-1 focus:ring-accent-green/20 transition-all duration-300 appearance-none hover:cursor-pointer"
                      >
                        <option value="Easy" className="bg-[#0A0F16] text-white py-2">Standard / Easy</option>
                        <option value="Medium" className="bg-[#0A0F16] text-white py-2">Senior / Medium</option>
                        <option value="Hard" className="bg-[#0A0F16] text-white py-2">FAANG / Hard</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_content</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Interviewer Persona</label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-green transition-colors pointer-events-none">psychology</span>
                      <select 
                        disabled={isLoading}
                        value={interviewerStyle} 
                        onChange={e=>setInterviewerStyle(e.target.value)}
                        className="w-full pl-12 pr-10 py-3.5 bg-[#0A0F16] border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-accent-green/50 focus:bg-white/[0.03] focus:ring-1 focus:ring-accent-green/20 transition-all duration-300 appearance-none hover:cursor-pointer"
                      >
                        <option value="Standard" className="bg-[#0A0F16] text-white py-2">Analytical / Direct</option>
                        <option value="Hostile" className="bg-[#0A0F16] text-white py-2">Deep dive / Stress</option>
                        <option value="Friendly" className="bg-[#0A0F16] text-white py-2">Collaborative / Helpful</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_content</span>
                    </div>
                  </div>
               </div>

               <div className="space-y-1">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Resume Document <span className="text-slate-600 normal-case tracking-normal ml-1">(PDF/DOCX/TXT)</span></label>
                 <div className="relative group mt-1">
                   <input 
                     disabled={isLoading} 
                     onChange={e => setResumeFile(e.target.files[0])} 
                     required 
                     type="file" 
                     accept=".pdf,.doc,.docx,.txt"
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait z-10"
                   />
                   <div className={`w-full bg-[#0A0F16] border border-dashed ${resumeFile ? 'border-accent-green/50 bg-accent-green/5' : 'border-white/20 group-hover:border-accent-green/30 group-hover:bg-white/[0.02]'} rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-inner`}>
                     <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${resumeFile ? 'bg-accent-green/20 text-accent-green scale-110' : 'bg-white/5 text-slate-400 group-hover:bg-accent-green/10 group-hover:text-accent-green'}`}>
                       <span className={`material-symbols-outlined text-3xl transition-transform ${resumeFile ? 'scale-110 drop-shadow-md' : ''}`}>
                         {resumeFile ? 'task_alt' : 'cloud_upload'}
                       </span>
                     </div>
                     <p className={`font-semibold text-sm ${resumeFile ? 'text-accent-green' : 'text-slate-300 group-hover:text-white transition-colors'}`}>
                       {resumeFile ? resumeFile.name : 'Click or drop your resume here'}
                     </p>
                     {!resumeFile && <p className="text-xs text-slate-500 mt-2 font-light">Max size: 5MB</p>}
                   </div>
                 </div>
               </div>
               
               <button disabled={isLoading} type="submit" className="w-full mt-4 bg-white text-[#060A0F] font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative border border-white">
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#060A0F]/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                 {isLoading ? (
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="w-4 h-4 border-2 border-[#060A0F]/20 border-t-[#060A0F] rounded-full animate-spin"></span>
                      <span>Provisioning AI Environment...</span>
                    </div>
                 ) : (
                    <div className="flex items-center space-x-2 text-sm relative z-10">
                      <span>Launch Interview Terminal</span>
                      <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 group-hover/btn:text-accent-green transition-all">arrow_forward</span>
                    </div>
                 )}
               </button>
            </form>
          </div>

          {/* Configuration Summary / Rules */}
          <div className="hidden xl:flex flex-col space-y-4">
            <div className="bg-[#13171D] border border-white/5 rounded-2xl p-8 shadow-xl">
              <h3 className="text-white font-semibold flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-400 text-[18px]">science</span>
                </div>
                <span>Session Parameters</span>
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="mt-0.5 bg-white/5 p-1.5 rounded-md mr-4">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">timer</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-200 font-medium tracking-wide">Estimated Duration</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Mock sessions take roughly 30 - 45 minutes to complete effectively.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mt-0.5 bg-white/5 p-1.5 rounded-md mr-4">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">document_scanner</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-200 font-medium tracking-wide">Context Horizon</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">The AI parses your entire resume file prior to generating scenario questions.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mt-0.5 bg-white/5 p-1.5 rounded-md mr-4">
                     <span className="material-symbols-outlined text-slate-400 text-[18px]">grade</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-200 font-medium tracking-wide">Final Evaluation</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Upon concluding, receive a detailed metric-based performance report.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-accent-green/[0.05] to-transparent border border-accent-green/20 rounded-2xl p-6 relative overflow-hidden group hover:border-accent-green/40 transition-colors">
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/10 rounded-bl-full blur-2xl"></div>
               <div className="relative z-10 flex items-center space-x-3 text-accent-green mb-3">
                 <span className="material-symbols-outlined text-[20px] animate-pulse">tips_and_updates</span>
                 <span className="font-semibold text-sm tracking-wide">Pro Tip</span>
               </div>
               <p className="relative z-10 text-xs text-slate-400 leading-relaxed max-w-sm">
                 Treat this like a real technical interview. Use the integrated code editor to write compilable tests and <span className="text-slate-300 font-medium">narrate your thought process</span> in the chat.
               </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default MockInterviewSetup;
