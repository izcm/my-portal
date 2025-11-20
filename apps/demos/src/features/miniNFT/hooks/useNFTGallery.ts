import { useState, useEffect } from "react";

import { useMyTokens } from "../web3/hooks/read";
import { readSVG } from "../web3/actions/read";

import { type UI_NFT } from "../data/UI_NFT";

// feature hook
export const useNFTGallery = (wallet: `0x${string}`) => {
  const { tokens, isFetching: isTokensFetching } = useMyTokens(wallet);

  const [userNFTs, setUserNFTs] = useState<UI_NFT[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // token fetch still loading
      if (isTokensFetching) {
        setIsGalleryLoading(true);
        return;
      }

      // no tokens
      if (!tokens || tokens.length === 0) {
        setUserNFTs([]);
        setIsGalleryLoading(false);
        return;
      }

      // tokens fetched => fetch SVGs
      setIsGalleryLoading(true);

      const nfts = await Promise.all(
        tokens.map(async (id) => {
          const svg = await readSVG(id);
          return {
            tokenId: id,
            label: `Token #${id}`,
            svg: svg ?? "",
            owned: true,
          } as UI_NFT;
        }),
      );

      setUserNFTs(nfts);
      setIsGalleryLoading(false);
    };

    load();
  }, [tokens, isTokensFetching]);

  const updateSVG = async (tokenId: bigint) => {
    setIsGalleryLoading(true);
    const svg = await readSVG(tokenId);
    setIsGalleryLoading(false);

    // ❗ TODO: error handling
    if (!svg) {
      return;
    }

    setUserNFTs((prev) =>
      prev.map((nft) => (nft.tokenId === tokenId ? { ...nft, svg } : nft)),
    );
  };

  const addNewNFT = async (tokenId: bigint) => {
    let indexAfterAdd = 0;

    setUserNFTs((prev) => {
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
    isGalleryLoading,
    userNFTs,
    updateSVG,
    addNewNFT,
  };
};
