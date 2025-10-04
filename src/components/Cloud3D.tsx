interface Cloud3DProps {
  delay?: number;
  duration?: number;
  size?: 'small' | 'medium' | 'large';
  startPosition?: { x: number; y: number };
}

export function Cloud3D({ delay = 0, duration = 20, size = 'medium', startPosition = { x: -20, y: 20 } }: Cloud3DProps) {
  const sizes = {
    small: 'w-32 h-16',
    medium: 'w-48 h-24',
    large: 'w-64 h-32'
  };

  return (
    <div
      className={`absolute ${sizes[size]} cloud-float opacity-80`}
      style={{
        left: `${startPosition.x}%`,
        top: `${startPosition.y}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-2xl">
        <defs>
          <filter id={`cloud-shadow-${delay}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="4" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id={`cloud-gradient-${delay}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/>
            <stop offset="50%" stopColor="#f0f9ff" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.85"/>
          </linearGradient>
        </defs>

        {/* Main cloud body */}
        <ellipse cx="100" cy="60" rx="50" ry="25" fill={`url(#cloud-gradient-${delay})`} filter={`url(#cloud-shadow-${delay})`}/>
        <ellipse cx="70" cy="50" rx="35" ry="20" fill={`url(#cloud-gradient-${delay})`} filter={`url(#cloud-shadow-${delay})`}/>
        <ellipse cx="130" cy="55" rx="40" ry="22" fill={`url(#cloud-gradient-${delay})`} filter={`url(#cloud-shadow-${delay})`}/>
        <ellipse cx="85" cy="65" rx="30" ry="18" fill={`url(#cloud-gradient-${delay})`} filter={`url(#cloud-shadow-${delay})`}/>
        <ellipse cx="115" cy="68" rx="35" ry="20" fill={`url(#cloud-gradient-${delay})`} filter={`url(#cloud-shadow-${delay})`}/>

        {/* Highlight for 3D effect */}
        <ellipse cx="90" cy="45" rx="20" ry="10" fill="white" opacity="0.6"/>
        <ellipse cx="120" cy="50" rx="15" ry="8" fill="white" opacity="0.5"/>
      </svg>
    </div>
  );
}
