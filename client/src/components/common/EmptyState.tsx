import { type ReactNode } from 'react';
import { FileText, FolderOpen, Search, Trash2, Heart } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        {icon || <FileText className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function NoNotesState({ onCreateNote }: { onCreateNote: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="w-8 h-8 text-gray-400" />}
      title="No notes yet"
      description="Create your first note to get started"
      action={{ label: 'Create Note', onClick: onCreateNote }}
    />
  );
}

export function NoSearchResultsState() {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8 text-gray-400" />}
      title="No results found"
      description="Try adjusting your search or filters"
    />
  );
}

export function EmptyFolderState({ onCreateNote }: { onCreateNote: () => void }) {
  return (
    <EmptyState
      icon={<FolderOpen className="w-8 h-8 text-gray-400" />}
      title="This folder is empty"
      description="Create a new note in this folder"
      action={{ label: 'Create Note', onClick: onCreateNote }}
    />
  );
}

export function EmptyTrashState() {
  return (
    <EmptyState
      icon={<Trash2 className="w-8 h-8 text-gray-400" />}
      title="Trash is empty"
      description="Notes you delete will appear here"
    />
  );
}

export function EmptyFavoritesState() {
  return (
    <EmptyState
      icon={<Heart className="w-8 h-8 text-gray-400" />}
      title="No favorites yet"
      description="Add notes to favorites to see them here"
    />
  );
}
