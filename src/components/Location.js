import React from 'react'
import '../App.css';
import {Box,Button,Typography} from '@mui/material'
import {useEffect,useState} from 'react'

const Location = ({setLatitude,
  setLongitude,
  setNavigatorAvailable,
  latitude,
  longitude,
  navigatorAvailable}) => {
 

const NoNavigator = () =>{
    return(
    <Box>
        No Navigator Available with this Browser! 
    </Box>
    )
}

const Navigator = ()=>{
    return(
<></>
    )
}

  return (
    <>
    <Box className='locationBox'>
      {
        navigatorAvailable? <Navigator/>:<NoNavigator/>
      }
    </Box>
    </>
  )
}

export default Location