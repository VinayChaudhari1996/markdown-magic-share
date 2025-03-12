
export const backgroundPatterns = [
  { id: 'none', label: 'None', pattern: 'none' },
  { id: 'dots', label: 'Dots', pattern: `radial-gradient(black 1px, transparent 1px)` },
  { id: 'grid', label: 'Grid', pattern: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)` },
  { id: 'diagonal', label: 'Diagonal', pattern: `repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 1px, transparent 0, transparent 50%)` },
  { id: 'circles', label: 'Circles', pattern: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.05) 10%, transparent 10.5%)` },
  { id: 'waves', label: 'Waves', pattern: `repeating-radial-gradient(rgba(0,0,0,0.04) 2px, transparent 5px, transparent 60px)` },
  { id: 'hexagons', label: 'Hexagons', pattern: `radial-gradient(circle at 0% 50%, transparent 9px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 15px, transparent 16px), radial-gradient(circle at 50% 0%, transparent 9px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 15px, transparent 16px)` },
];

export const backgroundColors = [
  { id: 'white', label: 'White', color: '#ffffff' },
  { id: 'soft-yellow', label: 'Soft Yellow', color: '#FEF7CD' },
  { id: 'soft-blue', label: 'Soft Blue', color: '#D3E4FD' },
  { id: 'soft-pink', label: 'Soft Pink', color: '#FFDEE2' },
  { id: 'soft-green', label: 'Soft Green', color: '#F2FCE2' },
  { id: 'soft-purple', label: 'Soft Purple', color: '#E5DEFF' },
  { id: 'soft-peach', label: 'Soft Peach', color: '#FDE1D3' },
  { id: 'soft-gray', label: 'Soft Gray', color: '#F1F0FB' },
  { id: 'cream', label: 'Cream', color: '#FFF9E6' },
  { id: 'mint', label: 'Mint', color: '#E0F5E9' },
  { id: 'lavender', label: 'Lavender', color: '#F0E6FF' },
  { id: 'sky', label: 'Sky', color: '#E6F7FF' },
];
