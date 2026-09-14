import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, Quote, ShieldCheck, CheckCircle2, 
  Building2, Hospital, Star, Award, MapPin, Sparkles, Filter
} from 'lucide-react';

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  institution: string;
  type: 'PUBLIC' | 'PRIVATE';
  location: string;
  avatarInitials: string;
  quote: string;
  rating: number;
  projectBadge: string;
  date: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number] 
    } 
  }
};

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: '1',
    clientName: 'Hospital de Nivel III',
    role: 'Área de Ingeniería Biomédica',
    institution: 'Sector Público - Lima',
    type: 'PUBLIC',
    location: 'Lima, Perú',
    avatarInitials: 'SP',
    quote: 'Provisión de Monitores de Funciones Vitales UCI con sus correspondientes fichas técnicas homologadas y registro sanitario DIGEMID vigente. El proceso de entrega técnica y capacitación al personal médico se realizó conforme a los protocolos normativos.',
    rating: 5,
    projectBadge: 'Monitores Multiparámetro UCI',
    date: '2023 - 2024'
  },
  {
    id: '2',
    clientName: 'Clínica Especializada',
    role: 'Mantenimiento y Equipamiento Biomédico',
    institution: 'Sector Privado - Lima',
    type: 'PRIVATE',
    location: 'Lima, Perú',
    avatarInitials: 'SP',
    quote: 'Renovación del parque de camas hospitalarias eléctricas de 3 y 5 motores, ejecutada en los plazos pactados. La estructura clínica de las camas y el acabado del mobiliario cumplen con las exigencias del sector privado.',
    rating: 5,
    projectBadge: 'Renovación de Camas Eléctricas UCI',
    date: '2023'
  },
  {
    id: '3',
    clientName: 'Red de Salud Regional',
    role: 'Coordinación de Adquisiciones y Logística',
    institution: 'Sector Público - Regiones',
    type: 'PUBLIC',
    location: 'Cusco, Perú',
    avatarInitials: 'RS',
    quote: 'Acompañamiento técnico durante la formulación de expedientes de equipamiento para centros de atención primaria. Los catálogos detallados y la trazabilidad de los certificados ISO respaldaron las bases de licitación.',
    rating: 5,
    projectBadge: 'Equipamiento de Diagnóstico y Ecografía',
    date: '2023 - 2024'
  },
  {
    id: '4',
    clientName: 'Centro Médico Quirúrgico',
    role: 'Centro Quirúrgico y Central de Esterilización',
    institution: 'Sector Privado',
    type: 'PRIVATE',
    location: 'Lima, Perú',
    avatarInitials: 'CQ',
    quote: 'Adquisición de instrumental quirúrgico especializado en acero alemán y cajas de cirugía laparoscópica. Acabado de alta precisión en tijeras y pinzas para procedimientos de complejidad.',
    rating: 5,
    projectBadge: 'Instrumental Quirúrgico',
    date: '2024'
  },
  {
    id: '5',
    clientName: 'Hospital Regional',
    role: 'Área de Cuidados Intensivos',
    institution: 'Sector Público - Norte',
    type: 'PUBLIC',
    location: 'La Libertad, Perú',
    avatarInitials: 'HR',
    quote: 'Cumplimiento estricto de los Términos de Referencia. Provisión de bombas de infusión volumétricas con calibración de fábrica, certificados de homologación y manuales de usuario para el personal asistencial.',
    rating: 5,
    projectBadge: 'Bombas de Infusión y Jeringa',
    date: '2023'
  },
  {
    id: '6',
    clientName: 'Red de Laboratorios',
    role: 'Dirección Técnica de Laboratorio',
    institution: 'Sector Privado',
    type: 'PRIVATE',
    location: 'Arequipa, Perú',
    avatarInitials: 'RL',
    quote: 'Cadena de suministro para centrífugas clínicas, microscopios binoculares y reactivos. Embalaje de protección que garantiza la integridad de los equipos médicos hasta la sede regional.',
    rating: 5,
    projectBadge: 'Equipamiento de Laboratorio',
    date: '2024'
  }
];

export function TestimonialsSection() {
  const [filter, setFilter] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const filteredTestimonials = TESTIMONIALS_DATA.filter((t) => {
    if (filter === 'ALL') return true;
    return t.type === filter;
  });

  // Reset index if out of bounds after filter change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filter]);

  // Autoplay handler
  useEffect(() => {
    if (isAutoPlaying && filteredTestimonials.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredTestimonials.length);
      }, 6000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, filteredTestimonials.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? filteredTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const currentTestimonial = filteredTestimonials[currentIndex] || TESTIMONIALS_DATA[0];

  return (
    <section 
      id="testimonios-clientes" 
      aria-label="Testimonios de Clientes Institucionales"
      className="py-20 sm:py-24 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] relative overflow-hidden border-t border-slate-200/80"
    >
      {/* Background Subtle Medical Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 text-brand-cyan text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span>Confianza Institucional Comprobada</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2C3E50] tracking-tight leading-tight mb-4">
            Testimonios de Clientes y Respaldo Institucional
          </h2>

          <p className="text-slate-600 font-normal text-sm sm:text-base leading-relaxed">
            La confianza de hospitales públicos, redes de salud, clínicas privadas y laboratorios en todo el Perú valida nuestro compromiso con la excelencia biomédica.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => { setFilter('ALL'); setIsAutoPlaying(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === 'ALL'
                  ? 'bg-[#2C3E50] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Todas las Instituciones ({TESTIMONIALS_DATA.length})</span>
            </button>

            <button
              onClick={() => { setFilter('PUBLIC'); setIsAutoPlaying(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === 'PUBLIC'
                  ? 'bg-brand-cyan text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Hospital className="w-3.5 h-3.5" />
              <span>Sector Público (EsSalud / MINSA / DIRESA)</span>
            </button>

            <button
              onClick={() => { setFilter('PRIVATE'); setIsAutoPlaying(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                filter === 'PRIVATE'
                  ? 'bg-[#2C3E50] text-cyan-300 shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Sector Privado (Clínicas y Laboratorios)</span>
            </button>
          </div>
        </motion.div>

        {/* Carousel Wrapper */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeUp}
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Main Active Testimonial Card */}
          <div className="relative min-h-[360px] sm:min-h-[320px]">
            <AnimatePresence mode="wait">
              {currentTestimonial && (
                <motion.div
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Decorative Background Quote Mark */}
                  <Quote 
                    className="absolute top-6 right-8 w-24 h-24 text-slate-100/80 pointer-events-none -scale-x-100" 
                    strokeWidth={1}
                  />

                  <div>
                    {/* Card Top Meta Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                          currentTestimonial.type === 'PUBLIC'
                            ? 'bg-cyan-50 text-brand-cyan border border-cyan-200'
                            : 'bg-[#2C3E50] text-cyan-300'
                        }`}>
                          {currentTestimonial.type === 'PUBLIC' ? 'Sector Público' : 'Sector Privado'}
                        </span>

                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {currentTestimonial.location}
                        </span>
                      </div>

                      {/* Project / Equipment Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold text-[#2C3E50] bg-slate-50 border border-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>{currentTestimonial.projectBadge}</span>
                      </span>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 mb-4 text-amber-400">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                      <span className="text-xs font-bold text-slate-400 ml-2">
                        5.0 / 5.0 Evaluado
                      </span>
                    </div>

                    {/* Testimonial Quote Text */}
                    <blockquote className="text-[#2C3E50] text-base sm:text-lg md:text-xl font-medium leading-relaxed italic mb-8 relative z-10">
                      "{currentTestimonial.quote}"
                    </blockquote>
                  </div>

                  {/* Author Info Footer */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                      {/* Avatar Circle with Initials */}
                      <div className="w-12 h-12 rounded-2xl bg-[#2C3E50] text-cyan-300 font-black text-sm flex items-center justify-center shadow-md shrink-0 border-2 border-cyan-400/30">
                        {currentTestimonial.avatarInitials}
                      </div>

                      <div>
                        <h3 className="font-extrabold text-[#2C3E50] text-sm sm:text-base tracking-tight">
                          {currentTestimonial.clientName}
                        </h3>
                        <p className="text-slate-500 text-xs font-medium">
                          {currentTestimonial.role}
                        </p>
                        <p className="text-brand-cyan text-xs font-bold mt-0.5">
                          {currentTestimonial.institution}
                        </p>
                      </div>
                    </div>

                    {/* Delivery Verified Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shrink-0 self-start sm:self-auto">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Suministro Verificado DIGEMID</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Carousel Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Left/Right Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                aria-label="Testimonio Anterior"
                className="w-11 h-11 rounded-2xl bg-white border border-slate-200 text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-all shadow-2xs hover:shadow flex items-center justify-center active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                aria-label="Siguiente Testimonio"
                className="w-11 h-11 rounded-2xl bg-white border border-slate-200 text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-all shadow-2xs hover:shadow flex items-center justify-center active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Pagination Indicators (Dots) */}
            <div className="flex items-center gap-2">
              {filteredTestimonials.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Ir al testimonio ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === currentIndex
                      ? 'w-8 h-2.5 bg-brand-cyan'
                      : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            {/* Autoplay Status Indicator */}
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              {currentIndex + 1} de {filteredTestimonials.length} testimonios
            </span>
          </div>
        </motion.div>

        {/* Institutional Trust Metrics Bar below Carousel */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={fadeUp}
          className="mt-16 pt-12 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <p className="text-2xl sm:text-3xl font-black text-[#2C3E50] tracking-tight">+150</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Instituciones Atendidas</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <p className="text-2xl sm:text-3xl font-black text-brand-cyan tracking-tight">100%</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Homologado DIGEMID</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <p className="text-2xl sm:text-3xl font-black text-[#2C3E50] tracking-tight">&lt;24 Horas</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Respuesta Técnico-Económica</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <p className="text-2xl sm:text-3xl font-black text-brand-cyan tracking-tight">24/7</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Soporte Biomédico</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
