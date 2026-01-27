import { useStore } from '@nanostores/react';
import { osStore } from '../store/osStore';
import { Hexagon, Battery, Wifi, Search, Command } from 'lucide-react'; // Using Hexagon as OS logo
import { useState, useEffect } from 'react';

export default function MenuBar() {
  const { activeWindowId, windows } = useStore(osStore);
  const activeWindow = activeWindowId ? windows[activeWindowId] : null;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const appName = activeWindow ? activeWindow.title : 'Glassmorphic OS';

  return (
    <header className="fixed top-0 inset-x-0 h-9 bg-white/10 backdrop-blur-2xl border-b border-white/20 flex items-center justify-between px-4 z-[9999] text-white/90 text-xs shadow-lg">
      <div className="flex items-center gap-6">
        {/* OS Logo */}
        <div className="flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded transition-colors cursor-pointer">
           <Hexagon size={16} className="text-blue-300 fill-blue-300/20" />
        </div>

        {/* App Name */}
        <span className="font-bold tracking-wide text-sm">{appName}</span>

        {/* Menu Items */}
        <nav className="flex gap-1">
          {['File', 'Edit', 'View', 'Window', 'Help'].map(item => (
            <button key={item} className="px-3 py-1 rounded hover:bg-white/10 transition-colors">
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-2 py-1 bg-black/20 rounded-md border border-white/5">
            <Command size={12} className="text-white/50" />
            <span className="text-white/50">Spotlight</span>
        </div>
        <Wifi size={16} />
        <Battery size={16} />
        <span className="font-medium font-mono">
            {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>
    </header>
  );
}