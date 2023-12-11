import './App.css';
import Location from './components/Location';
import WalletConnect from './components/WalletConnect';
import { useEffect, useState } from 'react';
import { CircularProgress,
  Box,
  Card, 
  Typography,
  Button} from '@mui/material';
import GetTreasure from './components/GetTreasure';
import SetTreasure from './components/SetTreasure';
import SmartContracts from './chain-info/smart_contracts.json'
import { ethers } from 'ethers';

function App() {

  const [latitude, setLatitude] = useState(null)
  const [longitude,setLongitude] = useState(null)
  const [navigatorAvailable, setNavigatorAvailable] = useState(false)

  const [defaultAccount,setDefaultAccount] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [provider, setProvider] = useState(null)
  const [walletBalance,setWalletBalance] = useState(null)

  const [treasuremode,setTreasureMode] = useState(null)

  //Sepolia network 
  //const TreasureGoAddress = SmartContracts.deploymentAddress.sepolia

  //Scroll Sepolia testnet
  const TreasureGoAddress = SmartContracts.deploymentAddress.scroll_sepolia


  useEffect(()=>{
    setLatitude(32.299507); // Set latitude to London's latitude (32.299507)
    setLongitude(-64.790337); // Set longitude to London's longitude (-0.1278)
    setNavigatorAvailable(true);
  }, []);

  const getWalletBalance = async (provider) => {
    // Look up the balance
    if (provider !== null  && defaultAccount !== null) {
        let balance = await provider.getBalance(defaultAccount);
        setWalletBalance(ethers.utils.formatEther(balance))
    }

}



  return (
    <Box className="App">
      <header className="App-header">
       X Marks The Spot
      </header>
      <Box>
      
       {latitude && longitude?
      <Location setLatitude={setLatitude}
      setLongitude={setLongitude}
      setNavigatorAvailable={setNavigatorAvailable}
      latitude={latitude}
      longitude={longitude}
      navigatorAvailable={navigatorAvailable}/>:
      <Box sx={{marginTop:'30px'}}>
        <CircularProgress/>
        <Typography>Loading ... Latitude and Longitude ...</Typography>
      </Box>
       }
    
      <WalletConnect 
      setDefaultAccount={setDefaultAccount}
      setSigner={setSigner}
      setContract={setContract}
      setProvider={setProvider}
      setWalletBalance={setWalletBalance}
      defaultAccount={defaultAccount}
      provider={provider}
      walletBalance={walletBalance}
      />
      </Box>

       {
      defaultAccount?
      <Box sx={{display:'flex'}}>
       <Box sx={{flexDirection:'row',margin:'auto'}}>
       <Button onClick={()=>{setTreasureMode("setTreasure")}} variant="contained" color="warning">SET TREASURE</Button> 
       <Button onClick={()=>{setTreasureMode("getTreasure")}} variant="contained" color="success">GET TREASURE</Button>
       </Box>
      </Box>:null
      } 

      {
        treasuremode?treasuremode=='getTreasure'?
        <GetTreasure contract={contract} 
        userLatitude={latitude} 
        userLongitude={longitude}
        provider={provider}
        setWalletBalance={setWalletBalance}
        defaultAccount={defaultAccount}
        walletBalance={walletBalance}
        address={TreasureGoAddress}/>
        :(<>
        <Box sx={{display:'flex',margin:'auto',justifyContent:'center'}}>
          <Box>
          <SetTreasure latitude={latitude} 
          longitude={longitude}
          contract={contract}
          signer={signer}
          contractAddress={TreasureGoAddress}
          provider={provider}
          getWalletBalance={getWalletBalance}/>
          </Box>
        </Box>
        </>)
        :null
      }

    </Box>
  );
}

export default App;
