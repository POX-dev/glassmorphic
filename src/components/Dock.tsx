import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Globe, Settings, Terminal, Folder, MessageSquare, Calculator, StickyNote } from 'lucide-react';
import { openWindow } from '../store/osStore';

function DockIcon({ icon: Icon, label, onClick, mouseX }: any) {
  const ref = useRef<HTMLDivElement>(null);

  // Distance-based magnification logic
  const distance = useMotionValue(Infinity);
  const size = useSpring(useTransform(distance, [-150, 0, 150], [48, 80, 48]), {
    stiffness: 400,
    damping: 30,
  });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => distance.set(e.pageX - (ref.current?.getBoundingClientRect().x || 0) - 24)}
      onMouseLeave={() => distance.set(Infinity)}
      style={{ width: size, height: size }}
      onClick={onClick}
      className="flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl cursor-pointer hover:bg-white/20 transition-colors relative group"
    >
      <Icon className="text-white w-1/2 h-1/2" />
      {/* Tooltip */}
      <span className="absolute -top-12 px-2 py-1 rounded bg-black/50 backdrop-blur-lg text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </motion.div>
  );
}

export default function Dock() {
  const mouseX = useMotionValue(Infinity);

  const dockApps = [
    { name: 'Finder', icon: Folder, type: 'finder' },
    { name: 'Calculator', icon: Calculator, type: 'calculator' },
    { name: 'Notes', icon: StickyNote, type: 'notes' },
    { name: 'Browser', icon: Globe, type: 'browser' },
    { name: 'Terminal', icon: Terminal, type: 'terminal' },
    { name: 'Settings', icon: Settings, type: 'settings' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[10000]">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-3 px-4 pb-3 pt-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[24px] shadow-2xl shadow-black/40"
      >
        {dockApps.map((app) => (
          <DockIcon
            key={app.name}
            mouseX={mouseX}
            icon={app.icon}
            label={app.name}
            onClick={() => openWindow({ title: app.name, type: app.type as any })}
          />
        ))}
      </motion.div>
    </div>
  );
}