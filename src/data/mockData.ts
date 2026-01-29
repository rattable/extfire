import { ExtensionItem, TabItem } from "../types";

export const mockExtensions: ExtensionItem[] = [
  {
    id: "ext-privacy",
    name: "Spectre Privacy Shield",
    version: "3.4.1",
    description: "Bloqueur avancé de pisteurs avec filtres IA et rapports automatiques.",
    permissions: [
      { name: "onglets", risk: 2 },
      { name: "cookies", risk: 3 },
      { name: "webRequest", risk: 4 }
    ],
    enabled: true,
    icon: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
    category: "Vie privée"
  },
  {
    id: "ext-dev",
    name: "Neon DevKit",
    version: "1.9.8",
    description: "Outils de debug full-stack, capture réseau et analyse DOM.",
    permissions: [
      { name: "onglets", risk: 3 },
      { name: "storage", risk: 2 }
    ],
    enabled: true,
    icon: "https://cdn-icons-png.flaticon.com/512/4248/4248443.png",
    category: "Développement"
  },
  {
    id: "ext-shopping",
    name: "Shadow Deals",
    version: "2.1.0",
    description: "Recherche automatique de coupons et alertes de prix en temps réel.",
    permissions: [
      { name: "webRequest", risk: 5 },
      { name: "cookies", risk: 4 }
    ],
    enabled: false,
    icon: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
    category: "Shopping"
  },
  {
    id: "ext-security",
    name: "Firewall Sentinel",
    version: "4.0.2",
    description: "Pare-feu Web intelligent avec règles comportementales.",
    permissions: [
      { name: "webRequestBlocking", risk: 5 },
      { name: "storage", risk: 2 }
    ],
    enabled: true,
    icon: "https://cdn-icons-png.flaticon.com/512/10473/10473422.png",
    category: "Sécurité"
  },
  {
    id: "ext-productivity",
    name: "Focus Rail",
    version: "0.9.3",
    description: "Gestionnaire de sessions, minuteur de focus et blocage de distractions.",
    permissions: [
      { name: "onglets", risk: 2 },
      { name: "storage", risk: 1 }
    ],
    enabled: true,
    icon: "https://cdn-icons-png.flaticon.com/512/1802/1802333.png",
    category: "Productivité"
  }
];

export const mockTabs: TabItem[] = [
  {
    id: 101,
    title: "Console ExoCore / Roichi",
    url: "https://exocore.local/dashboard",
    audible: false,
    favIconUrl: "https://cdn-icons-png.flaticon.com/512/1998/1998610.png"
  },
  {
    id: 102,
    title: "Flux radar cybermenaces",
    url: "https://cyber-feed.example.com",
    audible: true,
    favIconUrl: "https://cdn-icons-png.flaticon.com/512/124/124037.png"
  },
  {
    id: 103,
    title: "Docs API Gemini",
    url: "https://ai.google.dev",
    audible: false,
    favIconUrl: "https://cdn-icons-png.flaticon.com/512/2703/2703985.png"
  },
  {
    id: 104,
    title: "Analyse RAM Extensions",
    url: "https://monitoring.exocore",
    audible: false,
    favIconUrl: "https://cdn-icons-png.flaticon.com/512/4329/4329444.png"
  }
];

export const memoryHistory = Array.from({ length: 12 }).map((_, index) => ({
  name: `T-${12 - index}m`,
  charge: 40 + Math.round(Math.random() * 45)
}));

export const extensionTypes = [
  { name: "Vie privée", value: 3 },
  { name: "Développement", value: 2 },
  { name: "Shopping", value: 1 },
  { name: "Sécurité", value: 1 },
  { name: "Productivité", value: 2 }
];
