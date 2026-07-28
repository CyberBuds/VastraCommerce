import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-xs font-semibold text-slate-700 dark:text-zinc-300 tracking-wide select-none',
          className
        )}
        {...props}
      >
        {children}
      </label>
    );
  }
);
Label.displayName = 'Label';
