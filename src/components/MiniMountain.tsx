import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

interface MiniMountainProps {
  /** Percentage remaining (0-100). 100 = full mountain, 0 = flat/eroded */
  remainingPercent: number;
  /** Name of the debt */
  name?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to show the label */
  showLabel?: boolean;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: CSSProperties;
}

const MiniMountain = ({ 
  remainingPercent, 
  name, 
  size = "md",
  showLabel = true,
  className,
  style
}: MiniMountainProps) => {
  // Clamp value between 0 and 100
  const percent = Math.max(0, Math.min(100, remainingPercent));
  
  // Calculate height based on remaining percentage
  // Full mountain at 100%, flat at 0%
  const heightRatio = percent / 100;
  
  const sizeConfig = {
    sm: { width: 40, maxHeight: 32, baseHeight: 4 },
    md: { width: 60, maxHeight: 48, baseHeight: 6 },
    lg: { width: 100, maxHeight: 80, baseHeight: 8 },
  };
  
  const config = sizeConfig[size];
  const peakHeight = config.baseHeight + (config.maxHeight - config.baseHeight) * heightRatio;
  
  // Generate mountain path - more angular/triangular shape
  const halfWidth = config.width / 2;
  const path = `
    M 0 ${config.maxHeight}
    L ${halfWidth * 0.15} ${config.maxHeight - peakHeight * 0.4}
    L ${halfWidth} ${config.maxHeight - peakHeight}
    L ${config.width - halfWidth * 0.15} ${config.maxHeight - peakHeight * 0.4}
    L ${config.width} ${config.maxHeight}
    Z
  `;
  
  // Gray tones for the mountain base
  const getColor = () => {
    if (percent === 0) return "hsl(0 0% 75%)"; // Paid off - light gray
    return "hsl(0 0% 43%)"; // #6E6E6E - gray base
  };
  
  const getOpacity = () => {
    if (percent === 0) return 0.3;
    return 0.6 + (percent / 100) * 0.4;
  };

  return (
    <div className={cn("flex flex-col items-center", className)} style={style}>
      <svg 
        width={config.width} 
        height={config.maxHeight} 
        viewBox={`0 0 ${config.width} ${config.maxHeight}`}
        className="transition-all duration-500"
      >
        {/* Mountain shadow */}
        <path
          d={path}
          fill="hsl(0 0% 35%)"
          opacity={getOpacity() * 0.2}
          transform="translate(2, 2)"
        />
        {/* Mountain body - gray base */}
        <path
          d={path}
          fill={getColor()}
          opacity={getOpacity()}
          className="transition-all duration-500"
        />
        {/* Snow cap - always show on mountains with height */}
        {percent > 10 && (
          <path
            d={`
              M ${halfWidth * 0.7} ${config.maxHeight - peakHeight * 0.75}
              L ${halfWidth} ${config.maxHeight - peakHeight}
              L ${config.width - halfWidth * 0.7} ${config.maxHeight - peakHeight * 0.75}
              Z
            `}
            fill="hsl(0 0% 95%)"
            opacity={0.9}
          />
        )}
      </svg>
      
      {showLabel && name && (
        <div className="text-center mt-1">
          <p className="text-xs font-medium text-foreground truncate max-w-[60px]" title={name}>
            {name}
          </p>
          <p className={cn(
            "text-xs",
            percent === 0 ? "text-growth font-semibold" : "text-muted-foreground"
          )}>
            {percent === 0 ? "✓ Pagada" : `${Math.round(percent)}%`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MiniMountain;