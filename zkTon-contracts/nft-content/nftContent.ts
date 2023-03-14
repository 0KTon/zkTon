import {beginCell, Cell, Slice} from "ton";

const OFF_CHAIN_CONTENT_PREFIX = 0x01

export function flattenSnakeCell(cell: Cell) {
    let c: Cell|null = cell

    let res = Buffer.alloc(0)
console.log("The root cell in decode - ", c)
    while (c) {
        let cs = c.beginParse()
        if(cs.remainingBits){
        // console.log("The data - ", cs.remainingBits)

            let data = cs.loadBuffer(127);
        console.log("The data - ", data)

            res = Buffer.concat([res, data])
        }
        c = c.refs[0]
    }

    return res
}

function bufferToChunks(buff: Buffer, chunkSize: number) {
    let chunks: Buffer[] = []
    while (buff.byteLength > 0) {
        chunks.push(buff.slice(0, chunkSize))
        buff = buff.slice(chunkSize)
    }
    return chunks
}

export function makeSnakeCell(data: Buffer) {
    let chunks = bufferToChunks(data, 127)
    let rootCell = beginCell()
    let curCell = rootCell
    curCell.storeBuffer(chunks[0])
    let nextCell = new Cell().asBuilder().storeBuffer(chunks[1])
    curCell.storeRef(nextCell)
    curCell = nextCell
    let nextCell2 = new Cell().asBuilder().storeBuffer(chunks[2])
    curCell.storeRef(nextCell2)

    

    // console.log("curcell - ",curCell)
    console.log("rootCell - ",rootCell)
    // curCell.storeBuffer(chunks[0])
    // for (let i = 0; i < chunks.length-1; i++) {
    //     // let chunk = chunks[i]
    //     // console.log("rootCell -- ", i , " -  ", rootCell)
              
    //     if (chunks[i+1]) {
    //         // console.log(chunks[i+1]);
    //         let nextCell = beginCell().storeBuffer(chunks[i+1])
    //         curCell.storeRef(nextCell)
    //         // console.log("curCell 2 -- ", i , " -  ", curCell, nextCell)
    //         curCell = nextCell
    //         nextCell.endCell();
    //     }
    //     // curCell.endCell()
    // }
    console.log("rootCell.availableRefs.toFixed() -- ", rootCell.availableRefs.toFixed(), rootCell.asCell().refs[0])
    return rootCell.endCell()
}

export function encodeOffChainContent(content: string) {
    let data = Buffer.from(content)
    let offChainPrefix = Buffer.from([OFF_CHAIN_CONTENT_PREFIX])
    data = Buffer.concat([offChainPrefix, data])
    return makeSnakeCell(data)
}

export function decodeOffChainContent(content: Cell) {
    let data = flattenSnakeCell(content)

    let prefix = data[0]
    if (prefix !== OFF_CHAIN_CONTENT_PREFIX) {
        throw new Error(`Unknown content prefix: ${prefix.toString(16)}`)
    }
    return data.slice(1).toString()
}