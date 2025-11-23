export interface Integration {
  name: string;
  src: string;
}

export const INTEGRATIONS: Integration[] = [
  // Tech Giants
  { name: 'Google', src: 'https://cdn.simpleicons.org/google/4285F4' },
  { name: 'Apple', src: 'https://cdn.simpleicons.org/apple/000000' },
  { name: 'Microsoft', src: '/integrations/microsoft-logo.png' },
  { name: 'Meta', src: 'https://cdn.simpleicons.org/meta/0668E1' },
  { name: 'Amazon', src: '/integrations/amazon-logo.png' },
  { name: 'NVIDIA', src: 'https://cdn.simpleicons.org/nvidia/76B900' },
  { name: 'Tesla', src: 'https://cdn.simpleicons.org/tesla/CC0000' },
  
  // Investment Banking & Finance
  { name: 'JPMorgan', src: '/integrations/jpmorgan-logo.png' },
  { name: 'Goldman Sachs', src: 'https://cdn.simpleicons.org/goldmansachs/0066CC' },
  { name: 'Morgan Stanley', src: '/integrations/morganstanley-logo.png' },
  { name: 'Bank of America', src: 'https://cdn.simpleicons.org/bankofamerica/E31837' },
  
  // Consulting & Professional Services
  { name: 'McKinsey', src: '/integrations/mckinsey-logo.png' },
  { name: 'Deloitte', src: '/integrations/deloitte-logo.png' },
  { name: 'PwC', src: '/integrations/pwc-logo.png' },
  { name: 'KPMG', src: '/integrations/kpmg-logo.png' },
  { name: 'EY', src: '/integrations/ey-logo.png' },
  
  // Energy & Resources
  { name: 'Shell', src: 'https://cdn.simpleicons.org/shell/FBCE07' },
  { name: 'ExxonMobil', src: '/integrations/exxonmobil-logo.png' },
  
  // Healthcare & Pharma
  { name: 'Johnson & Johnson', src: '/integrations/johnson-johnson-logo.png' },
];
