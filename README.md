
# Treasure Go!: Location Based Crypto Distribution 

## Created for ETHOnline 2023 

## Summary
TreasureGo! is an experimental interface for distributing cryptocurrency. The current dApp deployment is to the layer 2 blockchain, Scroll. The dApp, TreasureGo! allows a user to set a physical geographic location for Scroll Ethereum to be deposited. A user overlapping this geographic region with an Ethereum deposit can, in turn, collect the deposited amount by using the dApp. 

Think PokemonGo combined with crypto and therein lies the concept behind TreasureGo!

## dApp Problem Statement
We need a means of providing people with a crypto payment based on them visiting a physical location. Many real world industries ranging from logistics to tourism could benefit from the implementation of said concept. TreasureGo! fulfills this need by allowing the setting and getting of crypto aka. ‘treasure' based on device location on a map.  

On a simplistic level, TreasureGo! can be utilized as a kind of game, akin to PokemonGo!, where a user deposits an amount of Ethereum to be collected at a set geographic location. However, the technology within the concept can be extended to use cases such as human resource payment disbursement for workers arriving at a particular geographic region; moreover, the idea of crypto tied to geographic location can function as a means for mobilizing people to visit locations as a type of marketing or tourism incentive. 

The possibilities with TreasureGo! are vast and the bridge between the crypto realm and the physical realm is where value lies within the concept; both on an artistic level, for a level of gamification, as well as a functional level on the level of payment disbursements tied to a unique parameter within the Web3 space. 

## TreasureGo! 
The promise of cryptocurrency is freedom untethered from centralized control. For some, this means leave some crypto to be collected at any geographic location. 

Set the destination, drop some crypto, buckle up those boots and go, go, go! 

<p align="center">
<img  width="90%" src="dAppScreenshots/Logo.png">
</p>

## Smart Contract Patterns
-`TreasureGo.sol`: a single smart contract provides the backdrop for the experimental dApp/prototype, TreasureGo!. 

The TreasureGo! contract records deposit amounts made to the contract address, latitude and longitude parameters as selected by the depositor, to be associated with their Ethereum amount. Collections via the TreasureGo.sol are made via a function which takes input parameters: (latitude, longitude, 'the treasure ID’,webkey).

The webkey parameter passed into the TreasureGo.sol contract is my attempt to make the contract callable only by the TresureGo! web dApp [note: current deployment is currently functional on desktop and not mobile]. This security feature is important because location data, for a user, is pulled from the front end which uses the inbuilt properties of a web-browser location services to verify overlap with treasure deposits. 

When a user deploys a TresureGo.sol contract there is one input constructor argument a user passes in which is then one-way hashed `(keccak256(abi.encodePacked(clientKey));)` and then saved within the contract as a private variable- as a part of an access modifier coded into the Solidity smart-contract. The one way hashing of the constructor attempts to mask the original parameter passed in and makes is a bit harder to compromise. 

In this regard, the private variable stored on the contract must be consistent with what is stored on the front end in a .env file. The data of which is masked to front end client users upon live dApp deployment- but can still be pulled to interact with the deployed TreasureGo.sol contract when a user click a button on the front-end. This 'hacky' feature is one of the proposed innovations conceptualized by way of this hackathon submission; the ability to interact with a Solidity contract only by a specifically built web dApp using constructor arguments, hashing and the default process.env functionality of a front-end React.js app. 

## Run your own TreasureGo! frontend
TreasureGo! has been built for the Ethereum naive Layer2 network- Scroll; upon researching the protocol it's more cost effective, scalable and faster to use it.  

Important: TreasureGO! requires MetaMask be installed- https://metamask.io/download/. 

Important: Testing and dApp creation was done on the Chrome browser; use TreasureGo! with Chrome: https://www.google.com/chrome/dr/download/


1. Use MetaMask and connect to the Scroll network: https://docs.scroll.io/en/user-guide/setup/. 

From the following link you can collect Scroll Sepolia ETH used to deploy the TreasureGo.sol smart-contract and interact with the front end: https://sepolia.scroll.io/bridge


2. Use Remix, https://remix.ethereum.org/, to deploy your own TreasureGo.sol contract- pass in a constructor/string argument which then becomes your ‘web_key.' This ‘web_key' must be consistent with what is eventually stored on the front end inside a .env file. 

3. TreasureGo! relies on maps for depositing and finding treasure; and to make things easy on myself I utilized Google Maps. Which means that users wishing to deploy their own TreasureGo! dApp must sign up for a Google Developers Account and enable the Maps API: https://developers.google.com/maps/get-started

4. Clone the repo using your terminal:

```
git clone https://github.com/kitfud/TreasureGo.git
```

In the terminal 'cd' into the `treasure_go` folder and create a .env file in your front end root folder (reference picture below for location): 

<p align="center">
<img  width="25%" src="dAppScreenshots/FileStructure.png">
</p>

with the following information outlined below in the .env file-
inserting your web_key (string constructor argument used for the Treasure.sol deployment) as REACT_APP_WEB_KEY and set the REACT_APP_API constant as the Google Maps API key registered:


    ```
    REACT_APP_WEB_KEY = "xxxxxxxxxxxxx"
    REACT_APP_API_KEY = "xxxxxxxxxxxxx"
    ```


5. Then run the following commands in the terminal to launch the dApp locally:
    
    ```
    npm install 
    npm start 
    ```
   

## Live Deployment/Desktop Only

The current TreasureGo dApp is only available on desktop and is deployed to the Scroll network (test-net Sepolia). As a result, test Scroll Sepolia is necessary. The TreasureGo! front end relies on the window navigator element and has only been tested with a Chrome browser.

Location services must be enabled to use the dApp, and depending on where you are it can take a little while for latitude and longitude values to come in- be patient and have fun out there:

https://treasurego.netlify.app/

## Front End Features
-<ins>Latitude and Longitude Display</ins>: Upon grating location services permissions a users latitude and longitude is displayed

<p align="center">
<img  width="100%" src="dAppScreenshots/Landing.png">
</p>

-<ins>Wallet Connect Button</ins>: A wallet connect button provides a connection to MetaMask and displays a user's address as well as wallet balance in Scroll Sepolia ETH

-<ins>Set Treasure View</ins>: If a user selects the 'Set Treasure' button they will see a Google Map element set in proximity to their current location. A user can click on the map to set a deposit location (latitude/longitude) and also complete a text field to set the amount of ETH to be deposited there. Clicking the deposit button requires signing two transaction- one to transfer said amount of ETH to the TreasureGo.sol contract and the second transaction write is to 'record' the location on the contract as a form of a map. 

<p align="center">
<img  width="100%" src="dAppScreenshots/SetTreasure.png">
</p>

-<ins>Get Treasure View</ins>: If a user selects the 'Get Treasure' button they will be prompted with a table with recorded treasure locations. If their current location status (as passed by the browser data) overlaps with their current location a red 'Collect Treasure' button will render in the specific row of the treasure table. 

<p align="center">
<img  width="100%" src="dAppScreenshots/GetTreasure.png">
</p>

-<ins>Get Treasure View Treasure Map</ins>: Below the 'Get Treasure' table is another Google Map where the user's location is indicated by a red pin. Deposited treasure is indicated by yellow pins on the map. This will help a user orient themselves as they seek treasure. 

<p align="center">
<img  width="100%" src="dAppScreenshots/TreasureMapVisualization.png">
</p>

## Tools and Frameworks Used
- <strong>Scroll Network</strong>: Affordable, scalable and fast- the Scroll (test-net) provides a perfect backdrop for testing and performance
- <strong>Ethers.js</strong>: The utility library for interacting with the Treasure.sol contract and converting blockchain data for viewing on the front end
- <strong>MetaMask</strong>: The web extension interface for Ethers.js to pull from to create the signer object
- <strong>Remix</strong>: The single tool used for the development and testing of the smart contract TreasureGo.sol.
- <strong>Google Maps API</strong>: Creates the accurate maps used on the front end for selecting deposit locations as well as visualizing crypto deposit locations via the dApp
- <strong>Chrome Browser</strong>: Provides the location services used by the dApp to determine a user's location and whether they are in enough proximity to deposited treasure to collect it. 
- <strong>React.js</strong>: Front-end framework of choice for creating the TreasureGo! web interface

## Concluding Thoughts

I believe that the success of crypto, from an adoption standpoint, relies on a relatable concept which connects the physical world to the virtual. A connection to the physical world is what will make things tangible for a broader audience aside from Web3 digital natives. TreasureGo! is an attempt to think out of the box an innovate on the understanding of what is possible given the melting pot of centralized and decentralized tools available, and hopefully provide a talking point for the future. 

## Developer
- [@kitfud](https://github.com/kitfud)