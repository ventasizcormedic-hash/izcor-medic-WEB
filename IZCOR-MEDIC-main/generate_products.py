import json
import os
import re

# Función para crear slugs amigables
def slugify(text):
    text = text.lower().replace(' ', '-')
    text = re.sub(r'[^a-z0-9-]', '', text)
    return f"{text}-peru"

products_text = """
6|Equipos de Monitoreo|Monitor de signos vitales Mindray UMEC|Mindray
6|Equipos de Monitoreo|Monitor de signos vitales Witleaf L Series|Witleaf
6|Equipos de Monitoreo|Monitor de signos vitales Edan CX Series|Edan
7|Equipos de Monitoreo|Monitor de signos vitales Edan iV Series|Edan
7|Equipos de Monitoreo|Monitor de signos vitales Biolight S Series|Biolight
7|Equipos de Monitoreo|Electrocardiógrafo Edan Se3|Edan
7|Equipos de Monitoreo|Monitor de paciente Edan M3|Edan
7|Equipos de Monitoreo|Oximetro de pulso Nonin 7500|Nonin
7|Equipos de Monitoreo|Oximetro de pulso Witleaf XH-60 Series|Witleaf
7|Equipos de Monitoreo|Oximetro de pulso Mindray PM60|Mindray
7|Equipos de Monitoreo|Oximetro de pulso Edan H100|Edan
7|Equipos de Monitoreo|Oximetro de pulso Bistos BT-710|Bistos
8|Equipos de Soporte Vital|Ventilador volumetrico Mindray SV600 / SV800|Mindray
8|Equipos de Soporte Vital|Maquina de anestesia Mindray Wato EX20|Mindray
8|Equipos de Soporte Vital|Maquina de anestesia General Electric Carestation 650|General Electric
9|Equipos de Soporte Vital|Incubadora de transporte Ningbo Ti2000|Ningbo
9|Equipos de Soporte Vital|Cuna de calor o servocuna Ningbo HKN93|Ningbo
9|Equipos de Soporte Vital|Bomba de infusion de jeringa Mindray Vp5|Mindray
9|Equipos de Soporte Vital|Bomba de infusion de 1 canal Medrena Vp50|Medrena
9|Equipos de Soporte Vital|Bomba de infusion de 1 canal Daiwha DI-2000EN|Daiwha
9|Equipos de Soporte Vital|Desfibrilador con monitor Mindray Beneheart D30|Mindray
9|Equipos de Soporte Vital|Desfibrilador con monitor Comen S5|Comen
9|Equipos de Soporte Vital|Desfibrilador DEA automatico Zoll AED Plus|Zoll
9|Equipos de Soporte Vital|Desfibrilador DEA semiautomatico Comen F2|Comen
10|Equipos de Diagnóstico|Tensiometro aneroide Riester Exacta 1350|Riester
10|Equipos de Diagnóstico|Tensiometro digital Omron HEM-7120|Omron
10|Equipos de Diagnóstico|Tensiometro aneroide rodable Riester Big Ben|Riester
11|Equipos de Diagnóstico|Estetoscopio Riester Duplex 2.0|Riester
11|Equipos de Diagnóstico|Estetoscopio Littman Classic III|Littman
11|Equipos de Diagnóstico|Videolaringoscopio Hugemed VL3R|Hugemed
11|Equipos de Diagnóstico|Laringoscopio Riester Macintosh|Riester
11|Equipos de Diagnóstico|Oto oftalmoscopio Riester E-Scope|Riester
11|Equipos de Diagnóstico|Glucometro Accu Check Instant|Accu Check
11|Equipos de Diagnóstico|Oximetro de pulso de dedo Riester RI FOX|Riester
11|Equipos de Diagnóstico|Termometro digital Beurer Ft65|Beurer
11|Equipos de Diagnóstico|Termometro axilar digital Riester RI Termo|Riester
12|Equipos de Diagnóstico por Imágenes|Sistema de rayos X digital estacionario, Perlove PLD 7900|Perlove
12|Equipos de Diagnóstico por Imágenes|Sistema de rayos X digital estacionario, DRGEM Serie GRX SD|DRGEM
13|Equipos de Diagnóstico por Imágenes|Rayos X portatil digital Perlove PLX5200|Perlove
13|Equipos de Diagnóstico por Imágenes|Rayos X portatil digital DRGEM Topaz|DRGEM
13|Equipos de Diagnóstico por Imágenes|Rayos X dental Runyes Ray 98|Runyes
13|Equipos de Diagnóstico por Imágenes|Ecógrafo estacionario Esaote Mylab A70|Esaote
13|Equipos de Diagnóstico por Imágenes|Ultrasonido portátil Esaote Mylab C25|Esaote
13|Equipos de Diagnóstico por Imágenes|Ecógrafo estacionario Edan Acclarix LX3|Edan
13|Equipos de Diagnóstico por Imágenes|Ecógrafo portátil Edan Acclarix AX3|Edan
13|Equipos de Diagnóstico por Imágenes|Ecógrafo estacionario Vinno G50|Vinno
13|Equipos de Diagnóstico por Imágenes|Ecógrafo portátil Vinno A5|Vinno
14|Equipos de Emergencia|Aspirador de secreciones Cami New Hospivac 400|Cami
14|Equipos de Emergencia|Aspirador quirúrgico Elmaslar Lifetime SA01HT|Elmaslar
14|Equipos de Emergencia|Camilla de rescate Spencer Rock B-Back|Spencer
15|Equipos de Emergencia|Camilla telescópica Sitmed MXS-330|Sitmed
15|Equipos de Emergencia|Aspirador portátil Cami New Askir 30|Cami
15|Equipos de Emergencia|Nebulizador Silfab N32|Silfab
15|Equipos de Emergencia|Collarín cervical Ambu Perfit Ace|Ambu
15|Equipos de Emergencia|Resucitador manual adulto Besmed PS 2103|Besmed
15|Equipos de Emergencia|Maletín de reanimación ETIMSA MLT-A01|ETIMSA
15|Equipos de Emergencia|Maletín de emergencia para primeros auxilios|Genérico
15|Equipos de Emergencia|Coche de paro Metro Lifeline|Metro
15|Equipos de Emergencia|Coche de paro Pukang F46|Pukang
16|Equipos de Laboratorio|Analizador bioquímico aut. Mindray BS-240E|Mindray
16|Equipos de Laboratorio|Analizador bioquímico aut. Biobase BK200|Biobase
16|Equipos de Laboratorio|Analizador hematológico 3 dif. Aehealth AERC-3|Aehealth
17|Equipos de Laboratorio|Analizador de gases Edan i15|Edan
17|Equipos de Laboratorio|Analizador bioquímico semiaut. Mindray BA88A|Mindray
17|Equipos de Laboratorio|Autoclave 24 litros Euronda E8|Euronda
17|Equipos de Laboratorio|Esterilizador de calor seco Memmert Sn55|Memmert
17|Equipos de Laboratorio|Centrífuga universal Boeco C28A|Boeco
17|Equipos de Laboratorio|Microcentrífuga Boeco HC-240|Boeco
17|Equipos de Laboratorio|Microscopio binocular Zeiss Primo Star 3|Zeiss
17|Equipos de Laboratorio|Baño maría Memmert WNB22|Memmert
17|Equipos de Laboratorio|Micropipetas Boeco|Boeco
18|Mobiliario Clinico y Administrativo|Cama electrica UCI Saikang Y8Y|Saikang
18|Mobiliario Clinico y Administrativo|Cama UCI 2 columnas Medik YA-D7-1|Medik
18|Mobiliario Clinico y Administrativo|Cama clínica manual 2 manivelas|Genérico
19|Mobiliario Clinico y Administrativo|Camilla de transporte Saikang SKB041-3|Saikang
19|Mobiliario Clinico y Administrativo|Mesa de parto hidraulica Medik MC-H02|Medik
19|Mobiliario Clinico y Administrativo|Vitrina de acero inoxidable de dos cuerpos|Genérico
19|Mobiliario Clinico y Administrativo|Armario metálico para instrumental dental|Genérico
19|Mobiliario Clinico y Administrativo|Biombo metálico de dos cuerpos|Genérico
19|Mobiliario Clinico y Administrativo|Archivador metálico de 4 gavetas|Genérico
19|Mobiliario Clinico y Administrativo|Coche de curaciones de acero inoxidable|Genérico
19|Mobiliario Clinico y Administrativo|Velador metálico|Genérico
19|Mobiliario Clinico y Administrativo|Negatoscopio metálico de dos cuerpos|Genérico
20|Material e Instrumental Médico|Mandil descartable no estéril R y G|R y G
20|Material e Instrumental Médico|Traje de seguridad desechable 3M|3M
20|Material e Instrumental Médico|Chaqueta quirúrgica descartable no estéril|Genérico
21|Material e Instrumental Médico|Toca tipo circular descartable celeste|Genérico
21|Material e Instrumental Médico|Guantes descartables de látex y de nitrilo|Genérico
21|Material e Instrumental Médico|Jeringas descartables|Genérico
21|Material e Instrumental Médico|Tubo para extracción de sangre|Genérico
21|Material e Instrumental Médico|Algodón hidrófilo 50gr.|CKF
21|Material e Instrumental Médico|Instrumental quirúrgico|Genérico
21|Material e Instrumental Médico|Tambores de acero quirúrgico|Genérico
21|Material e Instrumental Médico|Riñoneras de acero quirúrgico|Genérico
21|Material e Instrumental Médico|Chatas y papagayos de acero quirúrgico|Genérico
22|Equipos de Cadena de Frío|Refrigerador de laboratorio y farmacia / Meling YCL-1015L|Meling
22|Equipos de Cadena de Frío|Refrigerador de laboratorio y farmacia / Meling YCL-525L|Meling
22|Equipos de Cadena de Frío|Refrigerador de vacunas y congelador de paquetes fríos Bmedical TCW2000AC|Bmedical
22|Equipos de Cadena de Frío|Cajas para vacunas 44 L Bmedical RCW25|Bmedical
22|Equipos de Cadena de Frío|Termo para vacunas Blowkings 2.6L BK-VC-1.7-CF|Blowkings
22|Equipos de Cadena de Frío|Paquetes frios 0.4L Blowkings BK-4|Blowkings
"""

products = []
order = 1
for line in products_text.strip().split('\n'):
    if not line: continue
    parts = line.split('|')
    page = int(parts[0])
    category = parts[1]
    name = parts[2]
    brand = parts[3]
    
    # SEO logic
    slug = slugify(name)
    title_seo = f"{name} | {brand} | Venta en Perú"
    description_seo = (
        f"¿Buscas {name} en Perú? En nuestra tienda contamos con {name} "
        f"de la marca {brand}. Equipos médicos con certificación de calidad, "
        f"garantía técnica y envíos a Lima y todo el Perú. ¡Cotiza hoy!"
    )
    
    # ID Generation
    id_str = slug
    
    code = ''
    parts_name = name.split()
    if any(char.isdigit() for char in parts_name[-1]):
        code = parts_name[-1]
    
    # Especificaciones Técnicas (Estructura para Google Rich Snippets)
    especificaciones = {
        "marca": brand,
        "garantia": "12 meses",
        "certificacion": "ISO 13485 / Certificación Técnica",
        "soporte": "Instalación y capacitación técnica en Perú",
        "envio": "Nacional a todo el Perú"
    }

    # FAQ para mejorar posicionamiento en búsquedas de voz y preguntas directas
    faq = [
        {"pregunta": "¿El precio incluye IGV?", "respuesta": "Sí, todos nuestros precios incluyen IGV y emitimos factura electrónica."},
        {"pregunta": "¿Brindan soporte técnico en Perú?", "respuesta": "Contamos con servicio técnico especializado con cobertura en Lima y provincias."},
        {"pregunta": "¿Tienen stock disponible?", "respuesta": "Contamos con stock inmediato para entrega en nuestras oficinas de Lima o despacho a nivel nacional."}
    ]

    product = {
        'id': id_str,
        'orden': order,
        'categoria': category,
        'slug': slug,
        'metaTitle': title_seo,
        'metaDescription': description_seo,
        'nombre': name,
        'codigo': code,
        'marca': brand,
        'descripcion': description_seo,
        'especificaciones': especificaciones,
        'registroSanitario': 'Autorizado por DIGEMID / Conforme a normativa vigente',
        'faq': faq,
        'productosRelacionados': [], # Espacio para conectar productos manualmente o via lógica futura
        'linkWhatsApp': f"https://wa.me/51999999999?text=Hola, estoy interesado en el producto {name} del catálogo. ¿Me brindan información técnica y precio?",
        'imagenPrincipal': f'/assets/catalogo/productos/{id_str}/{id_str}-01.webp',
        'paginaPDF': page,
        'verificarImagen': True # Campo para indicar que el sistema debe validar la imagen
    }
    products.append(product)
    order += 1

# Generación de categorías para SEO Landing Pages
categorias_seo = {
    "Equipos de Monitoreo": {
        "h1": "Venta de Monitores de Signos Vitales en Perú",
        "descripcion": "Contamos con los mejores monitores de signos vitales con tecnología de punta, ideales para clínicas, hospitales y centros de salud en todo el Perú."
    },
    "Equipos de Diagnóstico": {
        "h1": "Equipos Médicos de Diagnóstico de Alta Precisión en Perú",
        "descripcion": "Soluciones completas de diagnóstico médico. Estetoscopios, tensiómetros y más, con entrega inmediata en Lima y provincias."
    },
    "Equipos de Soporte Vital": {
        "h1": "Equipos de Soporte Vital y Emergencias en Perú",
        "descripcion": "Ventiladores, desfibriladores y bombas de infusión. Equipamiento médico crítico con soporte técnico especializado en territorio peruano."
    }
}

# Función para verificar imágenes faltantes
def verificar_imagenes(products):
    missing = []
    print("Verificando existencia de imágenes...")
    for p in products:
        path = p['imagenPrincipal'].replace('/assets', 'public/assets')
        if not os.path.exists(path):
            missing.append(path)
    return missing

os.makedirs('src/data', exist_ok=True)
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

with open('src/data/categories.json', 'w', encoding='utf-8') as f:
    json.dump(categorias_seo, f, ensure_ascii=False, indent=2)

# Ejecutar verificación
faltantes = verificar_imagenes(products)
if faltantes:
    print(f"ADVERTENCIA: Se encontraron {len(faltantes)} imágenes faltantes. Revisa la carpeta public/assets.")
else:
    print("Todas las imágenes fueron verificadas correctamente.")

print(f'Created {len(products)} products and category SEO data in src/data/')

