export interface Integration {
  name: string;
  src: string;
}

export const INTEGRATIONS: Integration[] = [
  // Tech Giants
  { name: 'Google', src: 'https://cdn.simpleicons.org/google/4285F4' },
  { name: 'Apple', src: 'https://cdn.simpleicons.org/apple/000000' },
  { name: 'Microsoft', src: 'https://cdn.simpleicons.org/microsoft/00A4EF' },
  { name: 'Meta', src: 'https://cdn.simpleicons.org/meta/0668E1' },
  { name: 'Amazon', src: 'https://cdn.simpleicons.org/amazon/FF9900' },
  { name: 'NVIDIA', src: 'https://cdn.simpleicons.org/nvidia/76B900' },
  { name: 'Tesla', src: 'https://cdn.simpleicons.org/tesla/CC0000' },
  
  // Investment Banking & Finance
  { name: 'JPMorgan', src: 'https://cdn.simpleicons.org/jpmorganchase/117ACA' },
  { name: 'Goldman Sachs', src: 'https://cdn.simpleicons.org/goldmansachs/0066CC' },
  { name: 'Morgan Stanley', src: 'https://cdn.simpleicons.org/morganstanley/00529B' },
  { name: 'Bank of America', src: 'https://cdn.simpleicons.org/bankofamerica/E31837' },
  
  // Consulting & Professional Services
  { name: 'McKinsey', src: 'https://cdn.simpleicons.org/mckinsey/002E6D' },
  { name: 'Deloitte', src: 'https://cdn.simpleicons.org/deloitte/0076A8' },
  { name: 'PwC', src: 'https://cdn.simpleicons.org/pwc/D93954' },
  { name: 'KPMG', src: 'https://cdn.simpleicons.org/kpmg/00338D' },
  { name: 'EY', src: 'https://cdn.simpleicons.org/ey/FFE600' },
  
  // Energy & Resources
  { name: 'Shell', src: 'https://cdn.simpleicons.org/shell/FBCE07' },
  { name: 'ExxonMobil', src: 'https://cdn.simpleicons.org/exxonmobil/FF0000' },
  
  // Healthcare & Pharma
  { name: 'Johnson & Johnson', src: 'https://cdn.simpleicons.org/johnsonandjohnson/DC0028' },
];
