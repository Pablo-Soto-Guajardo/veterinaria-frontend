import { imagenes as IMG } from "../data/datosIniciales";

export const categoriasIniciales = [
  {
    id: "antiparasitarios",
    nombre: "Antiparasitarios",
    descripcion: "Control de pulgas, garrapatas y parásitos internos.",
    imagen: IMG.perro
  },
  {
    id: "antibioticos",
    nombre: "Antibióticos",
    descripcion: "Tratamientos bajo receta para infecciones bacterianas.",
    imagen: IMG.medicamentos
  },
  {
    id: "dermatologia",
    nombre: "Dermatología",
    descripcion: "Productos para piel, pelaje y alergias.",
    imagen: IMG.dermatologia
  },
  {
    id: "alimentos",
    nombre: "Alimentos clínicos",
    descripcion: "Dietas veterinarias para necesidades específicas.",
    imagen: IMG.perroDos
  },
  {
    id: "higiene",
    nombre: "Higiene y cuidado",
    descripcion: "Accesorios de higiene dental, ótica y cuidado diario.",
    imagen: IMG.cachorro
  },
  {
    id: "educacion",
    nombre: "Educación",
    descripcion: "Material gratuito para tutores responsables.",
    imagen: IMG.educacion
  }
];

export const productosIniciales = [
  {
    codigo: "ME004",
    nombre: "Nexgard (Afoxolaner)",
    categoria: "antiparasitarios",
    presentacion: "Masticable 1 unid. (Perro)",
    descripcion: "Tratamiento y prevención de infestaciones por pulgas y garrapatas en perros.",
    precio: 9500,
    precioOferta: null,
    stock: 60,
    stockCritico: 10,
    imagen: IMG.perro
  },
  {
    codigo: "ME005",
    nombre: "Bravecto (Fluralaner)",
    categoria: "antiparasitarios",
    presentacion: "Masticable 1 unid. (Perro)",
    descripcion: "Protección continua por hasta 12 semanas contra pulgas y garrapatas.",
    precio: 18900,
    precioOferta: 16900,
    stock: 8,
    stockCritico: 10,
    imagen: IMG.perroDos
  },
  {
    codigo: "ME006",
    nombre: "Drontal Plus (Prazicuantel)",
    categoria: "antiparasitarios",
    presentacion: "Comprimido 1 unid. (Perro)",
    descripcion: "Antiparasitario interno de amplio espectro contra nematodos y cestodos.",
    precio: 3900,
    precioOferta: null,
    stock: 40,
    stockCritico: 10,
    imagen: IMG.cachorro
  },
  {
    codigo: "ME007",
    nombre: "Revolution Gatos (Selamectina)",
    categoria: "antiparasitarios",
    presentacion: "Pipeta 0,75 ml (Gato)",
    descripcion: "Pipeta mensual contra pulgas, ácaros del oído y parásitos intestinales.",
    precio: 12500,
    precioOferta: 10900,
    stock: 15,
    stockCritico: 5,
    imagen: IMG.gato
  },
  {
    codigo: "ME001",
    nombre: "Amoxibay 250mg (Amoxicilina)",
    categoria: "antibioticos",
    presentacion: "Blíster 10 comp. (Perro / Gato)",
    descripcion: "Antibiótico bactericida de amplio espectro para infecciones respiratorias y dérmicas.",
    precio: 4200,
    precioOferta: null,
    stock: 45,
    stockCritico: 10,
    imagen: IMG.medicamentos
  },
  {
    codigo: "ME002",
    nombre: "Enrofloxacino 50mg",
    categoria: "antibioticos",
    presentacion: "Blíster 10 comp. (Perro / Gato)",
    descripcion: "Antibiótico de la familia de las quinolonas para infecciones urinarias y digestivas.",
    precio: 6900,
    precioOferta: null,
    stock: 4,
    stockCritico: 8,
    imagen: IMG.medicamentos
  },
  {
    codigo: "ME003",
    nombre: "Cefalexina 250mg/5ml",
    categoria: "antibioticos",
    presentacion: "Suspensión oral 100 ml",
    descripcion: "Antibiótico en suspensión, de fácil dosificación para cachorros y gatos.",
    precio: 7800,
    precioOferta: null,
    stock: 25,
    stockCritico: 6,
    imagen: IMG.medicamentos
  },
  {
    codigo: "ME011",
    nombre: "Clorhexidina shampoo 2%",
    categoria: "dermatologia",
    presentacion: "Frasco 250 ml (Perro / Gato)",
    descripcion: "Antiséptico de uso tópico para higiene y tratamiento de piodermas y dermatitis.",
    precio: 8900,
    precioOferta: null,
    stock: 0,
    stockCritico: 5,
    imagen: IMG.dermatologia
  },
  {
    codigo: "ME013",
    nombre: "Apoquel 16mg (Oclacitinib)",
    categoria: "dermatologia",
    presentacion: "Blíster 10 comp. (Perro)",
    descripcion: "Control rápido y seguro del prurito asociado a dermatitis alérgica en caninos.",
    precio: 22000,
    precioOferta: 19800,
    stock: 18,
    stockCritico: 5,
    imagen: IMG.cachorro
  },
  {
    codigo: "ME014",
    nombre: "Crema cicatrizante con alantoína",
    categoria: "dermatologia",
    presentacion: "Pomo 50 g",
    descripcion: "Favorece la regeneración de la piel en heridas superficiales y rozaduras.",
    precio: 5400,
    precioOferta: null,
    stock: 30,
    stockCritico: 6,
    imagen: IMG.dermatologia
  },
  {
    codigo: "AL001",
    nombre: "Dieta renal felina",
    categoria: "alimentos",
    presentacion: "Saco 2 kg (Gato)",
    descripcion: "Alimento clínico bajo en fósforo para apoyar la función renal de gatos adultos.",
    precio: 24990,
    precioOferta: null,
    stock: 12,
    stockCritico: 5,
    imagen: IMG.gato
  },
  {
    codigo: "AL002",
    nombre: "Dieta gastrointestinal canina",
    categoria: "alimentos",
    presentacion: "Saco 3,85 kg (Perro)",
    descripcion: "Alimento de alta digestibilidad para perros con trastornos digestivos.",
    precio: 32990,
    precioOferta: 28990,
    stock: 9,
    stockCritico: 5,
    imagen: IMG.perroDos
  },
  {
    codigo: "AL003",
    nombre: "Lata de recuperación",
    categoria: "alimentos",
    presentacion: "Lata 400 g (Perro / Gato)",
    descripcion: "Alimento húmedo hipercalórico para pacientes en convalecencia.",
    precio: 3200,
    precioOferta: null,
    stock: 50,
    stockCritico: 12,
    imagen: IMG.perro
  },
  {
    codigo: "HI001",
    nombre: "Kit cepillo dental doble",
    categoria: "higiene",
    presentacion: "Unidad (Perro / Gato)",
    descripcion: "Cepillo de doble cabezal y dedal para la higiene dental diaria.",
    precio: 2990,
    precioOferta: 2490,
    stock: 70,
    stockCritico: 10,
    imagen: IMG.cachorro
  },
  {
    codigo: "HI002",
    nombre: "Limpiador ótico",
    categoria: "higiene",
    presentacion: "Frasco 120 ml",
    descripcion: "Solución para la limpieza suave del conducto auditivo externo.",
    precio: 6500,
    precioOferta: null,
    stock: 22,
    stockCritico: 6,
    imagen: IMG.gato
  },
  {
    codigo: "EDU001",
    nombre: "Guía de primeros auxilios y vacunación",
    categoria: "educacion",
    presentacion: "Documento digital PDF",
    descripcion: "Manual preventivo con protocolos de urgencia para tutores responsables.",
    precio: 0,
    precioOferta: null,
    stock: 200,
    stockCritico: 10,
    imagen: IMG.educacion
  }
];

export const usuariosIniciales = [
  {
    run: "190110222",
    nombre: "Administrador",
    apellidos: "San Marcos",
    correo: "admin@duoc.cl",
    password: "admin123",
    rol: "ADMIN",
    fechaNacimiento: "1990-04-12",
    direccion: "Av. San Juan 1020",
    region: "OHI",
    comuna: "Rancagua"
  },
  {
    run: "142234564",
    nombre: "Camila",
    apellidos: "Valenzuela Rojas",
    correo: "vendedor@duoc.cl",
    password: "vende123",
    rol: "VENDEDOR",
    fechaNacimiento: "1995-08-30",
    direccion: "Los Aromos 455",
    region: "OHI",
    comuna: "Machalí"
  },
  {
    run: "201234565",
    nombre: "Javiera",
    apellidos: "Rojas Fuentes",
    correo: "cliente@gmail.com",
    password: "cliente1",
    rol: "CLIENTE",
    fechaNacimiento: "2000-01-15",
    direccion: "Los Crisantemos 120, Edificio Norte",
    region: "RM",
    comuna: "Providencia"
  }
];

const cliente = { nombre: "Javiera", apellidos: "Rojas Fuentes", correo: "cliente@gmail.com" };
const envio = {
  calle: "Los Crisantemos 120, Edificio Norte",
  departamento: "Depto 603",
  region: "RM",
  comuna: "Providencia",
  indicaciones: ""
};

export const boletasIniciales = [
  {
    numero: 1,
    fecha: "2026-09-20T12:32:00",
    estado: "Pagada",
    cliente,
    envio: { ...envio, indicaciones: "Dejar con conserjería." },
    items: [
      { codigo: "ME004", nombre: "Nexgard (Afoxolaner)", precioUnitario: 9500, cantidad: 2, subtotal: 19000, imagen: IMG.perro },
      { codigo: "HI001", nombre: "Kit cepillo dental doble", precioUnitario: 2490, cantidad: 1, subtotal: 2490, imagen: IMG.cachorro }
    ],
    total: 21490,
    pago: { medio: "Tarjeta", ultimosDigitos: "1111", codigoAutorizacion: "AUT-584211", motivo: null }
  },
  {
    numero: 2,
    fecha: "2026-10-01T09:05:00",
    estado: "Enviada",
    cliente,
    envio,
    items: [
      { codigo: "AL002", nombre: "Dieta gastrointestinal canina", precioUnitario: 28990, cantidad: 1, subtotal: 28990, imagen: IMG.perroDos },
      { codigo: "EDU001", nombre: "Guía de primeros auxilios y vacunación", precioUnitario: 0, cantidad: 1, subtotal: 0, imagen: IMG.educacion }
    ],
    total: 28990,
    pago: { medio: "Tarjeta", ultimosDigitos: "1111", codigoAutorizacion: "AUT-610934", motivo: null }
  },
  {
    numero: 3,
    fecha: "2026-10-03T16:47:00",
    estado: "Rechazada",
    cliente,
    envio: { ...envio, departamento: "" },
    items: [
      { codigo: "ME013", nombre: "Apoquel 16mg (Oclacitinib)", precioUnitario: 19800, cantidad: 1, subtotal: 19800, imagen: IMG.cachorro }
    ],
    total: 19800,
    pago: { medio: "Tarjeta", ultimosDigitos: "0002", codigoAutorizacion: null, motivo: "Tarjeta rechazada por el emisor." }
  }
];