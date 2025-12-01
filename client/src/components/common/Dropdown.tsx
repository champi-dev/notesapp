import { useState, useRef, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

const DropdownContext = createContext<{ closeDropdown: () => void }>({ closeDropdown: () => {} });

export function Dropdown({ trigger, children, align = 'left', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 192; // min-w-[12rem] = 192px

      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: align === 'right'
          ? rect.right + window.scrollX - menuWidth
          : rect.left + window.scrollX,
      });
    }
  }, [align]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        if (
          triggerRef.current &&
          !triggerRef.current.contains(target) &&
          menuRef.current &&
          !menuRef.current.contains(target)
        ) {
          setIsOpen(false);
        }
      };

      const handleScroll = () => {
        updatePosition();
      };

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('resize', updatePosition);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('scroll', handleScroll, true);
        document.removeEventListener('keydown', handleEscape);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div ref={triggerRef} onClick={handleTriggerClick} className="inline-flex">
        {trigger}
      </div>
      {isOpen && createPortal(
        <div
          ref={menuRef}
          className={cn(
            'fixed min-w-[12rem] p-1 rounded-lg',
            'bg-white border border-gray-200 shadow-xl',
            'dark:bg-gray-800 dark:border-gray-700',
            className
          )}
          style={{
            top: position.top,
            left: position.left,
            zIndex: 9999,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownContext.Provider value={{ closeDropdown }}>
            {children}
          </DropdownContext.Provider>
        </div>,
        document.body
      )}
    </>
  );
}

interface DropdownItemProps {
  onClick?: () => void;
  children: ReactNode;
  danger?: boolean;
  className?: string;
}

export function DropdownItem({ onClick, children, danger, className }: DropdownItemProps) {
  const { closeDropdown } = useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick?.();
    closeDropdown();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md text-left transition-colors',
        danger
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
        className
      )}
    >
      {children}
    </button>
  );
}
