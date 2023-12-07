import React from 'react'
import { GoogleMap, useJsApiLoader,Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CircularProgress,
  Box,
  Card, 
  Typography,
  Button,
  TextField,
  Snackbar
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
  
  const containerStyle = {
    width: '400px',
    height: '400px'
  };
  

const SetTreasure = ({latitude,
    longitude,
    contract,
    signer,
    contractAddress,
    provider
}) => {

    const [selectLatitude,setSelectLatitude] = useState(null)
    const [selectLongitude,setSelectLongitude] = useState(null)
    const [treasureAmount, setTreasureAmount] = useState(null)

    const [processing, setProcessing] = useState(false)
    const [txHash, setTxHash] = useState(null)
    const [transactionPosted, setTransactionPosted] = useState(false)

    const [openSnackbar,setOpenSnackBar] = useState(false)
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_API_KEY
      })

      const center = {
        lat: latitude,
        lng: longitude
      };


 const _onClick=(obj)=> { 
    console.log(obj.latLng.lat(),obj.latLng.lng())
    setSelectLatitude(Math.round(obj.latLng.lat()*1000)/1000)
    setSelectLongitude(Math.round(obj.latLng.lng()*1000)/1000)
}

    const handleAmount = (amount)=>{
    console.log("amount",amount)
    setTreasureAmount(amount)
    }

const handleDeposit = async ()=>{
        setProcessing(true)

        if (treasureAmount=== null){
            alert('Deposit not possible with incomplete whole number or decimal.')
        }
        else{
            const amountAsWei = ethers.utils.parseEther(treasureAmount)
            const tx = await signer.sendTransaction({to:contractAddress,value:amountAsWei}).then((res)=>{
                console.log('txhash', res.hash)
                let hash = res.hash
                setTxHash(hash.toString())
                isTransactionMined(hash.toString())
                try{
                    recordTreasureDeposit()
                    }
                    catch(e){
                        console.log(e.message)
                        return
                    }
    
            }).catch(error => {
                console.log("error with processing", error)
                setProcessing(false)})
            }
    
            
    }

const isTransactionMined = async (transactionHash) => {
        let transactionBlockFound = false
    
        while (transactionBlockFound === false) {
            let tx = await provider.getTransactionReceipt(transactionHash)
            console.log("transaction status check....")
            try {
                await tx.blockNumber
            }
            catch (error) {
                tx = await provider.getTransactionReceipt(transactionHash)
            }
            finally {
                console.log("proceeding")
            }
    
    
            if (tx && tx.blockNumber) {
               
                setProcessing(false)
                console.log("block number assigned.")
                transactionBlockFound = true
                let stringBlock = tx.blockNumber.toString()
                console.log("COMPLETED BLOCK: " + stringBlock)
                setOpenSnackBar(true)
            
            }
        }
    
    }
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnackBar(false);
      
      };
      
      const action = (
        <React.Fragment>
          <Button
            color="secondary"
            size="small"
            onClick={handleClose}
          >
            UNDO
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );


const recordTreasureDeposit = async ()=>{
    let _weiAmount = String(parseFloat(treasureAmount)*10e17)
    let adjustedLatitude = selectLatitude*1000
    let adjustedLongitude = selectLongitude*1000
    console.log({
        adjustedLatitude,
        adjustedLongitude, 
        _weiAmount
    },"Treasure_Object")

    try{
            console.log("treasure deployment attempt")
            const amountAsWei = ethers.utils.parseEther(treasureAmount)
            const lat = parseInt(adjustedLatitude)
            const long = parseInt(adjustedLongitude)
           
            const tx = await contract.recordTreasureDeposit(lat,long,amountAsWei,process.env.REACT_APP_WEB_KEY)
            let hash = tx.hash
            setTxHash(hash.toString())
            isTransactionMined(hash.toString())
            return 
        }
        
        catch(e) {
            console.log("catch initiated")
            console.log(e.message)
            setProcessing(false)
        }

}
      
  const [map, setMap] = React.useState(null)
    
      const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
    
       setTimeout(()=> setMap(map),100)
      }, [])
    
      const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
      }, [])
    
      return isLoaded ? (
  <>
      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleClose}
          message=""
          action={action}
          sx={{
            backgroundColor:"white"
          }}
        >
          <a target="_blank" href={`https://sepolia.scrollscan.com/tx/${txHash}`}>
            <Typography color="black">
              Success-Treasure Deposited! Click for Transaction:${txHash} on Scroll Scan
            </Typography>
           
          </a>
        </Snackbar>
      <GoogleMap
            onClick={_onClick}
            mapContainerStyle={containerStyle}
            center={center}
            zoom={7}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
          
        </GoogleMap>
        <Box>
        <Typography>User Selected Treasure Coordinates:</Typography>
        <Typography>Latitude:{selectLatitude}</Typography>
        <Typography>Longitude:{selectLongitude}</Typography>
        </Box>
        <Typography sx={{marginTop:'20px'}}>Set Treasure Amount:</Typography>
        <TextField sx={{backgroundColor:'white'}} 
        inputMode='numeric'
        label="ETH"
        onChange={(e)=> handleAmount(e.target.value)}
        >Set Treasure Amount:</TextField>
        {
            !processing?
   <Box>
   <Button variant='contained'
   color="success"
   onClick={handleDeposit}
   >Deposit Treasure</Button>
   <Card sx={{backgroundColor:'green'}}>
   <Typography sx={{color:'yellow'}}>
    <Typography sx={{color:'red'}}>Note:</Typography>Two Transaction Signings Necessary Upon Deposit</Typography>
   <hr></hr>
   <Typography>1.Depositing Treasure Amount</Typography>
   <Typography>2.Record Treasure Location Map</Typography>
   </Card>

   </Box>:
   <Box sx={{marginTop:'20px'}}>
   <CircularProgress/>
   </Box>
        }
        </>
      ) : <></>
  
}

export default SetTreasure