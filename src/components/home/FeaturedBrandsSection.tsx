import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Award, ArrowRight, ExternalLink, CheckCircle2, 
  Sparkles, Globe2, FileText, MessageCircle, X, ChevronRight,
  Stethoscope, Microscope, Activity, HeartPulse, Building2
} from 'lucide-react';
import { FEATURED_BRANDS_LIST, BrandData, BrandLogoImage } from '../brands/BrandLogos';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } 
  }
};

const filterTabs = [
  { id: 'all', label: 'Todas las Marcas', icon: Sparkles },
  { id: 'uci', label: 'UCI & Monitoreo', icon: Activity },
  { id: 'diagnostico', label: 'Diagnóstico & Precisión', icon: Stethoscope },
  { id: 'laboratorio', label: 'Laboratorio & Esterilización', icon: Microscope },
  { id: 'materno_infantil', label: 'Salud Fetal & Neonatal', icon: HeartPulse },
];

export function FeaturedBrandsSection() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeBrandModal, setActiveBrandModal] = useState<BrandData | null>(null);

  const filteredBrands = FEATURED_BRANDS_LIST.filter(brand => {
    if (selectedFilter === 'all') return true;
    return brand.categoryType === selectedFilter;
  });

  const getWhatsAppBrandLink = (brandName: string) => {
    const text = encodeURIComponent(
      `Hola IZCOR MEDIC, requiero información técnica y cotización formal de equipamiento médico de la marca ${brandName}.`
    );
    return `https://wa.me/51928130349?text=${text}`;
  };

  return (
    <section id="marcas-homologadas-section" className="py-20 sm:py-24 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Institucional de la Sección */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          variants={fadeUp} 
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00B9D8]/10 border border-[#00B9D8]/25 text-[#008DA8] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#008DA8]" />
            <span>Marcas y Fabricantes Homologados</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2C3E50] tracking-tight font-heading">
            Tecnología Médica de Fabricantes Líderes Internacionales
          </h2>
          <p className="text-slate-600 font-normal text-sm sm:text-base mt-3 leading-relaxed">
            Distribuimos y representamos equipamiento con garantía de fábrica, registros sanitarios <strong>DIGEMID</strong> vigentes y expedientes técnicos listos para comités de compra hospitalaria y procesos <strong>OSCE</strong>.
          </p>
        </motion.div>

        {/* Marquesina Dinámica y Fluida de Logos Oficiales (Sin distorsión) */}
        <div className="mb-14">
          <div className="relative overflow-hidden w-full py-4 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 sm:before:w-32 before:bg-gradient-to-r before:from-[#F8FAFC] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 sm:after:w-32 after:bg-gradient-to-l after:from-[#F8FAFC] after:to-transparent">
            <div className="inline-flex animate-marquee hover:pause gap-4 sm:gap-6 w-max items-center">
              {/* Duplicado para loop continuo */}
              {[...Array(2)].map((_, groupIdx) => (
                <div key={groupIdx} className="flex gap-4 sm:gap-6 shrink-0 items-center">
                  {FEATURED_BRANDS_LIST.map((brand) => (
                    <button
                      key={`${brand.id}-${groupIdx}`}
                      type="button"
                      onClick={() => setActiveBrandModal(brand)}
                      className="group w-44 sm:w-52 h-24 sm:h-28 px-4 py-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#00B9D8] transition-all cursor-pointer flex flex-col items-center justify-between text-center shrink-0 active:scale-98"
                      title={`Ver detalles de ${brand.name}`}
                    >
                      <div className="w-full h-12 sm:h-14 flex items-center justify-center overflow-hidden">
                        <img 
                          src={brand.logoUrl} 
                          alt={`Logo oficial de ${brand.name}`}
                          className="h-full w-full object-contain max-h-9 sm:max-h-11 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex items-center justify-between w-full pt-1 border-t border-slate-100 text-[10px] text-slate-500 group-hover:text-brand-navy font-semibold">
                        <span className="truncate">{brand.countryName}</span>
                        <span className="text-[#008DA8] font-bold">Ver Ficha →</span>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Barra de Filtros por Especialidad Clínica */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2C3E50] text-white shadow-sm ring-2 ring-[#2C3E50]/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Grid de Marcas Detalladas (Ubicadas a Detalle Sin Distorsión) */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredBrands.map((brand) => (
              <motion.div
                key={brand.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
              >
                {/* Borde superior de acento */}
                <div 
                  className="h-1.5 w-full transition-all"
                  style={{ backgroundColor: brand.accentColor || '#00B9D8' }}
                />

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  {/* Cabecera de la Marca: Logo Proporcionado + País */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/70 text-[11px] font-bold text-slate-700">
                        <Globe2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{brand.origin}</span>
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#008DA8] bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100">
                        {brand.categoryTag}
                      </span>
                    </div>

                    {/* Contenedor del Logo con Proporción Perfecta y Cero Distorsión */}
                    <div className="w-full h-20 sm:h-24 bg-slate-50/70 rounded-xl border border-slate-100 p-3 mb-5 flex items-center justify-center overflow-hidden group-hover:bg-slate-50 transition-colors">
                      <img 
                        src={brand.logoUrl} 
                        alt={`Logo oficial de ${brand.name}`}
                        className="max-h-12 sm:max-h-14 max-w-[85%] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Título y Tagline */}
                    <h3 className="text-xl font-black text-[#2C3E50] tracking-tight mb-1.5 font-heading">
                      {brand.name}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed mb-4">
                      {brand.tagline}
                    </p>

                    {/* Líneas y Especialidades Clínicas */}
                    <div className="space-y-2 mb-5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Líneas de Equipamiento:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {brand.specialties.slice(0, 3).map((spec, i) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100/90 hover:bg-slate-200/80 px-2 py-0.5 rounded-md transition-colors"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#008DA8] shrink-0" />
                            <span>{spec}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Certificaciones y Acreditaciones */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 mb-6">
                      {brand.certifications.slice(0, 3).map((cert, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Acciones de la Tarjeta: Explorar Catálogo o Ficha Completa */}
                  <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => navigate(`/productos?search=${encodeURIComponent(brand.name)}`)}
                      className="w-full h-10 rounded-xl bg-[#2C3E50] hover:bg-[#1A252F] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-98 cursor-pointer"
                    >
                      <span>Ver Equipos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveBrandModal(brand)}
                      className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                    >
                      <span>Ficha Técnica</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer Informativo de Homologación de Marcas */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#008DA8] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#2C3E50]">
                ¿Buscas una marca o modelo específico para tu expediente técnico?
              </div>
              <div className="text-xs text-slate-500">
                Gestionamos homologaciones directas de fábrica y compatibilidad técnica para procesos de adquisición pública y privada.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => navigate('/marcas')}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Directorio Completo de Marcas
            </button>
            <a
              href="https://wa.me/51928130349?text=Hola%20IZCOR%20MEDIC,%20consulto%20por%20la%20disponibilidad%20de%20marcas%20y%20modelos%20espec%C3%ADficos%20para%20un%20proyecto."
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Consultar Asesor</span>
            </a>
          </div>
        </div>

      </div>

      {/* Modal de Detalle de Marca (A detalle y sin distorsión) */}
      <AnimatePresence>
        {activeBrandModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBrandModal(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8"
            >
              {/* Header Modal */}
              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#1E293B] to-[#0D2232] text-white">
                <button
                  type="button"
                  onClick={() => setActiveBrandModal(null)}
                  className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-[11px] font-bold uppercase tracking-wider w-max mb-3 border border-white/15">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Fabricante Oficial Homologado</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-heading">
                  {activeBrandModal.name}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1">
                  {activeBrandModal.origin} • Especialidad: {activeBrandModal.categoryTag}
                </p>
              </div>

              {/* Body Modal */}
              <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Logo oficial con proporción protegida */}
                <div className="w-full h-24 sm:h-28 bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-center justify-center">
                  <img 
                    src={activeBrandModal.logoUrl} 
                    alt={`Logo oficial de ${activeBrandModal.name}`}
                    className="max-h-16 max-w-[80%] w-auto h-auto object-contain"
                  />
                </div>

                {/* Reseña Corporativa */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                    Respaldo y Trayectoria
                  </h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {activeBrandModal.description}
                  </p>
                </div>

                {/* Equipos destacados */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                    Modelos y Soluciones Destacadas en IZCOR MEDIC
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeBrandModal.highlightProducts.map((prod, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-[#008DA8] shrink-0" />
                        <span>{prod}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Normas y Certificaciones */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                    Acreditaciones Técnicas & Calidad
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeBrandModal.certifications.map((cert, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs"
                      >
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Modal con Botones */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const brandName = activeBrandModal.name;
                    setActiveBrandModal(null);
                    navigate(`/productos?search=${encodeURIComponent(brandName)}`);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2C3E50] hover:bg-[#1A252F] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span>Ver Todos los Equipos de {activeBrandModal.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={getWhatsAppBrandLink(activeBrandModal.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Cotizar por WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
