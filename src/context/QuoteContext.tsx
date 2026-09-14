import React, { createContext, useContext, useState, useEffect } from 'react';

export interface QuoteItem {
  id: number;
  name: string;
  brandName?: string | null;
  brand?: string | null;
  model?: string | null;
  imageUrl?: string | null;
  image?: string | null;
  slug: string;
  categoryName?: string;
  quantity?: number;
}

interface QuoteContextType {
  items: QuoteItem[];
  addItem: (item: QuoteItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearTray: () => void;
  isInTray: (id: number) => boolean;
  itemCount: number;
  justAddedId: number | null;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('izcor_quote_tray');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [justAddedId, setJustAddedId] = useState<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('izcor_quote_tray', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const addItem = (item: QuoteItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 2000);
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearTray = () => {
    setItems([]);
  };

  const isInTray = (id: number) => {
    return items.some(i => i.id === id);
  };

  const itemCount = items.reduce((acc, curr) => acc + (curr.quantity || 1), 0);

  return (
    <QuoteContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearTray, isInTray, itemCount, justAddedId }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
}
