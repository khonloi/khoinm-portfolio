import React, { useCallback, useRef, memo } from "react";
import { useNews } from "./useNews";
import { MOCK_ARTICLES } from "./data/mockArticles";
import { useBrowserHistory, HOME_PAGE_ID } from "./hooks/useBrowserHistory";
import { NewsToolbar } from "./components/NewsToolbar";
import { HomePage } from "./components/HomePage";
import { ArticlePage } from "./components/ArticlePage";

const News = memo(() => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const resetScroll = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, []);

  const {
    currentPageId,
    canGoBack,
    canGoForward,
    isNavLoading,
    setIsNavLoading,
    navigate,
    goBack,
    goForward,
    goHome,
    simulateLoad,
  } = useBrowserHistory({ onScrollReset: resetScroll });

  // Sanity data hook
  const {
    articles,
    isLoading: isFetching,
    error,
    refetch,
  } = useNews(MOCK_ARTICLES);

  const isLoading = isNavLoading || isFetching;

  const handleRefresh = useCallback(() => {
    refetch();
    simulateLoad(resetScroll);
  }, [refetch, simulateLoad, resetScroll]);

  const renderPage = () => {
    if (error && articles.length === 0) {
      return (
        <div className="p-6 text-sm text-windows-black">
          <p className="font-bold mb-1">Failed to load news.</p>
          <p className="text-windows-grey-dark">Check your Sanity configuration or network connection.</p>
        </div>
      );
    }

    if (currentPageId === HOME_PAGE_ID) {
      return <HomePage articles={articles} onNavigate={navigate} />;
    }

    const article = articles.find((a) => (a._id ?? a.id) === currentPageId);
    if (article) {
      return <ArticlePage article={article} onNavigate={navigate} />;
    }

    return <div className="w-full h-full bg-windows-white" />;
  };

  return (
    <div className="flex flex-col w-full h-full md:w-[900px] md:h-[600px] [.maximized_&]:md:w-full [.maximized_&]:md:h-full bg-windows-grey font-main text-sm">
      <NewsToolbar
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isLoading={isLoading}
        onGoBack={goBack}
        onGoForward={goForward}
        onStop={() => setIsNavLoading(false)}
        onRefresh={handleRefresh}
        onGoHome={goHome}
      />

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
