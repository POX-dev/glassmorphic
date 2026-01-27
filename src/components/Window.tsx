import { useState, useRef, useEffect } from 'react';
import { X, Minus, Maximize2, Hexagon } from 'lucide-react'; // Added Hexagon
import { useStore } from '@nanostores/react'; // Added useStore
import { type WindowData, focusWindow, closeWindow, updateWindowPos } from '../store/osStore';
import { motion, AnimatePresence } from 'framer-motion';
import { glassOpacity } from '../store/settingsStore';

// Dynamic Content Resolver
import Settings from './apps/Settings';
import Terminal from './apps/Terminal';
import FileExplorer from './apps/FileExplorer';

export default function Window({ data }: { data: WindowData }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Access the live settings
  const $opacity = useStore(glassOpacity);

  const handleMouseDown = (e: React.MouseEvent) => {
    focusWindow(data.id);
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - data.x,
      y: e.clientY - data.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) updateWindowPos(data.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, data.id]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        left: data.x,
        top: data.y,
        width: data.width,
        height: data.height,
        zIndex: data.zIndex,
        // We inject the dynamic opacity here:
        backgroundColor: `rgba(255, 255, 255, ${$opacity / 100})` 
      }}
      className="absolute flex flex-col rounded-xl overflow-hidden shadow-2xl backdrop-blur-3xl border border-white/20"
      onMouseDown={() => focusWindow(data.id)}
    >
      {/* Glass Title Bar */}
      <div 
        className="h-10 bg-gradient-to-b from-white/10 to-transparent border-b border-white/10 flex items-center justify-between px-4 cursor-default select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex gap-2 window-controls group">
          <button onClick={(e) => { e.stopPropagation(); closeWindow(data.id); }} className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] shadow-inner" />
          <button className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24] shadow-inner" />
          <button className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] shadow-inner" />
        </div>
        <span className="text-white/90 text-sm font-medium drop-shadow-sm">{data.title}</span>
        <div className="w-10"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-black/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        
        <div className="p-6 relative z-10 text-white h-full overflow-auto">
          {data.type === 'settings' ? (
            <Settings />
          ) : data.type === 'terminal' ? (
            <Terminal /> 
          ): data.type === 'finder' ? (
            <FileExplorer /> 
          ) : data.content ? (
            <textarea 
              className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm text-gray-200" 
              defaultValue={data.content}
              readOnly 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/20">
              <Hexagon size={48} strokeWidth={1} />
              <span className="mt-4 text-sm font-light">Glassmorphic System Process</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}