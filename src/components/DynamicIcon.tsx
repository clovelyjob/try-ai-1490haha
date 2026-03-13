import { icons } from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon = ({ name, className = '', size = 24 }: DynamicIconProps) => {
  // Convert kebab-case to PascalCase for lucide-react
  const pascalName = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  const LucideIcon = (icons as Record<string, any>)[pascalName];
  
  if (!LucideIcon) {
    // Fallback to a generic icon
    const FallbackIcon = icons.Circle;
    return <FallbackIcon className={className} size={size} />;
  }
  
  return <LucideIcon className={className} size={size} />;
};
