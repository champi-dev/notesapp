import { useState, useCallback } from 'react';
import { debounce } from '../lib/utils';
import { useNoteStore } from '../stores';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const setFilter = useNoteStore((s) => s.setFilter);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setFilter({ search: query });
    }, 300),
    [setFilter]
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setFilter({ search: '' });
  }, [setFilter]);

  return {
    searchQuery,
    handleSearch,
    clearSearch,
  };
}
