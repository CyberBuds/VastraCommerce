import { useState, useCallback } from 'react';

export function useDialog<T = any>(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const open = useCallback((customData?: T) => {
    if (customData !== undefined) {
      setData(customData);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay resetting data to prevent flash of empty content during transition
    setTimeout(() => {
      setData(null);
      setIsSubmitting(false);
    }, 200);
  }, []);

  const startSubmit = useCallback(() => setIsSubmitting(true), []);
  const endSubmit = useCallback(() => setIsSubmitting(false), []);

  return {
    isOpen,
    data,
    isSubmitting,
    open,
    close,
    setData,
    startSubmit,
    endSubmit,
    setIsOpen,
  };
}
