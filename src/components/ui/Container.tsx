import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('lx-container', className)}>{children}</div>;
}
