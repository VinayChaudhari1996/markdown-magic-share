
export const backgroundPatterns = [
  { id: 'none', label: 'None', pattern: 'none' },
  { id: 'dots', label: 'Dots', pattern: `radial-gradient(black 1px, transparent 1px)` },
  { id: 'grid', label: 'Grid', pattern: `linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)` },
  { id: 'diagonal', label: 'Diagonal', pattern: `repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 1px, transparent 0, transparent 50%)` },
  { id: 'waves', label: 'Waves', pattern: `repeating-radial-gradient(rgba(0,0,0,0.1) 0, rgba(0,0,0,0.1) 1px, transparent 0, transparent 100%)` },
  { id: 'checks', label: 'Checks', pattern: `repeating-conic-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 25%, transparent 0%, transparent 50%)` },
  { id: 'stripes', label: 'Stripes', pattern: `repeating-linear-gradient(-45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 5px, transparent 5px, transparent 10px)` },
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
  
  // Adding dark theme colors
  { id: 'dark-gray', label: 'Dark Gray', color: '#1F2937' },
  { id: 'dark-blue', label: 'Dark Blue', color: '#1E3A8A' },
  { id: 'dark-purple', label: 'Dark Purple', color: '#4C1D95' },
  { id: 'dark-green', label: 'Dark Green', color: '#064E3B' },
  { id: 'dark-pink', label: 'Dark Pink', color: '#831843' },
  { id: 'dark-amber', label: 'Dark Amber', color: '#78350F' },
  { id: 'dark-slate', label: 'Dark Slate', color: '#0F172A' },
];

// Export linear gradients for backgrounds
export const backgroundGradients = [
  { id: 'gradient-none', label: 'None', gradient: 'none' },
  { id: 'gradient-warm', label: 'Warm Sunset', gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
  { id: 'gradient-cool', label: 'Cool Blues', gradient: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)' },
  { id: 'gradient-pastel', label: 'Pastel Dream', gradient: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)' },
  { id: 'gradient-peach', label: 'Peach', gradient: 'linear-gradient(to right, #ee9ca7, #ffdde1)' },
  { id: 'gradient-mint', label: 'Mint', gradient: 'linear-gradient(to right, #c1c161 0%, #c1c161 0%, #d4d4b1 100%)' },
];
