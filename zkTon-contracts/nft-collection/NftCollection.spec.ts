import {CollectionMintItemInput, NftCollectionData, OperationCodes} from "./NftCollection.data";
import {Cell,  CommonMessageInfo, contractAddress,  toNano, Sender} from "ton-core";
import NftCollectionLocal from "./NftCollectionLocal";
import {NftCollectionSource} from "./NftCollection.source";
import {randomAddress} from "../utils/randomAddress";
import {SendMsgAction} from "ton-contract-executor";
// import { ExternalMessage  } from "ton";
import * as fs from "fs";
import { Blockchain, OpenedContract, TreasuryContract } from "@ton-community/sandbox";
import {compileFunc} from "../utils/compileFunc";
let blockchain: Blockchain;

let OWNER: OpenedContract<TreasuryContract>;
let ROYALTY: OpenedContract<TreasuryContract>;
let collectionLocal: NftCollectionLocal;
let collection: OpenedContract<NftCollectionLocal>;
let defaultConfig: NftCollectionData

describe('nft collection smc', () => {

    beforeEach(async () =>  {

        let code = await compileFunc(NftCollectionSource)
        
        // initialize the blockchain sandbox
        blockchain = await Blockchain.create();
        OWNER = await blockchain.treasury("owner");
        ROYALTY = await blockchain.treasury("royalty");
    
        // blockchain.verbosity = {
        //     blockchainLogs: true,
        //     vmLogs: "vm_logs_full",
        //     debugLogs: true,
        //   }

        defaultConfig = {
            ownerAddress: OWNER.address,
            nextItemIndex: 177,
            collectionContent: 'collection_content',
            commonContent: 'common_content',
            nftItemCode: new Cell(),
            royaltyParams: {
                royaltyFactor: 100,
                royaltyBase: 200,
                royaltyAddress: ROYALTY.address
            }
        }
  
        collectionLocal = await NftCollectionLocal.createForDeploy(code.cell, defaultConfig)
        // // deploy counter
        collection = blockchain.openContract(collectionLocal);
        await collection.sendDeploy(OWNER.getSender());
      }),

    // it('should ignore external messages', async () => {
        

    //     let res = await collection.s.contract.sendExternalMessage(new ExternalMessage({
    //         dest: collection.address,
    //         from: OWNER_ADDRESS,
    //         body: CommonMessageInfo({
    //             body: new CellMessage(new Cell())
    //         })
    //     }))

    //     expect(res.exit_code).not.toEqual(0)
    // })

    it('should return collection data', async () => {
        

        let res = await collection.getCollection()
        expect(res).toEqual(177n);

        // expect(res.nextItemId).toEqual(defaultConfig.nextItemIndex)
        // expect(res.collectionContent).toEqual(defaultConfig.collectionContent)
        // expect(res.ownerAddress).toEqual(defaultConfig.ownerAddress)
    })

    // it('should return nft content', async () => {
        

    //     let nftContent = new Cell()
    //     nftContent.asBuilder().storeBuffer(Buffer.from('1'))
    //     // nftContent.bits.writeString('1')

    //     let res = await collection.getNftContent(0, nftContent)
    //     expect(res).toEqual(defaultConfig.commonContent + '1')
    // })

    // it('should return nft address by index', async () => {
        

    //     let index = 77

    //     let res = await collection.getNftAddressByIndex(index)

    //     // Basic nft item data
    //     let nftItemData = new Cell()
    //     nftItemData.asBuilder().storeUint(index, 64)
    //     nftItemData.asBuilder().storeAddress(collection.address)

    //     let expectedAddress = contractAddress(
    //         0,{
    //         code: defaultConfig.nftItemCode,
    //         data: nftItemData
    //     })

    //     expect(res).toEqual(expectedAddress)
    // })

    // it('should return royalty params', async () => {
        

    //     let res = await collection.getRoyaltyParams()

    //     expect(res.royaltyBase).toEqual(defaultConfig.royaltyParams.royaltyBase)
    //     expect(res.royaltyFactor).toEqual(defaultConfig.royaltyParams.royaltyFactor)
    //     expect(res.royaltyAddress).toEqual(defaultConfig.royaltyParams.royaltyAddress)
    // })

    // it('should deploy new nft', async () => {
        

    //     let itemIndex = 1

    //     let res = await collection.sendDeployNewNft(Sender(OWNER_ADDRESS), provider:ContractProvider, toNano('1'), {
    //         passAmount: toNano('0.5'),
    //         itemIndex,
    //         itemOwnerAddress: OWNER_ADDRESS,
    //         itemContent: 'test_content'
    //     })

    //     if (res.type !== 'success') {
    //         throw new Error()
    //     }

    //     // Basic nft item data
    //     let nftItemData = new Cell()
    //     nftItemData.asBuilder().storeUint(itemIndex, 64)
    //     nftItemData.asBuilder().storeAddress(collection.address)

    //     // As a result of mint query, collection contract should send stateInit message to NFT item contract
    //     expect(res.actionList.length).toBe(1)
    //     let [initMessage] = res.actionList as [SendMsgAction]

    //     expect(initMessage.message.init!.code!.toString()).toEqual(defaultConfig.nftItemCode.toString())
    //     expect(initMessage.message.init!.data!.toString()).toEqual(nftItemData.toString())

    // })

    // it('should batch deploy nft\'s', async () => {
        


    //     let items: CollectionMintItemInput[] = [
    //         {
    //             passAmount: toNano('0.5'),
    //             index: 0,
    //             ownerAddress: randomAddress(),
    //             content: '1'
    //         },
    //         {
    //             passAmount: toNano('0.5'),
    //             index: 1,
    //             ownerAddress: randomAddress(),
    //             content: '2'
    //         },
    //     ]

    //     let res = await collection.sendBatchDeployNft(OWNER_ADDRESS,"", toNano('1'), {
    //         items
    //     })
    //     if (res.type !== 'success') {
    //         throw new Error()
    //     }

    //     expect(res.actionList.length).toBe(2)

    //     let [initMessage1, initMessage2] = res.actionList as [SendMsgAction, SendMsgAction]

    //     let nftItemData1 = new Cell()
    //     nftItemData1.asBuilder().storeUint(0, 64)
    //     nftItemData1.asBuilder().storeAddress(collection.address)

    //     let nftItemData2 = new Cell()
    //     nftItemData2.asBuilder().storeUint(1, 64)
    //     nftItemData2.asBuilder().storeAddress(collection.address)

    //     expect(initMessage1.message.init!.code!.toString()).toEqual(defaultConfig.nftItemCode.toString())
    //     expect(initMessage1.message.init!.data!.toString()).toEqual(nftItemData1.toString())
    //     expect(initMessage2.message.init!.code!.toString()).toEqual(defaultConfig.nftItemCode.toString())
    //     expect(initMessage2.message.init!.data!.toString()).toEqual(nftItemData2.toString())
    // })

    // it('should deploy nft only if owner calls', async () => {
        

    //     let itemIndex = 1

    //     let res = await collection.sendDeployNewNft(randomAddress(), toNano('1'), {
    //         passAmount: toNano('0.5'),
    //         itemIndex,
    //         itemOwnerAddress: OWNER_ADDRESS,
    //         itemContent: 'test_content'
    //     })

    //     expect(res.exit_code).not.toEqual(0)
    // })

    // it('should change owner', async () => {
        
    //     let newOwner = randomAddress()

    //     let res = await collection.sendChangeOwner(randomAddress(), newOwner)
    //     // Should fail if caller is not current user
    //     expect(res.exit_code).not.toEqual(0)

    //     res = await collection.sendChangeOwner(OWNER_ADDRESS, newOwner)

    //     expect(res.exit_code).toBe(0)
    //     let data = await collection.getCollectionData()
    //     expect(data.ownerAddress).toEqual(newOwner)
    // })

    // it('should send royalty params', async () => {
        
    //     let sender = randomAddress()
    //     let res = await collection.sendGetRoyaltyParams(sender)

    //     expect(res.exit_code).toBe(0)
    //     if (res.type !== 'success') {
    //         throw new Error()
    //     }

    //     let [responseMessage] = res.actionList as [SendMsgAction]

    //     expect(responseMessage.message.info.dest!).toEqual(sender)
    //     let response = responseMessage.message.body.beginParse()

    //     let op = response.readUintNumber(32)
    //     let queryId = response.readUintNumber(64)
    //     let royaltyFactor = response.readUintNumber(16)
    //     let royaltyBase = response.readUintNumber(16)
    //     let royaltyAddress = response.readAddress()!

    //     expect(op).toEqual(OperationCodes.GetRoyaltyParamsResponse)
    //     expect(queryId).toEqual(0)
    //     expect(royaltyFactor).toEqual(defaultConfig.royaltyParams.royaltyFactor)
    //     expect(royaltyBase).toEqual(defaultConfig.royaltyParams.royaltyBase)
    //     expect(royaltyAddress).toEqual(defaultConfig.royaltyParams.royaltyAddress)
    // })

    // it('should edit content', async () => {
        
    //     let sender = randomAddress()

    //     let royaltyAddress = randomAddress()
    //     let res = await collection.sendEditContent(sender, {
    //         collectionContent: 'new_content',
    //         commonContent: 'new_common_content',
    //         royaltyParams: {
    //             royaltyFactor: 150,
    //             royaltyBase: 220,
    //             royaltyAddress
    //         }
    //     })
    //     // should fail if sender is not owner
    //     expect(res.exit_code).not.toEqual(0)

    //     res = await collection.sendEditContent(OWNER_ADDRESS, {
    //         collectionContent: 'new_content',
    //         commonContent: 'new_common_content',
    //         royaltyParams: {
    //             royaltyFactor: 150,
    //             royaltyBase: 220,
    //             royaltyAddress
    //         }
    //     })

    //     expect(res.exit_code).toBe(0)
    //     if (res.type !== 'success') {
    //         throw new Error()
    //     }

    //     let data = await collection.getCollectionData()
    //     expect(data.collectionContent).toEqual('new_content')
    //     let royalty = await collection.getRoyaltyParams()
    //     expect(royalty.royaltyBase).toEqual(220)
    //     expect(royalty.royaltyFactor).toEqual(150)
    //     expect(royalty.royaltyAddress).toEqual(royaltyAddress)
    // })

})