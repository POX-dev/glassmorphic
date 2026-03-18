import { useState, useRef, useEffect } from 'react';
import { X, Minus, Maximize2, Minimize2, Hexagon } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { type WindowData, focusWindow, closeWindow, updateWindowPos, minimizeWindow, maximizeWindow } from '../store/osStore';
import { motion, AnimatePresence } from 'framer-motion';
import { glassOpacity } from '../store/settingsStore';

// Dynamic Content Resolver
import Settings from './apps/Settings';
import Terminal from './apps/Terminal';
import FileExplorer from './apps/FileExplorer';
import TextEditor from './apps/TextEditor';
import Calculator from './apps/Calculator';
import Notes from './apps/Notes';
import Browser from './apps/Browser';

export default function Window({ data }: { data: WindowData }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Access the live settings
  const $opacity = useStore(glassOpacity);

  const SNAP_DISTANCE = 20; // Distance from edge to trigger snap/resize
  const MIN_WIDTH = 300;
  const MIN_HEIGHT = 200;

  const getViewportBounds = () => ({
    width: window.innerWidth,
    height: window.innerHeight - 48, // Account for menu bar
    top: 48
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    focusWindow(data.id);
    if ((e.target as HTMLElement).closest('.window-controls')) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on resize borders
    const isLeftBorder = x < 10;
    const isRightBorder = x > rect.width - 10;
    const isTopBorder = y < 10;
    const isBottomBorder = y > rect.height - 10;

    if (isLeftBorder || isRightBorder || isTopBorder || isBottomBorder) {
      setIsResizing(true);
      let direction = '';
      if (isTopBorder) direction += 'n';
      if (isBottomBorder) direction += 's';
      if (isLeftBorder) direction += 'w';
      if (isRightBorder) direction += 'e';
      setResizeDirection(direction);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: data.width,
        height: data.height
      });
    } else {
      // Regular dragging
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - data.x,
        y: e.clientY - data.y
      });
    }
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || !resizeDirection) return;

    const dx = e.clientX - resizeStart.x;
    const dy = e.clientY - resizeStart.y;
    const bounds = getViewportBounds();

    let newX = data.x;
    let newY = data.y;
    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;

    if (resizeDirection.includes('w')) {
      newWidth = Math.max(MIN_WIDTH, resizeStart.width - dx);
      newX = data.x + (resizeStart.width - newWidth);
    }
    if (resizeDirection.includes('e')) {
      newWidth = Math.max(MIN_WIDTH, resizeStart.width + dx);
    }
    if (resizeDirection.includes('n')) {
      newHeight = Math.max(MIN_HEIGHT, resizeStart.height - dy);
      newY = data.y + (resizeStart.height - newHeight);
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(MIN_HEIGHT, resizeStart.height + dy);
    }

    // Constrain to viewport
    if (newX < 0) {
      newWidth += newX;
      newX = 0;
    }
    if (newY < bounds.top) {
      newHeight += (newY - bounds.top);
      newY = bounds.top;
    }
    if (newX + newWidth > bounds.width) {
      newWidth = bounds.width - newX;
    }
    if (newY + newHeight > bounds.height + bounds.top) {
      newHeight = bounds.height + bounds.top - newY;
    }

    // Update window bounds
    const store = osStore.get();
    osStore.setKey('windows', {
      ...store.windows,
      [data.id]: {
        ...store.windows[data.id],
        x: newX,
        y: newY,
        width: Math.max(MIN_WIDTH, newWidth),
        height: Math.max(MIN_HEIGHT, newHeight)
      }
    });
  };

  const handleDrag = (e: MouseEvent) => {
    if (!isDragging) return;

    const bounds = getViewportBounds();
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    // Check for edge snapping/resizing
    const nearLeft = newX <= SNAP_DISTANCE;
    const nearRight = newX + data.width >= bounds.width - SNAP_DISTANCE;
    const nearTop = newY <= bounds.top + SNAP_DISTANCE;
    const nearBottom = newY + data.height >= bounds.height + bounds.top - SNAP_DISTANCE;

    if (nearLeft && !nearTop && !nearBottom) {
      // Snap to left half
      newX = 0;
      newY = bounds.top;
      updateWindowBounds(data.id, 0, bounds.top, bounds.width / 2, bounds.height);
      return;
    } else if (nearRight && !nearTop && !nearBottom) {
      // Snap to right half
      newX = bounds.width / 2;
      newY = bounds.top;
      updateWindowBounds(data.id, bounds.width / 2, bounds.top, bounds.width / 2, bounds.height);
      return;
    } else if (nearTop && !nearLeft && !nearRight) {
      // Snap to top half
      newX = 0;
      newY = bounds.top;
      updateWindowBounds(data.id, 0, bounds.top, bounds.width, bounds.height / 2);
      return;
    } else if (nearBottom && !nearLeft && !nearRight) {
      // Snap to bottom half
      newX = 0;
      newY = bounds.top + bounds.height / 2;
      updateWindowBounds(data.id, 0, bounds.top + bounds.height / 2, bounds.width, bounds.height / 2);
      return;
    }

    // Constrain to viewport bounds (keep at least 50px visible)
    const minVisible = 50;
    newX = Math.max(-data.width + minVisible, Math.min(bounds.width - minVisible, newX));
    newY = Math.max(bounds.top - data.height + minVisible, Math.min(bounds.height + bounds.top - minVisible, newY));

    updateWindowPos(data.id, newX, newY);
  };

  const updateWindowBounds = (id: string, x: number, y: number, width: number, height: number) => {
    const store = osStore.get();
    osStore.setKey('windows', {
      ...store.windows,
      [id]: {
        ...store.windows[id],
        x, y, width, height,
        isMaximized: false
      }
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        handleResize(e);
      } else if (isDragging) {
        handleDrag(e);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeDirection, resizeStart, data]);

  return (
    <AnimatePresence>
      {!data.isMinimized && (
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
            backgroundColor: `rgba(255, 255, 255, ${$opacity / 100})`
          }}
          className={`absolute flex flex-col rounded-xl overflow-hidden shadow-2xl backdrop-blur-3xl border border-white/20 ${
            isResizing ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseDown={() => focusWindow(data.id)}
        >
          {/* Glass Title Bar */}
          <div
            className="h-10 bg-gradient-to-b from-white/10 to-transparent border-b border-white/10 flex items-center justify-between px-4 cursor-default select-none"
            onMouseDown={handleMouseDown}
          >
            <div className="flex gap-2 window-controls group">
              <button onClick={(e) => { e.stopPropagation(); closeWindow(data.id); }} className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] shadow-inner hover:bg-[#ff6b67] transition-colors" />
              <button onClick={(e) => { e.stopPropagation(); minimizeWindow(data.id); }} className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24] shadow-inner hover:bg-[#fecf3e] transition-colors" />
              <button onClick={(e) => { e.stopPropagation(); maximizeWindow(data.id); }} className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] shadow-inner hover:bg-[#32d74b] transition-colors" />
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
              ) : data.type === 'editor' ? (
                <TextEditor windowData={data} />
              ) : data.type === 'calculator' ? (
                <Calculator />
              ) : data.type === 'notes' ? (
                <Notes />
              ) : data.type === 'browser' ? (
                <Browser />
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
      )}
    </AnimatePresence>
  );
}