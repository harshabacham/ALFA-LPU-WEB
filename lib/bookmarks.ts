import { useState, useEffect } from 'react';
import { Event as AppEvent, PGRoom, Note } from '../types';

export interface BookmarkedEvent {
  item: AppEvent;
  index: number;
}

export interface BookmarkedPG {
  item: PGRoom;
  index: number;
}

export interface BookmarkedNote {
  item: Note;
}

const EVENTS_KEY = 'alfa_bookmarks_events';
const PGS_KEY = 'alfa_bookmarks_pgs';
const NOTES_KEY = 'alfa_bookmarks_notes';

// Safe localStorage access
const getStored = <T>(key: string, fallback: T): T => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error('Error reading localStorage', e);
    return fallback;
  }
};

const setStored = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch a custom storage event so other instances of the hook sync immediately
    window.dispatchEvent(new Event('alfa_bookmarks_updated'));
  } catch (e) {
    console.error('Error writing localStorage', e);
  }
};

export const bookmarkService = {
  getEvents: (): BookmarkedEvent[] => getStored<BookmarkedEvent[]>(EVENTS_KEY, []),
  getPGs: (): BookmarkedPG[] => getStored<BookmarkedPG[]>(PGS_KEY, []),
  getNotes: (): BookmarkedNote[] => getStored<BookmarkedNote[]>(NOTES_KEY, []),

  isEventBookmarked: (title: string): boolean => {
    const events = bookmarkService.getEvents();
    return events.some(e => e.item.title === title);
  },

  isPGBookmarked: (name: string): boolean => {
    const pgs = bookmarkService.getPGs();
    return pgs.some(p => p.item.name === name);
  },

  isNoteBookmarked: (fileId: string): boolean => {
    const notes = bookmarkService.getNotes();
    return notes.some(n => n.item.file_id === fileId);
  },

  toggleEvent: (event: AppEvent, index: number): boolean => {
    const events = bookmarkService.getEvents();
    const isBookmarked = events.some(e => e.item.title === event.title);
    let newEvents: BookmarkedEvent[];

    if (isBookmarked) {
      newEvents = events.filter(e => e.item.title !== event.title);
    } else {
      newEvents = [...events, { item: event, index }];
    }
    setStored(EVENTS_KEY, newEvents);
    return !isBookmarked;
  },

  togglePG: (pg: PGRoom, index: number): boolean => {
    const pgs = bookmarkService.getPGs();
    const isBookmarked = pgs.some(p => p.item.name === pg.name);
    let newPGs: BookmarkedPG[];

    if (isBookmarked) {
      newPGs = pgs.filter(p => p.item.name !== pg.name);
    } else {
      newPGs = [...pgs, { item: pg, index }];
    }
    setStored(PGS_KEY, newPGs);
    return !isBookmarked;
  },

  toggleNote: (note: Note): boolean => {
    const notes = bookmarkService.getNotes();
    const isBookmarked = notes.some(n => n.item.file_id === note.file_id);
    let newNotes: BookmarkedNote[];

    if (isBookmarked) {
      newNotes = notes.filter(n => n.item.file_id !== note.file_id);
    } else {
      newNotes = [...notes, { item: note }];
    }
    setStored(NOTES_KEY, newNotes);
    return !isBookmarked;
  }
};

export const useBookmarks = () => {
  const [events, setEvents] = useState<BookmarkedEvent[]>([]);
  const [pgs, setPgs] = useState<BookmarkedPG[]>([]);
  const [notes, setNotes] = useState<BookmarkedNote[]>([]);

  const reload = () => {
    setEvents(bookmarkService.getEvents());
    setPgs(bookmarkService.getPGs());
    setNotes(bookmarkService.getNotes());
  };

  useEffect(() => {
    reload();

    const handleUpdate = () => {
      reload();
    };

    window.addEventListener('alfa_bookmarks_updated', handleUpdate);
    return () => {
      window.removeEventListener('alfa_bookmarks_updated', handleUpdate);
    };
  }, []);

  return {
    events,
    pgs,
    notes,
    isEventBookmarked: bookmarkService.isEventBookmarked,
    isPGBookmarked: bookmarkService.isPGBookmarked,
    isNoteBookmarked: bookmarkService.isNoteBookmarked,
    toggleEvent: (event: AppEvent, index: number) => {
      const res = bookmarkService.toggleEvent(event, index);
      reload();
      return res;
    },
    togglePG: (pg: PGRoom, index: number) => {
      const res = bookmarkService.togglePG(pg, index);
      reload();
      return res;
    },
    toggleNote: (note: Note) => {
      const res = bookmarkService.toggleNote(note);
      reload();
      return res;
    }
  };
};
