import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ResizablePanelProps {
  direction: 'horizontal' | 'vertical';
  defaultSizes?: number[];
  minSizes?: number[];
  children: React.ReactNode[];
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  direction,
  defaultSizes = [],
  minSizes = [],
  children,
}) => {
  const panelCount = React.Children.count(children);
  const defaultSizesWithFallback = defaultSizes.length === panelCount
    ? defaultSizes
    : Array(panelCount).fill(100 / panelCount);
  
  const minSizesWithFallback = minSizes.length === panelCount
    ? minSizes
    : Array(panelCount).fill(10);

  const [sizes, setSizes] = useState<number[]>(defaultSizesWithFallback);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const dragIndex = useRef<number>(-1);
  const startPos = useRef<number>(0);
  const startSizes = useRef<number[]>([]);

  const handleMouseDown = useCallback((index: number, e: React.MouseEvent) => {
    isDragging.current = true;
    dragIndex.current = index;
    startPos.current = direction === 'horizontal' ? e.clientX : e.clientY;
    startSizes.current = [...sizes];
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [direction, sizes]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerSize = direction === 'horizontal' ? containerRect.width : containerRect.height;
    const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
    const delta = currentPos - startPos.current;
    const deltaPercent = (delta / containerSize) * 100;
    
    const newSizes = [...startSizes.current];
    
    // Update the sizes of the panels being resized
    newSizes[dragIndex.current] = Math.max(minSizesWithFallback[dragIndex.current], startSizes.current[dragIndex.current] + deltaPercent);
    newSizes[dragIndex.current + 1] = Math.max(minSizesWithFallback[dragIndex.current + 1], startSizes.current[dragIndex.current + 1] - deltaPercent);
    
    // Ensure the total is still 100%
    const totalSize = newSizes.reduce((acc, size) => acc + size, 0);
    const sizeAdjustment = (100 - totalSize) / 2;
    
    newSizes[dragIndex.current] += sizeAdjustment;
    newSizes[dragIndex.current + 1] += sizeAdjustment;
    
    setSizes(newSizes);
  }, [direction, minSizesWithFallback]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} h-full w-full`}
    >
      {React.Children.map(children, (child, index) => (
        <React.Fragment key={index}>
          <div
            className="relative flex-shrink-0"
            style={{
              [direction === 'horizontal' ? 'width' : 'height']: `${sizes[index]}%`,
              overflow: 'hidden',
            }}
          >
            {child}
          </div>
          
          {index < panelCount - 1 && (
            <div
              className={`flex-shrink-0 bg-gray-700 hover:bg-blue-600 cursor-${direction === 'horizontal' ? 'col' : 'row'}-resize z-10`}
              style={{
                [direction === 'horizontal' ? 'width' : 'height']: '4px',
              }}
              onMouseDown={(e) => handleMouseDown(index, e)}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ResizablePanel; 