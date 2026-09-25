import React from 'react';
import { 
  BookOpen, 
  PenTool, 
  Code2, 
  Atom, 
  Compass, 
  Sparkles, 
  Target, 
  Coffee, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  GraduationCap,
  Bookmark
} from 'lucide-react';

interface IconSquircleProps {
  emoji?: string;
  iconName?: string;
  bgColor?: string;
  accentColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'squircle' | 'circle';
  className?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  PenTool,
  Code2,
  Atom,
  Compass,
  Sparkles,
  Target,
  Coffee,
  Flame,
  Calendar,
  CheckCircle2,
  GraduationCap,
};

export const IconSquircle: React.FC<IconSquircleProps> = ({
  emoji,
  iconName,
  bgColor = '#EFF6FF',
  accentColor = '#3B82F6',
  size = 'md',
  shape = 'squircle',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-9 h-9 text-base',
    md: 'w-12 h-12 text-xl',
    lg: 'w-14 h-14 text-2xl',
    xl: 'w-20 h-20 text-4xl',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 36,
  };

  const borderRadius = shape === 'circle' ? 'rounded-full' : 'rounded-[1.15rem]';

  const LucideComponent = iconName ? ICON_MAP[iconName] || Bookmark : null;

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center select-none transition-transform duration-200 group-hover:scale-105 ${borderRadius} ${sizeStyles[size]} ${className}`}
      style={{
        backgroundColor: bgColor,
        boxShadow: `
          0 4px 12px -2px ${accentColor}25,
          0 1px 3px 0 ${accentColor}15,
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.9),
          inset 0 -2px 4px 0 rgba(0, 0, 0, 0.05)
        `,
        border: `1px solid ${accentColor}30`,
      }}
    >
      {/* 3D Glass Light reflection specular highlight on top */}
      <div 
        className="absolute inset-x-1.5 top-1 h-[35%] rounded-t-xl bg-gradient-to-b from-white/70 to-transparent pointer-events-none opacity-80" 
      />

      {/* Emoji or SVG Icon */}
      {LucideComponent ? (
        <LucideComponent 
          size={iconSizes[size]} 
          style={{ color: accentColor }} 
          className="relative z-10 drop-shadow-sm" 
        />
      ) : (
        <span 
          className="relative z-10 leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)] filter transition-transform"
        >
          {emoji || '📚'}
        </span>
      )}
    </div>
  );
};
