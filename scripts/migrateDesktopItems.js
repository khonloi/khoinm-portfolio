import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.VITE_SANITY_TOKEN,
  useCdn: false,
});

// The data to migrate (Extracted from programConfig.jsx)
// I will only migrate the main categories and some samples to show how it works
// A full migration of 600+ items might be too large for a single script run,
// but I'll do the core structure.

const desktopItems = [
  {
    id: 'about',
    label: 'My Information',
    iconSrc: 'computerIcon',
    type: 'icon',
    isMaximizable: false,
    position: 'left',
  },
  {
    id: 'certificates',
    label: 'My Certificates',
    iconSrc: 'openDocIcon',
    type: 'folder',
    position: 'left',
    contents: [
      {
        id: 'network',
        label: 'Computer Network',
        iconSrc: 'docIcon',
        type: 'icon',
        link: 'https://www.coursera.org/account/accomplishments/specialization/EB5BPKJWRHKZ',
      },
      {
        id: 'pm',
        label: 'Project Management',
        iconSrc: 'docIcon',
        type: 'icon',
        link: 'https://www.coursera.org/account/accomplishments/specialization/TL03HX7CKRQF',
      },
    ],
  },
  {
    id: 'projects',
    label: 'My Projects',
    iconSrc: 'briefcaseIcon',
    type: 'folder',
    position: 'left',
    contents: [
      {
        id: 'portfolio',
        label: 'Pane 3.1',
        iconSrc: 'logoIcon',
        type: 'icon',
        link: 'https://khoinm.vercel.app',
      },
    ],
  },
  {
    id: 'message',
    label: 'Message Me',
    iconSrc: 'faxIcon',
    type: 'icon',
    position: 'left',
  },
  {
    id: 'internet',
    label: 'News',
    iconSrc: 'newsIcon',
    type: 'icon',
    isMaximizable: true,
    position: 'left',
  },
  {
    id: 'welcome',
    label: 'Welcome to Hayami',
    iconSrc: 'noteIcon',
    type: 'icon',
    startup: true,
    position: 'left',
  },
  {
    id: 'onlineAccounts',
    label: 'Online Accounts',
    iconSrc: 'folderIEIcon',
    type: 'folder',
    position: 'right',
    contents: [
      {
        id: 'github',
        label: 'GitHub',
        iconSrc:
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        type: 'icon',
        link: 'https://github.com',
      },
    ],
  },
  {
    id: 'programs',
    label: 'Programs',
    iconSrc: 'folderLinksysIcon',
    type: 'folder',
    position: 'right',
    contents: [
      {
        id: 'calculator',
        label: 'Calculator',
        iconSrc: 'calculatorIcon',
        type: 'icon',
      },
      {
        id: 'calendar',
        label: 'Calendar',
        iconSrc: 'calendarIcon',
        type: 'icon',
      },
      { id: 'clock', label: 'Clock', iconSrc: 'clockIcon', type: 'icon' },
      {
        id: 'media',
        label: 'Media Player',
        iconSrc: 'mediaIcon',
        type: 'icon',
      },
    ],
  },
];

async function migrate() {
  console.log('Starting migration to Sanity...');

  const migrateItem = async (item, order) => {
    console.log(`Processing: ${item.label} (${item.id})`);

    let contentRefs = [];
    if (item.contents && item.contents.length > 0) {
      for (let i = 0; i < item.contents.length; i++) {
        const childId = await migrateItem(item.contents[i], i);
        contentRefs.push({
          _type: 'reference',
          _ref: childId,
          _key: `key-${childId}`,
        });
      }
    }

    const doc = {
      _type: 'desktopItem',
      _id: `desktop-item-${item.id}`,
      id: item.id,
      label: item.label,
      type: item.type,
      iconSrc: item.iconSrc,
      position: item.position,
      link: item.link,
      isMaximizable: item.isMaximizable || false,
      startup: item.startup || false,
      order: order,
      contents: contentRefs.length > 0 ? contentRefs : undefined,
    };

    try {
      await client.createOrReplace(doc);
      return doc._id;
    } catch (err) {
      console.error(`Failed to migrate ${item.label}:`, err.message);
      return null;
    }
  };

  for (let i = 0; i < desktopItems.length; i++) {
    await migrateItem(desktopItems[i], i);
  }

  console.log('Migration complete!');
}

migrate();
