import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Home, Globe } from 'lucide-react';

export default function Browser() {
  const [url, setUrl] = useState('https://example.com');
  const [history, setHistory] = useState<string[]>(['https://example.com']);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigateTo = (newUrl: string) => {
    if (newUrl !== history[currentIndex]) {
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(newUrl);
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
      setUrl(newUrl);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUrl(history[currentIndex - 1]);
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUrl(history[currentIndex + 1]);
    }
  };

  const refresh = () => {
    // Simulate refresh
    console.log('Refreshing:', url);
  };

  const goHome = () => {
    navigateTo('https://example.com');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(url);
  };

  return (
    <div className="flex flex-col h-full bg-black/10">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-white/5">
        <div className="flex gap-1">
          <button
            onClick={goBack}
            disabled={currentIndex === 0}
            className="p-2 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={goForward}
            disabled={currentIndex === history.length - 1}
            className="p-2 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowRight size={16} />
          </button>
          <button
            onClick={refresh}
            className="p-2 rounded hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={goHome}
            className="p-2 rounded hover:bg-white/10 transition-colors"
          >
            <Home size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 mx-4">
          <div className="flex bg-black/20 rounded-lg border border-white/10 overflow-hidden">
            <div className="px-3 py-2 text-white/60 flex items-center">
              <Globe size={14} />
            </div>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-3 py-2 bg-transparent text-white/90 outline-none"
              placeholder="Enter URL or search"
            />
          </div>
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative">
        {/* Browser Content Simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
          <div className="text-center">
            <Globe size={64} className="mx-auto mb-4 text-white/30" />
            <h2 className="text-2xl font-light text-white/70 mb-2">Glassmorphic Browser</h2>
            <p className="text-white/50 mb-4">Current URL: {url}</p>
            <div className="space-y-2 text-sm text-white/40">
              <p>This is a simulated browser interface.</p>
              <p>In a real implementation, this would render web pages.</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
            <h3 className="text-white/80 font-medium mb-3">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'GitHub', url: 'https://github.com' },
                { name: 'React', url: 'https://react.dev' },
                { name: 'Tailwind', url: 'https://tailwindcss.com' },
                { name: 'Astro', url: 'https://astro.build' },
              ].map(site => (
                <button
                  key={site.name}
                  onClick={() => navigateTo(site.url)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors border border-white/10"
                >
                  <div className="text-white/90 font-medium">{site.name}</div>
                  <div className="text-white/50 text-sm truncate">{site.url}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}