import { css } from 'lit';

export const sharedStyles = css`
  :host {
    /* Neo-Y2K Color Palette */
    --color-primary: #00ffff;
    --color-primary-hover: #00cccc;
    --color-primary-light: #00ffff15;
    --color-primary-dark: #008888;
    
    --color-secondary: #ff00ff;
    --color-secondary-hover: #cc00cc;
    --color-secondary-light: #ff00ff15;
    
    --color-accent: #ffff00;
    --color-accent-hover: #cccc00;
    
    --color-success: #00ff00;
    --color-success-bg: #00ff0020;
    --color-success-border: #00ff0060;
    
    --color-danger: #ff0080;
    --color-danger-bg: #ff008020;
    --color-danger-border: #ff008060;
    
    --color-warning: #ff8000;
    --color-warning-bg: #ff800020;
    
    /* Backgrounds with gradients */
    --color-bg-primary: #000011;
    --color-bg-secondary: linear-gradient(135deg, #001122 0%, #000033 50%, #001144 100%);
    --color-bg-tertiary: linear-gradient(135deg, #112233 0%, #223344 100%);
    --color-bg-input: linear-gradient(135deg, #334455 0%, #445566 100%);
    --color-bg-metallic: linear-gradient(135deg, #667788 0%, #778899 50%, #889900 100%);
    
    /* Chrome/metallic effects */
    --color-chrome: linear-gradient(135deg, #c0c0c0 0%, #e0e0e0 25%, #a0a0a0 50%, #d0d0d0 75%, #b0b0b0 100%);
    --color-chrome-dark: linear-gradient(135deg, #404040 0%, #606060 25%, #303030 50%, #505050 75%, #404040 100%);
    
    --color-border: #00ffff80;
    --color-border-input: #00ffff40;
    --color-border-focus: var(--color-primary);
    --color-border-glow: #00ffff;
    
    --color-text-primary: #ffffff;
    --color-text-secondary: #00ffff;
    --color-text-muted: #aaaaaa;
    --color-text-neon: #00ff00;
    --color-text-cyber: #ff00ff;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    
    /* Border Radius - more angular Y2K style */
    --radius-sm: 2px;
    --radius-md: 4px;
    --radius-lg: 6px;
    --radius-xl: 8px;
    --radius-full: 50%;
    
    /* Typography */
    --font-family-cyber: 'Courier New', 'Lucida Console', monospace;
    --font-size-xs: 0.7rem;
    --font-size-sm: 0.8rem;
    --font-size-base: 0.9rem;
    --font-size-lg: 1rem;
    --font-size-xl: 1.2rem;
    --font-size-2xl: 1.5rem;
    
    --font-weight-normal: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    /* Transitions */
    --transition-fast: 0.15s ease-out;
    --transition-base: 0.3s ease-out;
    --transition-glow: 0.2s ease-in-out;
    
    /* Shadows & Glows */
    --shadow-glow: 0 0 10px;
    --shadow-glow-lg: 0 0 20px;
    --shadow-glow-xl: 0 0 30px;
    --shadow-cyber: 0 0 15px #00ffff, 0 0 30px #00ffff40, 0 0 45px #00ffff20;
    --shadow-neon: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
    --shadow-inset: inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(255,255,255,0.1);
    
    /* Gradients */
    --gradient-cyber: linear-gradient(45deg, #00ffff, #ff00ff, #ffff00, #00ffff);
    --gradient-neon: linear-gradient(90deg, #ff0080, #00ffff, #00ff00, #ffff00);
    --gradient-metallic: linear-gradient(135deg, #c0c0c0, #e8e8e8, #a8a8a8, #d8d8d8);
    --gradient-holographic: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff0080, #00ff00);
  }
`;

export const buttonStyles = css`
  .btn {
    border: 2px solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: var(--font-weight-semibold);
    font-family: var(--font-family-cyber);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all var(--transition-base);
    padding: var(--spacing-sm) var(--spacing-md);
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-inset);
  }
  
  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left var(--transition-base);
  }
  
  .btn:hover::before {
    left: 100%;
  }
  
  .btn-primary {
    background: var(--color-chrome);
    color: #000;
    border-color: var(--color-primary);
    box-shadow: var(--shadow-inset), 0 0 10px var(--color-primary)40;
  }
  
  .btn-primary:hover {
    box-shadow: var(--shadow-inset), var(--shadow-cyber);
    transform: translateY(-1px);
  }
  
  .btn-success {
    background: var(--color-chrome);
    color: #000;
    border-color: var(--color-success);
    box-shadow: var(--shadow-inset), 0 0 10px var(--color-success)40;
  }
  
  .btn-success:hover {
    box-shadow: var(--shadow-inset), 0 0 15px var(--color-success), 0 0 30px var(--color-success)40;
    transform: translateY(-1px);
  }
  
  .btn-danger {
    background: var(--color-chrome);
    color: #000;
    border-color: var(--color-danger);
    box-shadow: var(--shadow-inset), 0 0 10px var(--color-danger)40;
  }
  
  .btn-danger:hover {
    box-shadow: var(--shadow-inset), 0 0 15px var(--color-danger), 0 0 30px var(--color-danger)40;
    transform: translateY(-1px);
  }
  
  .btn-lg {
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    border-radius: var(--radius-md);
    border-width: 3px;
  }
  
  .btn-cyber {
    background: var(--gradient-cyber);
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
    color: #000;
    border: 2px solid var(--color-primary);
    font-weight: var(--font-weight-bold);
  }
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

export const inputStyles = css`
  .input {
    background: var(--color-bg-input);
    border: 2px solid var(--color-border-input);
    color: var(--color-text-primary);
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-family: var(--font-family-cyber);
    box-shadow: var(--shadow-inset);
    transition: all var(--transition-glow);
  }
  
  .input:focus {
    outline: none;
    border-color: var(--color-border-focus);
    box-shadow: var(--shadow-inset), 0 0 15px var(--color-primary)60, 0 0 25px var(--color-primary)30;
    background: linear-gradient(135deg, #445566 0%, #556677 100%);
  }
  
  .input-sm {
    padding: 0.4rem 0.6rem;
    font-size: var(--font-size-base);
    width: 70px;
    text-align: center;
    font-weight: var(--font-weight-bold);
  }
  
  .input::placeholder {
    color: var(--color-text-muted);
    font-style: italic;
  }
`;

export const cardStyles = css`
  .card {
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    border: 2px solid var(--color-border);
  }
  
  .card-compact {
    padding: var(--spacing-md);
  }
`;

export const badgeStyles = css`
  .badge {
    padding: 0.2rem var(--spacing-sm);
    border-radius: var(--radius-xl);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    text-transform: uppercase;
  }
  
  .badge-success {
    background: var(--color-success-bg);
    color: var(--color-success);
    border: 1px solid var(--color-success-border);
  }
  
  .badge-danger {
    background: var(--color-danger-bg);
    color: var(--color-danger);
    border: 1px solid var(--color-danger-border);
  }
`;

export const layoutStyles = css`
  .flex {
    display: flex;
  }
  
  .flex-col {
    flex-direction: column;
  }
  
  .items-center {
    align-items: center;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .gap-xs { gap: var(--spacing-xs); }
  .gap-sm { gap: var(--spacing-sm); }
  .gap-md { gap: var(--spacing-md); }
  .gap-lg { gap: var(--spacing-lg); }
  .gap-xl { gap: var(--spacing-xl); }
  
  .mb-xs { margin-bottom: var(--spacing-xs); }
  .mb-sm { margin-bottom: var(--spacing-sm); }
  .mb-md { margin-bottom: var(--spacing-md); }
  .mb-lg { margin-bottom: var(--spacing-lg); }
  
  .text-center { text-align: center; }
  .text-sm { font-size: var(--font-size-sm); }
  .text-base { font-size: var(--font-size-base); }
  .text-lg { font-size: var(--font-size-lg); }
  .text-xl { font-size: var(--font-size-xl); }
  
  .font-semibold { font-weight: var(--font-weight-semibold); }
  
  .text-primary { color: var(--color-primary); }
  .text-secondary { color: var(--color-text-secondary); }
  .text-muted { color: var(--color-text-muted); }
`; 