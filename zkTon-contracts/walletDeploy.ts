import * as dotenv from 'dotenv' 
dotenv.config()
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { WalletContractV4, TonClient, fromNano } from "ton";

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  //const mnemonic = "unfold sugar water ..."; // your 24 secret words (replace ... with the rest of the words)
  const mnemonic = process.env.MNEMONIC||''; // your 24 secret words (replace ... with the rest of the words)
  
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });
  console.log("wallet.address:", wallet.address, wallet.address.toString({ testOnly: true }));

  // query balance from chain
  const balance = await client.getBalance(wallet.address);
  console.log("balance:", fromNano(balance));

  // query seqno from chain
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  console.log("seqno:", seqno);
}

main();
