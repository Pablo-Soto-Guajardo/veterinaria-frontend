const IMG = {
  perro: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=60",
  perroDos: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&auto=format&fit=crop&q=60",
  medicamentos: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60",
  dermatologia: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=60",
  cachorro: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=60",
  educacion: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=60",
  clinica: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=900&auto=format&fit=crop&q=60",
  gato: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=60"
};

export const imagenes = IMG;

export const blogs = [
  {
    id: 1,
    titulo: "Vacunación temprana y prevención de parvovirus",
    categoria: "Medicina preventiva",
    fecha: "2026-08-15",
    autor: "Equipo médico San Marcos",
    imagen: IMG.cachorro,
    resumen:
      "Descubre la importancia de completar el calendario de vacunas séxtuple canina antes del primer paseo en espacios públicos.",
    contenido: [
      "El parvovirus canino es una de las enfermedades infecciosas más severas en cachorros. En la Clínica Veterinaria San Marcos de Rancagua, nuestro protocolo inicia a las 6 semanas con vacunas séxtuple y refuerzos programados.",
      "Es indispensable evitar el contacto con parques públicos hasta 15 días después de la tercera dosis, asegurando una inmunidad completa."
    ],
    consejos: [
      "Lleva el carnet de vacunación a cada control.",
      "No mezcles cachorros sin vacunar con perros desconocidos.",
      "Consulta de inmediato ante vómitos o diarrea con sangre."
    ]
  },
  {
    id: 2,
    titulo: "Manejo de alergias cutáneas en felinos",
    categoria: "Dermatología veterinaria",
    fecha: "2026-08-20",
    autor: "Dra. especialista en dermatología",
    imagen: IMG.gato,
    resumen:
      "Identificación de dermatitis atópica y el uso seguro de champús antisépticos con clorhexidina en el hogar.",
    contenido: [
      "El rascado excesivo o lamido compulsivo en gatos suele esconder problemas dérmicos relacionados con picaduras de pulga o alergias ambientales.",
      "El uso de champús hipoalergénicos medicados con clorhexidina al 2% restaura la barrera lipídica y previene colonizaciones bacterianas secundarias."
    ],
    consejos: [
      "Mantén el control antiparasitario al día.",
      "Usa solo productos indicados para gatos.",
      "Registra cuándo aparecen los síntomas para identificar el alérgeno."
    ]
  }
];

export const regiones = [
  { id: "AP", nombre: "Región de Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre"] },
  { id: "TA", nombre: "Región de Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte"] },
  { id: "AN", nombre: "Región de Antofagasta", comunas: ["Antofagasta", "Calama", "Mejillones", "Tocopilla"] },
  { id: "AT", nombre: "Región de Atacama", comunas: ["Copiapó", "Vallenar", "Caldera"] },
  { id: "CO", nombre: "Región de Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel"] },
  { id: "VAL", nombre: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón"] },
  { id: "RM", nombre: "Región Metropolitana de Santiago", comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "La Reina", "Cerrillos", "Buin", "Paine"] },
  { id: "OHI", nombre: "Región del Libertador Gral. Bernardo O'Higgins", comunas: ["Rancagua", "Machalí", "Rengo", "San Fernando", "Graneros", "Pichilemu"] },
  { id: "MA", nombre: "Región del Maule", comunas: ["Talca", "Curicó", "Linares", "Constitución"] },
  { id: "NB", nombre: "Región de Ñuble", comunas: ["Chillán", "Chillán Viejo", "San Carlos"] },
  { id: "BI", nombre: "Región del Biobío", comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Coronel"] },
  { id: "ARA", nombre: "Región de La Araucanía", comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"] },
  { id: "LR", nombre: "Región de Los Ríos", comunas: ["Valdivia", "La Unión", "Panguipulli"] },
  { id: "LL", nombre: "Región de Los Lagos", comunas: ["Puerto Montt", "Osorno", "Castro", "Puerto Varas"] },
  { id: "AI", nombre: "Región de Aysén", comunas: ["Coyhaique", "Puerto Aysén", "Chile Chico"] },
  { id: "MAG", nombre: "Región de Magallanes", comunas: ["Punta Arenas", "Puerto Natales", "Porvenir"] }
];
