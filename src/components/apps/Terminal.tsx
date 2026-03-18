import { useState, useRef, useEffect } from 'react';
import { getFiles, getDirectoryContents } from '../../lib/filesystem';

export default function Terminal() {
  const [history, setHistory] = useState<string[]>(['Welcome to Glassmorphic OS v1.0', 'Type "help" for available commands.']);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('/desktop');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getPrompt = () => `glassmorphic_user@glassmorphic:${currentDir}$ `;

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newHistory = [...history, `${getPrompt()}${input}`];
    const args = cmd.split(' ');
    const command = args[0].toLowerCase();

    // Add to command history
    setCommandHistory(prev => [...prev, cmd]);

    switch (command) {
      case 'ls':
        const path = args[1] || currentDir;
        try {
          const files = await getDirectoryContents(path);
          const fileList = files.map(f => f.path.split('/').pop()).join('  ') || 'No files found.';
          newHistory.push(fileList);
        } catch {
          newHistory.push(`ls: cannot access '${path}': No such file or directory`);
        }
        break;

      case 'cd':
        const newDir = args[1];
        if (!newDir || newDir === '~') {
          setCurrentDir('/desktop');
        } else if (newDir === '..') {
          const parent = currentDir.split('/').slice(0, -1).join('/') || '/';
          setCurrentDir(parent);
        } else if (newDir.startsWith('/')) {
          setCurrentDir(newDir);
        } else {
          const fullPath = currentDir === '/' ? `/${newDir}` : `${currentDir}/${newDir}`;
          setCurrentDir(fullPath);
        }
        break;

      case 'pwd':
        newHistory.push(currentDir);
        break;

      case 'cat':
        if (!args[1]) {
          newHistory.push('cat: missing file operand');
          break;
        }
        const filePath = args[1].startsWith('/') ? args[1] : `${currentDir}/${args[1]}`;
        try {
          const files = await getFiles(filePath);
          const file = files.find(f => f.path === filePath);
          if (file) {
            newHistory.push(file.content);
          } else {
            newHistory.push(`cat: ${args[1]}: No such file or directory`);
          }
        } catch {
          newHistory.push(`cat: ${args[1]}: No such file or directory`);
        }
        break;

      case 'echo':
        newHistory.push(args.slice(1).join(' '));
        break;

      case 'date':
        newHistory.push(new Date().toString());
        break;

      case 'whoami':
        newHistory.push('glassmorphic_user');
        break;

      case 'history':
        const hist = commandHistory.map((c, i) => `${i + 1}  ${c}`).join('\n');
        newHistory.push(hist || 'No commands in history.');
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'help':
        newHistory.push(`Available commands:
  ls [dir]     - List directory contents
  cd [dir]     - Change directory
  pwd          - Print working directory
  cat <file>   - Display file contents
  echo <text>  - Display text
  date         - Show current date and time
  whoami       - Show current user
  history      - Show command history
  clear        - Clear terminal
  help         - Show this help message`);
        break;

      default:
        newHistory.push(`Command not found: ${command}. Type 'help' for available commands.`);
    }

    setHistory(newHistory);
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for commands
      const commands = ['ls', 'cd', 'pwd', 'cat', 'echo', 'date', 'whoami', 'history', 'clear', 'help'];
      const partial = input.toLowerCase();
      const match = commands.find(cmd => cmd.startsWith(partial));
      if (match) {
        setInput(match);
      }
    }
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
        <span className="text-blue-400">{getPrompt()}</span>
        <input
          ref={inputRef}
          autoFocus
          className="bg-transparent outline-none flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />
      </form>
    </div>
  );
}