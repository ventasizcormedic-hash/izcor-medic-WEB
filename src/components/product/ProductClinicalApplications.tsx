import React from 'react';
import { Activity, CheckCircle2, Package } from 'lucide-react';

interface ProductClinicalApplicationsProps {
  applications?: string[];
  application?: string;
  presentation?: string;
}

export function ProductClinicalApplications({
  applications = [],
  application,
  presentation,
}: ProductClinicalApplicationsProps) {
  const list = [...applications];
  if (application && !list.includes(application)) {
    list.unshift(application);
  }

  if (list.length === 0 && !presentation) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-600" /> Aplicaciones Clínicas y Presentación
      </h3>
      {list.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {list.map((app, index) => (
            <li key={index} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{app}</span>
            </li>
          ))}
        </ul>
      )}
      {presentation && (
        <div className="flex items-center gap-2 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900">
          <Package className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-semibold">Formato de Presentación:</span>
          <span className="font-bold">{presentation}</span>
        </div>
      )}
    </div>
  );
}
