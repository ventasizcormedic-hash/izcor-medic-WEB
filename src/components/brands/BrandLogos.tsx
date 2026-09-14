import React from 'react';

export interface BrandData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  origin: string;
  countryCode: string;
  countryName: string;
  categoryTag: string;
  categoryType: 'uci' | 'diagnostico' | 'laboratorio' | 'materno_infantil' | 'general';
  tagline: string;
  description: string;
  specialties: string[];
  certifications: string[];
  foundedYear?: number;
  highlightProducts: string[];
  accentColor: string;
}

export const FEATURED_BRANDS_LIST: BrandData[] = [
  {
    id: 'mindray',
    name: 'Mindray',
    slug: 'mindray',
    logoUrl: '/assets/brands/mindray.svg',
    origin: 'Innovación Biomédica Global',
    countryCode: 'CN',
    countryName: 'Tecnología Global',
    categoryTag: 'Equipos UCI & Diagnóstico',
    categoryType: 'uci',
    tagline: 'Líder mundial en monitoreo de pacientes, anestesia y ultrasonido',
    description: 'Mindray es uno de los mayores proveedores globales de dispositivos médicos y soluciones clínicas avanzadas, reconocido por sus monitores multiparámetro, ecógrafos Doppler y sistemas de ventilación de alta confiabilidad.',
    specialties: ['Monitores Multiparámetro UCI', 'Ventiladores Mecánicos', 'Ecógrafos Doppler Color', 'Desfibriladores Bifásicos', 'Bombas de Infusión'],
    certifications: ['CE 0123', 'ISO 13485:2016', 'FDA 510(k)', 'Registro Sanitario DIGEMID'],
    foundedYear: 1991,
    highlightProducts: ['Monitor Multiparámetro ePM 12M / iMEC', 'Ecógrafo Portátil DP-50 / Z50', 'Desfibrilador BeneHeart D3'],
    accentColor: '#E30613'
  },
  {
    id: 'memmert',
    name: 'Memmert',
    slug: 'memmert',
    logoUrl: '/assets/brands/memmert.svg',
    origin: 'Alemania (German Engineering)',
    countryCode: 'DE',
    countryName: 'Alemania',
    categoryTag: 'Esterilización & Hornos',
    categoryType: 'laboratorio',
    tagline: 'Estándar alemán en hornos de secado, incubadoras y cámaras climáticas',
    description: 'Memmert GmbH es el referente internacional de ingeniería alemana en control térmico de precisión para laboratorios hospitalarios, microbiología, bancos de sangre y esterilización clínica.',
    specialties: ['Incubadoras de Microbiología (IN/IF)', 'Hornos de Secado y Esterilización (UN/UF)', 'Cámaras Climáticas de Estabilidad (ICH/HPP)', 'Baños de Agua Termostáticos'],
    certifications: ['DIN 12880:2007-05', 'ISO 9001:2015', 'ISO 13485', 'CE Medical Device Class I'],
    foundedYear: 1947,
    highlightProducts: ['Incubadora Universal IN55 / IN110', 'Horno de Esterilización UN55', 'Cámara Climática HPP110'],
    accentColor: '#E30613'
  },
  {
    id: 'boeco',
    name: 'BOECO Germany',
    slug: 'boeco-germany',
    logoUrl: '/assets/brands/boeco.svg',
    origin: 'Hamburgo, Alemania',
    countryCode: 'DE',
    countryName: 'Alemania',
    categoryTag: 'Microscopía & Laboratorio',
    categoryType: 'laboratorio',
    tagline: 'Instrumentación analítica y microscopía óptica de máxima precisión',
    description: 'Boeckel + Co (BOECO) ofrece instrumentación científica alemana para laboratorios clínicos y de investigación médica: microscopios binoculares y triloculares, centrífugas y micropipetas calibradas.',
    specialties: ['Microscopios Binoculares / Triloculares (BM-180, BM-800)', 'Centrífugas Clínicas y Microcentrífugas', 'Micropipetas Autoclavables de Precisión', 'Espectrofotómetros UV/VIS'],
    certifications: ['ISO 9001:2015', 'CE Compliant', 'Certificados de Calibración DAkkS/DKD'],
    foundedYear: 1929,
    highlightProducts: ['Microscopio Binocular BM-180', 'Centrífuga Clínica C-28A', 'Micropipetas Graduables BOECO GP Series'],
    accentColor: '#001FD8'
  },
  {
    id: 'riester',
    name: 'Riester',
    slug: 'riester',
    logoUrl: '/assets/brands/riester.svg',
    origin: 'Jungingen, Alemania',
    countryCode: 'DE',
    countryName: 'Alemania',
    categoryTag: 'Diagnóstico & Oftalmoscopía',
    categoryType: 'diagnostico',
    tagline: 'Instrumental de diagnóstico clínico de renombre y durabilidad alemana',
    description: 'Rudolf Riester GmbH diseña equipos de diagnóstico de primer nivel: esfigmomanómetros de precisión certificada, otoscopios, oftalmoscopios con óptica alemana y estaciones de pared para consultorios.',
    specialties: ['Esfigmomanómetros Aneroide y Digitales (exacta®, e-mega®)', 'Estuches de Diagnóstico Otoscopio/Oftalmoscopio (ri-scope®)', 'Estetoscopios de Acero Inoxidable (cardiophon®)', 'Lámparas de Exploración LED'],
    certifications: ['ISO 13485:2016', 'CE 0124', 'BHS / ESH Validación Clínica'],
    foundedYear: 1948,
    highlightProducts: ['Tensiómetro ri-san® / e-mega®', 'Estuche de Diagnóstico ri-mini® / ri-scope® L', 'Estetoscopio duplex® 2.0'],
    accentColor: '#1E5198'
  },
  {
    id: 'bistos',
    name: 'Bistos',
    slug: 'bistos',
    logoUrl: '/assets/brands/bistos.svg',
    origin: 'Corea del Sur / USA',
    countryCode: 'KR',
    countryName: 'Corea / USA',
    categoryTag: 'Monitoreo Fetal & Pediatría',
    categoryType: 'materno_infantil',
    tagline: 'Tecnología médica avanzada para monitoreo fetal y cuidado neonatal',
    description: 'Bistos Co., Ltd. es fabricante especializado en salud materno-infantil y monitorización médica, líder en detectores de latidos fetales, monitores fetales de gemelos (CTG) e incubadoras neonatales.',
    specialties: ['Monitores Fetales / Cardiotocógrafos (BT-300, BT-350)', 'Detectores de Latido Fetal Portátiles (BT-200 Hi-bebe)', 'Lámparas de Fototerapia Neonatal LED (BT-400)', 'Incubadoras Infantiles y Cunas Térmicas'],
    certifications: ['CE 0434', 'ISO 13485', 'FDA Cleared', 'KFDA Certified'],
    foundedYear: 2001,
    highlightProducts: ['Detector Fetal Hi-bebe BT-200', 'Monitor Fetal BT-350 LCD Color', 'Lámpara de Fototerapia LED BT-400'],
    accentColor: '#004D9F'
  },
  {
    id: 'seca',
    name: 'seca',
    slug: 'seca',
    logoUrl: '/assets/brands/seca.svg',
    origin: 'Hamburgo, Alemania',
    countryCode: 'DE',
    countryName: 'Alemania',
    categoryTag: 'Medición & Balanzas Médicas',
    categoryType: 'diagnostico',
    tagline: 'La referencia mundial indiscutible en pesaje y medición médica de precisión',
    description: 'seca es el líder mundial en sistemas médicos de medición y pesaje. Sus balanzas con tallímetro, pesabebés y analizadores de composición corporal equipan los centros médicos más exigentes del planeta.',
    specialties: ['Balanzas de Columna con Tallímetro (seca 700 / seca 769)', 'Pesabebés Electrónicos y Mecánicos (seca 354 / seca 725)', 'Tallímetros de Pared y Móviles (seca 213 / seca 206)', 'Balanzas de Silla de Ruedas y Plataformas'],
    certifications: ['Calibración Clase III Médica', 'ISO 13485', 'Directiva 2014/31/UE (NAWI)', 'CE 0123'],
    foundedYear: 1840,
    highlightProducts: ['Balanza Mecánica con Tallímetro seca 700', 'Balanza Electrónica Grado Médico seca 769', 'Pesabebé Digital seca 354'],
    accentColor: '#E30613'
  },
  {
    id: 'edan',
    name: 'EDAN',
    slug: 'edan',
    logoUrl: '/assets/brands/edan.svg',
    origin: 'Diagnóstico & Telemetría Médica',
    countryCode: 'CN',
    countryName: 'Tecnología Global',
    categoryTag: 'Electrocardiografía & Signos Vitales',
    categoryType: 'uci',
    tagline: 'Instrumentación avanzada de diagnóstico por imagen, ECG y signos vitales',
    description: 'EDAN Instruments es una compañía biomédica de vanguardia enfocada en soluciones para cardiología, monitoreo de pacientes, diagnóstico por ultrasonido y telemetría hospitalaria con alta conectividad.',
    specialties: ['Electrocardiógrafos Digitales de 3, 6 y 12 Canales (SE-3, SE-1200)', 'Monitores de Signos Vitales y UCI (iM50, iM80)', 'Pulsioxímetros de Mesa y Mano (H100B)', 'Sistemas de Ultrasonido y Doppler'],
    certifications: ['CE 0123', 'ISO 13485', 'FDA 510(k)', 'TUV Rheinland'],
    foundedYear: 1995,
    highlightProducts: ['Electrocardiógrafo Digital SE-3 / SE-1200 Express', 'Monitor de Signos Vitales iM3 / iM50', 'Pulsioxímetro Profesional H100B'],
    accentColor: '#75BA24'
  }
];

export function BrandLogoImage({ 
  brand, 
  className = "h-10 w-auto max-w-[160px] object-contain",
  alt
}: { 
  brand: BrandData | { name: string; logoUrl?: string; slug?: string; id?: string };
  className?: string;
  alt?: string;
}) {
  const match = FEATURED_BRANDS_LIST.find(
    b => b.name.toLowerCase() === brand.name.toLowerCase() || 
         b.slug === (brand as any).slug ||
         b.id === (brand as any).id
  );

  const src = match ? match.logoUrl : ((brand as any).logoUrl || '');
  const altText = alt || `Logo oficial de ${brand.name}`;

  return (
    <div className="flex items-center justify-center w-full h-full p-1 select-none">
      {src ? (
        <img 
          src={src} 
          alt={altText} 
          loading="lazy"
          decoding="async"
          className={`${className} transition-transform duration-300 will-change-transform`}
          style={{ imageRendering: 'auto' }}
        />
      ) : (
        <span className="font-extrabold text-slate-800 text-sm tracking-tight">
          {brand.name}
        </span>
      )}
    </div>
  );
}
