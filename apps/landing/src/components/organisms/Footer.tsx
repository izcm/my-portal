type Props = {
  copyright?: string;
};

export const Footer = ({ copyright }: Props) => {
  return (
    <footer className="w-full bg-neutral-900 text-neutral-400 text-sm py-6 text-center border-t border-neutral-800">
      {copyright ?? "© 2025 Kitz Universe 💫"}
    </footer>
  );
};
