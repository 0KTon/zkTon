import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "ton-core";

export default class Counter implements Contract {

  static createForDeploy(code: Cell, initialCounterValue: number): Counter {
    const data = beginCell()
      .storeUint(initialCounterValue, 64)
      .endCell();
    const workchain = 0; // deploy to workchain 0
    const address = contractAddress(workchain, { code, data });
    return new Counter(address, { code, data });
  }

  constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}

async sendDeploy(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: "0.01", // send 0.01 TON to contract for rent
      bounce: false
    });
  }
  
async getCounter(provider: ContractProvider) {
    const { stack } = await provider.get("counter", []);
    return stack.readBigNumber();
  }
  
async bid(amount) {
  let defaultConfig: NftAuctionV2Data = {
    marketplaceFeeAddress: randomAddress(),
    marketplaceFeeFactor: new BN(5),
    marketplaceFeeBase: new BN(100),


    royaltyAddress: randomAddress(),
    royaltyFactor: new BN(20),
    royaltyBase: new BN(100),


    minBid: toNano('1'),
    maxBid: toNano('100'),
    minStep: toNano('1'),
    endTimestamp: 1655880000, // 22 June 2022 г., 6:40:00

    stepTimeSeconds: 60 * 5,
    tryStepTimeSeconds: 60 * 5,

    nftOwnerAddress: null,
    nftAddress: randomAddress(),

    end: true,
    marketplaceAddress: randomAddress(),
    activated: false,
    createdAtTimestamp: 1655880000 - (60 * 60),
}

  const auc = await NftAuctionV2Local.createFromConfig({
    ...defaultConfig,
    end: false,
    nftOwnerAddress: randomAddress(),
    maxBid: new BN(0),
});

auc.contract.setC7Config({
    myself: auc.address,
    unixtime: defaultConfig.createdAtTimestamp + 10,
})

const bidResult = await makeBid(auc, buyerAddress, toNano(amount));


}

  async sendIncrement(provider: ContractProvider, via: Sender) {
  const messageBody = beginCell()
    .storeUint(1, 32) // op (op #1 = increment)
    .storeUint(0, 64) // query id
    .endCell();
  await provider.internal(via, {
    value: "0.002", // send 0.002 TON for gas
    body: messageBody
  });
}
}

