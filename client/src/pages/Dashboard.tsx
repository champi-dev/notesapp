import { useEffect } from 'react';
import { MainLayout } from '../components/layout';
import { NoteList } from '../components/notes';
import { NoteEditor } from '../components/editor';
import { useFolderStore, useTagStore, useNoteStore } from '../stores';
import { useKeyboardShortcuts } from '../hooks';

export function DashboardPage() {
  const { fetchFolders } = useFolderStore();
  const { fetchTags } = useTagStore();
  const { activeNoteId } = useNoteStore();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    fetchFolders();
    fetchTags();
  }, [fetchFolders, fetchTags]);

  return (
    <MainLayout>
      <div className="flex h-full overflow-hidden">
        {/* Note List - Full width on mobile, fixed width on desktop */}
        <div
          className={`
            ${activeNoteId ? 'hidden' : 'flex'}
            sm:flex
            w-full sm:w-80 lg:w-96
            border-r border-gray-200 dark:border-gray-700
            flex-shrink-0
            flex-col
            overflow-hidden
          `}
        >
          <NoteList />
        </div>

        {/* Editor - Hidden on mobile unless note is selected */}
        <div
          className={`
            ${activeNoteId ? 'flex' : 'hidden'}
            sm:flex
            flex-1
            flex-col
            min-w-0
            overflow-hidden
          `}
        >
          <NoteEditor />
        </div>
      </div>
    </MainLayout>
  );
}
