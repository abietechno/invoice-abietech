import React, { useEffect, useRef, useState } from 'react';

export default function PreviewWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(559);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        // 794px is roughly 210mm at 96dpi (A4/A5 width)
        const targetWidth = 794; 
        setScale(Math.min(1, parentWidth / targetWidth));
      }
    };
    
    updateScale();
    
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.offsetHeight);
      }
    };
    
    updateHeight();
    
    const observer = new ResizeObserver(updateHeight);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    
    return () => observer.disconnect();
  }, [children]);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex justify-center transition-all duration-300 no-print relative" 
      style={{ height: contentHeight * scale }}
    >
      <div 
        ref={contentRef}
        className="shrink-0 origin-top absolute top-0 flex items-start justify-center"
        style={{ 
          width: '794px', 
          transform: `scale(${scale})`, 
        }}
      >
        {children}
      </div>
    </div>
  );
}
