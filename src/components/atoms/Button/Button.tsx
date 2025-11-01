import { ReactNode } from "react";

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}
export const Button = ({
  onClick,
  children,
  className = "",
  disabled = false,
}: ButtonProps) => {
  const baseStyle = `
    px-4 py-2
    rounded-md
    bg-neutral-800
    text-white
    hover:bg-neutral-700
    focus:outline-none
    focus:ring-1
    focus:ring-indigo-300
    transition
  `;

  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseUp={(e) => e.currentTarget.blur()}
      className={`${baseStyle} ${disabled ? disabledStyle : ""} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
