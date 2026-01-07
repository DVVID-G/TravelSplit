import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

/**
 * Toast atom component
 * Simple toast notification for user feedback
 * Follows Design System Guide: rounded-xl, appropriate colors
 */
export const Toast = ({ message, type = 'info', onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-slate-50 border-slate-200 text-slate-800',
  };

  return (
    <div
      className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4 px-4 py-3 rounded-xl border shadow-lg flex items-center justify-between ${bgColors[type]}`}
      role="alert"
      aria-live="polite"
    >
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="ml-4 text-current opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 rounded transition-opacity"
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </div>
  );
};

