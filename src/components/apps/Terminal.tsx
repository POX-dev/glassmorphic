import { useState, useRef, useEffect } from 'react';
import { getFiles } from '../../lib/filesystem';

export default function Terminal() {
  const [history, setHistory] = useState<string[]>(['Welcome to Glassmorphic OS v1.0', 'Type "ls" to list files...']);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `> ${input}`];

    if (cmd === 'ls') {
      const files = await getFiles('/desktop');
      const fileList = files.map(f => f.path.split('/').pop()).join('  ');
      newHistory.push(fileList || 'No files found.');
    } else if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (cmd === 'help') {
      newHistory.push('Available commands: ls, clear, help, whoami');
    } else if (cmd === 'whoami') {
      newHistory.push('glassmorphic_user');
    } else {
      newHistory.push(`Command not found: ${cmd}`);
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full font-mono text-sm text-green-400 p-2">
      <div className="flex-1 overflow-y-auto mb-2 space-y-1">
        {history.map((line, i) => (
          <div key={i} className="break-all whitespace-pre-wrap">{line}</div>
        ))}
        <div ref={scrollRef} />
      </div>
      <form onSubmit={handleCommand} className="flex gap-2 border-t border-white/10 pt-2">
        <span>$</span>
        <input
          autoFocus
          className="bg-transparent outline-none flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      </form>
    </div>
  );
}