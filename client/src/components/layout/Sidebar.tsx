import { useState, useEffect } from 'react';
import {
  FileText,
  FolderClosed,
  Tag,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Star,
  X,
} from 'lucide-react';
import { cn, folderColors } from '../../lib/utils';
import { useNoteStore, useFolderStore, useTagStore, useUIStore } from '../../stores';
import type { Folder } from '../../types';

const sidebarItemClasses = (isActive: boolean) =>
  cn(
    'relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-left transition-all',
    'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100',
    isActive && 'bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-[60%] before:bg-primary-500 before:rounded-r'
  );

export function Sidebar() {
  const { filters, setFilter, clearFilters, createNote } = useNoteStore();
  const { folders, fetchFolders, createFolder } = useFolderStore();
  const { tags, fetchTags } = useTagStore();
  const { sidebarOpen, setSidebarOpen, addToast } = useUIStore();

  const [foldersExpanded, setFoldersExpanded] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(true);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(folderColors[0]);

  useEffect(() => {
    fetchFolders();
    fetchTags();
  }, [fetchFolders, fetchTags]);

  const handleCreateNote = async () => {
    try {
      await createNote(filters.folderId);
    } catch {
      addToast({ type: 'error', message: 'Failed to create note' });
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName, selectedColor);
      setNewFolderName('');
      setIsCreatingFolder(false);
      addToast({ type: 'success', message: 'Folder created' });
    } catch {
      addToast({ type: 'error', message: 'Failed to create folder' });
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Mobile header with close button */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <span className="font-semibold text-gray-900 dark:text-white">Menu</span>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* New Note Button */}
      <div className="p-4 pt-0 lg:pt-4">
        <button
          onClick={handleCreateNote}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          New Note
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {/* All Notes */}
        <button
          onClick={() => {
            clearFilters();
            setFilter({ folderId: null, trashed: false, favorite: false });
          }}
          className={sidebarItemClasses(!filters.folderId && !filters.tag && !filters.trashed && !filters.favorite)}
        >
          <FileText className="w-5 h-5" />
          <span>All Notes</span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => setFilter({ folderId: null, tag: null, trashed: false, favorite: true })}
          className={sidebarItemClasses(filters.favorite)}
        >
          <Star className="w-5 h-5" />
          <span>Favorites</span>
        </button>

        {/* Folders Section */}
        <div className="pt-4">
          <div className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <button
              onClick={() => setFoldersExpanded(!foldersExpanded)}
              className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <span>Folders</span>
              {foldersExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {foldersExpanded && (
            <div className="mt-1 space-y-0.5 animate-fade-in">
              {/* New folder input */}
              {isCreatingFolder && (
                <div className="p-2 space-y-2 animate-slide-up">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateFolder();
                      if (e.key === 'Escape') setIsCreatingFolder(false);
                    }}
                    placeholder="Folder name"
                    className="w-full px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-transparent focus:border-primary-500 outline-none"
                    autoFocus
                  />
                  <div className="flex items-center gap-1 flex-wrap">
                    {folderColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          'w-5 h-5 rounded-full transition-transform',
                          selectedColor === color && 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-gray-400 scale-110'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateFolder}
                      className="flex-1 px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setIsCreatingFolder(false)}
                      className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {folders.map((folder) => (
                <FolderItem
                  key={folder._id}
                  folder={folder}
                  isActive={filters.folderId === folder._id}
                  onClick={() => setFilter({ folderId: folder._id, tag: null, trashed: false, favorite: false })}
                />
              ))}

              {folders.length === 0 && !isCreatingFolder && (
                <p className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
                  No folders yet
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div className="pt-4">
          <button
            onClick={() => setTagsExpanded(!tagsExpanded)}
            className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
          >
            <span>Tags</span>
            {tagsExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {tagsExpanded && (
            <div className="mt-1 space-y-0.5 animate-fade-in">
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => setFilter({ tag: tag.name, folderId: null, trashed: false, favorite: false })}
                  className={sidebarItemClasses(filters.tag === tag.name)}
                >
                  <Tag className="w-4 h-4" />
                  <span className="flex-1 text-left truncate">{tag.name}</span>
                  <span className="text-xs text-gray-400">{tag.count}</span>
                </button>
              ))}

              {tags.length === 0 && (
                <p className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">
                  No tags yet
                </p>
              )}
            </div>
          )}
        </div>

        {/* Trash */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <button
            onClick={() => setFilter({ trashed: true, folderId: null, tag: null, favorite: false })}
            className={sidebarItemClasses(filters.trashed)}
          >
            <Trash2 className="w-5 h-5" />
            <span>Trash</span>
          </button>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 lg:translate-x-0 h-full',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

function FolderItem({
  folder,
  isActive,
  onClick,
}: {
  folder: Folder;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={sidebarItemClasses(isActive)}
    >
      <FolderClosed
        className="w-4 h-4"
        style={{ color: folder.color }}
      />
      <span className="flex-1 text-left truncate">{folder.name}</span>
      <span className="text-xs text-gray-400">{folder.noteCount || 0}</span>
    </button>
  );
}
