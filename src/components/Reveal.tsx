import React from 'react';
import { RevealDirection, useReveal } from '../hooks/useReveal';

interface RevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delayMs?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delayMs = 0,
  className = '',
}) => {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-reveal={direction}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`reveal-item ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
