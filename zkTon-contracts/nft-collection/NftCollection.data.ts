import {Address, Cell, contractAddress, ExternalAddress, StateInit, storeStateInit , beginCell } from "ton";
import BN from "bn.js";
import {NftCollectionCodeCell} from "./NftCollection.source";
import {encodeOffChainContent} from "../nft-content/nftContent";
import { Maybe } from "ton-core/dist/utils/maybe";

export type RoyaltyParams = {
    royaltyFactor: number
    royaltyBase: number
    royaltyAddress: Address
}

export type NftCollectionData = {
    ownerAddress: Address,
    nextItemIndex: number | bigint
    collectionContent: string
    commonContent: string
    nftItemCode: Cell
    royaltyParams: RoyaltyParams
}

// default#_ royalty_factor:uint16 royalty_base:uint16 royalty_address:MsgAddress = RoyaltyParams;
// storage#_ owner_address:MsgAddress next_item_index:uint64
//           ^[collection_content:^Cell common_content:^Cell]
//           nft_item_code:^Cell
//           royalty_params:^RoyaltyParams
//           = Storage;

export function buildNftCollectionDataCell(data: NftCollectionData) {
    const dataCell = beginCell()
                    .storeAddress(data.ownerAddress)
                    .storeUint(data.nextItemIndex, 64);
    

    let collectionContent = encodeOffChainContent(data.collectionContent)

    let commonContent = beginCell().storeBuffer(Buffer.from(data.commonContent))
    let contentCell = beginCell()
                        .storeRef(collectionContent)
                        .storeRef(commonContent)
                        .endCell();
    dataCell.storeRef(contentCell)
    dataCell.storeRef(data.nftItemCode)

    let royaltyCell = beginCell()
                      .storeUint(data.royaltyParams.royaltyFactor, 16)
                      .storeUint(data.royaltyParams.royaltyBase, 16)
                      .storeAddress(data.royaltyParams.royaltyAddress)
    dataCell.storeRef(royaltyCell)
    
    return dataCell.endCell()
}

export function buildNftCollectionStateInit(conf: NftCollectionData) {
    let dataCell = buildNftCollectionDataCell(conf)

    let stateInit:StateInit =  {
        code: NftCollectionCodeCell,
        data: dataCell
    }

    let hash = beginCell()
        .store(storeStateInit(stateInit))
        .endCell()
        .hash();

    let address = contractAddress(0, stateInit)
    return {
        stateInit: hash,
        stateInitMessage: stateInit,
        address
    }
}

export const OperationCodes = {
    Mint: 1,
    BatchMint: 2,
    ChangeOwner: 3,
    EditContent: 4,
    GetRoyaltyParams: 0x693d3950,
    GetRoyaltyParamsResponse: 0xa8cb00ad
}

export type CollectionMintItemInput = {
    passAmount: BN
    index: number
    ownerAddress: Address
    content: string
}

export const Queries = {
    mint: (params: { queryId?: number, passAmount: number|bigint, itemIndex: number, itemOwnerAddress: Address, itemContent: string }) => {
        let msgBody = new Cell()

        msgBody.asBuilder().storeUint(OperationCodes.Mint, 32)
        msgBody.asBuilder().storeUint(params.queryId || 0, 64)
        msgBody.asBuilder().storeUint(params.itemIndex, 64)
        msgBody.asBuilder().storeCoins(params.passAmount)

        let itemContent = new Cell()
        // itemContent.bits.writeString(params.itemContent)
        itemContent.asBuilder().storeBuffer(Buffer.from(params.itemContent))

        let nftItemMessage = new Cell()

        nftItemMessage.asBuilder().storeAddress(params.itemOwnerAddress)
        nftItemMessage.asBuilder().storeRef(itemContent)

        msgBody.asBuilder().storeRef(nftItemMessage)

        return msgBody
    },
    batchMint: (params: { queryId?: number, items: CollectionMintItemInput[] }) => {
        if (params.items.length > 250) {
            throw new Error('Too long list')
        }

        let itemsMap = new Map<string, CollectionMintItemInput>()

        for (let item of params.items) {
            itemsMap.set(item.index.toString(10), item)
        }

        // let dictCell = serializeTuple(itemsMap, 64, (src, cell) => {
        //     let nftItemMessage = new Cell()

        //     let itemContent = new Cell()
        //     // itemContent.bits.writeString(packages.content)
        //     itemContent.asBuilder().storeBuffer(Buffer.from(src.content))

        //     nftItemMessage.asBuilder().storeAddress(src.ownerAddress)
        //     nftItemMessage.asBuilder().storeRef(itemContent)

        //     cell.bits.writeCoins(src.passAmount)
        //     cell.asBuilder().storeRef(nftItemMessage)
        // })

        let msgBody = new Cell()

        msgBody.asBuilder().storeUint(OperationCodes.BatchMint, 32)
        msgBody.asBuilder().storeUint(params.queryId || 0, 64)
        // msgBody.asBuilder().storeRef(dictCell)

        return msgBody
    },
    changeOwner: (params: { queryId?: number, newOwner: Address}) => {
        let msgBody = new Cell()
        msgBody.asBuilder().storeUint(OperationCodes.ChangeOwner, 32)
        msgBody.asBuilder().storeUint(params.queryId || 0, 64)
        msgBody.asBuilder().storeAddress(params.newOwner)
        return msgBody
    },
    getRoyaltyParams: (params: { queryId?: number }) => {
        let msgBody = new Cell()
        msgBody.asBuilder().storeUint(OperationCodes.GetRoyaltyParams, 32)
        msgBody.asBuilder().storeUint(params.queryId || 0, 64)
        return msgBody
    },
    editContent: (params: { queryId?: number,  collectionContent: string, commonContent: string,  royaltyParams: RoyaltyParams  }) => {
        let msgBody = new Cell()
        msgBody.asBuilder().storeUint(OperationCodes.EditContent, 32)
        msgBody.asBuilder().storeUint(params.queryId || 0, 64)

        let royaltyCell = new Cell()
        royaltyCell.asBuilder().storeUint(params.royaltyParams.royaltyFactor, 16)
        royaltyCell.asBuilder().storeUint(params.royaltyParams.royaltyBase, 16)
        royaltyCell.asBuilder().storeAddress(params.royaltyParams.royaltyAddress)

        let contentCell = new Cell()

        let collectionContent = encodeOffChainContent(params.collectionContent)

        let commonContent = new Cell()
        // commonContent.bits.writeString(params.commonContent)
        commonContent.asBuilder().storeBuffer(Buffer.from(params.commonContent))

        contentCell.asBuilder().storeRef(collectionContent)
        contentCell.asBuilder().storeRef(commonContent)

        msgBody.asBuilder().storeRef(contentCell)
        msgBody.asBuilder().storeRef(royaltyCell)

        return msgBody
    }
}