import {SmartContract} from "ton-contract-executor";
import {buildNftCollectionDataCell, CollectionMintItemInput, NftCollectionData, Queries, RoyaltyParams} from "./NftCollection.data";
import {Address, Cell, ContractProvider, Contract, contractAddress, Slice, toNano, Sender, beginCell} from "ton";
import BN from "bn.js";
import {decodeOffChainContent} from "../nft-content/nftContent";
let contract:SmartContract;


export default class NftCollectionLocal implements Contract {

    static async createForDeploy(code:Cell, config: NftCollectionData): Promise<NftCollectionLocal> {

      let data = buildNftCollectionDataCell(config)

      const workchain = 0; // deploy to workchain 0
      const address = contractAddress(workchain, { code, data });
      contract =  await SmartContract.fromCell(code, data)


    contract.setC7Config({
        myself: address
    })
    return new NftCollectionLocal(address, { code, data });

    }
    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
          value: "1.01", // send 0.01 TON to contract for rent
          bounce: false,
        });
      }
      
 
    private constructor(
        public readonly address: Address,
        readonly init?: { code: Cell, data: Cell }
    ) {}


    //
    // Get methods
    //
    async getCounter(provider: ContractProvider) {
        const { stack } = await provider.get("counter", []);
        return stack.readBigNumber();
      }
      
    async getCollection(provider:ContractProvider): Promise<{ nextItemId: number, ownerAddress: Address, collectionContent: string }> {
        const { stack } = await provider.get("getCollection", []);
        if (!stack) {
            throw new Error(`Unable to invoke get_collection_data on contract`)
        }
        let nextItemId = stack.readBigNumber() 
        console.log('nextItemId -->',nextItemId)
        console.log('nextItemId -->',stack.peek())

        let collectionContent = stack.readCell() 
        let ownerAddress = stack.readAddress() 

        // let [nextItemId, collectionContent, ownerAddress] = res as [BN, Cell, Slice]

        return {
            nextItemId: parseInt(nextItemId.toString()) ,
            collectionContent: decodeOffChainContent(collectionContent),
            ownerAddress: ownerAddress!
        }
    }

    // async getNftAddressByIndex(index: number): Promise<Address> {
    //     let res = await this.contract.invokeGetMethod('get_nft_address_by_index', [{
    //         type: 'int',
    //         value: index.toString(10)
    //     }])
    //     return (res.result[0] as Slice).loadAddress()!
    // }

    // async getRoyaltyParams(): Promise<RoyaltyParams> {
    //     let res = await this.contract.invokeGetMethod('royalty_params', [])

    //     let [royaltyFactor, royaltyBase, royaltyAddress] = res.result as [BN, BN, Slice]

    //     return {
    //         royaltyFactor: royaltyFactor.toNumber(),
    //         royaltyBase: royaltyBase.toNumber(),
    //         royaltyAddress: royaltyAddress.loadAddress()!
    //     }
    // }

    // async getNftContent(index: number, nftIndividualContent: Cell): Promise<string> {
    //     let res = await this.contract.invokeGetMethod('get_nft_content', [
    //         { type: 'int', value: index.toString() },
    //         { type: 'cell', value: nftIndividualContent.toBoc({ idx: false }).toString('base64')}
    //     ])

    //     if (res.type !== 'success') {
    //         throw new Error('Unable to invoke get_nft_content on collection')
    //     }

    //     let [contentCell] = res.result as [Cell]

    //     return decodeOffChainContent(contentCell)
    // }

    //
    // Internal messages
    //

    async sendDeployNewNft(via: Sender, provider:ContractProvider, from: Address, value: number|bigint, params: { queryId?: number, passAmount: number|bigint, itemIndex: number, itemOwnerAddress: Address, itemContent: string }) {
        let msgBody = Queries.mint(params)
        return await provider.internal(via, {
            value: toNano(1), // send 0.002 TON for gas
            body: msgBody,
            bounce: false,
        });
        // return await this.contract.sendInternalMessage(new InternalMessage({
        //     to: this.address,
        //     from: from,
        //     value: new BN(value),
        //     bounce: false,
        //     body: new CommonMessageInfo({
        //         body: new CellMessage(msgBody)
        //     })
        // }))
    }

    async sendBatchDeployNft(via: Sender, provider:ContractProvider, value: BN,params: { queryId?: number, items: CollectionMintItemInput[] }) {
        let msgBody = Queries.batchMint(params)

        return await provider.internal(via, {
            value: toNano(1), // send 0.002 TON for gas
            body: msgBody,
            bounce: false,
        });
        // return await this.contract.sendInternalMessage(new InternalMessage({
        //     to: this.address,
        //     from: from,
        //     value: new BN(value),
        //     bounce: false,
        //     body: new CommonMessageInfo({
        //         body: new CellMessage(msgBody)
        //     })
        // }))
    }

    async sendChangeOwner(via: Sender, provider:ContractProvider, newOwner: Address) {
        let msgBody = Queries.changeOwner({newOwner})
        return await provider.internal(via, {
            value: toNano(1), // send 0.002 TON for gas
            body: msgBody,
            bounce: false,
        });
        // return await this.contract.sendInternalMessage(new InternalMessage({
        //     to: this.address,
        //     from: from,
        //     value: toNano(1),
        //     bounce: false,
        //     body: new CommonMessageInfo({
        //         body: new CellMessage(msgBody)
        //     })
        // }))
    }

    async sendGetRoyaltyParams(provider: ContractProvider, via: Sender) {

        let msgBody = Queries.getRoyaltyParams({})

        return await provider.internal(via, {
            value: toNano(1), // send 0.002 TON for gas
            body: msgBody,
            bounce: false,
        });

        // return await this.contract.sendInternalMessage(new InternalMessage({
        //     to: this.address,
        //     from: from,
        //     value: toNano(1),
        //     bounce: false,
        //     body: new CommonMessageInfo({
        //         body: new CellMessage(msgBody)
        //     })
        // }))
    }

    async sendEditContent(via: Sender, provider:ContractProvider, params: { queryId?: number,  collectionContent: string, commonContent: string,  royaltyParams: RoyaltyParams  }) {
        let msgBody = Queries.editContent(params)
        return await provider.internal(via, {
            value: toNano(1), // send 0.002 TON for gas
            body: msgBody,
            bounce: false,
        });
        // return await this.contract.sendInternalMessage(new InternalMessage({
        //     to: this.address,
        //     from: from,
        //     value: toNano(1),
        //     bounce: false,
        //     body: new CommonMessageInfo({
        //         body: new CellMessage(msgBody)
        //     })
        // }))
    }


}