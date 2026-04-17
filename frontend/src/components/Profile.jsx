import React, { useMemo, useState } from 'react';

function Profile({ user, streak, performanceStats, activityMap = {} }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const activityDates = Object.keys(activityMap).sort((a, b) => b.localeCompare(a));
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - 6);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const sessionsThisWeek = activityDates.reduce((total, date) => {
    const dt = new Date(date);
    return dt >= startOfWeek ? total + (activityMap[date] || 0) : total;
  }, 0);

  const sessionsThisMonth = activityDates.reduce((total, date) => {
    const dt = new Date(date);
    return dt >= startOfMonth ? total + (activityMap[date] || 0) : total;
  }, 0);

  const activeDays = activityDates.length;
  const lastActiveDate = activityDates[0] || 'No activity yet';

  const yearlyColumns = useMemo(() => {
    const totalDays = 371; // 53 weeks for a full-year style calendar map
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - totalDays + 1);

    const columns = [];
    for (let week = 0; week < 53; week++) {
      const weekCells = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + week * 7 + day);
        const dateStr = date.toISOString().split('T')[0];
        weekCells.push({
          date: dateStr,
          weekday: date.toLocaleDateString(undefined, { weekday: 'long' }),
          displayDate: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          monthName: date.toLocaleDateString(undefined, { month: 'short' }),
          count: activityMap[dateStr] || 0,
        });
      }
      columns.push(weekCells);
    }
    return columns;
  }, [activityMap]);

  const monthLabels = useMemo(() => {
    const labels = [];
    let prevMonth = '';
    yearlyColumns.forEach((weekCells, idx) => {
      const firstDay = weekCells[0];
      if (!firstDay) return;
      if (firstDay.monthName !== prevMonth) {
        labels.push({ index: idx, month: firstDay.monthName });
        prevMonth = firstDay.monthName;
      }
    });
    return labels;
  }, [yearlyColumns]);

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
          <div className="z-10">
            <h2 className="text-3xl font-bold">{user?.name}</h2>
            <p className="text-text-secondary mt-1">{user?.email}</p>
            <div className="mt-4 flex gap-3">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-blue-300 rounded-full border border-blue-500/30">
                CodePilot Learner
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

              <div className="ml-8 mb-2 flex h-4 min-w-max relative">
                {monthLabels.map((label) => (
                  <span
                    key={`${label.month}-${label.index}`}
                    className="absolute text-[10px] text-text-secondary/80"
                    style={{ left: `${label.index * 14}px` }}
                  >
                    {label.month}
                  </span>
                ))}
              </div>

            <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2" onMouseMove={handleCellMouseMove}>
              <div className="flex flex-col justify-between text-[10px] text-text-secondary/80 py-0.5 pr-1 min-w-[24px]">
                <span>Sun</span>
                <span>Tue</span>
                <span>Thu</span>
                <span>Sat</span>
              </div>
              <div className="flex gap-1.5 min-w-max">
                {yearlyColumns.map((weekCells, idx) => (
                  <div key={`week-${idx}`} className="flex flex-col gap-1.5">
                    {weekCells.map((dayCell) => (
                      <div
                        key={dayCell.date}
                        className={`w-3.5 h-3.5 rounded-[4px] transition-smooth hover:scale-110 ${getStreakCellClass(dayCell.count)}`}
                        onMouseEnter={() => setHoveredCell(dayCell)}
                        onMouseLeave={() => setHoveredCell(null)}
                      />
                    ))}
                  </div>
                ))}
              </div>
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
