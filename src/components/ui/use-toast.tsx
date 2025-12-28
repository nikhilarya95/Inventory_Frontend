"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "info" | "warning";
};

const ToastContext = React.createContext<{ toast: (props: ToastProps) => void }>({
  toast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback((props: ToastProps) => {
    setQueue((prev) => [...prev, props]);
    // Auto-remove after 3s
    setTimeout(() => {
      setQueue((prev) => prev.filter((t) => t !== props));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {queue.map((t, i) => (
          <ToastPrimitive.Root key={i} className="bg-white shadow rounded p-4 mb-2">
            <ToastPrimitive.Title className="font-bold">{t.title}</ToastPrimitive.Title>
            {t.description && <ToastPrimitive.Description>{t.description}</ToastPrimitive.Description>}
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 z-50" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = () => React.useContext(ToastContext);
