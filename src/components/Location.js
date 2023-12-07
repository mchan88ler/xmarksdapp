import React, { useEffect, useState } from 'react';
import '../App.css';
import { Box, Button, Typography } from '@mui/material';

const Location = ({ setLatitude, setLongitude, setNavigatorAvailable, latitude, longitude, navigatorAvailable }) => {
  useEffect(() => {
    if (navigator.geolocation) {
      setNavigatorAvailable(true);
      const watchId = navigator.geolocation.watchPosition(
        function (position) {
          setLatitude(Math.round(position.coords.latitude * 1000) / 1000);
          setLongitude(Math.round(position.coords.longitude * 1000) / 1000);
        },
        function (error) {
          console.log("Error Code = " + error.code + " - " + error.message);
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [setLatitude, setLongitude, setNavigatorAvailable]);

  const NoNavigator = () => {
    return (
      <Box>
        No Navigator Available with this Browser!
      </Box>
    );
  };

  const Navigator = () => {
    return (
      <Box>
        <Typography sx={{ backgroundColor: 'black', color: 'white' }}>Your Current Location is:</Typography>
        <Typography sx={{ backgroundColor: 'white' }}>Latitude: {latitude}</Typography>
        <Typography sx={{ backgroundColor: 'white' }}>Longitude: {longitude}</Typography>
      </Box>
    );
  };

  return (
    <>
      <Box className='locationBox'>
        {
          navigatorAvailable ? <Navigator /> : <NoNavigator />
        }
      </Box>
    </>
  );
}

export default Location;
