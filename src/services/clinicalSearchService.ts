/**
 * Clinical Search Service - IZCOR Soluciones Médicas
 * Capa de inteligencia médica, sinonimia clínica y tolerancia a errores tipográficos.
 * NO altera datos existentes; proporciona expansión semántica y sugerencias aditivas.
 */

export interface ClinicalMatchResult {
  originalQuery: string;
  normalizedQuery: string;
  expandedTerms: string[];
  suggestedCorrection?: string;
  clinicalCategoryHint?: string;
}

// Diccionario de sinonimia clínica y equivalencias de equipamiento médico hospitalario
const CLINICAL_SYNONYMS: Record<string, string[]> = {
  // Diagnóstico y Monitoreo
  'tensiometro': ['esfigmomanometro', 'presion arterial', 'baumanometro', 'tensimetro', 'tensiometro aneroide', 'tensiometro digital'],
  'esfigmomanometro': ['tensiometro', 'baumanometro', 'presion arterial', 'esfigmomanometro aneroide', 'esfigmomanometro de mercurio'],
  'oximetro': ['pulsioximetro', 'saturometro', 'spo2', 'pulsoximetro', 'oximetro de pulso', 'sensor spo2'],
  'pulsioximetro': ['oximetro', 'saturometro', 'spo2', 'oximetro de pulso', 'pulsoximetro'],
  'saturometro': ['oximetro', 'pulsioximetro', 'spo2'],
  'ecografo': ['ultrasonido', 'ecografia', 'doppler', 'transductor', 'sonda ecografica', 'ecografo portatil', 'ecografo 4d'],
  'ultrasonido': ['ecografo', 'ecografia', 'doppler', 'transductor'],
  'electrocardiografo': ['electrocardiograma', 'ecg', 'ekg', 'papel ecg', 'electrodos ecg', 'electrocardiografo 12 canales', 'electrocardiografo 3 canales'],
  'ecg': ['electrocardiografo', 'electrocardiograma', 'ekg'],
  'ekg': ['electrocardiografo', 'electrocardiograma', 'ecg'],
  'estetoscopio': ['fonendoscopio', 'estetoscopio duplex', 'estetoscopio cardiológico', 'campana doble'],
  'fonendoscopio': ['estetoscopio'],
  'otoscopio': ['oftalmoscopio', 'equipo de organos', 'set de diagnostico', 'espéculos'],
  'oftalmoscopio': ['otoscopio', 'fondo de ojo', 'equipo de organos', 'set de diagnostico'],
  'monitor': ['monitor multiparametro', 'signos vitales', 'pantalla multiparametrica', 'capnografia', 'monitor uci'],

  // Soporte Vital, UCI y Quirófano
  'desfibrilador': ['dea', 'cardioversor', 'desfibrilador externo automatico', 'paletas desfibrilador', 'marcapasos'],
  'dea': ['desfibrilador', 'desfibrilador externo automatico', 'cardioversor'],
  'aspirador': ['succionador', 'aspirador de secreciones', 'bomba de succion', 'frasco de aspiracion', 'aspirador quirurgico'],
  'succionador': ['aspirador', 'aspirador de secreciones', 'succionador quirurgico'],
  'laringoscopio': ['videolaringoscopio', 'hojas de laringoscopio', 'mango de laringoscopio', 'intubacion macintosh', 'intubacion miller'],
  'videolaringoscopio': ['laringoscopio', 'intubacion dificil'],
  'nebulizador': ['aerosolterapia', 'compresor nebulizador', 'mascarilla de nebulizacion'],
  'ventilador': ['ventilador mecanico', 'respirador artificial', 'soporte respiratorio', 'ventilador de transporte', 'ventilador uci'],
  'infusion': ['bomba de infusion', 'infusora', 'bomba volumetrica', 'bomba jeringa', 'set de infusion'],
  'bomba de infusion': ['infusora', 'bomba volumetrica', 'bomba peristaltica'],
  'electrobisturi': ['bisturi electrico', 'unidad electroquirurgica', 'cauterio', 'placa electroquirurgica', 'lapiz de electrobisturi'],
  'autoclave': ['esterilizador', 'esterilizacion a vapor', 'autoclave clase b', 'autoclave de mesa'],
  'esterilizador': ['autoclave', 'esterilizacion'],

  // Neonatología y Pediatría
  'fototerapia': ['bililuz', 'lampara de fototerapia', 'ictericia neonatal', 'luz azul'],
  'incubadora': ['incubadora neonatal', 'cuna termica', 'cuna de calor radiante', 'incubadora de transporte'],
  'cuna radiante': ['cuna de calor radiante', 'cuna termica', 'servocuna'],

  // Mobiliario Hospitalario
  'cama': ['cama clinica', 'cama hospitalaria', 'cama fowler', 'cama uci', 'cama electrica', 'colchon antiescaras'],
  'camilla': ['camilla de transporte', 'camilla de emergencia', 'camilla ginecologica', 'camilla de examen'],
  'lampara': ['lampara cialitica', 'lampara quirurgica', 'lampara de examen', 'luz cialitica', 'luz operatoria'],
  'cialitica': ['lampara cialitica', 'lampara quirurgica', 'luz quirurgica'],

  // Insumos y Laboratorio
  'glucometro': ['glucosa', 'tiras de glucosa', 'glucometro', 'lancetas'],
  'centrifuga': ['microcentrifuga', 'centrifuga de tubos', 'centrifuga hematocrito'],
  'microscopio': ['microscopio binocular', 'microscopio trinocular', 'optica medica'],
  'guante': ['guantes de latex', 'guantes de nitrilo', 'guantes quirurgicos', 'guantes esteriles'],
  'cateter': ['cateter venoso', 'cateter iv', 'aguja', 'abocath'],
  'jeringa': ['jeringa descartable', 'jeringa de 5ml', 'jeringa de 10ml', 'jeringa de 20ml', 'aguja hipodermica'],
  'mascarilla': ['mascarilla kn95', 'mascarilla quirurgica', 'respirador n95', 'tapaboca']
};

/**
 * Normaliza una cadena removiendo tildes, signos y convirtiendo a minúsculas
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Distancia Levenshtein básica para tolerancia a errores ortográficos
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Analiza la consulta y genera términos expandidos médicos y correcciones
 */
export function expandClinicalQuery(query: string): ClinicalMatchResult {
  const normQuery = normalizeSearchText(query);
  const words = normQuery.split(' ').filter(w => w.length > 2);
  const expandedSet = new Set<string>();
  expandedSet.add(normQuery);

  let suggestedCorrection: string | undefined;
  let clinicalCategoryHint: string | undefined;

  // 1. Coincidencia directa de sinónimos
  for (const [key, synonyms] of Object.entries(CLINICAL_SYNONYMS)) {
    const normKey = normalizeSearchText(key);
    if (normQuery.includes(normKey) || normKey.includes(normQuery)) {
      synonyms.forEach(s => expandedSet.add(normalizeSearchText(s)));
      clinicalCategoryHint = key;
    }

    // Comprobar palabras individuales
    for (const word of words) {
      if (word === normKey || normKey.startsWith(word) || word.startsWith(normKey)) {
        synonyms.forEach(s => expandedSet.add(normalizeSearchText(s)));
      }
    }
  }

  // 2. Coincidencia difusa (Fuzzy Levenshtein) si no hubo expansión directa
  if (expandedSet.size <= 1 && normQuery.length >= 4) {
    let closestKey: string | null = null;
    let minDistance = 999;

    for (const key of Object.keys(CLINICAL_SYNONYMS)) {
      const normKey = normalizeSearchText(key);
      const dist = levenshteinDistance(normQuery, normKey);
      
      // Permitir tolerancia de hasta 2 errores en palabras medianas/largas
      const maxAllowed = normKey.length > 6 ? 2 : 1;
      if (dist <= maxAllowed && dist < minDistance) {
        minDistance = dist;
        closestKey = key;
      }
    }

    if (closestKey && minDistance > 0) {
      suggestedCorrection = closestKey;
      expandedSet.add(normalizeSearchText(closestKey));
      const syns = CLINICAL_SYNONYMS[closestKey] || [];
      syns.forEach(s => expandedSet.add(normalizeSearchText(s)));
      clinicalCategoryHint = closestKey;
    }
  }

  return {
    originalQuery: query,
    normalizedQuery: normQuery,
    expandedTerms: Array.from(expandedSet).slice(0, 8),
    suggestedCorrection,
    clinicalCategoryHint,
  };
}
