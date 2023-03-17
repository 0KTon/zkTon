import { useEffect, useState } from 'react';
import NFT from '../contracts/nft';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';

import { Address, OpenedContract } from 'ton-core';

export function useCounterContract(address:string) {
  const client = useTonClient();
  // const [val, setVal] = useState<null | number>();
  const { sender } = useTonConnect();

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const nftContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new NFT(
      Address.parse(address) // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<NFT>;
  }, [client]);

  return {
    address: nftContract?.address.toString(),
    makeNewBid: (amount:number) => {
        return nftContract?.makeBid(sender, amount);
      },
  };
}
