
import { MarketplaceItem, CommunityPost, CharityEvent, CurrencyRate, MedicalService, DeliveryRequest, Review } from './types';

export const TRANSLATIONS = {
  FR: {
    menu: {
      HOME: 'Accueil',
      VEHICLES: 'Véhicules',
      COMMUNITY: 'Communauté',
      CHARITY: 'Civil Mob',
      SERVICES: 'Services Médicaux',
      DELIVERY: 'Livraison',
      FLEXY: 'Flexy',
      CHAT: 'Assistant Bled',
      ADMIN_PANEL: 'Admin Panel',
      SELLER_DASHBOARD: 'Tableau de bord Vendeur',
      PROFILE: 'Paramètres',
      LOGOUT: 'Déconnexion'
    },
    ui: {
      searchPlaceholder: "Rechercher sur Lebled...",
      heroTitle: "Vendez et achetez en",
      heroTitleHighlight: "toute confiance",
      heroSubtitle: "La plateforme de choix pour tous vos besoins en Algérie.",
      currencyTitle: "BOURSE D'ALGER",
      eventsTitle: "Événements à proximité",
      filtersTitle: "Filtres",
      resultsFound: "Résultats trouvés",
      viewGrid: "Grille",
      viewList: "Liste",
      contact: "Contacter",
      book: "Réserver",
      description: "Description",
      seller: "Vendeur",
      reviews: "Avis",
      writeReview: "Écrire un avis",
      safetyTips: "Conseils de sécurité",
      postedOn: "Publié le",
      price: "Prix",
      location: "Lieu",
      category: "Catégorie",
      clearAll: "Tout effacer",
      commonFilters: "Filtres courants",
      viewProfile: "Voir le profil",
      viewAd: "Voir l'annonce",
      contactSeller: "Contacter le vendeur",
      createListing: "Créer une annonce",
      title: "Titre",
      uploadImage: "Télécharger image",
      publish: "Publier l'annonce",
      year: "Année",
      fuel: "Carburant",
      transmission: "Boîte",
      kilometers: "Kilométrage",
      propertyType: "Type de bien",
      area: "Surface",
      rooms: "Pièces",
      floor: "Étage",
      brand: "Marque",
      condition: "État",
      booking: "Gestion des réservations",
      startTime: "Heure début",
      endTime: "Heure fin",
      availableDays: "Jours disponibles"
    }
  },
  EN: {
    menu: {
      HOME: 'Home',
      VEHICLES: 'Vehicles',
      COMMUNITY: 'Community',
      CHARITY: 'Civil Mob',
      SERVICES: 'Medical Services',
      DELIVERY: 'Delivery',
      FLEXY: 'Flexy',
      CHAT: 'Bled Assistant',
      ADMIN_PANEL: 'Admin Panel',
      SELLER_DASHBOARD: 'Seller Dashboard',
      PROFILE: 'Settings',
      LOGOUT: 'Log Out'
    },
    ui: {
      searchPlaceholder: "Search on Lebled...",
      heroTitle: "Buy and sell with",
      heroTitleHighlight: "confidence",
      heroSubtitle: "The platform of choice for all your needs in Algeria.",
      currencyTitle: "ALGIERS EXCHANGE",
      eventsTitle: "Events Nearby",
      filtersTitle: "Filters",
      resultsFound: "Results found",
      viewGrid: "Grid",
      viewList: "List",
      contact: "Contact",
      book: "Book",
      description: "Description",
      seller: "Seller",
      reviews: "Reviews",
      writeReview: "Write Review",
      safetyTips: "Safety Tips",
      postedOn: "Posted on",
      price: "Price",
      location: "Location",
      category: "Category",
      clearAll: "Clear All",
      commonFilters: "Common Filters",
      viewProfile: "View Profile",
      viewAd: "View Ad",
      contactSeller: "Contact Seller",
      createListing: "Create Listing",
      title: "Title",
      uploadImage: "Upload Image",
      publish: "Publish Listing",
      year: "Year",
      fuel: "Fuel",
      transmission: "Transmission",
      kilometers: "Kilometers",
      propertyType: "Property Type",
      area: "Area",
      rooms: "Rooms",
      floor: "Floor",
      brand: "Brand",
      condition: "Condition",
      booking: "Booking Management",
      startTime: "Start Time",
      endTime: "End Time",
      availableDays: "Available Days"
    }
  }
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    authorId: 'u2',
    authorName: 'Sarah Benali',
    rating: 5,
    comment: 'Excellent vendeur ! L\'article est exactement comme décrit.',
    date: '2023-10-20',
    helpfulCount: 12,
    targetId: 'seller1',
    targetType: 'user'
  },
  {
    id: 'r2',
    authorId: 'u3',
    authorName: 'Karim Oualid',
    rating: 4,
    comment: 'Bonne transaction.',
    date: '2023-10-15',
    helpfulCount: 3,
    targetId: '1', // item id
    targetType: 'item'
  },
  {
    id: 'r3',
    authorId: 'u4',
    authorName: 'Amina Z',
    rating: 5,
    comment: 'Très professionnelle. Je recommande.',
    date: '2023-09-28',
    helpfulCount: 8,
    targetId: 'seller1',
    targetType: 'user'
  },
  {
    id: 'r4',
    authorId: 'u5',
    authorName: 'Omar K',
    rating: 5,
    comment: 'Perfect condition, thanks!',
    date: '2023-10-26',
    helpfulCount: 2,
    targetId: '1', // item id
    targetType: 'item'
  }
];

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Peugeot 208 GT Line 2023',
    price: '3,200,000 DZD',
    location: 'Alger',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    tag: 'Vehicles',
    condition: 'Like New',
    date: '2023-10-25',
    seller: {
      name: 'Amine Auto',
      verified: true,
      rating: 4.8
    },
    description: 'Peugeot 208 GT Line 2023 in pristine condition. Full options, panoramic roof, i-Cockpit 3D. Low mileage (15,000km). Maintained at official Peugeot dealership. First hand. Price is slightly negotiable for serious buyers.',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: '2',
    title: 'Appartement F4 Centre Ville',
    price: '18,000,000 DZD',
    location: 'Oran',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    tag: 'RealEstate',
    condition: 'Good',
    date: '2023-10-24',
    seller: {
      name: 'Sarah Immobilier',
      verified: true,
      rating: 5.0
    },
    description: 'Beautiful F4 apartment located in the heart of Oran. 120m², 3rd floor with elevator. 3 bedrooms, large living room, equipped kitchen, central heating. Close to all amenities (schools, tramway, shops). Papers in order (Acte & Livret Foncier).',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: '3',
    title: 'iPhone 14 Pro Max',
    price: '240,000 DZD',
    location: 'Setif',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
    tag: 'Phones',
    condition: 'Like New',
    date: '2023-10-23',
    seller: {
      name: 'Yacine Tech',
      rating: 4.5
    },
    description: 'iPhone 14 Pro Max 256GB Deep Purple. Battery health 98%. Comes with box and original cable. No scratches, always used with screen protector and case. Selling to upgrade.',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: '4',
    title: 'Gaming PC RTX 4080',
    price: '450,000 DZD',
    location: 'Blida',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800',
    tag: 'Computing',
    date: '2023-10-27',
    seller: {
      name: 'Mehdi Gaming',
      verified: true,
      rating: 4.9
    },
    description: 'High-end gaming PC. Specs: RTX 4080 16GB, i9 13900K, 32GB DDR5 RAM, 2TB NVMe SSD. Custom water cooling loop. Perfect for 4K gaming and rendering. Built 2 months ago.',
    images: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: '5',
    title: 'MacBook Pro M2 14"',
    price: '350,000 DZD',
    location: 'Constantine',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800',
    tag: 'Computing',
    date: '2023-10-26',
    seller: {
      name: 'Laptop Store DZ',
      rating: 4.7
    },
    description: 'MacBook Pro 14 inch M2 Pro chip. 16GB RAM, 512GB SSD. Space Grey. Brand new sealed in box. 1 year international warranty.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: '1',
    user: 'mehdi.timizar',
    content: 'Salam alikoum, does anyone know a good mechanic in Hydra area for Volkswagen cars?',
    timestamp: '2/6/2026, 2:19:36 PM',
    likes: 12,
    comments: 4
  },
  {
    id: '2',
    user: 'amin.dev',
    content: 'Just launched my new startup delivering homemade food in Algiers! Check us out @KoulBenna',
    timestamp: '2/6/2026, 8:17:03 AM',
    likes: 45,
    comments: 12
  }
];

export const CHARITY_EVENTS: CharityEvent[] = [
  {
    id: '1',
    title: 'Nettoyage Plage Sablettes',
    location: 'Alger centre',
    joined: 12,
    goal: 50,
    progress: 24,
    category: 'Environment'
  },
  {
    id: '2',
    title: 'Distribution Paniers Ramadan',
    location: 'Alger',
    joined: 8,
    goal: 50,
    progress: 16,
    category: 'Charity'
  },
  {
    id: '3',
    title: 'Plantation d\'arbres - Forêt de Bainem',
    location: 'Bainem, Alger',
    joined: 45,
    goal: 100,
    progress: 45,
    category: 'Environment'
  }
];

export const CURRENCY_RATES: CurrencyRate[] = [
  { currency: 'Euro', buy: 282, sell: 284, trend: 'up' },
  { currency: 'Livre Sterling', buy: 312, sell: 315, trend: 'stable' },
  { currency: 'UAE Dirham', buy: 65, sell: 67, trend: 'up' },
  { currency: 'US Dollar', buy: 210, sell: 212, trend: 'down' }
];

export const MEDICAL_SERVICES: MedicalService[] = [
  {
    id: '1',
    name: 'Cabinet Dr. Amrani',
    type: 'Doctor',
    specialty: 'Cardiologue',
    location: 'Sidi Yahia, Alger',
    price: '2,500 DZD',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    rating: 4.8,
    contactNumber: '0550 12 34 56'
  },
  {
    id: '2',
    name: 'Clinique Les Orangers',
    type: 'Clinic',
    specialty: 'Urgences 24/7',
    location: 'Hydra, Alger',
    price: 'Variable',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    rating: 4.5,
    contactNumber: '021 60 70 80'
  },
  {
    id: '3',
    name: 'Soins Infirmiers à Domicile',
    type: 'Nurse',
    specialty: 'Injections & Pansements',
    location: 'Alger Centre',
    price: '1,500 DZD',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    rating: 4.9,
    contactNumber: '0661 23 45 67'
  },
  {
    id: '4',
    name: 'Lit Médical Électrique',
    type: 'Equipment',
    specialty: 'Location',
    location: 'Rouiba',
    price: '15,000 DZD/mois',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    rating: 5.0,
    contactNumber: '0770 89 10 11'
  }
];

export const DELIVERY_REQUESTS: DeliveryRequest[] = [
  {
    id: '1',
    type: 'Delivery',
    pickup: 'Alger Centre',
    dropoff: 'Rouiba',
    date: '2/6/2026',
    budget: '2,000 DZD',
    distance: '25 km',
    vehicle: 'Van',
    status: 'Open'
  },
  {
    id: '2',
    type: 'Moving',
    pickup: 'Oran',
    dropoff: 'Mostaganem',
    date: '2/10/2026',
    budget: '15,000 DZD',
    distance: '80 km',
    vehicle: 'Truck',
    status: 'Open'
  }
];

export const SYSTEM_INSTRUCTION = `Tu es "Assistant Bled", un guide IA chaleureux.`;