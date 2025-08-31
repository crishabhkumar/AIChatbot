import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: false, left: false, right: false });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const tooltip = tooltipRef.current;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      // Check if tooltip would go off screen
      const wouldOverflowLeft = rect.left + tooltipRect.width / 2 > rect.left + rect.width / 2 && 
                                rect.left + rect.width / 2 - tooltipRect.width / 2 < 0;
      const wouldOverflowRight = rect.left + rect.width / 2 + tooltipRect.width / 2 > viewport.width;
      const wouldOverflowTop = rect.top - tooltipRect.height - 10 < 0;

      setPosition({
        top: wouldOverflowTop,
        left: wouldOverflowLeft,
        right: wouldOverflowRight
      });
    }
  }, [isVisible]);

  const getTooltipClass = () => {
    let classes = 'tooltip-content';
    if (position.top) classes += ' tooltip-bottom';
    if (position.left) classes += ' tooltip-right';
    if (position.right) classes += ' tooltip-left';
    return classes;
  };

  return (
    <div 
      ref={containerRef}
      className={`tooltip-container ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div ref={tooltipRef} className={getTooltipClass()}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
