import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// ==========================================
// SELECT COMPONENT
// ==========================================
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-slate-700 dark:text-zinc-300 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg py-2 pl-3 pr-10 text-sm transition-all outline-none focus:border-slate-500 dark:focus:border-zinc-500 focus:ring-1 focus:ring-slate-500 dark:focus:ring-zinc-500 text-slate-900 dark:text-zinc-100 disabled:opacity-50 appearance-none cursor-pointer',
              {
                'border-red-500 focus:border-red-500 focus:ring-red-500': !!error,
              },
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-zinc-900">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
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
Select.displayName = 'Select';

// ==========================================
// DROPDOWN MENU
// ==========================================
export interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'normal' | 'danger';
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export const Dropdown = ({ trigger, items, align = 'right' }: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 mt-1.5 w-48 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 shadow-xl py-1 focus:outline-none',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setIsOpen(false);
                    if (item.onClick) item.onClick();
                  }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition-colors',
                    item.variant === 'danger'
                      ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'
                  )}
                >
                  {Icon && <Icon className="w-4 h-4 text-current" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// TOOLTIP COMPONENT
// ==========================================
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  const [show, setShow] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-semibold rounded-md shadow-md whitespace-nowrap dark:bg-zinc-800"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-zinc-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// ACCORDION COMPONENT
// ==========================================
interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

export const Accordion = ({ items }: { items: AccordionItem[] }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="w-full flex flex-col border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="border-b border-slate-200 dark:border-zinc-800 last:border-none">
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-center justify-between p-4 font-semibold text-sm text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn('w-4 h-4 text-slate-400 transition-transform duration-200', {
                  'rotate-180': isOpen,
                })}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-slate-50/50 dark:bg-zinc-950/20"
                >
                  <div className="p-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// TABS COMPONENT
// ==========================================
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (id: string) => void;
}

export const Tabs = ({ tabs, defaultTab, onChange }: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0].id);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (onChange) onChange(id);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex border-b border-slate-250 dark:border-zinc-800 p-0.5 gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'relative py-2.5 px-4 text-sm font-semibold text-slate-500 dark:text-zinc-400 transition-colors cursor-pointer whitespace-nowrap',
                {
                  'text-slate-900 dark:text-zinc-100 font-bold': isActive,
                }
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-zinc-200"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div>{tabs.find((t) => t.id === activeTab)?.content}</div>
    </div>
  );
};

// ==========================================
// PROGRESS BAR
// ==========================================
export const Progress = ({ value = 0, className }: { value: number; className?: string }) => {
  return (
    <div className={cn('h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden', className)}>
      <motion.div
        className="h-full bg-slate-800 dark:bg-zinc-300 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
};

// ==========================================
// SPINNER COMPONENT
// ==========================================
export const Spinner = ({ className }: { className?: string }) => {
  return <div className={cn('w-6 h-6 border-2 border-slate-200 border-t-slate-800 dark:border-zinc-800 dark:border-t-zinc-450 animate-spin rounded-full', className)} />;
};

// ==========================================
// SKELETON LOADER
// ==========================================
export const Skeleton = ({ className }: { className?: string }) => {
  return <div className={cn('bg-slate-100 dark:bg-zinc-850 animate-pulse rounded-md', className)} />;
};

// ==========================================
// TIMELINE COMPONENT
// ==========================================
export interface TimelineStep {
  title: string;
  description: string;
  time: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const Timeline = ({ steps }: { steps: TimelineStep[] }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {steps.map((step, stepIdx) => {
          const StepIcon = step.icon || Info;
          return (
            <li key={stepIdx}>
              <div className="relative pb-8">
                {stepIdx !== steps.length - 1 ? (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-zinc-800" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3 items-start">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                      <StepIcon className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">{step.title}</p>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{step.description}</p>
                    </div>
                    <div className="text-right text-[10px] whitespace-nowrap font-medium text-slate-400 dark:text-zinc-500">
                      {step.time}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
