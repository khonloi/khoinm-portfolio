import React, { useEffect, useMemo } from 'react';

const METADATA_MAP = {
  about: {
    title: 'My Information | Khoi NM - Creative Developer',
    description: 'Learn about Khoi NM, a creative developer specializing in frontend engineering, UI/UX design, and interactive retro web experiences.',
  },
  projects: {
    title: 'Projects Portfolio | Khoi NM - Creative Developer',
    description: 'Explore creative web projects, interactive retro web applications, and modern frontend experiments developed by Khoi NM.',
  },
  certificates: {
    title: 'Certificates & Credentials | Khoi NM - Creative Developer',
    description: 'Professional certificates, achievements, and technical credentials earned by Khoi NM.',
  },
  onlineAccounts: {
    title: 'Online Accounts & Social Links | Khoi NM',
    description: 'Connect with Khoi NM on GitHub, professional networks, and online developer profiles.',
  },
  message: {
    title: 'Send a Message | Contact Khoi NM',
    description: 'Get in touch with Khoi NM for collaborative projects, freelance opportunities, or creative development inquiries.',
  },
  internet: {
    title: 'News & Tech Logs | Khoi NM',
    description: 'Read the latest tech news, development insights, and creative articles on Khoi NM\'s retro portfolio.',
  },
  programs: {
    title: 'Retro Programs & Utilities | Khoi NM Windows 3.1',
    description: 'Explore retro Windows desktop applications including Paint, Calculator, Notebook, Audio Player, and File Manager.',
  },
  games: {
    title: 'Retro Games (Classic Line 98) | Khoi NM',
    description: 'Play retro games like Line 98 directly inside Khoi NM\'s interactive Windows 3.1 desktop.',
  },
  line98: {
    title: 'Line 98 Classic Game | Khoi NM',
    description: 'Play the retro Line 98 color matching ball puzzle game online.',
  },
  paint: {
    title: 'Paint Program | Khoi NM Windows 3.1',
    description: 'Create retro pixel art and drawings with the interactive in-browser Windows 3.1 Paint app.',
  },
  welcome: {
    title: 'Welcome to PANE | Khoi NM Creative Developer',
    description: 'Welcome to Khoi NM\'s interactive retro Windows portfolio experience. Discover projects, skills, and resume.',
  },
  notebook: {
    title: 'Notebook | Khoi NM Windows 3.1',
    description: 'Retro desktop notepad and text editor application.',
  },
  calculator: {
    title: 'Calculator | Khoi NM Windows 3.1',
    description: 'Vintage desktop calculator application.',
  },
  photoviewer: {
    title: 'Photo Viewer | Khoi NM Windows 3.1',
    description: 'Explore gallery images and visuals in retro Windows Photo Viewer.',
  },
  media: {
    title: 'Media Player | Khoi NM Windows 3.1',
    description: 'Retro audio and media player with classic sound effects and retro tracks.',
  },
};

const DEFAULT_SEO = {
  title: 'Khoi NM | Creative Developer - Retro Windows Experience',
  description: 'Khoi NM\'s creative developer portfolio, stylized as an interactive retro Windows desktop experience. Explore innovative frontend projects, web applications, skills, and resume.',
};

const BASE_URL = 'https://khoinm.vercel.app';

/**
 * Dynamic SEO Component
 * Updates document title, meta description, OpenGraph, Twitter, and canonical URLs
 * seamlessly using React 19 metadata tags with fallback DOM sync.
 */
export const SEO = ({ focusedWindow, openWindows = [] }) => {
  const currentMeta = useMemo(() => {
    if (focusedWindow && METADATA_MAP[focusedWindow]) {
      return METADATA_MAP[focusedWindow];
    }
    // If a window is open that doesn't have an explicit entry, find the open window object
    if (focusedWindow) {
      const activeWin = openWindows.find(w => w.id === focusedWindow);
      if (activeWin?.title) {
        return {
          title: `${activeWin.title} | Khoi NM - Creative Developer`,
          description: `View ${activeWin.title} on Khoi NM's creative developer retro portfolio.`,
        };
      }
    }
    return DEFAULT_SEO;
  }, [focusedWindow, openWindows]);

  const canonicalUrl = useMemo(() => {
    if (focusedWindow) {
      return `${BASE_URL}/?open=${encodeURIComponent(focusedWindow)}`;
    }
    return `${BASE_URL}/`;
  }, [focusedWindow]);

  // Imperative fallback to guarantee document title and meta updates across all browsers
  useEffect(() => {
    document.title = currentMeta.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', currentMeta.description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', currentMeta.title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', currentMeta.description);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalUrl);
    }

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', currentMeta.title);
    }

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) {
      twitterDesc.setAttribute('content', currentMeta.description);
    }

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', canonicalUrl);
    }
  }, [currentMeta, canonicalUrl]);

  return (
    <>
      <title>{currentMeta.title}</title>
      <meta name="description" content={currentMeta.description} />
      <meta property="og:title" content={currentMeta.title} />
      <meta property="og:description" content={currentMeta.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:title" content={currentMeta.title} />
      <meta name="twitter:description" content={currentMeta.description} />
      <link rel="canonical" href={canonicalUrl} />
    </>
  );
};

export default SEO;
