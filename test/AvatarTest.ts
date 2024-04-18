import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { json } from "stream/consumers";
import { token } from "../typechain-types/@openzeppelin/contracts";
import fetch from 'node-fetch';
import exp from "constants";
import { avatarDatas } from "./AvatarDatas";
const fs = require('fs');
const path = require('path');

describe("Testing Avatar data NFT", function () {
  async function deployNFTFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, verifier, user] = await ethers.getSigners();

    const AvatarNFTFactory = await ethers.getContractFactory("AvatarNFT");
    const avtNFT = await AvatarNFTFactory.deploy();
    const avtNFTAddress = await avtNFT.getAddress();

    return { owner, verifier, user, avtNFT, AvatarNFTFactory, avtNFTAddress };
  }

  describe("testing all sequence", async function () {
    
    // it("Testing One Time", async function () {
    //   const { owner, verifier, avtNFT, AvatarNFTFactory, avtNFTAddress } = await loadFixture(
    //     deployNFTFixture
    //   );

    //   /** Step01) put hash of avatar data and mint NFT
    //    * */
    //   console.log("1️⃣ put hash of avatar data and mint NFT")
    //     // const exData = {"name":"Sogang_Character1","author":"Yangho","creator":"Sogang","fileFormat":{"extention":"FBX","version":"0.01"},"fileVersion":"thesis_text_0.01","fileSize":"5MB","modelDimensions":{"units":"Humanoid","scale":"1.0","voundingBoxDimenstions":"1.0"},"geometry":{"vertexCount":"100","polygonCount":"300","Topology":"0.0, 0.0, 0.0"},"texturesAndMatrials":{"uvMapping":"uvMap_01","materialProperties":"mat_01"},"riggingAndAnimation":{"riggingInformation":"rig_01","animationClip":"anim_01"},"license":"sogangMetaversity_character","licenseUrl":"https://gsm.sogang.ac.kr/gsm/index_new.html","creationData":"05 Apr 2024","modificationDates":"05 Apr 2024","ownerShipHistory":"Yangho"};
    //     const exData = avatarDatas[0];
    //     // Serialize your JSON object to a string
    //     const serializedData = JSON.stringify(exData);

    //     // Hash the serialized data to get a bytes32 hash
    //     // You must ensure that you are hashing the hex-encoded bytes of the string, not the string directly
    //     const exDataHash = ethers.keccak256(ethers.toUtf8Bytes(serializedData));
    //     // console.log("✅exDataHash >>", exDataHash);

    //     const mintTx = await avtNFT.safeMint(owner.address, exDataHash);
    //     await mintTx.wait();

    //   /** Step02) get tokenURI data from Minted NFT and get Hash from minted NFT
    //    * */
    //   console.log("2️⃣ get tokenURI data from Minted NFT and get Hash from minted NFT");

    //   let i=0;
    //   const tokenURI = await avtNFT.connect(verifier).tokenURI(i+1);
    //   // console.log("✅tokenURI : ", tokenURI);

    //   const base64EncodedJson = tokenURI.split(",")[1];
    //   const decodedJsonString = atob(base64EncodedJson);
    //   // console.log("decodedJsonString >>", decodedJsonString);
    //   const jsonObj = JSON.parse(decodedJsonString);
    //   // console.log("get avatar name >>", jsonObj.name);
    //   // console.log("get url name >>", jsonObj.Url);

    //   const hashData = await avtNFT.getHashData(i);
    //   expect(hashData).equal(exDataHash);
    //   console.log("✅ hash of nft is recoreded correctly");

    //   // console.log("hashData >>", hashData);

    //   /** Step03) check if avatar data is manipulated by comparing hash data
    //    * */
    //   console.log("3️⃣ check if avatar data is manipulated by comparing hash data");

    //   let data;
    //     try {
    //         const response = await fetch(jsonObj.Url);
    //         data = await response.json();
    //     } catch (error) {
    //         console.error('Failed to fetch NFT data:', error);
    //     }
    //   const recoverSerializedData = JSON.stringify(data);
    //   const recoverExDataHash = ethers.keccak256(ethers.toUtf8Bytes(recoverSerializedData));

    //   expect(recoverExDataHash).to.equal(exDataHash);
    //   console.log("✅ compare hash data success");
    // });

    it("Testing Multiple Time", async function () {
      const { owner, verifier, user, avtNFT, AvatarNFTFactory, avtNFTAddress } = await loadFixture(
        deployNFTFixture
      );

      /** Step01) put hash of avatar data and mint NFT
       * */

      const readJsonFile = (filePath: string) => {
        try {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          return JSON.parse(fileContent);
        } catch (error) {
          console.error(`Error reading file ${filePath}: `, error);
          return null; // Return null to indicate failure
        }
      };

      for(let i =0; i<501; i++) {
        console.log("1️⃣ put hash of avatar data and mint NFT")
        const rootDir = __dirname;
        const filePath = path.join(rootDir, `../nftData/PlayerInfoData${i}.json`);
        const exData = readJsonFile(filePath);
        const serializedData = JSON.stringify(exData);
        const exDataHash = ethers.keccak256(ethers.toUtf8Bytes(serializedData));
        console.log("✅exDataHash >>", exDataHash);

        const mintTx = await avtNFT.safeMint(user.address, exDataHash);
        await mintTx.wait();

        // const tokenId = i-1;
        const ownerOfNft = await avtNFT.ownerOf(i);
        expect(ownerOfNft).to.equal(user.address);
        console.log("✅nft minted scceusfully");

        /** Step02) get tokenURI data from Minted NFT and get Hash from minted NFT
         * */
        console.log("2️⃣ get tokenURI data from Minted NFT and get Hash from minted NFT");  
        const tokenURI = await avtNFT.connect(verifier).tokenURI(i);
        // console.log("✅tokenURI : ", tokenURI);
        const base64EncodedJson = tokenURI.split(",")[1];
        const decodedJsonString = atob(base64EncodedJson);
        // console.log("decodedJsonString >>", decodedJsonString);
        const jsonObj = JSON.parse(decodedJsonString);
        // console.log("get avatar name >>", jsonObj.name);
        // console.log("get url name >>", jsonObj.Url);
  
        const hashData = await avtNFT.getHashData(i);
        console.log("✅hashData >>", hashData);

        expect(hashData).equal(exDataHash);
        console.log("✅ hash of nft is recoreded correctly");
    
        /** Step03) check if avatar data is manipulated by comparing hash data
         * */
        console.log("3️⃣ check if avatar data is manipulated by comparing hash data");
  
        let data;
          try {
              const response = await fetch(jsonObj.Url);
              data = await response.json();
          } catch (error) {
              console.error('Failed to fetch NFT data:', error);
          }
        const recoverSerializedData = JSON.stringify(data);
        console.log(serializedData)
        console.log(recoverSerializedData)
        expect(serializedData).to.equal(recoverSerializedData);
        console.log("✅ compare avatar data success");

        const recoverExDataHash = ethers.keccak256(ethers.toUtf8Bytes(recoverSerializedData));
  
        expect(recoverExDataHash).to.equal(exDataHash);
        console.log("✅ compare hash data success");
      }
    });
  });
});
