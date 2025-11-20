export const shortenAddr = (addr: string) =>
  `${addr.slice(0, 6)}…${addr.slice(-4)}`;
