const { constants } = require("ethers")
const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.1")

const tokenId = 7

async function list() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    basicNft = await ethers.getContract("basicNft")
    // const randomNumber = Math.floor(Math.random() * 2)
    // let basicNft
    // if (randomNumber == 1) {
    //     basicNft = await ethers.getContract("BasicNftTwo")
    // } else {
    //     basicNft = await ethers.getContract("BasicNft")
    // }
    console.log("Approving NFT...")
    const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId)
    await approvalTx.wait(1)
    console.log("Listing NFT...")
    const tx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE)
    await tx.wait(1)
    console.log("NFT Listed!")
    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(2, (sleepAmount = 1000))
    }
}

list()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })