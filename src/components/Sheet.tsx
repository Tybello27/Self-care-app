"use client";

import { useEffect, type ReactNode } from "react";

export default function Sheet({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-[#4a3f55]/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="animate-fade-up glass-strong relative z-10 max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-[2rem] px-6 pb-8 pt-4 no-scrollbar sm:rounded-[2rem]">
        <div className="sticky top-0 -mx-6 mb-3 flex items-center justify-center bg-transparent pt-1">
          <div className="h-1.5 w-12 rounded-full bg-[#d8cfe4]" />
        </div>
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl text-[#4a3f55]">{title}</h3>
            <button
              onClick={onClose}
              className="press grid h-9 w-9 place-items-center rounded-full bg-white/70 text-lg text-[#8a7c99]"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
