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
          flex flex-col items-center gap-4
          bg-nebula/100 border border-default rounded-xl
          max-w-sm w-[90%] p-8
          shadow-[0_0_40px_rgba(59,130,246,0.18)]
        "
        onClick={(e) => e.stopPropagation()} // prevent close when clicking modal
      >
        {children}
        {/* Mint Button */}
        <button className="btn btn-primary mt-3">Mint Selected</button>
      </div>
    </div>
  );
};
