import { atom } from 'nanostores';

export const wallpaper = atom<string>('bg-default');
export const glassOpacity = atom<number>(15); // Percentage of opacity

export const WALLPAPERS = [
  { id: 'bg-default', name: 'Deep Space', css: 'radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.4), transparent 25%), radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.4), transparent 25%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' },
  { id: 'bg-sunset', name: 'Cyber Sunset', css: 'linear-gradient(to bottom right, #f43f5e, #fbbf24, #1e1b4b)' },
  { id: 'bg-mesh', name: 'Aurora Mesh', css: 'linear-gradient(45deg, #00d2ff 0%, #3a7bd5 100%)' }
];