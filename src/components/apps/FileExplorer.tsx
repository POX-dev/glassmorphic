import { useState, useEffect } from 'react';
import { Folder, FileText, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { getDirectoryContents } from '../../lib/filesystem';
import { openWindow } from '../../store/osStore';

export default function FileExplorer() {
  const [currentPath, setCurrentPath] = useState('/desktop');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    loadFolder();
  }, [currentPath]);

  const loadFolder = async () => {
    const contents = await getDirectoryContents(currentPath);
    setItems(contents);
  };

  const handleEntryClick = (item: any) => {
    if (item.type === 'folder') {
      setCurrentPath(item.path);
    } else {
      // Open file in Editor
      openWindow({ 
        title: item.path.split('/').pop(), 
        content: item.content, 
        type: 'editor' 
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/10">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-2 border-b border-white/10 bg-white/5">
        <div className="flex gap-1">
          <button className="p-1 hover:bg-white/10 rounded"><ChevronLeft size={16} /></button>
          <button className="p-1 hover:bg-white/10 rounded"><ChevronRight size={16} /></button>
        </div>
        <div className="flex-1 px-3 py-1 bg-black/20 rounded border border-white/5 text-xs text-gray-400">
          {currentPath}
        </div>
        <Search size={14} className="text-gray-500" />
      </div>

      {/* Main Grid */}
      <div className="flex-1 p-4 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 content-start overflow-auto">
        {items.map((item) => (
          <div
            key={item.path}
            onDoubleClick={() => handleEntryClick(item)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 cursor-default group"
          >
            {item.type === 'folder' ? (
              <Folder className="text-blue-400 fill-blue-400/20" size={40} />
            ) : (
              <FileText className="text-gray-300" size={40} />
            )}
            <span className="text-[10px] text-center truncate w-full px-1">
              {item.path.split('/').pop()}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full h-full flex items-center justify-center text-white/20 text-xs">
            This folder is empty
          </div>
        )}
      </div>
    </div>
  );
}