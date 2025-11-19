export type UI_NFT = {
  tokenId: bigint; // only exists if minted
  label: string; // Token # Id
  colorCode: number; // optional metadata if needed later
  svg: string; // full SVG or IPFS URI / base64 string
  owned?: boolean; // true if wallet owns it
};
