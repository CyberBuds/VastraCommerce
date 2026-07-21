import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, LucideIcon } from 'lucide-react';

// ==========================================
// BUTTON COMPONENT
// ==========================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, icon: Icon, iconPosition = 'left', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          {
            // Primary - Slate Blue Gradient & Brand Accent in dark mode
            'bg-linear-to-r from-slate-800 to-slate-900 text-white hover:from-slate-700 hover:to-slate-800 dark:from-brand dark:to-brand-dark dark:hover:from-brand-hover dark:hover:to-brand shadow-md shadow-slate-900/10 dark:shadow-brand/20 focus:ring-slate-600 dark:focus:ring-brand focus:ring-offset-white dark:focus:ring-offset-zinc-950':
              variant === 'primary',
            // Secondary
            'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 focus:ring-slate-400 focus:ring-offset-white dark:focus:ring-offset-zinc-950':
              variant === 'secondary',
            // Outline
            'border border-slate-300 hover:bg-slate-50 text-slate-700 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-300 focus:ring-slate-400 focus:ring-offset-white dark:focus:ring-offset-zinc-950':
              variant === 'outline',
            // Ghost
            'hover:bg-slate-100 dark:hover:bg-zinc-850 text-slate-700 dark:text-zinc-300 focus:ring-slate-300':
              variant === 'ghost',
            // Danger
            'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md shadow-red-950/10': variant === 'danger',
            // Success
            'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-md shadow-emerald-950/10': variant === 'success',
          },
          {
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-5 py-3 text-base': size === 'lg',
            'p-2 w-9 h-9': size === 'icon',
          },
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
        ) : Icon && iconPosition === 'left' ? (
          <Icon className={cn('w-4 h-4', children ? 'mr-2' : '')} />
        ) : null}

        {size !== 'icon' && children}

        {!isLoading && Icon && iconPosition === 'right' && size !== 'icon' && (
          <Icon className="w-4 h-4 ml-2" />
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ==========================================
// INPUT COMPONENT
// ==========================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon: Icon, type = 'text', id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={cn(
              'w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm transition-all outline-none focus:border-slate-500 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-500 dark:focus:ring-zinc-500 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-zinc-950',
              {
                'pl-10': Icon,
                'border-red-500 focus:border-red-500 focus:ring-red-500': !!error,
              },
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <span className="text-[11px] font-medium text-red-500">{error}</span>
        ) : helperText ? (
          <span className="text-[11px] text-slate-400 dark:text-zinc-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ==========================================
// TEXTAREA COMPONENT
// ==========================================
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tracking-wide">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-sm min-h-[80px] transition-all outline-none focus:border-slate-500 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-500 dark:focus:ring-zinc-500 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-zinc-950',
            {
              'border-red-500 focus:border-red-500 focus:ring-red-500': !!error,
            },
            className
          )}
          {...props}
        />
        {error ? (
          <span className="text-[11px] font-medium text-red-500">{error}</span>
        ) : helperText ? (
          <span className="text-[11px] text-slate-400 dark:text-zinc-500">{helperText}</span>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ==========================================
// CHECKBOX COMPONENT
// ==========================================
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={checkboxId} className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            id={checkboxId}
            ref={ref}
            type="checkbox"
            className={cn(
              'mt-0.5 h-4 w-4 rounded-sm border-slate-300 dark:border-zinc-700 text-brand focus:ring-brand transition-all cursor-pointer accent-brand',
              className
            )}
            {...props}
          />
          {label && (
            <span className="text-sm text-slate-700 dark:text-zinc-300 leading-tight">
              {label}
            </span>
          )}
        </label>
        {error && <span className="text-[11px] font-medium text-red-500 ml-6">{error}</span>}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// ==========================================
// RADIO COMPONENT
// ==========================================
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const radioId = id || generatedId;

    return (
      <label htmlFor={radioId} className="flex items-center gap-2 cursor-pointer select-none">
        <input
          id={radioId}
          ref={ref}
          type="radio"
          className={cn(
            'h-4 w-4 border-slate-300 dark:border-zinc-700 text-brand focus:ring-brand transition-all cursor-pointer accent-brand',
            className
          )}
          {...props}
        />
        {label && (
          <span className="text-sm text-slate-700 dark:text-zinc-300">
            {label}
          </span>
        )}
      </label>
    );
  }
);
Radio.displayName = 'Radio';

// ==========================================
// SWITCH COMPONENT
// ==========================================
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const switchId = id || generatedId;

    return (
      <label htmlFor={switchId} className="flex items-center gap-3 cursor-pointer select-none">
        <div className="relative">
          <input
            id={switchId}
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div className="w-9 h-5 bg-slate-200 dark:bg-zinc-800 rounded-full peer peer-checked:bg-brand dark:peer-checked:bg-brand peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-brand transition-colors duration-200"></div>
          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white dark:bg-zinc-950 rounded-full shadow-md transition-transform duration-200 peer-checked:translate-x-4"></div>
        </div>
        {label && (
          <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
            {label}
          </span>
        )}
      </label>
    );
  }
);
Switch.displayName = 'Switch';

// ==========================================
// BADGE COMPONENT
// ==========================================
export interface BadgeProps {
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'brand';
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ variant = 'neutral', children, className }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold leading-4 tracking-wide',
        {
          'bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-300': variant === 'neutral',
          'bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50':
            variant === 'success',
          'bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50':
            variant === 'warning',
          'bg-red-50 text-red-700 border border-red-200/50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50':
            variant === 'error',
          'bg-sky-50 text-sky-700 border border-sky-200/50 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/50':
            variant === 'info',
          'bg-purple-50 text-purple-700 border border-purple-200/50 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/50':
            variant === 'purple',
          'bg-brand/10 text-brand border border-brand/20 dark:bg-brand/20 dark:text-brand-light dark:border-brand/40':
            variant === 'brand',
        },
        className
      )}
    >
      {children}
    </span>
  );
};

// ==========================================
// AVATAR COMPONENT
// ==========================================
export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar = ({ src, name, size = 'md', className }: AvatarProps) => {
  const [error, setError] = React.useState(false);

  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold overflow-hidden select-none border border-slate-200 dark:border-zinc-800',
        sizeClasses[size],
        className
      )}
    >
      {src && !error ? (
        // Using standard img tag with strict referrer policy to avoid NextJS Image container constraints
        // on external URLs inside arbitrary components
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
