const { network, deployments, getNamedAccounts } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    log("----------------------------------------------------")

    args = []
    const NftMarketplace = await deploy(
        "NftMarketplace",
        {
            from: deployer,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
            args: args,
        },
        log("deployed!")
    )

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(NftMarketplace.address, args)
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "nftmarketplace"]
