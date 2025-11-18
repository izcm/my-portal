import type { ReactNode } from "react";
import { useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  // Close on ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/60 backdrop-blur-sm 
        animate-fadeIn
      "
      onClick={onClose} // click outside closes
    >
      <div
        className="
          bg-secondary border border-default rounded-xl
          max-w-[90%] 
          min-w-[400px]
        "
        onClick={(e) => e.stopPropagation()} // prevent close when clicking modal
      >
        {children}
      </div>
    </div>
  );
};
