export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  tag?: string;
}

export type MenuCategory =
  | 'Entradas y Tapas'
  | 'Crudos y Tiraditos'
  | 'Arroces y Paellas'
  | 'Pescados a la Brasa'
  | 'Cazuelas y Pastas'
  | 'Guarniciones'
  | 'Postres'
  | 'Vinos y Coctelería';

export const MENU_CATEGORIES: MenuCategory[] = [
  'Entradas y Tapas',
  'Crudos y Tiraditos',
  'Arroces y Paellas',
  'Pescados a la Brasa',
  'Cazuelas y Pastas',
  'Guarniciones',
  'Postres',
  'Vinos y Coctelería',
];

export interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: string;
}

export interface RestaurantInfo {
  name: string;
  subtitle: string;
  category: string;
  reviewCount: number;
  priceRange: string;
  whatsappNumber: string;
  address: string;
  neighborhood: string;
  hours: string;
  instagramHandle: string;
  instagramUrl: string;
  googleMapsUrl: string;
  email: string;
}

export const HERO_BACKGROUND_IMAGE =
  '/assets/aistudio/CASA_DE_MARISCOS_6db247f6.jpg';

export const RESERVATION_IMAGE =
  '/src/assets/images/hero_casa_mariscos_madera_1795139201376.jpg';

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gal-1',
    src: '/src/assets/images/gallery_paella_mariscos_1795134333589.jpg',
    title: 'Paella de Mariscos del Canal',
    caption: 'Langostinos, mejillones, calamares y arroz al azafrán preparado al momento.',
    category: 'Arroces y Paellas',
  },
  {
    id: 'gal-2',
    src: '/src/assets/images/gallery_pulpo_brasa_1795134333621.jpg',
    title: 'Pulpo Español a la Brasa',
    caption: 'Tentáculo sellado al fuego sobre espuma tibia de papa y pimentón.',
    category: 'Pescados a la Brasa',
  },
  {
    id: 'gal-3',
    src: '/src/assets/images/gallery_tiradito_salmon_1795134333923.jpg',
    title: 'Tiradito de Pesca Blanca y Salmón',
    caption: 'Láminas frescas curadas al momento en leche de tigre cítrica y maíz cancha.',
    category: 'Crudos y Tiraditos',
  },
  {
    id: 'gal-4',
    src: '/src/assets/images/hero_casa_mariscos_madera_1795139201376.jpg',
    title: 'Nuestro Salón de Madera y Mesas Tradicionales',
    caption: 'Ambiente cálido fueguino con mesas y sillas de madera maciza en el corazón de Ushuaia.',
    category: 'El Salón',
  },
  {
    id: 'gal-5',
    src: '/src/assets/images/gallery_cazuela_mar_1795134334145.jpg',
    title: 'Cazuela Patagónica de Mariscos',
    caption: 'Vieiras, centolla, langostinos, mejillones y pesca del día en caldo caliente con pan tostado.',
    category: 'Cazuelas y Pastas',
  },
];

export const DEFAULT_RESTAURANT_INFO: RestaurantInfo = {
  name: 'La Casa de los Mariscos',
  subtitle: 'Tradicional Marisquería de Ushuaia',
  category: 'Marisquería',
  reviewCount: 3963,
  priceRange: '$ 30.000–70.000',
  whatsappNumber: '5492901488405',
  address: 'Av. San Martín 232, Ushuaia, Tierra del Fuego',
  neighborhood: 'Centro de Ushuaia · Canal Beagle',
  hours: 'Lun a Dom · 12:00 a 15:30 y 20:00 a 00:00',
  instagramHandle: '@lacasadelosmariscosushuaia',
  instagramUrl: 'https://www.instagram.com/lacasadelosmariscosushuaia',
  googleMapsUrl: 'https://maps.app.goo.gl/8wh6uML7rbFdb4dc6',
  email: 'info@lacasadelosmariscos.com',
};

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  // Entradas y Tapas
  {
    id: 'ent-1',
    name: 'Rabas a la Romana Clásicas',
    description: 'Anillas de calamar tiernizadas en rebozado ligero con alioli de lima y limón quemado.',
    price: 31500,
    category: 'Entradas y Tapas',
    tag: 'Clásico',
  },
  {
    id: 'ent-2',
    name: 'Langostinos al Ajillo en Hierro',
    description: 'Colas de langostinos patagónicos salteadas en oliva extra virgen, ajo confitado y guindilla.',
    price: 34800,
    category: 'Entradas y Tapas',
  },
  {
    id: 'ent-3',
    name: 'Mejillones a la Provenzal & Vino Blanco',
    description: 'Cazuela de mejillones frescos vaporizados en Torrontés salteño, perejil y pan tostado.',
    price: 30500,
    category: 'Entradas y Tapas',
  },
  {
    id: 'ent-4',
    name: 'Empanadas de Centolla y Puerro (3 u.)',
    description: 'Masa hojaldrada artesanal rellena de carne de centolla fueguina y crema suave de limón.',
    price: 32000,
    category: 'Entradas y Tapas',
    tag: 'Especialidad',
  },
  {
    id: 'ent-5',
    name: 'Chipirones Salteados con Cebolla Caramelizada',
    description: 'Chipirones enteros a la plancha sobre reducción de su tinta y aceite de hierbas.',
    price: 35500,
    category: 'Entradas y Tapas',
  },

  // Crudos y Tiraditos
  {
    id: 'cru-1',
    name: 'Tiradito de Pesca Blanca y Salmón',
    description: 'Láminas frescas curadas al momento en leche de tigre cítrica, ají limo y maíz cancha.',
    price: 36900,
    category: 'Crudos y Tiraditos',
    tag: 'Fresco del día',
  },
  {
    id: 'cru-2',
    name: 'Ceviche Clásico de Lenguado',
    description: 'Cubos de lenguado del Atlántico en jugo de lima recién exprimida, cebolla morada y batata glaseada.',
    price: 37500,
    category: 'Crudos y Tiraditos',
  },
  {
    id: 'cru-3',
    name: 'Ostras Frescas en Hielo (6 u.)',
    description: 'Ostras vivas abiertas en barra con mignonette de chalotes, vinagre de Jerez y gajos de limón.',
    price: 42000,
    category: 'Crudos y Tiraditos',
  },
  {
    id: 'cru-4',
    name: 'Tartar de Trucha Patagónica y Palta',
    description: 'Trucha arcoíris cortada a cuchillo, alcaparras crocantes, sésamo tostado y tostadas finas.',
    price: 35800,
    category: 'Crudos y Tiraditos',
  },

  // Arroces y Paellas
  {
    id: 'arr-1',
    name: 'Paella de Mariscos para Compartir (2 pers.)',
    description: 'Arroz bomba al azafrán con langostinos enteros, mejillones, almejas, calamar y socarrat dorado.',
    price: 68500,
    category: 'Arroces y Paellas',
    tag: 'Para compartir',
  },
  {
    id: 'arr-2',
    name: 'Arroz Negro con Chipirones y Alioli',
    description: 'Arroz caldoso en tinta de calamar con chipirones tiernos, arvejas frescas y punto de alioli.',
    price: 46500,
    category: 'Arroces y Paellas',
  },
  {
    id: 'arr-3',
    name: 'Risotto Cremoso de Langostinos y Azafrán',
    description: 'Arroz Carnaroli mantecado con bisque de crustáceos, mascarpone y langostinos grillados.',
    price: 44900,
    category: 'Arroces y Paellas',
  },

  // Pescados a la Brasa
  {
    id: 'pes-1',
    name: 'Pulpo Español a la Brasa',
    description: 'Tentáculo cocido a baja temperatura y sellado al quebracho sobre espuma de papa ahumada.',
    price: 64000,
    category: 'Pescados a la Brasa',
    tag: 'Firma del Chef',
  },
  {
    id: 'pes-2',
    name: 'Salmón Rosado a la Parrilla',
    description: 'Posta de salmón con piel crocante, manteca de hierbas, espárragos grillados y alcaparras.',
    price: 49500,
    category: 'Pescados a la Brasa',
  },
  {
    id: 'pes-3',
    name: 'Chernia Entera al Horno de Barro',
    description: 'Pesca fresca con papas rotas al romero, tomates cherry confitados y olivas negras.',
    price: 56000,
    category: 'Pescados a la Brasa',
  },
  {
    id: 'pes-4',
    name: 'Abadejo en Salsa Verde de Almejas',
    description: 'Lomo de abadejo sellado en fumet blanco, perejil fresco, ajo tierno y almejas abiertas.',
    price: 47200,
    category: 'Pescados a la Brasa',
  },

  // Cazuelas y Pastas
  {
    id: 'caz-1',
    name: 'Cazuela Patagónica de Mariscos',
    description: 'Guiso marino en barro con vieiras, langostinos, mejillones, calamares y pesca blanca.',
    price: 54000,
    category: 'Cazuelas y Pastas',
    tag: 'Abundante',
  },
  {
    id: 'caz-2',
    name: 'Fettuccine Artesanales Frutti di Mare',
    description: 'Pasta fresca al huevo salteada con almejas, mejillones, camarones y tomates San Marzano.',
    price: 43800,
    category: 'Cazuelas y Pastas',
  },
  {
    id: 'caz-3',
    name: 'Sorrentinos Negros de Salmón y Ricota',
    description: 'Masa al negro de sepia en emulsión suave de crema cítrica, eneldo y langostinos.',
    price: 42500,
    category: 'Cazuelas y Pastas',
  },

  // Guarniciones
  {
    id: 'gua-1',
    name: 'Papas Rústicas al Romero y Sal Marina',
    description: 'Papas rotas crocantes doradas en oliva con escamas de sal patagónica.',
    price: 12500,
    category: 'Guarniciones',
  },
  {
    id: 'gua-2',
    name: 'Vegetales de Estación a las Brasas',
    description: 'Zucchini, espárragos, morrones asados y cebolla morada con vinagreta de limón.',
    price: 14000,
    category: 'Guarniciones',
  },
  {
    id: 'gua-3',
    name: 'Ensalada Verde con Palta e Hinojo',
    description: 'Mix de brotes orgánicos, hinojo en láminas finas, palta y aderezo de naranja.',
    price: 13200,
    category: 'Guarniciones',
  },

  // Postres
  {
    id: 'pos-1',
    name: 'Crema Catalana Quemada al Momento',
    description: 'Infusión de vainilla natural y piel de naranja con costra crocante de azúcar caramelizado.',
    price: 13500,
    category: 'Postres',
  },
  {
    id: 'pos-2',
    name: 'Tarta Vasca de Queso & Frutos Rojos',
    description: 'Centro fundente horneado a alta temperatura con compota tibia de frutos del sur.',
    price: 15200,
    category: 'Postres',
  },
  {
    id: 'pos-3',
    name: 'Mousse de Chocolate Amargo 70% & Sal de Mar',
    description: 'Textura aireada de cacao ecuatoriano, aceite de oliva y cristales de sal marina.',
    price: 14800,
    category: 'Postres',
  },

  // Vinos y Coctelería
  {
    id: 'vin-1',
    name: 'Chardonnay Reserva Valle de Uco (Botella)',
    description: 'Blanco mineral de altura con notas de fruta blanca, acidez vibrante y leve paso por roble.',
    price: 38000,
    category: 'Vinos y Coctelería',
  },
  {
    id: 'vin-2',
    name: 'Torrontés de Cafayate Tardío (Botella)',
    description: 'Aromático, floral y cítrico; maridaje ideal para ceviches, tiraditos y mariscos grillados.',
    price: 32500,
    category: 'Vinos y Coctelería',
  },
  {
    id: 'vin-3',
    name: 'Negroni Costero / Gin Tonic Botánico',
    description: 'Coctelería de autor con gin patagónico, pomelo rosado, romero fresco o vermut rosso.',
    price: 16500,
    category: 'Vinos y Coctelería',
  },
];
