import { useEffect, useState } from 'react';
import { INftItem } from '../models/Nft';
import './NftList.css'

const NftList = () => {

  const [items, setItems] = useState<Array<INftItem>>([]);

  useEffect(() => {
    fetch('http://localhost:3000/nftCollectionSales')
      .then((response) => response.json())
      .then((response: { success: boolean, results: Array<INftItem>}) => {
        if (response?.success) {
          setItems(response.results);
        }
      });
  }, []);
  return (
    <div className="NftList-container">
      <div className="NftList-items">
        <div className="NftList-item">
          <img className="NftList-item-img" src="https://nft.fragment.com/username/metaagrar.webp/" alt="" />
          <div className="NftList-item-price">
            <img src="/ton_symbol.png" alt="" />
            <span>{((8888).toLocaleString())}</span>
          </div>
          <button className="NftList-item-button">BUY</button>
        </div>
        <div className="NftList-item">
          <img className="NftList-item-img" src="https://nft.fragment.com/username/metaagrar.webp/" alt="" />
          <div className="NftList-item-price">
            <img src="/ton_symbol.png" alt="" />
            <span>{((8888).toLocaleString())}</span>
          </div>
          <button className="NftList-item-button">BUY</button>
        </div>
        <div className="NftList-item">
          <img className="NftList-item-img" src="https://nft.fragment.com/username/metaagrar.webp/" alt="" />
          <div className="NftList-item-price">
            <img src="/ton_symbol.png" alt="" />
            <span>888</span>
          </div>
          <button className="NftList-item-button">BUY</button>
        </div>
        <div className="NftList-item">
          <img className="NftList-item-img" src="https://nft.fragment.com/username/metaagrar.webp/" alt="" />
          <div className="NftList-item-price">
            <img src="/ton_symbol.png" alt="" />
            <span>888</span>
          </div>
          <button className="NftList-item-button">BUY</button>
        </div>
        <div className="NftList-item">
          <img className="NftList-item-img" src="https://nft.fragment.com/username/metaagrar.webp/" alt="" />
          <div className="NftList-item-price">
            <img src="/ton_symbol.png" alt="" />
            <span>888</span>
          </div>
          <button className="NftList-item-button">BUY</button>
        </div>
        <div className="NftList-item">
          <img className="NftList-item-img" src="https://nft.fragment.com/username/metaagrar.webp/" alt="" />
          <div className="NftList-item-price">
            <img src="/ton_symbol.png" alt="" />
            <span>888</span>
          </div>
          <button className="NftList-item-button">BUY</button>
        </div>
        <div className="NftList-item">
          <img className="NftList-item-img" src="https://nft.fragment.com/username/metaagrar.webp/" alt="" />
          <div className="NftList-item-price">
            <img src="/ton_symbol.png" alt="" />
            <span>888</span>
          </div>
          <button className="NftList-item-button">BUY</button>
        </div>
        <div className="NftList-item">
          <img className="NftList-item-img" src="https://nft.fragment.com/username/metaagrar.webp/" alt="" />
          <div className="NftList-item-price">
            <img src="/ton_symbol.png" alt="" />
            <span>888</span>
          </div>
          <button className="NftList-item-button">BUY</button>
        </div>
        <div className="NftList-item">
          <img className="NftList-item-img" src="https://nft.fragment.com/username/metaagrar.webp/" alt="" />
          <div className="NftList-item-price">
            <img src="/ton_symbol.png" alt="" />
            <span>888</span>
          </div>
          <button className="NftList-item-button">BUY</button>
        </div>
        <div className="NftList-item">
          <img className="NftList-item-img" src="https://nft.fragment.com/username/metaagrar.webp/" alt="" />
          <div className="NftList-item-price">
            <img src="/ton_symbol.png" alt="" />
            <span>888</span>
          </div>
          <button className="NftList-item-button">BUY</button>
        </div>
      </div>
    </div>
  );
}

export default NftList;