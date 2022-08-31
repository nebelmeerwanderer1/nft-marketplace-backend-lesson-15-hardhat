const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network, gasReporter } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NftMarketplace unit test", function () {
          let nftMarketplace, nftMarketplaceContract, basicNft, basicNftContract
          const PRICE = ethers.utils.parseEther("0.1")
          const TOKEN_ID = 0

          beforeEach(async () => {
              accounts = await ethers.getSigners() // could also do with getNamedAccounts
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["all"])
              nftMarketplace = await ethers.getContract("NftMarketplace")
              // nftMarketplace = nftMarketplaceContract.connect(deployer)
              basicNft = await ethers.getContract("basicNft")
              // basicNft = await basicNftContract.connect(deployer)
              await basicNft.mintNft()
              await basicNft.approve(nftMarketplace.address, TOKEN_ID)
          })

          describe("listItem", function () {
              it("emits an event after listing an item", async function () {
                  expect(await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.emit(
                      "ItemListed"
                  )
              })

              it("exclusively lists items that haven't been listed", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  const error = `AlreadyListed("${basicNft.address}", ${TOKEN_ID})`
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("AlreadyListed")
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith(error)
              })
              it("exclusively allows owners to list", async function () {
                  console.log(`userNft address: ${user.address}`)
                  console.log(`deployer address: ${deployer.address}`)
                  console.log(`basicNft address: ${basicNft.address}`)
                  console.log(`marketplacenft address: ${nftMarketplace.address}`)
                  console.log("---------------------------")
                  console.log(`basicNft approved: ${await basicNft.getApproved(0)}`)
                  console.log(`basicNft[1] owner: ${await basicNft.ownerOf(0)}`)
                  console.log(`nftmarketplace signer: ${await nftMarketplace.signer.getAddress()}`)
                  nftMarketplace = nftMarketplace.connect(user)
                  // await basicNft.approve(user.address, TOKEN_ID) // not necessary
                  console.log("---------------------------")
                  console.log(`basicNft approved: ${await basicNft.getApproved(0)}`)
                  console.log(`basicNft[1] owner: ${await basicNft.ownerOf(0)}`)
                  console.log(`nftmarketplace signer: ${await nftMarketplace.signer.getAddress()}`)
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NotOwner")
              })

              it("reverts if price is not above zero", async function () {
                  basicNftAddress = await basicNft.address
                  tokenID = (await basicNft.getTokenCounter()) - 1
                  tokenPrice = 0
                  await expect(
                      nftMarketplace.listItem(basicNftAddress, tokenID, tokenPrice)
                  ).to.be.revertedWith("PriceMustBeAboveZero")
              })

              it("reverts if the token is not approved for marketplace", async function () {
                  basicNftAddress = await basicNft.address
                  tokenID = (await basicNft.getTokenCounter()) - 1
                  tokenPrice = 1
                  await basicNft.approve(user.address, tokenID)
                  await expect(
                      nftMarketplace.listItem(basicNftAddress, tokenID, tokenPrice)
                  ).to.be.revertedWith("NotApprovedForMarketplace")
              })
          })

          describe("cancelListing", function () {
              it("deletes listing and emits event", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  expect(await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)).to.emit(
                      "ItemCanceled"
                  )
                  const check = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
                  assert(check.price.toString() == "0")
              })

              it("exclusively cancels items that have been listed", async function () {})

              it("exclusively allows owners to cancel", async function () {})
          })

          describe("buyItem", function () {
              it("", async function () {})
          })

          describe("updateListing", function () {
              it("", async function () {})
          })

          describe("withdrawProceeds", function () {
              it("", async function () {})
          })
      })
