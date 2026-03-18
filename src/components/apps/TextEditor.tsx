import { useState, useEffect } from 'react';
import { Save, FileText, X } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { type WindowData } from '../../store/osStore';

interface TextEditorProps {
  windowData: WindowData;
}

export default function TextEditor({ windowData }: TextEditorProps) {
  const [content, setContent] = useState(windowData.content || '');
  const [fileName, setFileName] = useState(windowData.title || 'Untitled.txt');
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    setIsSaved(content === (windowData.content || ''));
  }, [content, windowData.content]);

  const handleSave = () => {
    // In a real implementation, this would save to the filesystem
    console.log('Saving file:', fileName, content);
    setIsSaved(true);
    // You could dispatch an action to update the file in the store
  };

  return (
    <div className="flex flex-col h-full bg-black/10">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-white/5">
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
            isSaved
              ? 'text-white/40 cursor-not-allowed'
              : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300'
          }`}
        >
          <Save size={14} />
          Save
        </button>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <FileText size={14} />
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="bg-transparent border-none outline-none text-white/80"
            placeholder="Filename"
          />
          {!isSaved && <span className="text-yellow-400">•</span>}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full bg-transparent border-none outline-none resize-none text-white/90 font-mono text-sm leading-relaxed"
          placeholder="Start writing..."
          spellCheck={false}
        />
      </div>
    </div>
  );
}