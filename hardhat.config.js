require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {},

    polygon_mumbai: {
      // chainId: 80001,
      url: "https://polygon-mumbai.g.alchemy.com/v2/1bUgXtfVMX0TkJqK6vFfXSjYph4-WsOF",
      accounts: [`0x${"fcffe7577b8701fae6702646c38c8204d5daae9bc6e87c04fa2bd71ca52f4762"}`],
    },
  },
};
