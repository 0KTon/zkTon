import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "ton-core";
// import { NftAuctionV2Data } from "./nft-auction-v2/NftAuctionV2.data";

export default class NFT implements Contract {

//   static createForDeploy(code: Cell, initialCounterValue: number): NFT {
//     const data = beginCell()
//       .storeUint(initialCounterValue, 64)
//       .endCell();
//     const workchain = 0; // deploy to workchain 0
//     const address = contractAddress(workchain, { code, data });
//     return new NFT(address, { code, data });
//   }

  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}
  
async makeBid(provider: ContractProvider, via: Sender, amount:number) {
  await provider.internal(via, {
    value: amount.toString(), // send 0.002 TON for gas
    body: new Cell
  });
}
}
