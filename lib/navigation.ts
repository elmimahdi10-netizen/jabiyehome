export interface NavSubItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  badge?: string;
}

export interface NavCategory {
  label: string;
  items: NavSubItem[];
}

export interface NavItem {
  label: string;
  href?: string;
  categories?: NavCategory[];
  featured?: {
    title: string;
    description: string;
    href: string;
    imagePlaceholder: string;
  };
}

export const navigation: NavItem[] = [
  {
    label: "Smart Home",
    categories: [
      {
        label: "Locks & Access",
        items: [
          { label: "Smart Locks", href: "/category/smart-home/smart-locks", description: "Keyless entry & remote access" },
          { label: "Video Doorbells", href: "/category/smart-home/video-doorbells", description: "See who's at your door" },
          { label: "Smart Garage", href: "/category/smart-home/smart-garage", description: "Remote garage control" },
        ],
      },
      {
        label: "Climate & Lighting",
        items: [
          { label: "Smart Thermostats", href: "/category/smart-home/smart-thermostats", description: "Energy-saving temperature control" },
          { label: "Smart Lighting", href: "/category/smart-home/smart-lighting", description: "Automated lighting systems" },
          { label: "Smart Plugs", href: "/category/smart-home/smart-plugs", description: "Control any outlet remotely" },
        ],
      },
      {
        label: "Control & Automation",
        items: [
          { label: "Smart Hubs", href: "/category/smart-home/smart-hubs", description: "Central control for all devices" },
          { label: "Voice Assistants", href: "/category/smart-home/voice-assistants", description: "Hands-free home control" },
          { label: "Home Automation Kits", href: "/category/smart-home/automation-kits", description: "Complete automation bundles" },
        ],
      },
    ],
    featured: {
      title: "New: Matter Protocol",
      description: "All our smart home devices now support the universal Matter standard.",
      href: "/blog/matter-protocol-guide",
      imagePlaceholder: "smart-home-featured",
    },
  },
  {
    label: "Cameras",
    categories: [
      {
        label: "Indoor",
        items: [
          { label: "Indoor Cameras", href: "/category/cameras/indoor", description: "Monitor your home interior" },
          { label: "Baby Monitors", href: "/category/cameras/baby-monitors", description: "Keep an eye on little ones" },
          { label: "Pan-Tilt Cameras", href: "/category/cameras/pan-tilt", description: "360° coverage inside" },
        ],
      },
      {
        label: "Outdoor",
        items: [
          { label: "Outdoor Cameras", href: "/category/cameras/outdoor", description: "Weatherproof perimeter security" },
          { label: "4K Security Cameras", href: "/category/cameras/4k", description: "Ultra HD clarity", badge: "4K" },
          { label: "Wireless Cameras", href: "/category/cameras/wireless", description: "Cable-free installation" },
        ],
      },
      {
        label: "Advanced",
        items: [
          { label: "AI-Powered Cameras", href: "/category/cameras/ai-powered", description: "Smart person & vehicle detection", badge: "AI" },
          { label: "PTZ Cameras", href: "/category/cameras/ptz", description: "Pan, tilt, zoom control" },
          { label: "Night Vision Cameras", href: "/category/cameras/night-vision", description: "Crystal clear in darkness" },
        ],
      },
    ],
    featured: {
      title: "4K AI Detection",
      description: "Our latest cameras distinguish people, vehicles, and animals automatically.",
      href: "/category/cameras/ai-powered",
      imagePlaceholder: "cameras-featured",
    },
  },
  {
    label: "Alarms",
    categories: [
      {
        label: "Wireless Systems",
        items: [
          { label: "Wireless Alarm Systems", href: "/category/alarms/wireless", description: "No wiring required" },
          { label: "Smart Alarm Systems", href: "/category/alarms/smart", description: "App-controlled protection" },
          { label: "GSM Alarm Systems", href: "/category/alarms/gsm", description: "Cellular backup connectivity" },
        ],
      },
      {
        label: "Professional Grade",
        items: [
          { label: "Professional Alarms", href: "/category/alarms/professional", description: "Commercial-grade reliability" },
          { label: "Business Alarm Systems", href: "/category/alarms/business", description: "Enterprise security solutions" },
          { label: "WiFi Alarm Systems", href: "/category/alarms/wifi", description: "Internet-connected alerts" },
        ],
      },
    ],
    featured: {
      title: "24/7 Monitoring",
      description: "Professional monitoring available for all our alarm systems.",
      href: "/services/monitoring",
      imagePlaceholder: "alarms-featured",
    },
  },
  {
    label: "Security Kits",
    categories: [
      {
        label: "Home Bundles",
        items: [
          { label: "Starter Security Kit", href: "/category/kits/starter", description: "Essential protection for apartments" },
          { label: "Family Security Kit", href: "/category/kits/family", description: "Complete home coverage" },
          { label: "Premium Security Kit", href: "/category/kits/premium", description: "Maximum protection package", badge: "Best Value" },
        ],
      },
      {
        label: "Specialist Kits",
        items: [
          { label: "Smart Home Kit", href: "/category/kits/smart-home", description: "Security meets automation" },
          { label: "Business Security Kit", href: "/category/kits/business", description: "Office & retail protection" },
          { label: "Holiday Bundle", href: "/category/kits/holiday", description: "Protect while you travel" },
        ],
      },
    ],
    featured: {
      title: "Save up to 35%",
      description: "Bundle and save — kits include everything you need for professional installation.",
      href: "/category/kits",
      imagePlaceholder: "kits-featured",
    },
  },
  {
    label: "Sensors",
    href: "/category/sensors",
    categories: [
      {
        label: "Motion Detection",
        items: [
          { label: "PIR Motion Sensors", href: "/category/sensors/pir", description: "Passive infrared detection" },
          { label: "Outdoor Motion Sensors", href: "/category/sensors/outdoor-motion", description: "Weatherproof perimeter detection" },
          { label: "AI Motion Sensors", href: "/category/sensors/ai-motion", description: "Intelligent false-alarm filtering", badge: "AI" },
        ],
      },
      {
        label: "Environmental",
        items: [
          { label: "Pet-Friendly Sensors", href: "/category/sensors/pet-friendly", description: "Ignores pets up to 25kg" },
          { label: "Door & Window Sensors", href: "/category/sensors/door-window", description: "Entry point monitoring" },
          { label: "Smoke & CO Detectors", href: "/category/sensors/smoke-co", description: "Life-safety detection" },
        ],
      },
    ],
  },
];

export const footerLinks = {
  products: [
    { label: "Smart Home", href: "/category/smart-home" },
    { label: "Security Cameras", href: "/category/cameras" },
    { label: "Alarm Systems", href: "/category/alarms" },
    { label: "Security Kits", href: "/category/kits" },
    { label: "Motion Sensors", href: "/category/sensors" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Partners", href: "/partners" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Installation Guides", href: "/guides" },
    { label: "Contact Us", href: "/contact" },
    { label: "Warranty", href: "/warranty" },
    { label: "Returns", href: "/returns" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};
