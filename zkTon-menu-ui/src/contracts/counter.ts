// import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell, toNano, address, Sender, Sender } from "ton-core";
// import { NftAuctionV2Data } from "./nft-auction-v2/NftAuctionV2.data";
// import BN from "bn.js";
// import { NftAuctionV2Local } from "./nft-auction-v2/NftAuctionV2Local";
// import { NftAuctionLocal } from "./nft-auction/NftAuctionLocal";
// export default class Counter implements Contract {

//   static createForDeploy(code: Cell, initialCounterValue: number): Counter {
//     const data = beginCell()
//       .storeUint(initialCounterValue, 64)
//       .endCell();
//     const workchain = 0; // deploy to workchain 0
//     const address = contractAddress(workchain, { code, data });
//     return new Counter(address, { code, data });
//   }

//   constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}

// async sendDeploy(provider: ContractProvider, via: Sender) {
//     await provider.internal(via, {
//       value: "0.01", // send 0.01 TON to contract for rent
//       bounce: false
//     });
//   }
  

// }
// export const bid =  async (amount:number, nftAddress:string) => {
//   console.log("Bid called", amount)
//   let defaultConfig: NftAuctionV2Data = {
//     marketplaceFeeAddress: address("EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS"),
//     marketplaceFeeFactor: 5,
//     marketplaceFeeBase: 100,


//     royaltyAddress: address(""),
//     royaltyFactor: 0,
//     royaltyBase: 0,


//     minBid: toNano('1'),
//     maxBid: toNano('100'),
//     minStep: toNano('1'),
//     endTimestamp: 1655880000, // 22 June 2022 г., 6:40:00

//     stepTimeSeconds: 60 * 5,
//     tryStepTimeSeconds: 60 * 5,

//     nftOwnerAddress: address("EQAcl8YbjEFreMyB0m3KKIzCS-pSFudfN3ZwYhgeaXhH93nh"),
//     nftAddress: address(nftAddress),

//     end: true,
//     marketplaceAddress: address("EQCjk1hh952vWaE9bRguFkAhDAL5jj3xj9p0uPWrFBq_GEMS"),
//     activated: false,
//     createdAtTimestamp: 1655880000 - (60 * 60),
// }
// // const auc = await NftAuctionV2Local.createFromConfig(defaultConfig);
// // auc.contract.setC7Config({unixtime: defaultConfig.createdAtTimestamp})

// const bidRes = await makeBid(address(nftAddress)), null, nftAddress, amount);

// }

// async function makeBid(via: Sender, provider:ContractProvider, nftAddress, amount: number) {
//   return await provider.internal(via, {
//     value: toNano(amount), // send 0.002 TON for gas
//     body: new Cell(),
//     bounce: true,
// });
  
// }