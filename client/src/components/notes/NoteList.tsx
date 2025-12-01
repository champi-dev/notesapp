import { useEffect } from 'react';
import { Pin, MoreVertical, Trash2, RotateCcw, Star, Heart } from 'lucide-react';
import { cn, formatDate, extractPreview } from '../../lib/utils';
import { useNoteStore, useUIStore } from '../../stores';
import { Dropdown, DropdownItem } from '../common/Dropdown';
import { Spinner } from '../common/Spinner';
import {
  NoNotesState,
  NoSearchResultsState,
  EmptyFolderState,
  EmptyTrashState,
  EmptyFavoritesState,
} from '../common/EmptyState';
import type { Note } from '../../types';

export function NoteList() {
  const {
    notes,
    activeNoteId,
    isLoading,
    filters,
    fetchNotes,
    setActiveNote,
    getNote,
    createNote,
    trashNote,
    restoreNote,
    deleteNote,
    updateNote,
  } = useNoteStore();
  const { addToast } = useUIStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes, filters]);

  const handleNoteClick = async (noteId: string) => {
    setActiveNote(noteId);
    await getNote(noteId);
  };

  const handleCreateNote = async () => {
    try {
      const note = await createNote(filters.folderId);
      await getNote(note._id);
    } catch {
      addToast({ type: 'error', message: 'Failed to create note' });
    }
  };

  const handleTrash = async (id: string) => {
    try {
      await trashNote(id);
      addToast({
        type: 'success',
        message: 'Note moved to trash',
        action: {
          label: 'Undo',
          onClick: () => restoreNote(id),
        },
      });
    } catch {
      addToast({ type: 'error', message: 'Failed to delete note' });
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreNote(id);
      addToast({ type: 'success', message: 'Note restored' });
      fetchNotes();
    } catch {
      addToast({ type: 'error', message: 'Failed to restore note' });
    }
  };

  const handleDeleteForever = async (id: string) => {
    try {
      await deleteNote(id);
      addToast({ type: 'success', message: 'Note permanently deleted' });
    } catch {
      addToast({ type: 'error', message: 'Failed to delete note' });
    }
  };

  const handleTogglePin = async (note: Note) => {
    try {
      await updateNote(note._id, { isPinned: !note.isPinned });
      fetchNotes();
    } catch {
      addToast({ type: 'error', message: 'Failed to update note' });
    }
  };

  const handleToggleFavorite = async (note: Note) => {
    try {
      await updateNote(note._id, { isFavorite: !note.isFavorite });
      fetchNotes();
      addToast({
        type: 'success',
        message: note.isFavorite ? 'Removed from favorites' : 'Added to favorites',
      });
    } catch {
      addToast({ type: 'error', message: 'Failed to update note' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  // Empty states
  if (notes.length === 0) {
    if (filters.search) {
      return <NoSearchResultsState />;
    }
    if (filters.trashed) {
      return <EmptyTrashState />;
    }
    if (filters.favorite) {
      return <EmptyFavoritesState />;
    }
    if (filters.folderId) {
      return <EmptyFolderState onCreateNote={handleCreateNote} />;
    }
    return <NoNotesState onCreateNote={handleCreateNote} />;
  }

  // Group notes by pinned status
  const pinnedNotes = notes.filter((n) => n.isPinned && !filters.trashed);
  const unpinnedNotes = notes.filter((n) => !n.isPinned || filters.trashed);

  return (
    <div className="h-full overflow-y-auto p-3 sm:p-4 space-y-2 bg-gray-50 dark:bg-gray-900">
      {/* Pinned section */}
      {pinnedNotes.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 px-2 mb-2">
            <Pin className="w-4 h-4 text-primary-500" />
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Pinned
            </span>
          </div>
          <div className="space-y-2">
            {pinnedNotes.map((note, index) => (
              <NoteCard
                key={note._id}
                note={note}
                isActive={note._id === activeNoteId}
                onClick={() => handleNoteClick(note._id)}
                onTrash={() => handleTrash(note._id)}
                onTogglePin={() => handleTogglePin(note)}
                onToggleFavorite={() => handleToggleFavorite(note)}
                isTrashView={filters.trashed}
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular notes */}
      {unpinnedNotes.length > 0 && (
        <div className="space-y-2">
          {pinnedNotes.length > 0 && !filters.trashed && (
            <div className="px-2 mb-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Other Notes
              </span>
            </div>
          )}
          {unpinnedNotes.map((note, index) => (
            <NoteCard
              key={note._id}
              note={note}
              isActive={note._id === activeNoteId}
              onClick={() => handleNoteClick(note._id)}
              onTrash={() => handleTrash(note._id)}
              onRestore={() => handleRestore(note._id)}
              onDeleteForever={() => handleDeleteForever(note._id)}
              onTogglePin={() => handleTogglePin(note)}
              onToggleFavorite={() => handleToggleFavorite(note)}
              isTrashView={filters.trashed}
              style={{ animationDelay: `${(pinnedNotes.length + index) * 50}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onTrash: () => void;
  onRestore?: () => void;
  onDeleteForever?: () => void;
  onTogglePin: () => void;
  onToggleFavorite: () => void;
  isTrashView: boolean;
  style?: React.CSSProperties;
}

function NoteCard({
  note,
  isActive,
  onClick,
  onTrash,
  onRestore,
  onDeleteForever,
  onTogglePin,
  onToggleFavorite,
  isTrashView,
  style,
}: NoteCardProps) {
  const preview = extractPreview(note.content || note.plainText);

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative p-4 rounded-xl cursor-pointer transition-all group animate-fade-in-up',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md',
        isActive && 'border-primary-500 dark:border-primary-500 bg-primary-50 dark:bg-primary-500/10'
      )}
      style={style}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {note.title || 'Untitled'}
            </h3>
            {note.isPinned && !isTrashView && (
              <Pin className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
            )}
            {note.isFavorite && !isTrashView && (
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 flex-shrink-0" />
            )}
          </div>
          {preview && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {preview}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(note.updatedAt)}
            </span>
            {note.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag text-[10px] py-0.5">
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-gray-400">+{note.tags.length - 3}</span>
            )}
          </div>
        </div>

        <Dropdown
          trigger={
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex-shrink-0"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          }
          align="right"
        >
          {isTrashView ? (
            <>
              <DropdownItem onClick={onRestore}>
                <RotateCcw className="w-4 h-4" />
                Restore
              </DropdownItem>
              <DropdownItem onClick={onDeleteForever} danger>
                <Trash2 className="w-4 h-4" />
                Delete Forever
              </DropdownItem>
            </>
          ) : (
            <>
              <DropdownItem onClick={onToggleFavorite}>
                <Heart className={cn('w-4 h-4', note.isFavorite && 'fill-red-500 text-red-500')} />
                {note.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </DropdownItem>
              <DropdownItem onClick={onTogglePin}>
                <Pin className={cn('w-4 h-4', note.isPinned && 'text-primary-500')} />
                {note.isPinned ? 'Unpin' : 'Pin Note'}
              </DropdownItem>
              <DropdownItem onClick={onTrash} danger>
                <Trash2 className="w-4 h-4" />
                Move to Trash
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </div>
    </div>
  );
}
