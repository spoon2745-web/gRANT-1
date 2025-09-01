declare module '@/contexts/ToastContext' {
  export type Toast = { id: string; title?: string; message?: string; type?: string; duration?: number };
  export type ToastContextType = {
    toasts: Toast[];
    addToast: (t: Partial<Toast>) => void;
    removeToast: (id: string) => void;
    success: (title: string, message?: string, duration?: number) => void;
    error: (title: string, message?: string, duration?: number) => void;
    warning: (title: string, message?: string, duration?: number) => void;
    info: (title: string, message?: string, duration?: number) => void;
  };
  export function useToast(): ToastContextType;
  export function ToastProvider({ children }: { children: React.ReactNode }): JSX.Element;
}
