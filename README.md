# metaverseAvatarRecord
2024 한국정보과학회 논문 실험


# flow
1. upload avatar data to Storage (sotrage URI is in nftData directory in this project
)
2. push hash data and mint NFT with tokenURI match to avatar data
3. anyone can check when avatar is created and if avatar data is manipulated by User.

# test
```
npm install
npx hardat compile
npx hardat run test
```

# sequance diagram of test

``` mermaid
sequenceDiagram
    participant User
    participant Owner
    participant AvatarNFT
    participant FileSystem
    participant Ethers
    participant NodeFetch
    participant Blockchain

    User->>Owner: Deploy AvatarNFT
    loop Testing Multiple Times
        User->>FileSystem: Read JSON from file
        FileSystem-->>User: JSON data
        User->>Ethers: Serialize and hash JSON data
        Ethers-->>User: exDataHash
        User->>AvatarNFT: safeMint(user.address, exDataHash)
        AvatarNFT->>Blockchain: Mint NFT
        Blockchain-->>AvatarNFT: tokenId
        User->>AvatarNFT: Request ownerOf(tokenId)
        AvatarNFT->>Blockchain: Check owner
        Blockchain-->>User: owner.address
        User->>AvatarNFT: Request tokenURI(tokenId)
        AvatarNFT->>Ethers: Generate tokenURI
        Ethers-->>AvatarNFT: URI string
        AvatarNFT-->>User: tokenURI
        User->>NodeFetch: Fetch data from URL in tokenURI
        NodeFetch-->>User: NFT data
        User->>Ethers: Serialize and hash fetched data
        Ethers-->>User: recoverExDataHash
        User->>AvatarNFT: Request getHashData(tokenId)
        AvatarNFT->>Blockchain: Retrieve hashData
        Blockchain-->>User: hashData
        User->>User: Compare exDataHash and recoverExDataHash
    end

```

# test results
```
·············································································································
|  Solidity and Network Configuration                                                                       │
························|·················|···············|·················|································
|  Solidity: 0.8.24     ·  Optim: false   ·  Runs: 200    ·  viaIR: false   ·     Block: 30,000,000 gas     │
························|·················|···············|·················|································
|  Methods                                                                                                  │
························|·················|···············|·················|················|···············
|  Contracts / Methods  ·  Min            ·  Max          ·  Avg            ·  # calls       ·  usd (avg)   │
························|·················|···············|·················|················|···············
|  AvatarNFT            ·                                                                                   │
························|·················|···············|·················|················|···············
|      safeMint         ·        346,172  ·      375,276  ·        375,147  ·          1000  ·           -  │
························|·················|···············|·················|················|···············
|  Deployments                            ·                                 ·  % of limit    ·              │
························|·················|···············|·················|················|···············
|  AvatarNFT            ·              -  ·            -  ·      2,911,025  ·         9.7 %  ·           -  │
························|·················|···············|·················|················|···············
|  Key                                                                                                      │
·············································································································
|  ◯  Execution gas for this method does not include intrinsic gas overhead                                 │
·············································································································
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
·············································································································
|  Toolchain:  hardhat                                                                                      │
·············································································································
```