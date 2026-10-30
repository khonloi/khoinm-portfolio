import React, { memo } from 'react';
import winInternationalIcon from '../../../assets/icons/win-international.ico';
import type { NewsArticle } from '../useNews';
import { HOME_PAGE_ID } from '../hooks/useBrowserHistory';

export interface HomePageProps {
  articles: NewsArticle[];
  onNavigate: (pageId: string | number) => void;
}

export const HomePage = memo<HomePageProps>(({ articles, onNavigate }) => {
  const categories = [
    'Revolutionary Activities',
    'Politics',
    'Economy',
    'Social',
    'Military',
    'International',
    'South Korea',
  ];

  return (
    <div className="flex flex-col bg-windows-white min-h-full font-main">
      {/* Sticky Header & Date Line */}
      <div className="sticky top-0 z-30 bg-windows-white border-b border-windows-grey-dark">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-windows-white gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col cursor-pointer" onClick={() => onNavigate(HOME_PAGE_ID)}>
              <h1 className="m-0 text-4xl font-black italic text-[#800000] tracking-tighter leading-none flex items-center">
                JAJON <span className="bg-[#800000] text-white px-1.5 not-italic ml-4">SINMUN</span>
              </h1>
              <p className="m-0 text-xs font-bold text-windows-grey-dark uppercase tracking-[0.2em] mt-1.5 whitespace-nowrap">
                Self-Reliance Daily News
              </p>
            </div>
          </div>
          <div className="flex-1 max-w-full sm:max-w-[500px] h-[85px] border border-windows-grey-dark bg-[#f8f8f8] flex items-center p-4 relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center">
                <img src={winInternationalIcon} className="w-9 h-9 object-contain" alt="" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-[#800000] leading-none uppercase">LATEST UPDATES DAILY</span>
                <span className="text-xs font-bold text-windows-grey-dark leading-none mt-2 tracking-wide">
                  {(() => {
                    const now = new Date();
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const months = [
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ];
                    const dayOfWeek = days[now.getDay()];
                    const monthName = months[now.getMonth()];
                    const day = now.getDate();
                    const year = now.getFullYear();
                    let juche = year - 2003;
                    if (now.getMonth() > 9 || (now.getMonth() === 9 && day >= 19)) juche += 1;
                    return `${dayOfWeek}, ${monthName} ${day}, Jajonsim ${juche} (${year})`;
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row min-h-0 relative">
        {/* Sticky Left Sidebar */}
        <aside className="w-full md:w-[180px] bg-[#004080] shrink-0 md:sticky overflow-y-auto scrollbar-none border-r border-windows-grey-dark z-20">
          <nav className="flex flex-col">
            {categories.map((cat, idx) => (
              <a
                key={cat}
                className={`px-4 py-2.5 text-windows-white font-bold text-sm border-b border-[#ffffff15] hover:bg-windows-blue-bright cursor-pointer ${
                  idx === 0 ? 'bg-[#800000]' : ''
                }`}
              >
                {cat}
              </a>
            ))}
          </nav>

          <div className="p-3 space-y-4 bg-[#004080]">
            {/* Weather */}
            <div className="bg-[#c0c0c0] border border-windows-grey-dark text-xs font-main">
              <div className="bg-[#808080] text-white px-2 py-1 font-bold uppercase tracking-wider text-[10px]">Weather</div>
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-windows-grey-dark">
                    <td className="px-2 py-1.5">Pyongyang</td>
                    <td className="px-2 py-1.5 text-right font-black">18-24°C</td>
                  </tr>
                  <tr className="border-b border-windows-grey-dark">
                    <td className="px-2 py-1.5">Kaesong</td>
                    <td className="px-2 py-1.5 text-right font-black">17-23°C</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1.5">Wonsan</td>
                    <td className="px-2 py-1.5 text-right font-black">16-25°C</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Production Stats */}
            <div className="bg-[#c0c0c0] border border-windows-grey-dark text-xs font-main">
              <div className="bg-[#808080] text-white px-2 py-1 font-bold uppercase tracking-wider text-[10px]">Production</div>
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-windows-grey-dark">
                    <td className="px-2 py-1.5 uppercase font-bold text-[10px]">Steel</td>
                    <td className="px-2 py-1.5 text-right font-black italic border-l border-windows-grey-dark">112%</td>
                  </tr>
                  <tr className="border-b border-windows-grey-dark">
                    <td className="px-2 py-1.5 uppercase font-bold text-[10px]">Coal</td>
                    <td className="px-2 py-1.5 text-right font-black italic border-l border-windows-grey-dark">108%</td>
                  </tr>
                  <tr className="bg-[#004080] text-white">
                    <td className="px-2 py-1.5 font-bold uppercase text-[9px]">Growth</td>
                    <td className="px-2 py-1.5 text-right font-black">+5.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </aside>

        {/* Main Content Areas */}
        <main className="flex-1 p-6 md:p-10 bg-windows-white">
          {articles.length > 0 && (
            <div className="max-w-[860px] mx-auto space-y-12">
              {/* Featured Section */}
              <section className="flex flex-col border-b-2 border-[#800000] pb-10">
                <h3 className="text-[#ff0000] font-bold text-sm mb-3 uppercase tracking-tight font-main">Leadership Activities:</h3>
                <h2
                  className="text-2xl font-black text-windows-black leading-tight hover:underline cursor-pointer mb-4 decoration-[#808080]"
                  onClick={() => onNavigate((articles[0]._id ?? articles[0].id) || '')}
                >
                  {articles[0].title}
                </h2>
                <p className="text-base italic text-[#333333] mb-6 leading-relaxed font-medium">
                  "{articles[0].summary}" — Reports from our correspondents on the field detailing the latest progress.
                </p>
                <div className="flex justify-end">
                  <span
                    className="text-sm text-[#000080] hover:underline cursor-pointer font-black uppercase tracking-tighter"
                    onClick={() => onNavigate((articles[0]._id ?? articles[0].id) || '')}
                  >
                    Read Full Report →
                  </span>
                </div>
              </section>

              {/* Sub Sections */}
              <div className="flex flex-col gap-10">
                {articles.slice(1).map((article: NewsArticle) => (
                  <article key={article._id ?? article.id} className="flex flex-col group">
                    <h3 className="text-[#800000] font-bold text-sm uppercase mb-3 border-b border-[#dddddd] w-fit pb-3 pr-6 font-main">{article.category}:</h3>
                    <div className="flex flex-col sm:flex-row gap-8">
                      <div className="flex-1">
                        <h4
                          className="text-xl font-bold text-[#000080] group-hover:underline cursor-pointer leading-tight mb-3"
                          onClick={() => onNavigate((article._id ?? article.id) || '')}
                        >
                          {article.title}
                        </h4>
                        <p className="text-base text-[#444444] leading-relaxed">
                          {article.summary}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Sticky Right Sidebar */}
        <aside className="hidden lg:flex w-[190px] flex-col p-4 gap-6 bg-windows-white shrink-0 md:sticky overflow-y-auto scrollbar-none border-2 border-[#ececec] z-20">
          <div className="flex flex-col gap-5">
            {[
              { label: 'State Radio', color: 'bg-[#fff2e6]', logo: winInternationalIcon },
              { label: 'Cultural Heritage', color: 'bg-white', border: true, accent: '#800000' },
              { label: "Workers' Paradise Hotel", color: 'bg-[#fdfdfd]', border: true, text: '#4d2600' },
              { label: 'SINMUN ONLINE', color: 'bg-[#004080]', text: 'white' },
              { label: 'VINTAGE CAFE', color: 'bg-black', text: 'white' },
            ].map((b, i) => (
              <div
                key={i}
                className={`w-full aspect-[4/3] border border-windows-grey-dark flex flex-col items-center justify-center p-3 text-center text-xs font-black leading-tight cursor-pointer hover:brightness-95 hover:scale-105 z-10 ${b.color} ${b.text === 'white' ? 'text-white' : (b.text || 'text-[#800000]')}`}
              >
                {b.logo && <img src={b.logo} className="w-6 h-6 mb-2 opacity-50" alt="" />}
                {b.label}
                <div className={`mt-2 w-full h-1 ${b.accent ? `bg-[#800000]` : 'bg-windows-grey-dark'} opacity-30`} />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
});

HomePage.displayName = 'HomePage';
export default HomePage;

