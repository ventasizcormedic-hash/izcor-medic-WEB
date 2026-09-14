import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, Clock, Award, FileText, BookOpen, AlertTriangle, ExternalLink } from 'lucide-react';
import { Logo } from '../Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-[radial-gradient(circle_at_top,_rgba(0,163,196,0.12),_transparent_32%),linear-gradient(180deg,_#0A192F_0%,_#0F2438_100%)] text-slate-300 pt-16 pb-8 border-t-4 border-brand-cyan" role="contentinfo" aria-label="Pie de página de IZCOR MEDIC">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

        {/* Top Corporate Accreditation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-12 mb-12 border-b border-white/10">
          <div className="footer-cta-card flex items-start gap-4 p-4 rounded-xl hover:bg-white/8 transition-colors">
            <ShieldCheck className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Garantía y Registro Sanitario</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Equipos e insumos con certificaciones DIGEMID, CE e ISO para uso en centros hospitalarios.
              </p>
            </div>
          </div>

          <div className="footer-cta-card flex items-start gap-4 p-4 rounded-xl hover:bg-white/8 transition-colors">
            <Award className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Suministro y Licitaciones</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Especialistas en procesos OSCE, compras corporativas y abastecimiento directo a nivel nacional.
              </p>
            </div>
          </div>

          <div className="footer-cta-card flex items-start gap-4 p-4 rounded-xl hover:bg-white/8 transition-colors">
            <Clock className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Soporte Biomédico</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asistencia técnica, manuales, fichas oficiales y cotizaciones formalizadas en menos de 24 horas.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
          
          {/* Brand Presentation */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="mb-5 bg-white p-2.5 rounded-xl inline-block shadow-sm">
              <Logo size="md" variant="dark" />
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm mb-6">
              Plataforma integral de suministro y equipamiento para hospitales, clínicas, laboratorios e instituciones públicas y privadas del Perú.
            </p>
            
            <address className="not-italic space-y-2.5 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
                <span>Lima, Perú • Despachos a nivel nacional</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
                <a href="mailto:ventasizcormedic@gmail.com" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-cyan-300">
                  ventasizcormedic@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
                <a href="tel:+51928130349" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:text-cyan-300">
                  +51 928 130 349
                </a>
              </p>
            </address>
          </div>

          {/* Navegación Institucional */}
          <nav className="sm:col-span-1 lg:col-span-2" aria-label="Navegación de plataforma">
            <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-cyan-400">
              PLATAFORMA
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" className="text-slate-300 hover:text-white transition-colors">
                  Catálogo Oficial
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-slate-300 hover:text-white transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/noticias" className="text-slate-300 hover:text-white transition-colors">
                  Noticias
                </Link>
              </li>
              <li>
                <Link to="/tdr" className="text-slate-300 hover:text-white transition-colors">
                  Módulo TDR (OSCE)
                </Link>
              </li>
              <li>
                <Link to="/cotizar" className="text-slate-300 hover:text-white transition-colors">
                  Solicitud de Cotización
                </Link>
              </li>
              <li>
                <Link to="/farmacovigilancia" className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                  <span>Farmacovigilancia</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Líneas Médicas */}
          <nav className="sm:col-span-1 lg:col-span-3" aria-label="Líneas médicas">
            <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-cyan-400">
              LÍNEAS MÉDICAS
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/productos?category=equipos-medicos" className="text-slate-300 hover:text-white transition-colors">
                  Equipamiento Clínico &amp; UCI
                </Link>
              </li>
              <li>
                <Link to="/productos?category=diagnostico-y-monitoreo" className="text-slate-300 hover:text-white transition-colors">
                  Diagnóstico &amp; Imagenología
                </Link>
              </li>
              <li>
                <Link to="/productos?category=mobiliario-clinico" className="text-slate-300 hover:text-white transition-colors">
                  Mobiliario Hospitalario
                </Link>
              </li>
              <li>
                <Link to="/productos?category=instrumental-quirurgico" className="text-slate-300 hover:text-white transition-colors">
                  Instrumental Quirúrgico
                </Link>
              </li>
              <li>
                <Link to="/productos?category=insumos-descartables" className="text-slate-300 hover:text-white transition-colors">
                  Insumos &amp; Descartables
                </Link>
              </li>
            </ul>
          </nav>

          {/* Canal Corporativo + Libro de Reclamaciones */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-4">
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase mb-3 text-cyan-400">
                CANAL CORPORATIVO
              </h3>
              <div className="footer-cta-card p-4 rounded-xl text-xs space-y-3">
                <p className="text-slate-300 leading-relaxed">
                  ¿Requiere sustento técnico o cotización para bases de licitación?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                  <Link
                    to="/tdr"
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-brand-navy hover:bg-brand-navy-light text-white font-bold text-xs border border-white/20 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
                    <span>Cargar TDR</span>
                  </Link>
                  <a
                    href="https://wa.me/51928130349?text=Hola%20IZCOR%20MEDIC%2C%20me%20comunico%20desde%20la%20web..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                    aria-label="Contactar asesor por WhatsApp"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Libro de Reclamaciones */}
            <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-red-400 shrink-0" aria-hidden="true" />
                <h4 className="text-white font-bold text-xs">Libro de Reclamaciones</h4>
              </div>
              <p className="text-slate-400 text-[10px] leading-relaxed mb-3">
                Conforme a la Ley 29571 (Código de Protección al Consumidor), registra tu reclamo o queja.
              </p>
              <Link
                to="/contacto"
                className="inline-flex items-center gap-1.5 w-full justify-center py-2 px-3 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-[10px] uppercase tracking-wider transition-colors"
                aria-label="Registrar una queja o reclamo"
              >
                <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span>Registrar Reclamo</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4 text-center md:text-left">
          <p>
            &copy; {currentYear} IZCOR MEDIC S.A.C. Todos los derechos reservados. RUC y especificaciones sujetas a verificación institucional.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-5 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5" aria-label="Canal de atención activo">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
              Atención Activa
            </span>
            <Link to="/farmacovigilancia" className="hover:text-slate-200 transition-colors">
              Farmacovigilancia
            </Link>
            <Link to="/contacto" className="hover:text-slate-200 transition-colors">
              Contacto
            </Link>
            <Link to="/admin" className="hover:text-slate-200 transition-colors">
              Panel Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
