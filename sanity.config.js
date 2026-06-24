import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import newsArticle from './sanity/schemas/newsArticle';
import aboutInfo from './sanity/schemas/aboutInfo';
import certificateList from './sanity/schemas/certificateList';
import projectList from './sanity/schemas/projectList';
import stuffList from './sanity/schemas/stuffList';
import onlineAccountList from './sanity/schemas/onlineAccountList';
import cdDrive from './sanity/schemas/cdDrive';

export default defineConfig({
  name: 'default',
  title: 'Pane Operator',

  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',

  basePath: '/editor',

  plugins: [structureTool()],

  schema: {
    types: [
      newsArticle,
      aboutInfo,
      certificateList,
      projectList,
      stuffList,
      onlineAccountList,
      cdDrive,
    ],
  },
});
