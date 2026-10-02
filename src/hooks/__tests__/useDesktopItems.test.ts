import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useCMSContent } from '../useDesktopItems';
import { client } from '../../lib/sanityClient';

vi.mock('../../lib/sanityClient', () => ({
  client: {
    fetch: vi.fn(),
  },
}));

describe('useCMSContent', () => {
  it('should fetch and parse CMS content', async () => {
    const mockData = [
      {
        _type: 'projectList',
        jsonContent: JSON.stringify([{ id: 'proj1', label: 'Project 1' }])
      },
      {
        _type: 'cdDrive',
        label: 'CD Drive',
        fileContent: 'CD Content'
      }
    ];

    vi.mocked(client.fetch).mockResolvedValueOnce(mockData as any);

    const { result } = renderHook(() => useCMSContent());

    expect(result.current.loading).toBe(true);

    // Wait for the async useEffect to finish
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.folderMap.projects).toHaveLength(1);
    expect(result.current.folderMap.projects[0].id).toBe('proj1');
    expect(result.current.cdDrive).toEqual({
      label: 'CD Drive',
      fileContent: 'CD Content'
    });
  });

  it('should handle fetch errors gracefully', async () => {
    vi.mocked(client.fetch).mockRejectedValueOnce(new Error('Network error'));
    
    // Spy on console.error to prevent it from cluttering the test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useCMSContent());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.folderMap).toEqual({});
    
    consoleSpy.mockRestore();
  });
});
