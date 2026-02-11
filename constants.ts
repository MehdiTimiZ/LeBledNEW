
import { MarketplaceItem, CommunityPost, CharityEvent, CurrencyRate, MedicalService, DeliveryRequest, Review } from './types';

export const TRANSLATIONS = {
  FR: {
    menu: {
      HOME: 'Accueil',
      VEHICLES: 'Véhicules',
      COMMUNITY: 'Communauté',
      CHARITY: 'Civil Mob',
      SERVICES: 'Santé',
      DELIVERY: 'Livraison',
      FLEXY: 'Flexy',
      CHAT: 'Assistant Bled',
      ADMIN_PANEL: 'Admin Panel',
      SELLER_DASHBOARD: 'Tableau de bord Vendeur',
      PROFILE: 'Paramètres',
      LOGOUT: 'Déconnexion',
      EXPATS: 'Expats Hub'
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
      area: "Surface (m²)",
      rooms: "Chambres",
      floor: "Étage",
      brand: "Marque",
      condition: "État",
      booking: "Gestion des réservations",
      startTime: "Heure début",
      endTime: "Heure fin",
      availableDays: "Jours disponibles",
      message: "Message",
      editProfile: "Modifier le profil",
      itemsSold: "Objets vendus",
      trustedSeller: "Vendeur de confiance",
      fastResponder: "Répond rapidement",
      verifiedId: "Identité vérifiée",
      about: "À propos",
      listings: "Annonces",
      noReviews: "Aucun avis pour le moment",
      beFirst: "Soyez le premier à donner votre avis !",
      reviewCount: "Avis",
      specifications: "Caractéristiques"
    }
  },
  EN: {
    menu: {
      HOME: 'Home',
      VEHICLES: 'Vehicles',
      COMMUNITY: 'Community',
      CHARITY: 'Civil Alert',
      SERVICES: 'Health',
      DELIVERY: 'Delivery',
      FLEXY: 'Flexy',
      CHAT: 'Bled Assistant',
      ADMIN_PANEL: 'Admin Panel',
      SELLER_DASHBOARD: 'Seller Dashboard',
      PROFILE: 'Settings',
      LOGOUT: 'Log Out',
      EXPATS: 'Expats Hub'
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
      area: "Area (sq m)",
      rooms: "Bedrooms",
      floor: "Floor",
      brand: "Brand",
      condition: "Condition",
      booking: "Booking Management",
      startTime: "Start Time",
      endTime: "End Time",
      availableDays: "Available Days",
      message: "Message",
      editProfile: "Edit Profile",
      itemsSold: "Items Sold",
      trustedSeller: "Trusted Seller",
      fastResponder: "Fast Responder",
      verifiedId: "Verified ID",
      about: "About",
      listings: "Listings",
      noReviews: "No reviews yet",
      beFirst: "Be the first to rate!",
      reviewCount: "Reviews",
      specifications: "Specifications"
    }
  }
};

export const ALGERIA_WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", 
  "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", 
  "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", 
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", 
  "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", 
  "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", 
  "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", 
  "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

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
      rating: 4.8,
      phone: '0550123456'
    },
    description: 'Peugeot 208 GT Line 2023 in pristine condition. Full options. First hand, well maintained.',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'
    ],
    specifications: {
        "Year": 2023,
        "Fuel": "Essence",
        "Transmission": "Automatic",
        "Kilometers": 12000,
        "Engine": "1.2 PureTech 130ch",
        "Color": "White"
    }
  },
  {
    id: '2',
    title: 'Appartement F4 Centre Ville',
    price: '18,000,000 DZD',
    location: 'Oran',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    tag: 'Real Estate',
    condition: 'Good',
    date: '2023-10-24',
    seller: {
      name: 'Sarah Immobilier',
      verified: true,
      rating: 5.0,
      phone: '0550654321'
    },
    description: 'Beautiful F4 apartment located in the heart of Oran. Close to all amenities, tramway, and schools.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'
    ],
    specifications: {
        "Surface": "120 m²",
        "Rooms": 4,
        "Floor": 3,
        "Papers": "Act & Livret Foncier",
        "Furnished": "No"
    }
  }
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: '1',
    user: 'mehdi.timizar',
    content: 'Salam alikoum, does anyone know a good mechanic in Hydra area?',
    timestamp: '2/6/2026, 2:19:36 PM',
    likes: 12,
    comments: 4,
    category: 'general'
  },
  {
    id: '2',
    user: 'JohnExpat',
    content: 'Hello everyone! I just arrived in Algiers. Where is the best place to buy organic vegetables near Sidi Yahia?',
    timestamp: '2/7/2026, 9:00:00 AM',
    likes: 8,
    comments: 12,
    category: 'expat'
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
    title: 'Urgence Don de Sang',
    location: 'Hôpital Mustapha',
    joined: 45,
    goal: 100,
    progress: 85,
    category: 'Medical'
  }
];

export const CURRENCY_RATES: CurrencyRate[] = [
  { currency: 'Euro', buy: 282, sell: 284, trend: 'up' },
  { currency: 'US Dollar', buy: 210, sell: 212, trend: 'down' }
];

export const MEDICAL_SERVICES: MedicalService[] = [
  {
    id: '1',
    name: 'Dr. Amrani - Cardiologue',
    type: 'Doctor',
    specialty: 'Cardiologue',
    location: 'Sidi Yahia, Alger',
    price: '2,500 DZD',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    rating: 4.8,
    contactNumber: '0550 12 34 56'
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
  }
];

export const EXPAT_HOUSING_ITEMS: MarketplaceItem[] = [
  {
    id: 'ex1',
    title: 'Luxury 3BR Apt - Hydra Heights',
    price: '2,500 EUR/mo',
    location: 'Hydra, Alger',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    tag: 'Real Estate',
    condition: 'Furnished',
    date: 'Today',
    seller: {
      name: 'Prestige Living',
      verified: true,
      rating: 5.0,
      phone: '0550998877'
    },
    description: 'Fully furnished, high security, diplomat area. Includes generator and water tank.',
    isPremium: true,
    specifications: {
        "Bedrooms": 3,
        "Bathrooms": 2,
        "Area": "150 m²",
        "Security": "24/7",
        "Parking": "Underground"
    }
  },
  {
    id: 'ex2',
    title: 'Modern Villa with Pool',
    price: '4,000 EUR/mo',
    location: 'Ben Aknoun, Alger',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800',
    tag: 'Real Estate',
    condition: 'Furnished',
    date: 'Yesterday',
    seller: {
      name: 'Elite Homes',
      verified: true,
      rating: 4.9,
      phone: '0550112233'
    },
    description: 'Spacious villa, international school nearby. Perfect for families.',
    isPremium: true
  }
];

export const SYSTEM_INSTRUCTION = `Tu es "Assistant Bled", un guide IA chaleureux.`;
