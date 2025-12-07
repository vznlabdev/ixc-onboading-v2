import React, { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  handler: () => void;
  description: string;
}

const defaultShortcuts: ShortcutConfig[] = [
  {
    key: 'k',
    ctrl: true,
    handler: () => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement;
      searchInput?.focus();
    },
    description: 'Focus search',
  },
  {
    key: 's',
    ctrl: true,
    handler: () => {
      toast.info('Saving changes...');
      // Trigger save action
    },
    description: 'Save changes',
  },
  {
    key: 'n',
    alt: true,
    handler: () => {
      // Open new application modal
      const newButton = document.querySelector('button:has-text("Add"), button:has-text("New")') as HTMLElement;
      newButton?.click();
    },
    description: 'New item',
  },
  {
    key: 'Escape',
    handler: () => {
      // Close any open modals
      const closeButton = document.querySelector('[aria-label="Close"], button:has(svg[class*="X"])') as HTMLElement;
      closeButton?.click();
    },
    description: 'Close modal',
  },
  {
    key: '/',
    handler: () => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement;
      searchInput?.focus();
    },
    description: 'Focus search',
  },
  {
    key: '?',
    shift: true,
    handler: () => {
      showShortcutsHelp();
    },
    description: 'Show shortcuts help',
  },
  {
    key: 'ArrowDown',
    alt: true,
    handler: () => {
      // Navigate to next item
      window.scrollBy(0, 100);
    },
    description: 'Next item',
  },
  {
    key: 'ArrowUp',
    alt: true,
    handler: () => {
      // Navigate to previous item
      window.scrollBy(0, -100);
    },
    description: 'Previous item',
  },
  {
    key: 'a',
    ctrl: true,
    shift: true,
    handler: () => {
      // Select all items
      const selectAllCheckbox = document.querySelector('input[type="checkbox"][aria-label*="Select all"]') as HTMLInputElement;
      selectAllCheckbox?.click();
    },
    description: 'Select all',
  },
  {
    key: 'Enter',
    handler: () => {
      // Submit active form or confirm action
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        const form = activeElement.closest('form') as HTMLFormElement;
        form?.requestSubmit();
      }
    },
    description: 'Submit/Confirm',
  },
];

function showShortcutsHelp() {
  const shortcuts = defaultShortcuts.map(s => {
    const keys = [];
    if (s.ctrl) keys.push('Ctrl');
    if (s.alt) keys.push('Alt');
    if (s.shift) keys.push('Shift');
    keys.push(s.key);
    return `${keys.join('+')} - ${s.description}`;
  }).join('\n');

  toast.info('Keyboard Shortcuts', {
    description: shortcuts,
    duration: 10000,
    style: {
      whiteSpace: 'pre-line',
    },
  });
}

export function useKeyboardShortcuts(customShortcuts?: ShortcutConfig[]) {
  const shortcuts = customShortcuts || defaultShortcuts;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs (except for some global shortcuts)
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement)?.tagName);
    const globalShortcuts = ['Escape', '?'];
    
    if (isTyping && !globalShortcuts.includes(event.key)) {
      return;
    }

    shortcuts.forEach(shortcut => {
      const matchesKey = event.key === shortcut.key;
      const matchesCtrl = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : true;
      const matchesAlt = shortcut.alt ? event.altKey : !event.altKey;
      const matchesShift = shortcut.shift ? event.shiftKey : !event.shiftKey;

      if (matchesKey && matchesCtrl && matchesAlt && matchesShift) {
        event.preventDefault();
        shortcut.handler();
      }
    });
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { showShortcutsHelp };
}

// Component to show shortcuts hint
export function KeyboardShortcutsHint() {
  return (
    <div className="fixed bottom-4 right-4 z-40 animate-fade-in">
      <button
        onClick={showShortcutsHelp}
        className="bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
      >
        <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">?</kbd>
        Keyboard shortcuts
      </button>
    </div>
  );
}
