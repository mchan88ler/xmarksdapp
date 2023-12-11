//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Treasure {
        address depositor;
        uint256 amount;
        uint256 treasureID; 
        int latitude;
        int longitude;
        bool isTreasureFound;  
}

contract TreasureGo {
Treasure[] public TreasureChest;
uint256 [] public Found; 
uint256 private treasureNum = 0;
bytes32 private accessKey; 

constructor (string memory key) {
  accessKey = keccak256(abi.encodePacked(key));
}


  modifier onlyWebApp(string memory clientKey){
        bytes32 hash = keccak256(abi.encodePacked(clientKey));
        require(hash==accessKey, "can only access via WebApp");
        _;
    }

receive() external payable{
}

function getTreasureArray() public view returns(Treasure[] memory) {
        return TreasureChest;
}

function getFoundArray() public view returns(uint256[] memory) {
        return Found;
}

function recordTreasureDeposit (int latitude, int longitude, uint256 amount, string calldata webkey) public onlyWebApp(webkey) {

    Treasure memory deposit = Treasure(
        msg.sender,
        amount, 
        treasureNum,
        latitude,
        longitude,
        false
    );
    TreasureChest.push(deposit);
    treasureNum++;

}

function existsInFound(uint num) public view returns (bool) {
    for (uint i = 0; i < Found.length; i++) {
        if (Found[i] == num) {
            return true;
        }
    }

    return false;
}


function getTreasure(int256 latitude, int256 longitude, uint256 ID, string calldata webkey) public onlyWebApp(webkey) {
   require(existsInFound(ID)==false,"treasure has been found");
   require(TreasureChest[ID].latitude== latitude,"Not at destination latitude for treasure");
    require(TreasureChest[ID].longitude== longitude,"Not at destination longitude for treasure");
   
    uint256 amount = TreasureChest[ID].amount;
    (bool sent,) = msg.sender.call{value:amount}("");
    require(sent, "Failed to send Ether To Finder");
    TreasureChest[ID].isTreasureFound = true;
    Found.push(ID);
}


function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}