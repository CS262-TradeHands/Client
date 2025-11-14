export interface Business {
  id: string;
  name: string;
  industry: string;
  askingPrice: string;
  location: string;
  description: string;
  employees: number;
  yearsInOperation: number;
  annualRevenue: string;
  monthlyRevenue: string;
  profitMargin: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  financialHighlights: { revenue: string; profit: string; growth: string };
  businessHours: string;
  website: string;
  socialMedia: string[];
}

export const mockBusinesses: Business[] = [
  {
    id: '6',
    name: 'Bäckerei Wörner',
    industry: 'Food & Beverage',
    askingPrice: '$750,000 - $1,000,000',
    location: 'Jettingen, Germany',
    description: 'The cutest bakery ever!',
    employees: 10,
    yearsInOperation: 250,
    annualRevenue: '$1,200,000',
    monthlyRevenue: '$100,000',
    profitMargin: '25%',
    ownerName: 'Marc Wörner',
    ownerEmail: 'marc@bakery.com',
    ownerPhone: '+49 152 34567890',
    financialHighlights: { revenue: '$1.2M', profit: '$300K', growth: '2% YoY' },
    businessHours: 'Mon-Sat 6am-6pm',
    website: 'www.backerei-worner.de',
    socialMedia: ['Instagram', 'Facebook']
  },
  {
    id: '1',
    name: 'TechStart Solutions',
    industry: 'Tech',
    askingPrice: '$250,000 - $300,000',
    location: 'San Francisco, CA',
    description: 'Profitable SaaS company with recurring revenue and growing customer base.',
    employees: 8,
    yearsInOperation: 5,
    annualRevenue: '$500,000',
    monthlyRevenue: '$42,000',
    profitMargin: '35%',
    ownerName: 'David Chen',
    ownerEmail: 'david@techstartsolutions.com',
    ownerPhone: '(555) 123-4567',
    financialHighlights: { revenue: '$500K annual revenue', profit: '$175K annual profit', growth: '25% YoY growth' },
    businessHours: 'Mon-Fri 9am-6pm',
    website: 'www.techstartsolutions.com',
    socialMedia: ['LinkedIn', 'Twitter']
  },
  {
    id: '2',
    name: "Bella's Boutique",
    industry: 'Retail',
    askingPrice: '$150,000 - $200,000',
    location: 'Austin, TX',
    description: "Established women's clothing boutique in prime downtown location with loyal customers.",
    employees: 3,
    yearsInOperation: 7,
    annualRevenue: '$220,000',
    monthlyRevenue: '$18,000',
    profitMargin: '22%',
    ownerName: 'Isabella Moore',
    ownerEmail: 'isabella@bellaboutique.com',
    ownerPhone: '(555) 234-5678',
    financialHighlights: { revenue: '$220K', profit: '$48K', growth: '5% YoY' },
    businessHours: 'Tue-Sat 10am-7pm',
    website: 'www.bellaboutique.com',
    socialMedia: ['Instagram', 'Facebook']
  },
  {
    id: '3',
    name: 'Green Clean Services',
    industry: 'Service',
    askingPrice: '$80,000 - $120,000',
    location: 'Denver, CO',
    description: 'Eco-friendly cleaning service with commercial and residential clients.',
    employees: 12,
    yearsInOperation: 4,
    annualRevenue: '$320,000',
    monthlyRevenue: '$27,000',
    profitMargin: '18%',
    ownerName: 'Miguel Alvarez',
    ownerEmail: 'miguel@greenclean.co',
    ownerPhone: '(555) 345-6789',
    financialHighlights: { revenue: '$320K', profit: '$58K', growth: '12% YoY' },
    businessHours: 'Mon-Fri 8am-5pm',
    website: 'www.greencleanservices.com',
    socialMedia: ['LinkedIn']
  },
  {
    id: '4',
    name: 'Craft Brewery Co.',
    industry: 'Food & Beverage',
    askingPrice: '$400,000 - $500,000',
    location: 'Portland, OR',
    description: 'Popular local brewery with taproom and regional distribution.',
    employees: 15,
    yearsInOperation: 6,
    annualRevenue: '$1,100,000',
    monthlyRevenue: '$92,000',
    profitMargin: '15%',
    ownerName: 'Sam Patel',
    ownerEmail: 'sam@craftbrewco.com',
    ownerPhone: '(555) 456-7890',
    financialHighlights: { revenue: '$1.1M', profit: '$165K', growth: '10% YoY' },
    businessHours: 'Daily 12pm-10pm',
    website: 'www.craftbrewco.com',
    socialMedia: ['Instagram', 'Twitter']
  },
  {
    id: '5',
    name: 'MediCare Plus',
    industry: 'Healthcare',
    askingPrice: '$600,000 - $750,000',
    location: 'Miami, FL',
    description: 'Well-established medical practice with multiple locations.',
    employees: 25,
    yearsInOperation: 12,
    annualRevenue: '$2,200,000',
    monthlyRevenue: '$180,000',
    profitMargin: '20%',
    ownerName: 'Dr. Priya Sharma',
    ownerEmail: 'priya@medicareplus.com',
    ownerPhone: '(555) 567-8901',
    financialHighlights: { revenue: '$2.2M', profit: '$440K', growth: '8% YoY' },
    businessHours: 'Mon-Fri 8am-6pm',
    website: 'www.medicareplus.com',
    socialMedia: ['LinkedIn']
  }
];

export function getBusinessById(id: string) {
  return mockBusinesses.find((b) => b.id === id) || null;
}

// Bakery visibility flag: hidden by default
let bakeryRevealed = false;

export function isBakeryRevealed() {
  return bakeryRevealed;
}

// Reveal the bakery listing and ensure it is at the front of the list
export function revealBakery() {
  bakeryRevealed = true;
  const idx = mockBusinesses.findIndex((b) => b.id === '6');
  if (idx > 0) {
    const [bakery] = mockBusinesses.splice(idx, 1);
    mockBusinesses.unshift(bakery);
  }
}

// Return businesses that should be visible in the UI (bakery omitted until revealed)
export function getVisibleBusinesses(): Business[] {
  if (bakeryRevealed) return mockBusinesses;
  return mockBusinesses.filter((b) => b.id !== '6');
}

// Utility to add a business to the front (if needed elsewhere)
export function addBusinessToFront(business: Business) {
  mockBusinesses.unshift(business);
}
