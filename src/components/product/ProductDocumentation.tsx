import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface ProductDocumentationProps {
  documents?: any[];
  sourceUrl?: string;
}

export function ProductDocumentation({ documents = [], sourceUrl }: ProductDocumentationProps) {
  if ((!documents || documents.length === 0) && !sourceUrl) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-brand-navy" /> Documentación y Descargas
      </h3>
      <div className="flex flex-col gap-3">
        {documents.map((doc, idx) => (
          <a
            key={idx}
            href={doc.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-brand-navy" />
              <span>{doc.title || doc.name || `Ficha Técnica PDF ${idx + 1}`}</span>
            </div>
            <span className="text-xs font-bold text-brand-navy uppercase">Descargar →</span>
          </a>
        ))}
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-slate-500" />
              <span>Fuente de Información Oficial / Fabricante</span>
            </div>
            <span className="text-xs font-bold text-slate-600 uppercase">Visitar Sitio →</span>
          </a>
        )}
      </div>
    </div>
  );
}
