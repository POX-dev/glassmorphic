import { map } from 'nanostores';

export type WindowType = 'finder' | 'editor' | 'browser' | 'terminal' | 'settings' | 'calculator' | 'notes';

export type WindowData = {
  id: string;
  title: string;
  type: WindowType; // Use the expanded union type here
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  prevBounds?: { x: number; y: number; width: number; height: number };
};

export const osStore = map<{
  windows: Record<string, WindowData>;
  activeWindowId: string | null;
  highestZIndex: number;
}>({
  windows: {},
  activeWindowId: null,
  highestZIndex: 10,
});

// Actions
export const openWindow = (app: Partial<WindowData>) => {
  const store = osStore.get();
  const id = app.id || Math.random().toString(36).substr(2, 9);
  const newZ = store.highestZIndex + 1;

  osStore.setKey('windows', {
    ...store.windows,
    [id]: {
      id,
      title: 'New Window',
      type: 'finder',
      x: 100 + (Object.keys(store.windows).length * 20),
      y: 100 + (Object.keys(store.windows).length * 20),
      width: 600,
      height: 400,
      zIndex: newZ,
      isMinimized: false,
      isMaximized: false,
      ...app,
    },
  });
  
  focusWindow(id);
};

export const focusWindow = (id: string) => {
  const store = osStore.get();
  const newZ = store.highestZIndex + 1;
  
  osStore.setKey('windows', {
    ...store.windows,
    [id]: { ...store.windows[id], zIndex: newZ }
  });
  osStore.setKey('highestZIndex', newZ);
  osStore.setKey('activeWindowId', id);
};

export const closeWindow = (id: string) => {
  const { windows } = osStore.get();
  const { [id]: _, ...rest } = windows; // Remove key
  osStore.setKey('windows', rest);
  osStore.setKey('activeWindowId', null);
};

export const updateWindowPos = (id: string, x: number, y: number) => {
    const w = osStore.get().windows[id];
    if(w) osStore.setKey('windows', { ...osStore.get().windows, [id]: { ...w, x, y } });
}

export const minimizeWindow = (id: string) => {
  const store = osStore.get();
  const window = store.windows[id];
  if (window) {
    osStore.setKey('windows', {
      ...store.windows,
      [id]: { ...window, isMinimized: !window.isMinimized }
    });
  }
};

export const maximizeWindow = (id: string) => {
  const store = osStore.get();
  const window = store.windows[id];
  if (window) {
    const isMaximized = !window.isMaximized;
    const newWindow = {
      ...window,
      isMaximized,
      prevBounds: isMaximized ? { x: window.x, y: window.y, width: window.width, height: window.height } : window.prevBounds
    };

    if (isMaximized) {
      newWindow.x = 0;
      newWindow.y = 48; // Account for menu bar
      newWindow.width = window.innerWidth || 1200;
      newWindow.height = (window.innerHeight || 800) - 48;
    } else if (newWindow.prevBounds) {
      newWindow.x = newWindow.prevBounds.x;
      newWindow.y = newWindow.prevBounds.y;
      newWindow.width = newWindow.prevBounds.width;
      newWindow.height = newWindow.prevBounds.height;
    }

    osStore.setKey('windows', {
      ...store.windows,
      [id]: newWindow
    });
  }
};