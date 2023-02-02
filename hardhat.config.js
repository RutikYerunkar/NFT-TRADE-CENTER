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

    fuji: {
      url: "https://avalanche-fuji.infura.io/v3/84b588b22fe9f74b7b9a7fdef98e6151",
      accounts: [`0x${"5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"}`],
    }

  },
};
