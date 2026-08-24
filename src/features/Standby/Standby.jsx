import React, { useState, useEffect } from 'react';

const Standby = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  const month = time.getMonth();
  const year = time.getFullYear();
  const today = time.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <div
      className="fixed inset-0 bg-black z-[99999] flex items-center justify-center font-main text-white cursor-none overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center justify-center sm:gap-8 md:gap-16 lg:gap-24 w-full max-w-[1400px] p-6 h-full">
        {/* Clock Section */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-h-[40%] md:max-h-full">
          <AnalogClock time={time} />
        </div>

        {/* Calendar Section */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[320px] sm:max-w-[400px] md:max-w-none">
          <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#ff3b30] mb-4 sm:mb-6 md:mb-8 w-full text-left tracking-[0.2em] font-main">
            {monthNames[month]}
          </div>
          <div className="grid grid-cols-7 gap-x-2 sm:gap-x-4 gap-y-2 sm:gap-y-3 w-full">
            {dayNames.map((day, idx) => (
              <div key={`name-${idx}`} className="text-[#888] font-bold text-lg sm:text-xl md:text-2xl text-center pb-1 sm:pb-2 font-main">{day}</div>
            ))}
            {calendarDays.map((day, idx) => (
              <div
                key={`day-${idx}`}
                className={`h-8 sm:h-10 md:h-14 flex items-center justify-center text-xl sm:text-2xl md:text-3xl relative ${day === null ? 'invisible' : ''}`}
              >
                <span className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 font-main ${day === today ? 'bg-[#ff3b30] text-white' : ''}`}>
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AnalogClock = ({ time }) => {
  const s = time.getSeconds();
  const m = time.getMinutes();
  const h = time.getHours();

  const sDeg = s * 6;
  const mDeg = m * 6 + s * 0.1;
  const hDeg = (h % 12) * 30 + m * 0.5;

  return (
    <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] select-none">
      <div className="w-full h-full relative">
        {/* Ticks */}
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 w-0.5 h-full -ml-[1px]"
            style={{ transform: `rotate(${i * 6}deg)` }}
          >
            <div className={`absolute top-0 left-0 w-full ${i % 5 === 0
              ? 'h-[4%] bg-white w-[3px] sm:w-[4px] md:w-[5px] -ml-[1px] sm:-ml-[1.5px]'
              : 'h-[2%] bg-[#555]'
              }`} />
          </div>
        ))}

        {/* Numbers */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const r = 38; // Reduced radius to shift numbers closer to the center
          const x = 50 + r * Math.sin(angle);
          const y = 50 - r * Math.cos(angle);
          return (
            <div
              key={num}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-main text-white"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {num}
            </div>
          );
        })}

        {/* Hands */}
        <div
          className="absolute bottom-1/2 left-1/2 w-[1.5%] h-[28%] bg-white -ml-[0.75%] origin-bottom z-[2] shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
          style={{ transform: `rotate(${hDeg}deg)` }}
        />
        <div
          className="absolute bottom-1/2 left-1/2 w-[1%] h-[42%] bg-white -ml-[0.5%] origin-bottom z-[1] shadow-[2px_2px_0_rgba(0,0,0,0.5)]"
          style={{ transform: `rotate(${mDeg}deg)` }}
        />
        <div
          className="absolute bottom-1/2 left-1/2 w-[0.5%] h-[48%] bg-[#ff3b30] -ml-[0.25%] origin-bottom z-[3]"
          style={{ transform: `rotate(${sDeg}deg)` }}
        />

        {/* Center Pins */}
        <div className="absolute top-1/2 left-1/2 w-[3%] h-[3%] bg-white -translate-x-1/2 -translate-y-1/2 z-[4]" />
        <div className="absolute top-1/2 left-1/2 w-[1%] h-[1%] bg-[#ff3b30] -translate-x-1/2 -translate-y-1/2 z-[5]" />
      </div>
    </div>
  );
};

export default Standby;
