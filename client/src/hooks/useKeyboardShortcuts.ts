import { useEffect, useCallback } from 'react';
import { useNoteStore, useUIStore } from '../stores';

export function useKeyboardShortcuts() {
  const { createNote, filters, setSaveStatus } = useNoteStore();
  const { toggleSidebar, addToast } = useUIStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Ignore if typing in input/textarea (except for certain shortcuts)
      const target = e.target as HTMLElement;
      const isTyping = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable;

      // Ctrl/Cmd + N - New note
      if (modifier && e.key === 'n') {
        e.preventDefault();
        createNote(filters.folderId);
        return;
      }

      // Ctrl/Cmd + S - Save (show feedback)
      if (modifier && e.key === 's') {
        e.preventDefault();
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
        return;
      }

      // Ctrl/Cmd + \ - Toggle sidebar
      if (modifier && e.key === '\\') {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      // Ctrl/Cmd + F - Focus search
      if (modifier && e.key === 'f' && !isTyping) {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        searchInput?.focus();
        return;
      }

      // ? - Show keyboard shortcuts help
      if (e.key === '?' && !isTyping) {
        addToast({
          type: 'info',
          message: 'Keyboard shortcuts: Ctrl+N (new note), Ctrl+S (save), Ctrl+F (search), Ctrl+\\ (toggle sidebar)',
        });
        return;
      }

      // Escape - Clear selection, close modals
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-backdrop');
        if (activeModal) {
          // Modal will handle its own escape key
          return;
        }
      }
    },
    [createNote, filters.folderId, toggleSidebar, addToast, setSaveStatus]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
