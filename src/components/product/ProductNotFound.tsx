import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export function ProductNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center">
      <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Producto no encontrado</h2>
      <p className="text-slate-500 mb-6">El equipo o insumo médico que buscas no existe o fue dado de baja.</p>
      <Link to="/productos" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-md">
        Ir al Catálogo
      </Link>
    </div>
  );
}
