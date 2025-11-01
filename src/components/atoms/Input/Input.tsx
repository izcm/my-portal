import { FC } from "react";

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export const Input: FC<InputProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative group">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
      />
      <div className="absolute bottom-0 left-0 h-0.25 w-full bg-indigo-300 transform scale-x-0 origin-left transition-transform duration-300 ease-in-out group-focus-within:scale-x-100" />
    </div>
  );
};
