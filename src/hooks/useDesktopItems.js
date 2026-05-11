import { useState, useEffect } from 'react';
import { client } from '../lib/sanityClient';
import { ICON_MAP } from '../config/programConfig';

const CMS_JSON_QUERY = `*[_type in ["certificateList", "projectList", "stuffList", "onlineAccountList"]] {
  _type,
  jsonContent
}`;

export const useCMSContent = () => {
  const [folderMap, setFolderMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await client.fetch(CMS_JSON_QUERY);
        const map = {};

        const processItems = (items) => {
          return items.map(item => {
            let iconSrc = item.iconSrc;
            let type = item.type || 'icon';

            // Automatic icon assignment based on filetype IF iconSrc is not manually provided
            if (!iconSrc && !item.customIconUrl) {
              if (item.filetype === 'txt') iconSrc = 'winDocumentsIcon';
              else if (item.filetype === 'img') iconSrc = 'winMonaLisaIcon';
              else if (item.filetype === 'vid') iconSrc = 'winMediaPlayerIcon';
            }

            const transformedItem = {
              ...item,
              type,
              iconSrc: item.customIconUrl || ICON_MAP[iconSrc] || iconSrc,
              // Recursive processing for sub-folders
              contents: item.contents ? processItems(item.contents) : undefined
            };
            return transformedItem;
          });
        };

        data.forEach(doc => {
          let folderId;
          if (doc._type === 'certificateList') folderId = 'certificates';
          if (doc._type === 'projectList') folderId = 'projects';
          if (doc._type === 'stuffList') folderId = 'stuff';
          if (doc._type === 'onlineAccountList') folderId = 'onlineAccounts';

          if (folderId && doc.jsonContent) {
            try {
              const parsed = JSON.parse(doc.jsonContent);
              if (Array.isArray(parsed)) {
                map[folderId] = processItems(parsed);
              }
            } catch (e) {
              console.error(`Failed to parse JSON for ${folderId}:`, e);
            }
          }
        });

        setFolderMap(map);
      } catch (error) {
        console.error('Error fetching CMS content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { folderMap, loading };
};
