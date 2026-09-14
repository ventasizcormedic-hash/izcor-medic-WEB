import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

interface MedicalSearchBoxProps {
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  onSearchSubmit?: (query: string) => void;
  placeholder?: string;
}

export function MedicalSearchBox({ searchTerm, onSearchChange, onSearchSubmit, placeholder = 'Buscar equipos médicos, marcas, REF, catálogos...' }: MedicalSearchBoxProps) {
  const [query, setQuery] = useState(searchTerm || '');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(query);
      return;
    }
    if (query.trim()) {
      navigate(`/productos?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/productos');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto flex items-center bg-white rounded-2xl shadow-xl p-2 border border-slate-200">
      <div className="pl-4 text-slate-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none text-sm sm:text-base font-medium"
      />
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 flex-shrink-0 text-sm sm:text-base shadow-md"
      >
        <span>Buscar</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
