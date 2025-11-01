type Props = {
  title: string;
  subtitle?: string;
  href?: string;
};

export const Header = ({ title, subtitle, href = "/" }: Props) => {
  return (
    <header className="flex items-center justify-between w-full bg-black text-white p-6 border-b border-neutral-800 h-32">
      {/* Title & subtitle */}
      <a href={href} className="ml-4 flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
      </a>

      {/* Wallet button */}
      {/*<div className="ml-auto">
        <ConnectWalletSection />
      </div>*/}
    </header>
  );
};
