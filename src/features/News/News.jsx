import React, { useState, useCallback, useRef, memo } from "react";
import Button from "../../components/Button";
import winInternationalIcon from "../../assets/icons/Microsoft Windows 3 International.ico";
import treeIcon from "../../assets/icons/Tree.ico";
import { useNews } from "../../hooks/useNews";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PortableText } from "@portabletext/react";

// ─── Mock News Data ────────────────────────────────────────────────────────────
const MOCK_ARTICLES = [
  {
    id: 1,
    category: "Revolutionary Activities",
    title: "Respected Comrade Kim Jong Un Visits Major Industrial Complex",
    source: "KCNA",
    date: "April 14, Jajonsim 22 (2026)",
    isLeadership: true,
    summary:
      "The Respected Comrade Kim Jong Un provided field guidance to a recently modernized industrial complex, praising the workers for their heroic struggle in implementing the Party's decisions.",
    body: `The Respected Comrade Kim Jong Un, General Secretary of the Workers' Party of Korea and President of the State Affairs of the Democratic People's Republic of Korea, visited a major industrial complex that has been successfully modernized in the spirit of self-reliance.\n\nAccompanying him were senior officials of the Central Committee of the WPK and the provincial party committee. He was greeted at the complex by the leading officials and managers who have devoted themselves to the task of technical innovation and production growth.\n\nWalking through several production lines, he acquainted himself with the modernization of equipment and the quality of products. He expressed great satisfaction that the complex has built a solid foundation for mass-producing high-quality equipment using domestic resources and technology.\n\n"This success is a brilliant fruition of the heroic struggle of our workers who are boundlessly loyal to the Party's cause," he said, and set forth important tasks for further increasing production capacity and enhancing the competitive power of products.`,
  },
  {
    id: 2,
    category: "Politics",
    title: "Enthusiastic Celebration of National Sovereignty Held in Pyongyang",
    source: "Rodong Sinmun",
    date: "April 13, Jajonsim 22 (2026)",
    isLeadership: false,
    summary:
      "A grand assembly of citizens was held in the capital city to celebrate the achievements of national construction and renew their pledge of loyalty to the socialist cause.",
    body: `A grand assembly of working people from all walks of life was held at Kim Il Sung Square in Pyongyang to celebrate the historic achievements in national construction and the strengthening of sovereign rights.\n\nThe square was packed with crowds holding colorful flags and placards. Officials from the government and social organizations addressed the assembly, highlighting the rapid progress made in various fields of the national economy and defense under the guidance of the Workers' Party of Korea.\n\nSpeakers emphasized that the power of the DPRK lies in the single-hearted unity of the people around their leader. They called on all citizens to strive for even greater wonders in the upcoming period of the five-year plan for national economic development.\n\nThe assembly concluded with a vibrant demonstration and a pledge of loyalty, echoing with slogans of eternal struggle for the prosperity of the fatherland.`,
  },
  {
    id: 3,
    category: "Economy",
    title: "New Irrigation Systems Completed in Major Agricultural Regions",
    source: "KCNA",
    date: "April 12, Jajonsim 22 (2026)",
    isLeadership: false,
    summary:
      "Agricultural workers in South Hwanghae Province have completed the installation of new irrigation networks, ensuring stable harvests despite challenging weather conditions.",
    body: `Massive irrigation projects have been successfully completed in the vast agricultural regions of South Hwanghae Province, providing a secure foundation for another record-breaking harvest this year.\n\nThe construction workers and local farmers, through a display of the Chollima spirit, laid hundreds of kilometers of new water channels and built dozens of pumping stations in a short span of time. These systems will significantly reduce the impact of drought and ensure a steady water supply to thousands of hectares of paddy fields.\n\nThe completion of these projects is part of the national strategy to modernize agriculture and achieve complete self-sufficiency in food production. A celebration was held onsite, where medals and commendations were awarded to those who distinguished themselves during the construction.`,
  },
];

const HOME_PAGE_ID = "home";

// ─── Page Components ──────────────────────────────────────────────────────────

const HomePage = memo(({ articles, onNavigate }) => {
  const categories = [
    "Revolutionary Activities", "Politics", "Economy", "Social", "Military", "International", "South Korea"
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
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
                className={`px-4 py-2.5 text-windows-white font-bold text-sm border-b border-[#ffffff15] hover:bg-windows-blue-bright cursor-pointer ${idx === 0 ? "bg-[#800000]" : ""}`}
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
                  onClick={() => onNavigate(articles[0]._id ?? articles[0].id)}
                >
                  {articles[0].title}
                </h2>
                <p className="text-base italic text-[#333333] mb-6 leading-relaxed font-medium">
                  "{articles[0].summary}" — Reports from our correspondents on the field detailing the latest progress.
                </p>
                <div className="flex justify-end">
                  <span
                    className="text-sm text-[#000080] hover:underline cursor-pointer font-black uppercase tracking-tighter"
                    onClick={() => onNavigate(articles[0]._id ?? articles[0].id)}
                  >
                    Read Full Report →
                  </span>
                </div>
              </section>

              {/* Sub Sections */}
              <div className="flex flex-col gap-10">
                {articles.slice(1).map((article, i) => (
                  <article key={article._id ?? article.id} className="flex flex-col group">
                    <h3 className="text-[#800000] font-bold text-sm uppercase mb-3 border-b border-[#dddddd] w-fit pb-3 pr-6 font-main">{article.category}:</h3>
                    <div className="flex flex-col sm:flex-row gap-8">
                      <div className="flex-1">
                        <h4
                          className="text-xl font-bold text-[#000080] group-hover:underline cursor-pointer leading-tight mb-3"
                          onClick={() => onNavigate(article._id ?? article.id)}
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
              { label: "State Radio", color: "bg-[#fff2e6]", logo: winInternationalIcon },
              { label: "Cultural Heritage", color: "bg-white", border: true, accent: "#800000" },
              { label: "Workers' Paradise Hotel", color: "bg-[#fdfdfd]", border: true, text: "#4d2600" },
              { label: "SINMUN ONLINE", color: "bg-[#004080]", text: "white" },
              { label: "VINTAGE CAFE", color: "bg-black", text: "white" }
            ].map((b, i) => (
              <div
                key={i}
                className={`w-full aspect-[4/3] border border-windows-grey-dark flex flex-col items-center justify-center p-3 text-center text-xs font-black leading-tight cursor-pointer hover:brightness-95 hover:scale-105 z-10 ${b.color} ${b.text === 'white' ? 'text-white' : (b.text || 'text-[#800000]')}`}
              >
                {b.logo && <img src={b.logo} className="w-6 h-6 mb-2 opacity-50" alt="" />}
                {b.label}
                <div className={`mt-2 w-full h-1 ${b.accent ? `bg-[#800000]` : 'bg-windows-grey-dark'} opacity-30`}></div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
});
HomePage.displayName = "HomePage";

const ArticlePage = memo(({ article, onNavigate }) => (
  <div className="p-6 max-w-[760px]">
    <button
      className="inline-block mb-4 text-sm text-[#000080] bg-transparent border-none p-0 cursor-pointer underline hover:text-[#800000] font-main"
      onClick={() => onNavigate(HOME_PAGE_ID)}
    >
      ← Back to News
    </button>
    <span className="block text-xs font-bold text-windows-white bg-windows-blue-bright px-1 py-0.5 mb-2 w-fit uppercase tracking-wider">
      {article.category}
    </span>
    <h1 className={`m-0 mt-2 mb-2 text-2xl font-bold leading-snug ${article.isLeadership ? "text-[#ff0000]" : "text-windows-black"}`}>
      {article.title}
    </h1>
    <div className="text-sm text-windows-grey-dark mb-3">
      {article.source} &middot; {article.date}
    </div>
    <div className="text-base leading-relaxed text-windows-black news-markdown">
      {typeof article.body === 'string' ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-6 mb-3 border-b border-windows-grey-dark pb-1" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-5 mb-2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-base font-bold mt-4 mb-2" {...props} />,
            p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4 space-y-1" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4 space-y-1" {...props} />,
            li: ({ node, ...props }) => <li className="pl-1" {...props} />,
            a: ({ node, ...props }) => <a className="text-[#000080] underline hover:text-[#800000]" target="_blank" rel="noopener noreferrer" {...props} />,
            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-windows-grey-dark pl-4 italic my-4" {...props} />,
            code: ({ node, inline, ...props }) =>
              inline ?
                <code className="bg-windows-grey px-1 rounded-sm" {...props} /> :
                <code className="block bg-windows-grey p-3 rounded-sm border border-windows-grey-dark overflow-x-auto my-4" {...props} />,
            hr: ({ node, ...props }) => <hr className="border-windows-grey-dark my-6" {...props} />,
          }}
        >
          {article.body}
        </ReactMarkdown>
      ) : (
        <PortableText
          value={article.body}
          components={{
            block: {
              h1: ({ children }) => <h1 className="text-xl font-bold mt-6 mb-3 border-b border-windows-grey-dark pb-1">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold mt-5 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-bold mt-4 mb-2">{children}</h3>,
              normal: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
              blockquote: ({ children }) => <blockquote className="border-l-4 border-windows-grey-dark pl-4 italic my-4">{children}</blockquote>,
            },
            list: {
              bullet: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>,
              number: ({ children }) => <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>,
            },
            listItem: {
              bullet: ({ children }) => <li className="pl-1">{children}</li>,
              number: ({ children }) => <li className="pl-1">{children}</li>,
            },
            marks: {
              link: ({ children, value }) => (
                <a className="text-[#000080] underline hover:text-[#800000]" href={value.href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              code: ({ children }) => <code className="bg-windows-grey px-1 rounded-sm">{children}</code>,
            },
          }}
        />
      )}
    </div>
  </div>
));
ArticlePage.displayName = "ArticlePage";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ForwardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const News = memo(() => {
  const [history, setHistory] = useState([HOME_PAGE_ID]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isNavLoading, setIsNavLoading] = useState(false);
  const contentRef = useRef(null);

  // ── Sanity data ─────────────────────────────────────────────────────────────
  const {
    articles,
    isLoading: isFetching,
    error,
    refetch,
  } = useNews(MOCK_ARTICLES);

  const isLoading = isNavLoading || isFetching;

  const currentPageId = history[historyIndex];
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const simulateLoad = useCallback((callback) => {
    setIsNavLoading(true);
    setTimeout(() => { callback(); setIsNavLoading(false); }, 300);
  }, []);

  const navigate = useCallback((pageId) => {
    simulateLoad(() => {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), pageId]);
      setHistoryIndex((prev) => prev + 1);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    });
  }, [historyIndex, simulateLoad]);

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    simulateLoad(() => {
      setHistoryIndex((prev) => prev - 1);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    });
  }, [canGoBack, simulateLoad]);

  const goForward = useCallback(() => {
    if (!canGoForward) return;
    simulateLoad(() => {
      setHistoryIndex((prev) => prev + 1);
      if (contentRef.current) contentRef.current.scrollTop = 0;
    });
  }, [canGoForward, simulateLoad]);

  const goHome = useCallback(() => {
    if (currentPageId !== HOME_PAGE_ID) navigate(HOME_PAGE_ID);
  }, [currentPageId, navigate]);

  const refresh = useCallback(() => {
    refetch();
    simulateLoad(() => { if (contentRef.current) contentRef.current.scrollTop = 0; });
  }, [refetch, simulateLoad]);

  const renderPage = () => {
    // Sanity initial-fetch loading placeholder removed


    // Error state
    if (error && articles.length === 0) {
      return (
        <div className="p-6 text-sm text-windows-black">
          <p className="font-bold mb-1">Failed to load news.</p>
          <p className="text-windows-grey-dark">Check your Sanity configuration or network connection.</p>
        </div>
      );
    }

    if (history[historyIndex] === HOME_PAGE_ID)
      return <HomePage articles={articles} onNavigate={navigate} />;
    const article = articles.find((a) => (a._id ?? a.id) === history[historyIndex]);
    if (article) return <ArticlePage article={article} onNavigate={navigate} />;
    return <div className="w-full h-full bg-windows-white" />;
  };

  return (
    // Fixed size on desktop by default; responsive and filling the window when maximized or on mobile
    <div className="flex flex-col w-full h-full md:w-[900px] md:h-[600px] [.maximized_&]:md:w-full [.maximized_&]:md:h-full bg-windows-grey font-main text-sm">

      {/* ── Toolbar: same style as MenuBar ── */}
      <div className="flex items-center bg-windows-grey border-b-2 border-windows-grey-dark p-2 flex-shrink-0">
        <div className="flex items-center gap-0.5">
          <Button
            variant="control"
            onClick={goBack}
            disabled={!canGoBack || isLoading}
            title="Back"
            ariaLabel="Back"
          >
            <BackIcon />
          </Button>
          <Button
            variant="control"
            onClick={goForward}
            disabled={!canGoForward || isLoading}
            title="Forward"
            ariaLabel="Forward"
          >
            <ForwardIcon />
          </Button>

          <Button
            variant="control"
            onClick={() => setIsNavLoading(false)}
            disabled={!isLoading}
            title="Stop"
            ariaLabel="Stop"
          >
            <StopIcon />
          </Button>
          <Button
            variant="control"
            onClick={refresh}
            disabled={isLoading}
            title="Refresh"
            ariaLabel="Refresh"
          >
            <RefreshIcon />
          </Button>

          <Button
            variant="control"
            onClick={goHome}
            disabled={isLoading}
            title="Home"
            ariaLabel="Home"
          >
            <HomeIcon />
          </Button>
        </div>

        <div className="flex-1" />

        {/* Tree Icon logo box */}
        <div className="flex items-center justify-center w-8 h-8 bg-black border border-windows-grey-dark">
          <img src={treeIcon} alt="" className="w-6 h-6 object-contain" />
        </div>
      </div>

      {/* ── Content ── */}
      <div
        ref={contentRef}
        className={`flex-1 bg-windows-white overflow-y-auto select-text min-h-0 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
      >
        {renderPage()}
      </div>
    </div>
  );
});

News.displayName = "News";
export default News;
