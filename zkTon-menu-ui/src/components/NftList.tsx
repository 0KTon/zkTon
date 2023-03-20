import { useEffect, useState } from 'react';
import { INftItem } from '../models/Nft';
import './NftList.css'
// import {bid} from  '../contracts/counter';
import { useNftContract } from '../hooks/useNftContract';
import { useTonConnect } from '../hooks/useTonConnect';
import { TonConnectButton } from '@tonconnect/ui-react';

const NftList = () => {

  const [items, setItems] = useState<Array<INftItem>>([]);
  const { connected } = useTonConnect();

  const { makeNewBid } = useNftContract("EQBJgOTSVSOr3TCOn80hH68JrP6PChJHAG1Cajl36VIexoHN");
  useEffect(() => {
    // setItems([
    //   {
    //     "name": "@po_blznesu",
    //     "address": "EQANVqtZFuFlt9tVCdNLBMCXuWkVgsCZ54Kh1w_KDSN8AevW",
    //     "price": 30,
    //     "rarityRank": 670
    //   },
    //   {
    //     "name": "@metaagrar",
    //     "address": "EQDoFOYwu0KWN2Z-2crXWs1JCOtIbzUT3Np8zLsGAsWZZAwJ",
    //     "price": 25,
    //     "rarityRank": 3253
    //   },
    //   {
    //     "name": "@real_volya",
    //     "address": "EQDcA1aR2Y_X05vi-hCjBo1imLCTfUKzu06y71_QjOxaYTSb",
    //     "price": 9000,
    //     "rarityRank": 3242
    //   },
    //   {
    //     "name": "@onetrillion",
    //     "address": "EQDyviuayMYQd5vBPvqvsu5T05nKRV8C-IN8NYIOAzUfjFQ2",
    //     "price": 11111,
    //     "rarityRank": 3397
    //   },
    //   {
    //     "name": "@cyberpnk",
    //     "address": "EQBs3IbNzWkVVhSsk_K4Rcp-vxY_Hu9DHWo7KoTHOMOMP2QI",
    //     "price": 11000,
    //     "rarityRank": 2157
    //   },
    //   {
    //     "name": "@anyfund",
    //     "address": "EQAsJn3Pfqwtu4jEvFNxkc9aCLmnFFZ17cHqhIlw3eNWvuJW",
    //     "price": 19000,
    //     "rarityRank": 3542
    //   },
    //   {
    //     "name": "@otctoncoin",
    //     "address": "EQCtMunVDDILwgAyd_CBbb_doXGzoapQNREi-aaRNahlTcZw",
    //     "price": 19800,
    //     "rarityRank": 3590
    //   },
    //   {
    //     "name": "@toncoinfoundation",
    //     "address": "EQAQ1uIKWt_R_DQq9lUIhCUxt22Z48N-2bybbiT4S4FSzhDd",
    //     "price": 13579,
    //     "rarityRank": 3790
    //   },
    //   {
    //     "name": "@degenheim",
    //     "address": "EQBSR4oJMn8nx5rxfcJQrNzJvjJ8ZBtckASII0gUdz1wg2Ki",
    //     "price": 11000,
    //     "rarityRank": 3482
    //   },
    //   {
    //     "name": "@batsoupyumvault",
    //     "address": "EQAbrDm0IX6UNTIj7g_Dev1Z4wOXTitacJte5jX7WKQ30L4G",
    //     "price": 23000,
    //     "rarityRank": 3606
    //   }
    // ]);
    fetch('http://localhost:3000/nftCollectionSales')
      .then((response) => response.json())
      .then((response: { success: boolean, results: Array<INftItem> }) => {
        if (response?.success) {
          setItems(response.results);
          console.log(response.results)
        }
      });
  }, []);
  return (
    <div className="NftList-container">
      <div className="NftList-items">
        {items.filter((item: INftItem) => item.price < 5).map((item: INftItem) =>
          <div className="NftList-item" key={item.address}>
            {/* <img className="NftList-item-img" src={`https://nft.fragment.com/username/${item.name}.webp`} alt="" /> */}
            <div className="NftList-item-price">
              {/* <img src="/ton_symbol.png" alt="" /> */}
              <span>{item.name}</span>
              {/* <span>{item.address}</span>   */}
              <span>{item.price.toLocaleString()}</span>
            </div>
            <button className='NftList-item-button' onClick={() => makeNewBid(item.price)}>Place bid</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NftList;