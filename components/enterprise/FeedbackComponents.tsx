import * as React from 'react';
import { cn } from '@/lib/utils';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast as sonnerToast } from 'sonner';

// ==========================================
// CARD COMPONENT
// ==========================================
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = ({ children, header, footer, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-850 rounded-xl shadow-xs transition-all overflow-hidden flex flex-col',
        className
      )}
      {...props}
    >
      {header && (
        <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-850 bg-slate-50/20 dark:bg-zinc-950/10">
          {header}
        </div>
      )}
      <div className="p-5 flex-1">{children}</div>
      {footer && (
        <div className="px-5 py-4 border-t border-slate-100 dark:border-zinc-850 bg-slate-50/20 dark:bg-zinc-950/10">
          {footer}
        </div>
      )}
    </div>
  );
};

// ==========================================
// ALERT COMPONENT
// ==========================================
interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export const Alert = ({ type = 'info', title, description, onClose, className }: AlertProps) => {
  const icons = {
    info: <Info className="w-5 h-5 text-sky-600 dark:text-sky-450" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-450" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-450" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-450" />,
  };

  const bgClasses = {
    info: 'bg-sky-50/60 border-sky-200 dark:bg-sky-950/10 dark:border-sky-900/30',
    success: 'bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/10 dark:border-emerald-900/30',
    warning: 'bg-amber-50/60 border-amber-200 dark:bg-amber-950/10 dark:border-amber-900/30',
    error: 'bg-red-50/60 border-red-200 dark:bg-red-950/10 dark:border-red-900/30',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border text-sm text-slate-800 dark:text-zinc-200 transition-all',
        bgClasses[type],
        className
      )}
    >
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <h4 className="font-bold leading-5">{title}</h4>
        {description && <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">{description}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// ==========================================
// DIALOG / MODAL COMPONENT
// ==========================================
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Dialog = ({ isOpen, onClose, title, children, size = 'md' }: DialogProps) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', duration: 0.35 }}
            className={cn(
              'relative w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col z-50',
              sizeClasses[size]
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-850">
              <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 flex-1 overflow-y-auto max-h-[70vh] pr-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Modal = Dialog;

// ==========================================
// DRAWER / SHEET COMPONENT (Sliding from Right)
// ==========================================
interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Sheet = ({ isOpen, onClose, title, children }: SheetProps) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-screen max-w-md bg-white dark:bg-zinc-900 border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-850 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 dark:text-zinc-100">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ==========================================
// TOAST API NOTIFICATION TRIGGER
// ==========================================
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    sonnerToast.error(message, { description });
  },
  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, { description });
  },
  info: (message: string, description?: string) => {
    sonnerToast.info(message, { description });
  },
};
