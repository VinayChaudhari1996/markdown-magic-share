export const backgroundPatterns = [
  { id: 'none', label: 'None', pattern: 'none' },
  { id: 'dots', label: 'Dots', pattern: `radial-gradient(black 1px, transparent 1px)` },
  { id: 'grid', label: 'Grid', pattern: `linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)` },
  { id: 'diagonal', label: 'Diagonal', pattern: `repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 1px, transparent 0, transparent 50%)` },
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
];
