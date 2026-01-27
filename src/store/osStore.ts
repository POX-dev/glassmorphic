import { map } from 'nanostores';

export type WindowType = 'finder' | 'editor' | 'browser' | 'terminal' | 'settings';

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