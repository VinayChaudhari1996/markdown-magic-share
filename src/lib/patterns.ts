
export const backgroundPatterns = [
  { id: 'none', label: 'None', pattern: 'none' },
  { id: 'dots', label: 'Dots', pattern: `radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)` },
  { id: 'grid', label: 'Grid', pattern: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)` },
  { id: 'diagonal', label: 'Diagonal', pattern: `repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0, rgba(0,0,0,0.03) 1px, transparent 0, transparent 50%)` },
  { id: 'circles', label: 'Circles', pattern: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.03) 10%, transparent 10.5%)` },
  { id: 'waves', label: 'Waves', pattern: `repeating-radial-gradient(rgba(0,0,0,0.02) 2px, transparent 5px, transparent 60px)` },
  { id: 'hexagons', label: 'Hexagons', pattern: `radial-gradient(circle at 0% 50%, transparent 9px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 15px, transparent 16px), radial-gradient(circle at 50% 0%, transparent 9px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 15px, transparent 16px)` },
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

export const codeBlockThemes = [
  { id: 'light', label: 'Light', bgColor: '#f7f7f7', textColor: '#1a1a1a', borderColor: '#e0e0e0', lineNumberBg: '#f0f0f0', lineNumberColor: '#888' },
  { id: 'github', label: 'GitHub', bgColor: '#f6f8fa', textColor: '#24292e', borderColor: '#e1e4e8', lineNumberBg: '#f0f3f8', lineNumberColor: '#6e7781' },
  { id: 'pastel', label: 'Pastel', bgColor: '#fbfbfd', textColor: '#383a42', borderColor: '#e8e8ef', lineNumberBg: '#f5f5fa', lineNumberColor: '#a0a1a7' },
  { id: 'solarized-light', label: 'Solarized Light', bgColor: '#fdf6e3', textColor: '#657b83', borderColor: '#eee8d5', lineNumberBg: '#eee8d5', lineNumberColor: '#93a1a1' },
  { id: 'one-light', label: 'One Light', bgColor: '#fafafa', textColor: '#383a42', borderColor: '#e5e5e6', lineNumberBg: '#f0f0f1', lineNumberColor: '#9d9d9f' },
  { id: 'soft-blue', label: 'Soft Blue', bgColor: '#f5f8fc', textColor: '#2c3e50', borderColor: '#e3ebf6', lineNumberBg: '#edf2f7', lineNumberColor: '#8da2b5' },
  { id: 'soft-green', label: 'Soft Green', bgColor: '#f5fcf5', textColor: '#2c3e2e', borderColor: '#e3f6e3', lineNumberBg: '#edf7ed', lineNumberColor: '#8da28d' },
  { id: 'soft-purple', label: 'Soft Purple', bgColor: '#f9f5fc', textColor: '#3e2c50', borderColor: '#f0e3f6', lineNumberBg: '#f5edf7', lineNumberColor: '#a28db5' },
];
