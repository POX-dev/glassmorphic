import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, StickyNote } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
}

const NOTE_COLORS = [
  'bg-yellow-200/20 border-yellow-300/30',
  'bg-blue-200/20 border-blue-300/30',
  'bg-green-200/20 border-green-300/30',
  'bg-pink-200/20 border-pink-300/30',
  'bg-purple-200/20 border-purple-300/30',
];

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('glassmorphic-notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt)
      }));
      setNotes(parsedNotes);
    }
  }, []);

  useEffect(() => {
    // Save notes to localStorage
    localStorage.setItem('glassmorphic-notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      createdAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const saveNote = () => {
    if (!selectedNote) return;

    const updatedNotes = notes.map(note =>
      note.id === selectedNote.id
        ? { ...note, title: editTitle, content: editContent }
        : note
    );
    setNotes(updatedNotes);
    setSelectedNote({ ...selectedNote, title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const startEditing = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  return (
    <div className="flex h-full bg-black/10">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white/90 font-semibold flex items-center gap-2">
            <StickyNote size={18} />
            Notes
          </h2>
          <button
            onClick={createNote}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedNote?.id === note.id
                  ? 'bg-white/20 border-white/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              } ${note.color}`}
            >
              <h3 className="text-white/90 font-medium text-sm truncate">
                {note.title}
              </h3>
              <p className="text-white/60 text-xs mt-1 line-clamp-2">
                {note.content || 'Empty note'}
              </p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-white/40 text-xs">
                  {note.createdAt.toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {notes.length === 0 && (
            <div className="text-center text-white/40 py-8">
              <StickyNote size={32} className="mx-auto mb-2 opacity-50" />
              <p>No notes yet</p>
              <p className="text-xs">Click + to create one</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {selectedNote ? (
          <div className="h-full">
            {isEditing ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-2xl font-bold bg-transparent border-none outline-none text-white/90 placeholder-white/50"
                    placeholder="Note title"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveNote}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/70 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none resize-none text-white/80 leading-relaxed"
                  placeholder="Start writing your note..."
                />
              </div>
            ) : (
              <div className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-white/90">
                    {selectedNote.title}
                  </h1>
                  <button
                    onClick={() => startEditing(selectedNote)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                </div>
                <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                  {selectedNote.content || (
                    <span className="text-white/40 italic">This note is empty</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/40">
            <StickyNote size={64} className="mb-4 opacity-50" />
            <h3 className="text-xl font-light mb-2">Select a note to view</h3>
            <p className="text-sm">Choose a note from the sidebar or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}