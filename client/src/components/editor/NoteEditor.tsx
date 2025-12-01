import { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { FolderOpen, Check, Loader2, X, ArrowLeft } from 'lucide-react';
import { EditorToolbar } from './EditorToolbar';
import { TagInput } from '../tags/TagInput';
import { useNoteStore, useFolderStore, useUIStore } from '../../stores';
import { Dropdown, DropdownItem } from '../common/Dropdown';
import { debounce } from '../../lib/utils';
import { AUTOSAVE_DELAY } from '../../lib/constants';

const lowlight = createLowlight(common);

export function NoteEditor() {
  const { activeNote, activeNoteId, updateNote, saveStatus, setSaveStatus, setActiveNote } = useNoteStore();
  const { folders } = useFolderStore();
  const { addToast } = useUIStore();

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Underline.configure({}),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    immediatelyRender: false,
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      debouncedSave(editor.getHTML());
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((content: string) => {
      if (activeNoteId) {
        handleSave({ content });
      }
    }, AUTOSAVE_DELAY),
    [activeNoteId]
  );

  const handleSave = async (data: Partial<{ title: string; content: string; tags: string[]; folderId: string | null }>) => {
    if (!activeNoteId) return;

    try {
      await updateNote(activeNoteId, data);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      addToast({ type: 'error', message: 'Failed to save note' });
    }
  };

  // Update editor content when note changes
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setTags(activeNote.tags);
      editor?.commands.setContent(activeNote.content || '');
    }
  }, [activeNote, editor]);

  // Save title on blur
  const handleTitleBlur = () => {
    if (activeNoteId && title !== activeNote?.title) {
      handleSave({ title });
    }
  };

  // Save tags
  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    if (activeNoteId) {
      handleSave({ tags: newTags });
    }
  };

  // Move to folder
  const handleMoveToFolder = (folderId: string | null) => {
    if (activeNoteId) {
      handleSave({ folderId });
      addToast({
        type: 'success',
        message: folderId
          ? `Moved to ${folders.find((f) => f._id === folderId)?.name}`
          : 'Moved to All Notes',
      });
    }
  };

  // Go back to note list (mobile)
  const handleBack = () => {
    setActiveNote(null);
  };

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <FolderOpen className="w-10 h-10" />
          </div>
          <p className="text-lg font-medium">Select a note</p>
          <p className="text-sm mt-1">Choose a note from the list or create a new one</p>
        </div>
      </div>
    );
  }

  const currentFolder = folders.find((f) => f._id === activeNote.folderId);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 animate-fade-in">
      {/* Editor Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        {/* Mobile back button and Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="sm:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            placeholder="Untitled"
            className="flex-1 text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
          />
        </div>

        {/* Tags and folder */}
        <div className="mt-3 flex items-center gap-4 flex-wrap">
          <TagInput tags={tags} onChange={handleTagsChange} />

          <div className="flex items-center gap-2 ml-auto">
            {/* Save status */}
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1.5 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1.5 text-green-500 animate-fade-in">
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Saved</span>
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="flex items-center gap-1.5 text-red-500 animate-fade-in">
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Error</span>
                </span>
              )}
            </div>

            {/* Folder selector */}
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <FolderOpen className="w-4 h-4" style={{ color: currentFolder?.color }} />
                  <span className="hidden sm:inline">{currentFolder?.name || 'All Notes'}</span>
                </button>
              }
              align="right"
            >
              <DropdownItem onClick={() => handleMoveToFolder(null)}>
                <FolderOpen className="w-4 h-4" />
                All Notes
              </DropdownItem>
              {folders.map((folder) => (
                <DropdownItem
                  key={folder._id}
                  onClick={() => handleMoveToFolder(folder._id)}
                >
                  <FolderOpen className="w-4 h-4" style={{ color: folder.color }} />
                  {folder.name}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="overflow-x-auto">
        <EditorToolbar editor={editor} />
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}
