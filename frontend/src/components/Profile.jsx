import React, { useMemo, useState } from 'react';

const formatDateKeyLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateKeyLocal = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

function Profile({ user, streak, performanceStats, activityMap = {} }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const activityDates = Object.keys(activityMap).sort((a, b) => b.localeCompare(a));
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - 6);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const sessionsThisWeek = activityDates.reduce((total, date) => {
    const dt = parseDateKeyLocal(date);
    return dt >= startOfWeek ? total + (activityMap[date] || 0) : total;
  }, 0);

  const sessionsThisMonth = activityDates.reduce((total, date) => {
    const dt = parseDateKeyLocal(date);
    return dt >= startOfMonth ? total + (activityMap[date] || 0) : total;
  }, 0);

  const activeDays = activityDates.length;
  const lastActiveDate = activityDates[0] || 'No activity yet';

  const calendarMonths = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastYearStart = new Date(today.getFullYear() - 1, today.getMonth() + 1, 1);
    
    const months = [];
    let currentMonth = new Date(pastYearStart);
    
    for (let i = 0; i < 12; i++) {
       const year = currentMonth.getFullYear();
       const monthIndex = currentMonth.getMonth();
       
       const monthName = currentMonth.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
       
       const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
       const startDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 = Sunday
       
       const weeks = [];
       let currentWeek = Array(7).fill(null);
       let dayOfWeek = startDayOfWeek;
       
       for (let day = 1; day <= daysInMonth; day++) {
          const cellDate = new Date(year, monthIndex, day);
          const dateStr = formatDateKeyLocal(cellDate);
          const isFuture = cellDate > today;
          
          currentWeek[dayOfWeek] = {
             date: dateStr,
             dayNumber: day,
             weekday: cellDate.toLocaleDateString(undefined, { weekday: 'long' }),
             displayDate: cellDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
             count: activityMap[dateStr] || 0,
             isFuture,
          };
          
          dayOfWeek++;
          if (dayOfWeek > 6) {
             weeks.push(currentWeek);
             currentWeek = Array(7).fill(null);
             dayOfWeek = 0;
          }
       }
       if (dayOfWeek > 0) {
          weeks.push(currentWeek);
       }
       
       months.push({
          name: monthName,
          weeks
       });
       
       currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    
    return months;
  }, [activityMap]);

  const getStreakCellClass = (count) => {
    if (count === 0) return 'bg-bg-secondary border border-text-secondary/20';
    if (count === 1) return 'bg-blue-500/45 border border-blue-400/50';
    if (count === 2) return 'bg-blue-400/70 border border-blue-300/70';
    return 'bg-cyan-300 border border-cyan-200 shadow-glow-cyan';
  };

  const handleCellMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: event.clientX - bounds.left + 12,
      y: event.clientY - bounds.top + 12,
    });
  };

  return (
    <main className="ml-64 flex-1 flex flex-col items-center bg-bg-primary overflow-y-auto text-text-primary h-screen pb-20">
      <div className="w-full max-w-5xl px-8 pt-12">
        <h1 className="text-4xl font-['Space_Grotesk'] font-bold text-text-primary mb-8">Your Profile</h1>

        {/* User Banner */}
        <div className="glass-effect rounded-3xl p-8 mb-10 flex items-center gap-8 border border-text-secondary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          <div className="w-24 h-24 rounded-2xl bg-gradient-soft-green flex items-center justify-center shadow-glow-blue border border-blue-400/30 z-10 shrink-0">
            <span className="material-symbols-outlined text-blue-300 text-5xl">person</span>
          </div>
          <div className="z-10" style={{ perspective: '1000px' }}>
            <h2 className="text-3xl font-bold name-3d-animated pb-1">{user?.name}</h2>
            <p className="text-text-secondary mt-1">{user?.email}</p>
            <div className="mt-4 flex gap-3">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/30">
                PrepPilot Learner
              </span>
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/30 flex items-center gap-1">
                🔥 {streak} Day Streak
              </span>
            </div>
          </div>
        </div>

        {/* Lifetime Stats */}
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-300">query_stats</span>
          Lifetime Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass-effect rounded-2xl p-5 border border-text-secondary/10 flex flex-col justify-center text-center shadow-soft">
            <span className="text-[10px] text-text-secondary uppercase tracking-widest mb-2 font-semibold">Total Sessions</span>
            <span className="text-3xl font-bold font-['Space_Grotesk']">{performanceStats?.totalSessions || 0}</span>
          </div>
          <div className="glass-effect rounded-2xl p-5 border border-text-secondary/10 flex flex-col justify-center text-center shadow-soft">
            <span className="text-[10px] text-text-secondary uppercase tracking-widest mb-2 font-semibold">Average Score</span>
            <span className="text-3xl font-bold text-blue-300 font-['Space_Grotesk']">{performanceStats?.avgScore || 0}</span>
          </div>
          <div className="glass-effect rounded-2xl p-5 border border-text-secondary/10 flex flex-col justify-center text-center shadow-soft">
            <span className="text-[10px] text-text-secondary uppercase tracking-widest mb-2 font-semibold">Current Streak</span>
            <span className="text-3xl font-bold text-orange-400 font-['Space_Grotesk']">{streak}</span>
          </div>
          <div className="glass-effect rounded-2xl p-5 border border-text-secondary/10 flex flex-col justify-center text-center shadow-soft">
            <span className="text-[10px] text-text-secondary uppercase tracking-widest mb-2 font-semibold">Favorite Topic</span>
            <span className="text-sm font-bold text-text-primary px-2">{performanceStats?.lastTopic || 'N/A'}</span>
          </div>
        </div>

        {/* Activity Analytics */}
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-cyan-300">analytics</span>
          Activity Analytics
        </h3>
        <div className="glass-effect rounded-3xl p-6 md:p-8 border border-text-secondary/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-effect-sm rounded-2xl p-5 border border-text-secondary/10 interactive-soft">
              <p className="text-xs uppercase tracking-widest text-text-secondary">Sessions This Week</p>
              <p className="text-3xl font-bold text-blue-300 mt-2">{sessionsThisWeek}</p>
            </div>
            <div className="glass-effect-sm rounded-2xl p-5 border border-text-secondary/10 interactive-soft">
              <p className="text-xs uppercase tracking-widest text-text-secondary">Sessions This Month</p>
              <p className="text-3xl font-bold text-cyan-300 mt-2">{sessionsThisMonth}</p>
            </div>
            <div className="glass-effect-sm rounded-2xl p-5 border border-text-secondary/10 interactive-soft">
              <p className="text-xs uppercase tracking-widest text-text-secondary">Active Days</p>
              <p className="text-2xl font-bold text-text-primary mt-2">{activeDays}</p>
            </div>
            <div className="glass-effect-sm rounded-2xl p-5 border border-text-secondary/10 interactive-soft">
              <p className="text-xs uppercase tracking-widest text-text-secondary">Last Active Date</p>
              <p className="text-sm font-semibold text-text-primary mt-3">{lastActiveDate}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl glass-effect-sm border border-text-secondary/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-text-secondary">Streak Map</p>
              <p className="text-[11px] text-text-secondary/80">Date-wise yearly heat map</p>
            </div>

            <div className="relative rounded-xl border border-text-secondary/10 bg-bg-primary/20 p-3">
              {hoveredCell && (
                <div
                  className="absolute z-20 rounded-lg border border-blue-400/30 bg-slate-900/90 px-3 py-2 text-xs shadow-soft backdrop-blur-sm pointer-events-none transition-smooth"
                  style={{ left: hoverPosition.x, top: hoverPosition.y }}
                >
                  <p className="font-semibold text-blue-200">{hoveredCell.displayDate}</p>
                  <p className="text-text-secondary">{hoveredCell.weekday}</p>
                  <p className="mt-1 text-cyan-300">{hoveredCell.count} session{hoveredCell.count === 1 ? '' : 's'}</p>
                </div>
              )}

              <div className="flex gap-6 overflow-x-auto custom-scrollbar pb-4" onMouseMove={handleCellMouseMove}>
                {calendarMonths.map((month, mIdx) => (
                   <div key={`month-${mIdx}`} className="flex flex-col gap-1.5 min-w-max">
                      <div className="text-xs font-bold text-text-secondary text-center mb-1">{month.name}</div>
                      <div className="flex gap-1.5 justify-between text-[10px] text-text-secondary/80 pb-1">
                         <span className="w-4 text-center">S</span>
                         <span className="w-4 text-center">M</span>
                         <span className="w-4 text-center">T</span>
                         <span className="w-4 text-center">W</span>
                         <span className="w-4 text-center">T</span>
                         <span className="w-4 text-center">F</span>
                         <span className="w-4 text-center">S</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                         {month.weeks.map((week, wIdx) => (
                            <div key={`week-${wIdx}`} className="flex gap-1.5">
                               {week.map((cell, cIdx) => (
                                  cell ? (
                                     <div
                                        key={cell.date}
                                        className={`w-4 h-4 rounded-[4px] flex items-center justify-center text-[8px] transition-smooth ${cell.isFuture ? 'opacity-0 pointer-events-none' : `hover:scale-110 cursor-pointer ${getStreakCellClass(cell.count)}`}`}
                                        onMouseEnter={() => !cell.isFuture && setHoveredCell(cell)}
                                        onMouseLeave={() => setHoveredCell(null)}
                                     >
                                        <span className="opacity-0 hover:opacity-100 mix-blend-color-burn">{cell.dayNumber}</span>
                                     </div>
                                  ) : (
                                     <div key={`empty-${cIdx}`} className="w-4 h-4 bg-transparent" />
                                  )
                               ))}
                            </div>
                         ))}
                      </div>
                   </div>
                ))}
            </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-text-secondary/70">
                <span>Less</span>
                <div className="w-3 h-3 rounded-[3px] bg-bg-secondary border border-text-secondary/20" />
                <div className="w-3 h-3 rounded-[3px] bg-blue-500/45 border border-blue-400/50" />
                <div className="w-3 h-3 rounded-[3px] bg-blue-400/70 border border-blue-300/70" />
                <div className="w-3 h-3 rounded-[3px] bg-cyan-300 border border-cyan-200" />
                <span>More</span>
              </div>
              <p className="text-[11px] text-text-secondary/70">Hover any cell for exact date and sessions.</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default Profile;
