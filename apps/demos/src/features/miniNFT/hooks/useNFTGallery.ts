import { useState, useEffect } from "react";

import { useMyTokens } from "../web3/hooks/read";
import { readSVG } from "../web3/actions/read";

import { type UI_NFT } from "../data/ui_nfts";

// feature hook
export const useNFTGallery = (wallet: `0x${string}`) => {
  const { tokens, isFetching } = useMyTokens(wallet);

  const [userNFTs, setUsersNFTs] = useState<UI_NFT[]>([]);

  useEffect(() => {
    const run = async () => {
      const nfts = await Promise.all(
        tokens.map(async (id) => {
          const svg = await readSVG(id);
          return {
            tokenId: id,
            label: `Token #${id}`,
            svg: svg || "",
            owned: true,
          } as UI_NFT;
        }),
      );

      setUsersNFTs(nfts);
    };

    run();
  }, [tokens]);

  const updateSVG = async (tokenId: bigint) => {
    const svg = await readSVG(tokenId);

    // ❗ TODO: error handling
    if (!svg) {
      return;
    }

    setUsersNFTs((prev) =>
      prev.map((nft) => (nft.tokenId === tokenId ? { ...nft, svg } : nft)),
    );
  };

  const addNewNFT = async (tokenId: bigint) => {
    let indexAfterAdd = 0;

    setUsersNFTs((prev) => {
      const newNFT = {
        tokenId: tokenId,
        label: `Token #${tokenId}`,
        svg: "",
        owned: true,
      } as UI_NFT;

      indexAfterAdd = prev.length; // showcase the added NFT
      return [...prev, newNFT];
    });

    await updateSVG(tokenId);
    return indexAfterAdd;
  };

  return {
    isFetching,
    userNFTs,
    updateSVG,
    addNewNFT,
  };
};
