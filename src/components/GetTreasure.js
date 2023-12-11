import React from 'react'
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader,Marker } from '@react-google-maps/api';
import PushPinIcon from '@mui/icons-material/PushPin';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { CircularProgress,
  Box,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
  TextField,
  Snackbar,
  Paper
} from '@mui/material';

const containerStyle = {
  width: '800px',
  height: '400px'
};

const GetTreasure = ({contract,
  userLatitude,
  userLongitude,
  provider,
  defaultAccount,
  setWalletBalance,
  wallletBalance,
  address
  }) => {

  const [treasureArray, setTreasrureArray] = useState([])
  const [foundArray, setFoundArray] = useState([])
  const [tabledata,setTableData] = useState([])

  const [processing, setProcessing] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [openSnackbar,setOpenSnackBar] = useState(false)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_API_KEY
  })

  const center = {
    lat: userLatitude,
    lng: userLongitude
  };

  const [map, setMap] = React.useState(null)

    
  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  async function getData(){
    try{
    let data = await contract.getTreasureArray()
    setTreasrureArray(data)
    }
    catch(err){
      console.log(err.message)
    }
    //console.log(data)
    let founddata = await contract.getFoundArray()
    setFoundArray(founddata)
    //console.log(founddata)
  }

  useEffect(()=>{
    if(contract){
    getData()
    }
  },[])


  useEffect(()=>{
    getData()
      },[wallletBalance])

  useEffect(()=>{
console.log(treasureArray)
let convertedArray = []
let counter = 0;
treasureArray.forEach((element)=>{
  counter++
let tdata = {
  "treasureId": parseInt(element.treasureID),
  "depositor": element.depositor,
  "amount": parseFloat(ethers.utils.formatEther(element.amount)),
  "latitude": (parseFloat(element.latitude))/1000,
  "longitude":(parseFloat(element.longitude))/1000,
}
console.log("tdata",tdata)
if(element.isTreasureFound==false){
  convertedArray.push(tdata)
}
if(counter ==treasureArray.length){
  console.log("Setting Table Data", treasureArray.length)
  setTableData(convertedArray)
  }
})


  },[treasureArray])

  useEffect(()=>{
console.log("TABLE DATA",tabledata)
  },[tabledata])

const getTreasure = async (userLat,userLong,ID,webkey)=>{
  setProcessing(true)
  //console.log("data",{"lat":userLat,"long":userLong,"ID":ID})
  try{
  let tx = await contract.getTreasure(userLat,userLong,ID,webkey)
  let hash = tx.hash
  setTxHash(hash.toString())
  isTransactionMined(hash.toString())
  }
  catch(err){
    console.log(err)
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
          getWalletBalance(provider)
      
      }
  }

}

const handleClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setOpenSnackBar(false);
  window.location.reload()
  window.scrollTo(0, 0);
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

const getWalletBalance = async (provider) => {
  // Look up the balance
  if (provider !== null  && defaultAccount !== null) {
      let balance = await provider.getBalance(defaultAccount);
      setWalletBalance(ethers.utils.formatEther(balance))
  }

}

  return (
    <>
    <Box>
     <Typography color="black">Get Treasure</Typography> 
      </Box>
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
              Success-Treasure Collected! Click for Transaction:${txHash} on Scroll Scan
            </Typography>
            <Typography>Page will reload momentarily to refresh table.</Typography>
          </a>
        </Snackbar>
    <Card
                  sx={{
                    marginTop:'20px',
                    marginBottom: "20px",
                    padding:'0px',
                    border:2,
                    borderColor:"green"
                  }}
                >
                  <Box>
                  </Box>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 900, }} aria-label="Current Dollar Cost Average">
                      <TableHead sx={{backgroundColor:"#a7aeff"}}>
                        <TableRow>
                          <TableCell>treasureID</TableCell>
                          <TableCell align="right">Depositor</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Latitude</TableCell>
                          <TableCell align="right">Longitude&nbsp;</TableCell>
                          <TableCell align="right"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody
                        sx={{
                          backgroundColor: "#ebecff"
                        }}
                      >
                        {
                          tabledata
                          ?
                            (tabledata.map((row) => {
                       console.log("COUNT",tabledata)
                              return(
                                <TableRow
                                  key={row.treasureId}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <TableCell align="right">{row.treasureId}</TableCell>
                                  <TableCell align="right">{row.depositor}</TableCell>
                                  <TableCell align="right">{row.amount}</TableCell>
                                  {console.log("LATITUDE",row)}
                                  <TableCell align="right">{row.latitude}</TableCell>
                                  <TableCell align="right">{row.longitude}</TableCell>
                                  <TableCell>
                                  {

                                row.latitude==userLatitude&&row.longitude==userLongitude?
                                    !processing?
                                    <Button
                                      onClick={()=>{
                                        console.log("KEY",process.env.REACT_APP_WEB_KEY)
                                        getTreasure(userLatitude*1000,userLongitude*1000,row.treasureId,process.env.REACT_APP_WEB_KEY)
                                      }}
                                      variant='contained'
                                      color="error"
                                    >
                                      Collect Treasure
                                    </Button>:<CircularProgress/>:null
                            }
                                  </TableCell>
                                </TableRow>

                              )
                            }))
                           
                          :
                            null
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {
                    isLoaded?
                  <Box sx={{display:'flex',
                  margin:'auto',
                  justifyContent:'center',
                  marginTop:'20px'}}>
                    <Box>
        
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >


       
  { tabledata.map((treasure)=>{
    return(<>
<Marker key="user"
           position={{
               lat: userLatitude,
               lng: userLongitude,
           }}
           label= {{
            text: "YOU",
            color: "black",
            fontWeight: "bold"
          }}      
           />

      
           <Marker key={treasure.treasureID}
           icon={{
            //path: window.google.maps.SymbolPath.CIRCLE,
            path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
            fillColor: "yellow",
            fillOpacity: 1.0,
            strokeWeight: 0,
            scale: 1.0
          }}
          
           position={{
               lat: treasure.latitude,
               lng: treasure.longitude,
           }}    
           />
           </>
    )
  }
  
  )

}

     
        </GoogleMap>
                    </Box>
        
                  </Box>:null
}
                </Card>
                
    </>
  )
}

export default GetTreasure