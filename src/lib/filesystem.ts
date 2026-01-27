import { openDB } from 'idb';

const DB_NAME = 'GlassmorphicOS_FS';
const STORE_NAME = 'files';

// Helper to get all items in a specific directory
export const getDirectoryContents = async (path: string) => {
  const db = await openDB(DB_NAME, 1);
  const allFiles = await db.getAll(STORE_NAME);
  
  // Filter for items that start with the path but aren't deeper in subfolders
  return allFiles.filter(file => {
    const relativePath = file.path.replace(path, '').replace(/^\//, '');
    return relativePath && !relativePath.includes('/');
  });
};

export const initFS = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'path' });
      }
    },
  });
  
  // Seed default files
  if ((await db.count(STORE_NAME)) === 0) {
    await db.put(STORE_NAME, { 
      path: '/desktop/Welcome.txt', 
      content: 'Welcome to Glassmorphic OS.\n\nEnjoy the blur.', 
      type: 'text' 
    });
    await db.put(STORE_NAME, { 
      path: '/desktop/System_Config.json', 
      content: '{\n  "theme": "glass",\n  "transparency": 0.85\n}', 
      type: 'json' 
    });
  }
  return db;
};

export const getFiles = async (dir: string) => {
  const db = await initFS();
  const all = await db.getAll(STORE_NAME);
  return all.filter((f: any) => f.path.startsWith(dir));
};