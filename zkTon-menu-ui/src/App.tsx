import './App.css';
import '@twa-dev/sdk';

import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';
import NftList from './components/NftList';


function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className='AppContainer'>
      <NftList />

      {/* <div className='Container'>
      <TonConnectButton />

      <div className='Card'>
        <b>Counter Address</b>
        <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
      </div>

      <div className='Card'>
        <b>Counter Value</b>
        <div>{value ?? 'Loading...'}</div>
      </div>

      <a
        className={`Button ${connected ? 'Active' : 'Disabled'}`}
        onClick={() => {
          sendIncrement();
        }}
      >
        Increment
      </a>
    </div> */}
    </div>
  );
}

export default App
