import { useStore } from '@nanostores/react';
import { wallpaper, glassOpacity, WALLPAPERS } from '../../store/settingsStore';
import { Palette, Layers, Monitor } from 'lucide-react';

export default function Settings() {
  const $wallpaper = useStore(wallpaper);
  const $opacity = useStore(glassOpacity);

  return (
    <div className="flex flex-col gap-8 p-2">
      <section>
        <div className="flex items-center gap-2 mb-4 text-blue-300">
          <Monitor size={18} />
          <h3 className="font-semibold">Desktop Wallpaper</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {WALLPAPERS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => wallpaper.set(wp.id)}
              className={`h-16 rounded-lg border-2 transition-all ${$wallpaper === wp.id ? 'border-blue-400 scale-95' : 'border-transparent'}`}
              style={{ background: wp.css, backgroundSize: 'cover' }}
              title={wp.name}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4 text-purple-300">
          <Layers size={18} />
          <h3 className="font-semibold">Glass Transparency</h3>
        </div>
        <input 
          type="range" 
          min="5" 
          max="40" 
          value={$opacity} 
          onChange={(e) => glassOpacity.set(parseInt(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-400"
        />
        <div className="flex justify-between text-[10px] text-white/40 mt-2">
          <span>Clear</span>
          <span>Frosted</span>
        </div>
      </section>
    </div>
  );
}