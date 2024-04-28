import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

describe("Testing Avatar data NFT", function () {
  async function deployNFTFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, verifier, user] = await ethers.getSigners();

    const NormalNFTFactory = await ethers.getContractFactory("NormalNFT");
    const normalNFT = await NormalNFTFactory.deploy();
    const normalNFTAddress = await normalNFT.getAddress();

    return { owner, verifier, user, normalNFT, normalNFTAddress };
  }

  describe("testing nft mint", async function () {
    const { owner, verifier, user, normalNFT, normalNFTAddress } = await loadFixture(
      deployNFTFixture
    )  
    for(let i =0; i<1000; i++) {
      const mintTx = await normalNFT.safeMint(user.address);
      await mintTx.wait();
    }
  });
});
