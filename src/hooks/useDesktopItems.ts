import { useState, useEffect } from 'react';
import { client } from '../lib/sanityClient';
import { ICON_MAP } from '../config/programConfig';
import type { DesktopItem } from '../types';

const CMS_JSON_QUERY = `*[_type in ["certificateList", "projectList", "stuffList", "onlineAccountList", "cdDrive", "customShortcut"]] {
  _type,
  jsonContent,
  label,
  fileContent
}`;

export interface CdDriveConfig {
  label?: string;
  fileContent?: string;
}

export const useCMSContent = () => {
  const [folderMap, setFolderMap] = useState<Record<string, DesktopItem[]>>({});
  const [cdDrive, setCdDrive] = useState<CdDriveConfig | null>(null);
  const [customShortcuts, setCustomShortcuts] = useState<DesktopItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await client.fetch(CMS_JSON_QUERY);
        const map: Record<string, DesktopItem[]> = {};
        let cdDriveConfig: CdDriveConfig | null = null;

        const processItems = (items: any[]): DesktopItem[] => {
          return items.map((item: any) => {
            let iconSrc = item.iconSrc;
            const type = item.type || 'icon';

            // Automatic icon assignment based on filetype IF iconSrc is not manually provided
            if (!iconSrc && !item.customIconUrl) {
              if (item.filetype === 'txt') iconSrc = 'winDllIcon';
              else if (item.filetype === 'img') iconSrc = 'winMonaLisaIcon';
              else if (item.filetype === 'vid') iconSrc = 'winMediaPlayerIcon';
            }

            const transformedItem: DesktopItem = {
              ...item,
              type,
              iconSrc: item.customIconUrl || (ICON_MAP as Record<string, string>)[iconSrc] || iconSrc,
              // Recursive processing for sub-folders
              contents: item.contents ? processItems(item.contents) : undefined,
            };
            return transformedItem;
          });
        };

        data.forEach((doc: any) => {
          if (doc._type === 'cdDrive') {
            cdDriveConfig = {
              label: doc.label,
              fileContent: doc.fileContent,
            };
            return;
          }

          let folderId: string | undefined;
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
          
          if (doc._type === 'customShortcut' && doc.jsonContent) {
            try {
              const parsed = JSON.parse(doc.jsonContent);
              if (Array.isArray(parsed)) {
                const shortcuts: DesktopItem[] = processItems(parsed).map(item => ({
                  ...item,
                  position: 'right' as const, // Force position right to line up below CD Drive
                }));
                setCustomShortcuts(shortcuts);
              }
            } catch (e) {
              console.error('Failed to parse JSON for customShortcut:', e);
            }
          }
        });

        setFolderMap(map);
        if (cdDriveConfig) {
          setCdDrive(cdDriveConfig);
        }
      } catch (error) {
        console.error('Error fetching CMS content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { folderMap, cdDrive, customShortcuts, loading };
};
