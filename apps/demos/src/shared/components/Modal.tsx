import type { ReactNode } from "react";
import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Get current scrollbar width to prevent layout shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Store original styles
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Lock scroll and compensate for scrollbar
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Cleanup: restore original styles when modal closes
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) {
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [onClose, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/50 backdrop-blur-sm 
        animate-fadeIn
      "
      onClick={onClose}
    >
      <div
        className="
          bg-[var(--bg-surface)] 
          border border-[var(--border-default)]
          rounded-lg
          max-w-[90%] 
          min-w-[400px]
          shadow-lg
        "
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
