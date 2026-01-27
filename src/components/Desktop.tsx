import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { osStore, openWindow } from '../store/osStore';
import Window from './Window';
import { Folder, FileText, Settings as SettingsIcon, Terminal, Globe } from 'lucide-react'; // Renamed icon to avoid conflict
import { getFiles } from '../lib/filesystem';
import { wallpaper, WALLPAPERS } from '../store/settingsStore';

export default function Desktop() {
  const { windows } = useStore(osStore);
  const [files, setFiles] = useState<any[]>([]);

  // Listen to global settings
  const $currentWallpaper = useStore(wallpaper);
  const wpCss = WALLPAPERS.find(w => w.id === $currentWallpaper)?.css;

  useEffect(() => {
    getFiles('/desktop').then(setFiles);
  }, []);

  const apps = [
    { name: 'Browser', icon: Globe, type: 'browser' },
    { name: 'Settings', icon: SettingsIcon, type: 'settings' }, // Type matched to Window.tsx logic
    { name: 'Terminal', icon: Terminal, type: 'terminal' }, // Ready for the terminal app
  ];

  return (
    <div 
      className="w-full h-full pt-12 p-4 relative transition-all duration-1000 ease-in-out bg-cover bg-center"
      style={{ backgroundImage: wpCss }} // This line connects the Settings store to the UI
    >
      {/* Grid Layout for Icons */}
      <div className="grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-4 w-fit h-full content-start">
        
        {/* Render Application Icons */}
        {apps.map((app) => (
          <button
            key={app.name}
            onClick={() => openWindow({ title: app.name, type: app.type as any })}
            className="flex flex-col items-center justify-center w-24 h-24 rounded-lg hover:bg-white/10 transition-colors group outline-none"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <app.icon className="text-white drop-shadow-sm" size={24} />
            </div>
            <span className="mt-2 text-white text-[11px] drop-shadow-lg font-medium tracking-wide">
              {app.name}
            </span>
          </button>
        ))}

        {/* Render Desktop Files */}
        {files.map((file) => (
          <button
            key={file.path}
            onClick={() => openWindow({ 
              title: file.path.split('/').pop(), 
              content: file.content, 
              type: 'editor' 
            })}
            className="flex flex-col items-center justify-center w-24 h-24 rounded-lg hover:bg-white/10 transition-colors group outline-none"
          >
            <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform">
               <FileText className="text-blue-200 drop-shadow-xl" size={40} strokeWidth={1.5} />
            </div>
            <span className="mt-2 text-white text-[11px] drop-shadow-md font-medium truncate w-full text-center px-1">
              {file.path.split('/').pop()}
            </span>
          </button>
        ))}
      </div>

      {/* Render Active Windows */}
      {Object.values(windows).map((win) => (
        <Window key={win.id} data={win} />
      ))}
    </div>
  );
}